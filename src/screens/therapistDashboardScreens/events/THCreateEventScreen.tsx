/**
 * Therapist Create/Edit Event Screen
 * Uses validateEventForm() from LHValidators for inline Zod-powered field errors.
 */
import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TextInput,
    TouchableOpacity, Image, Platform, useWindowDimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button } from '@rneui/themed';
import DatePicker from 'react-native-date-picker';
import { launchImageLibrary } from 'react-native-image-picker';
import { useSelector } from 'react-redux';
import { appColors, appFonts } from '../../../global/Styles';
import { scale } from '../../../global/Scaling';
import ISGenericHeader from '../../../components/ISGenericHeader';
import ISStatusBar from '../../../components/ISStatusBar';
import { createEvent, updateEvent } from '../../../api/therapist';
import { validateEventForm, EventFormErrors } from '../../../global/LHValidators';
import ISAlert, { useISAlert } from '../../../components/alerts/ISAlert';

const CATEGORIES = ['Workshop', 'Training', 'Seminar', 'Summit'] as const;
type Category = typeof CATEGORIES[number];

// ── Inline error helper ────────────────────────────────────────────────────
const FieldError = ({ msg }: { msg?: string }) =>
    msg ? (
        <View style={errStyles.row}>
            <Icon type="material" name="error-outline" size={13} color="#E53935" />
            <Text style={errStyles.text}>{msg}</Text>
        </View>
    ) : null;

const errStyles = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
    text: { fontSize: 12, color: '#E53935', fontFamily: undefined, flex: 1 },
});

// ──────────────────────────────────────────────────────────────────────────────

const THCreateEventScreen = ({ navigation, route }: any) => {
    const userDetails = useSelector((state: any) => state.userData.userDetails);
    const { event } = route.params || {};
    const isEditing = !!event;
    const { width } = useWindowDimensions();
    const imagePickerHeight = Math.round(width * 0.4);

    const [title, setTitle] = useState(event?.title || '');
    const [description, setDescription] = useState(event?.description || '');
    const [category, setCategory] = useState<Category>(event?.category || 'Workshop');
    const [location, setLocation] = useState(event?.location || 'Virtual');
    const [maxAttendees, setMaxAttendees] = useState(event?.maxAttendees?.toString() || '50');
    const [price, setPrice] = useState(event?.price?.toString() || '0');

    const [date, setDate] = useState(event?.date ? new Date(event.date) : new Date());

    const defaultStart = new Date();
    defaultStart.setMinutes(0, 0, 0);
    defaultStart.setHours(defaultStart.getHours() + 1);
    const defaultEnd = new Date(defaultStart);
    defaultEnd.setHours(defaultEnd.getHours() + 1);

    const [startTime, setStartTime] = useState(defaultStart);
    const [endTime, setEndTime] = useState(defaultEnd);

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);

    const [imageUri, setImageUri] = useState<string | null>(event?.image || null);
    const [imageFile, setImageFile] = useState<any | null>(null);
    const [saving, setSaving] = useState(false);

    // Imperative alert — no visible-state boilerplate
    const alert = useISAlert();

    // Per-field validation errors
    const [errors, setErrors] = useState<EventFormErrors>({});

    const formatTime = (d: Date) =>
        d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

    const handlePickImage = async () => {
        launchImageLibrary(
            { mediaType: 'photo', quality: 0.8, maxWidth: 1200, maxHeight: 600 },
            (response) => {
                if (response.didCancel || response.errorCode) return;
                const asset = response.assets?.[0];
                if (asset) {
                    setImageUri(asset.uri || null);
                    setImageFile(asset);
                }
            }
        );
    };

    // Clear a field's error as soon as the user starts typing
    const clearError = (field: keyof EventFormErrors) => {
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const handleSave = async () => {
        // Run validation
        const formErrors = validateEventForm({
            title,
            description,
            category,
            location,
            maxAttendees,
            price,
            date,
            startTime,
            endTime,
        } as any);

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            if (Object.keys(formErrors).length > 2) {
                alert.show({
                    type: 'warning',
                    title: 'Form Incomplete',
                    message: 'Please fix the highlighted fields before saving.',
                    confirmText: 'Review',
                });
            }
            return;
        }

        setErrors({});
        setSaving(true);
        try {
            const therapistId = userDetails?.userId;

            if (isEditing && event?.id) {
                // Update uses plain JSON — the PUT endpoint does not accept multipart/form-data.
                // Image updates require a separate endpoint; skip image here for now.
                const updateData: Record<string, any> = {
                    therapist_id: therapistId,
                    title: title.trim(),
                    description: description.trim(),
                    category,
                    date: date.toISOString().split('T')[0],
                    startTime: formatTime(startTime),
                    endTime: formatTime(endTime),
                    location,
                    maxAttendees: parseInt(maxAttendees) || 50,
                    price: parseInt(price) || 0,
                    currency: 'UGX',
                };
                await updateEvent(event.id, updateData as any);
                alert.show({
                    type: 'success',
                    title: 'Event Updated',
                    message: 'Your event has been updated successfully.',
                    confirmText: 'Done',
                    onConfirm: () => navigation.goBack(),
                });
            } else {
                const formData = new FormData();
                formData.append('therapist_id', therapistId);
                formData.append('title', title.trim());
                formData.append('description', description.trim());
                formData.append('category', category);
                formData.append('date', date.toISOString().split('T')[0]);
                formData.append('startTime', formatTime(startTime));
                formData.append('endTime', formatTime(endTime));
                formData.append('location', location);
                formData.append('maxAttendees', String(parseInt(maxAttendees) || 50));
                formData.append('price', String(parseInt(price) || 0));
                formData.append('currency', 'UGX');
                if (imageFile) {
                    formData.append('image', {
                        uri: Platform.OS === 'android' ? imageFile.uri : imageFile.uri?.replace('file://', ''),
                        type: imageFile.type || 'image/jpeg',
                        name: imageFile.fileName || 'event_image.jpg',
                    } as any);
                }
                await createEvent(formData);
                alert.show({
                    type: 'success',
                    title: 'Event Created!',
                    message: 'Your event has been created and is now live.',
                    confirmText: 'Done',
                    onConfirm: () => navigation.goBack(),
                });
            }
        } catch (error: any) {
            const errorMessage = error.backendMessage || error.message || 'Failed to save event';
            alert.show({
                type: 'error',
                title: 'Something Went Wrong',
                message: errorMessage,
                confirmText: 'Try Again',
            });
        } finally {
            setSaving(false);
        }
    };

    const hasErrors = Object.values(errors).some(Boolean);

    return (
        <SafeAreaView style={styles.container}>
            <ISStatusBar />
            <ISGenericHeader
                title={isEditing ? 'Edit Event' : 'Create Event'}
                navigation={navigation}
            />

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

                {/* Event Image */}
                <View style={styles.section}>
                    <Text style={styles.label}>Event Banner Image</Text>
                    <TouchableOpacity style={[styles.imagePicker, { height: imagePickerHeight }]} onPress={handlePickImage} activeOpacity={0.8}>
                        {imageUri ? (
                            <>
                                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                                <View style={styles.imageOverlay}>
                                    <Icon type="material" name="edit" size={22} color="#FFF" />
                                    <Text style={styles.imageOverlayText}>Change Image</Text>
                                </View>
                            </>
                        ) : (
                            <View style={styles.imagePlaceholder}>
                                <Icon type="material" name="add-photo-alternate" size={36} color={appColors.grey4} />
                                <Text style={styles.imagePlaceholderText}>Tap to add event banner</Text>
                                <Text style={styles.imagePlaceholderSub}>Recommended: 1200 × 600px</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Title */}
                <View style={styles.section}>
                    <Text style={styles.label}>Event Title <Text style={styles.required}>*</Text></Text>
                    <TextInput
                        style={[styles.input, errors.title && styles.inputError]}
                        placeholder="e.g., Anxiety Management Workshop"
                        placeholderTextColor={appColors.grey3}
                        value={title}
                        onChangeText={(v) => { setTitle(v); clearError('title'); }}
                        maxLength={100}
                    />
                    <FieldError msg={errors.title} />
                </View>

                {/* Category */}
                <View style={styles.section}>
                    <Text style={styles.label}>Category <Text style={styles.required}>*</Text></Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoryContainer}
                    >
                        {CATEGORIES.map((cat) => (
                            <TouchableOpacity
                                key={cat}
                                style={[
                                    styles.categoryChip,
                                    category === cat && styles.categoryChipActive,
                                    errors.category && styles.categoryChipError,
                                ]}
                                onPress={() => { setCategory(cat); clearError('category'); }}
                            >
                                <Text style={[styles.categoryText, category === cat && styles.categoryTextActive]}>
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <FieldError msg={errors.category} />
                </View>

                {/* Date & Time */}
                <View style={styles.section}>
                    <Text style={styles.label}>Date <Text style={styles.required}>*</Text></Text>
                    <TouchableOpacity
                        style={[styles.dateTimeButton, errors.date && styles.inputError]}
                        onPress={() => { setShowDatePicker(true); clearError('date'); }}
                    >
                        <Icon type="material" name="calendar-today" size={20} color={appColors.AppBlue} />
                        <Text style={styles.dateTimeText}>{date.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                    <FieldError msg={errors.date} />

                    <Text style={[styles.label, { marginTop: 12 }]}>Time <Text style={styles.required}>*</Text></Text>
                    <View style={styles.timeRow}>
                        <TouchableOpacity
                            style={[styles.dateTimeButton, { flex: 1 }, errors.startTime && styles.inputError]}
                            onPress={() => { setShowStartTimePicker(true); clearError('startTime'); }}
                        >
                            <Icon type="material" name="schedule" size={20} color={appColors.AppBlue} />
                            <Text style={styles.dateTimeText}>
                                {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                        </TouchableOpacity>

                        <Text style={styles.toText}>to</Text>

                        <TouchableOpacity
                            style={[styles.dateTimeButton, { flex: 1 }, errors.endTime && styles.inputError]}
                            onPress={() => { setShowEndTimePicker(true); clearError('endTime'); }}
                        >
                            <Icon type="material" name="schedule" size={20} color={appColors.AppBlue} />
                            <Text style={styles.dateTimeText}>
                                {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <FieldError msg={errors.startTime || errors.endTime} />
                </View>

                {/* Location */}
                <View style={styles.section}>
                    <Text style={styles.label}>Location <Text style={styles.required}>*</Text></Text>
                    <TextInput
                        style={[styles.input, errors.location && styles.inputError]}
                        placeholder="e.g., Virtual or Kampala Road, Kampala"
                        placeholderTextColor={appColors.grey3}
                        value={location}
                        onChangeText={(v) => { setLocation(v); clearError('location'); }}
                    />
                    <FieldError msg={errors.location} />
                </View>

                {/* Attendees & Price */}
                <View style={styles.row}>
                    <View style={[styles.section, { flex: 1, marginRight: 8 }]}>
                        <Text style={styles.label}>Max Attendees <Text style={styles.required}>*</Text></Text>
                        <TextInput
                            style={[styles.input, errors.maxAttendees && styles.inputError]}
                            placeholder="50"
                            placeholderTextColor={appColors.grey3}
                            value={maxAttendees}
                            onChangeText={(v) => {
                                setMaxAttendees(v.replace(/[^0-9]/g, ''));
                                clearError('maxAttendees');
                            }}
                            keyboardType="number-pad"
                        />
                        <FieldError msg={errors.maxAttendees} />
                    </View>
                    <View style={[styles.section, { flex: 1, marginLeft: 8 }]}>
                        <Text style={styles.label}>Price (UGX)</Text>
                        <TextInput
                            style={[styles.input, errors.price && styles.inputError]}
                            placeholder="0 = Free"
                            placeholderTextColor={appColors.grey3}
                            value={price}
                            onChangeText={(v) => {
                                setPrice(v.replace(/[^0-9]/g, ''));
                                clearError('price');
                            }}
                            keyboardType="number-pad"
                        />
                        <FieldError msg={errors.price} />
                    </View>
                </View>

                {/* Description */}
                <View style={styles.section}>
                    <Text style={styles.label}>Description <Text style={styles.required}>*</Text></Text>
                    <TextInput
                        style={[styles.input, styles.textArea, errors.description && styles.inputError]}
                        placeholder="Describe your event, agenda, and what attendees will learn..."
                        placeholderTextColor={appColors.grey3}
                        value={description}
                        onChangeText={(v) => { setDescription(v); clearError('description'); }}
                        multiline
                        numberOfLines={5}
                        maxLength={1000}
                    />
                    <View style={styles.descFooter}>
                        <FieldError msg={errors.description} />
                        <Text style={styles.charCount}>{description.length}/1000</Text>
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            <ISAlert ref={alert.ref} />

            <View style={styles.footer}>
                {hasErrors && (
                    <View style={styles.errorBanner}>
                        <Icon type="material" name="error-outline" size={16} color="#E53935" />
                        <Text style={styles.errorBannerText}>Please fix the highlighted fields above</Text>
                    </View>
                )}
                <Button
                    title={saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Event'}
                    buttonStyle={styles.saveButton}
                    titleStyle={styles.saveButtonText}
                    onPress={handleSave}
                    disabled={saving}
                />
            </View>

            {/* Date/Time Pickers */}
            <DatePicker
                modal open={showDatePicker} date={date} mode="date"
                minimumDate={new Date()}
                onConfirm={(d) => { setShowDatePicker(false); setDate(d); clearError('date'); }}
                onCancel={() => setShowDatePicker(false)}
            />
            <DatePicker
                modal open={showStartTimePicker} date={startTime} mode="time"
                onConfirm={(d) => { setShowStartTimePicker(false); setStartTime(d); clearError('startTime'); }}
                onCancel={() => setShowStartTimePicker(false)}
            />
            <DatePicker
                modal open={showEndTimePicker} date={endTime} mode="time"
                onConfirm={(d) => { setShowEndTimePicker(false); setEndTime(d); clearError('endTime'); }}
                onCancel={() => setShowEndTimePicker(false)}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: appColors.AppLightGray,
    },
    content: {
        padding: 16,
    },
    section: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: appColors.grey2,
        marginBottom: 8,
        fontFamily: appFonts.bodyTextMedium,
    },
    required: {
        color: '#E53935',
        fontWeight: '700',
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 14,
        fontSize: 15,
        color: appColors.grey1,
        borderWidth: 1,
        borderColor: appColors.grey6,
        fontFamily: appFonts.bodyTextRegular,
    },
    inputError: {
        borderColor: '#E53935',
        borderWidth: 1.5,
    },
    textArea: {
        minHeight: 130,
        textAlignVertical: 'top',
    },
    descFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginTop: 4,
    },
    charCount: {
        fontSize: 11,
        color: appColors.grey4,
        fontFamily: appFonts.bodyTextRegular,
        marginLeft: 'auto',
    },
    // Image picker
    imagePicker: {
        borderRadius: 14,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: appColors.grey5,
        borderStyle: 'dashed',
        backgroundColor: '#FFF',
        height: scale(160),
    },
    imagePreview: {
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.45)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 8,
    },
    imageOverlayText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '600',
        fontFamily: appFonts.bodyTextMedium,
    },
    imagePlaceholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    imagePlaceholderText: {
        fontSize: 14,
        color: appColors.grey3,
        fontFamily: appFonts.bodyTextMedium,
    },
    imagePlaceholderSub: {
        fontSize: 11,
        color: appColors.grey4,
        fontFamily: appFonts.bodyTextRegular,
    },
    // Category — horizontal scroll so dynamic/long lists always fit
    categoryContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: appColors.grey5,
    },
    categoryChipActive: {
        backgroundColor: appColors.AppBlue,
        borderColor: appColors.AppBlue,
    },
    categoryChipError: {
        borderColor: '#E53935',
    },
    categoryText: {
        fontSize: 13,
        color: appColors.grey2,
        fontFamily: appFonts.bodyTextMedium,
    },
    categoryTextActive: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    // Date/Time
    dateTimeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: appColors.grey6,
        gap: 10,
        marginBottom: 0,
    },
    dateTimeText: {
        fontSize: 15,
        color: appColors.grey1,
        fontFamily: appFonts.bodyTextRegular,
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    toText: {
        marginHorizontal: 10,
        color: appColors.grey3,
        fontWeight: '600',
        fontFamily: appFonts.bodyTextMedium,
    },
    row: {
        flexDirection: 'row',
    },
    // Footer
    footer: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: appColors.grey6,
        gap: 8,
    },
    errorBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#FFEBEE',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
    },
    errorBannerText: {
        fontSize: 13,
        color: '#E53935',
        fontFamily: appFonts.bodyTextRegular,
        flex: 1,
    },
    saveButton: {
        backgroundColor: appColors.AppBlue,
        borderRadius: 12,
        paddingVertical: 14,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: appFonts.bodyTextMedium,
    },
});

export default THCreateEventScreen;
