/**
 * TherapistProfilePreviewCard
 *
 * A modern, dismissable modal that shows the therapist's professional profile
 * exactly as clients will see it. Designed as a readonly preview.
 *
 * Key behavior:
 * - Reads profile from Redux first (fast)
 * - If Redux profile is empty/null, fetches directly from the API on open
 * - Shows a loading indicator while fetching
 * - Displays ALL profile fields returned by the endpoint
 *
 * Usage:
 *   <TherapistProfilePreviewCard
 *     visible={isVisible}
 *     onDismiss={() => setIsVisible(false)}
 *     profile={therapistProfile}       // from Redux: state.therapistDashboard.profile
 *     userDetails={userDetails}         // fallback basic info from Redux
 *   />
 */
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
    Image,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { Icon } from '@rneui/themed';
import { appColors, appFonts } from '../../global/Styles';
import { appImages } from '../../global/Data';
import { getTherapistProfile } from '../../api/therapist';
import { resolveTherapistImage } from '../../utils/imageHelpers';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ── Types ────────────────────────────────────────────────────────────────────
interface TherapistProfilePreviewCardProps {
    visible: boolean;
    onDismiss: () => void;
    profile: any;
    userDetails?: any;
}

// ── Helper: Format availability for display ──────────────────────────────────
const formatAvailability = (availability: any): { day: string; hours: string }[] => {
    if (!availability || typeof availability !== 'object') return [];
    const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    return dayOrder
        .filter((day) => availability[day] && availability[day].length > 0)
        .map((day) => ({
            day: day.charAt(0).toUpperCase() + day.slice(1, 3),
            hours: availability[day].join(', '),
        }));
};

// ── Helper: Decode HTML entities (e.g. &amp; → &) ───────────────────────────
const decodeHtmlEntities = (text: string): string => {
    if (!text) return '';
    return text
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
};

// ── Component ────────────────────────────────────────────────────────────────
const TherapistProfilePreviewCard: React.FC<TherapistProfilePreviewCardProps> = ({
    visible,
    onDismiss,
    profile: reduxProfile,
    userDetails,
}) => {
    const [localProfile, setLocalProfile] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState(false);
    const [avatarLoadError, setAvatarLoadError] = useState(false);

    // Use Redux profile if available, otherwise use locally fetched profile
    const profile = reduxProfile || localProfile;

    // ── Fetch profile from API if Redux is empty when modal opens ──────────
    useEffect(() => {
        if (visible && !reduxProfile && !localProfile) {
            const therapistId = userDetails?.userId;
            if (!therapistId) return;

            setLoading(true);
            setFetchError(false);
            getTherapistProfile(therapistId)
                .then((response: any) => {
                    if (response?.success && response?.data) {
                        setLocalProfile(response.data);
                    } else if (response?.data) {
                        setLocalProfile(response.data);
                    } else {
                        setFetchError(true);
                    }
                })
                .catch(() => {
                    setFetchError(true);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [visible, reduxProfile, localProfile, userDetails?.userId]);

    // ── Derive display values ──────────────────────────────────────────────
    const firstName = profile?.firstName || userDetails?.firstName || '';
    const lastName = profile?.lastName || userDetails?.lastName || '';
    const email = profile?.email || userDetails?.email || '';
    const phone = profile?.phoneNumber || userDetails?.phone || '';
    const rawProfileImage = profile?.profileImage || userDetails?.avatar || userDetails?.profilePicture;
    const profileImage = resolveTherapistImage(rawProfileImage, 0);
    const specialization = decodeHtmlEntities(profile?.specialization || '');
    const bio = profile?.bio || '';
    const education = profile?.education || '';
    const languages = profile?.languages || '';
    const location = profile?.location || '';
    const yearsOfExperience = profile?.yearsOfExperience || '';
    const rating = profile?.rating || 0;
    const totalSessions = profile?.totalSessions ?? 0;
    const availability = formatAvailability(profile?.availability);
    const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`;

    // ── Helper: Render an info row ─────────────────────────────────────────
    const InfoRow = ({ icon, iconColor, bgColor, label, value }: any) => (
        <View style={styles.infoItem}>
            <View style={[styles.infoIconCircle, { backgroundColor: bgColor }]}>
                <Icon type="material" name={icon} size={16} color={iconColor} />
            </View>
            <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={styles.infoValue}>{value}</Text>
            </View>
        </View>
    );

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onDismiss}
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <TouchableOpacity
                    style={styles.dismissArea}
                    activeOpacity={1}
                    onPress={onDismiss}
                />

                <View style={styles.cardContainer}>
                    {/* ── Floating Close Button ──────────────────────────────── */}
                    <TouchableOpacity style={styles.closeButton} onPress={onDismiss} activeOpacity={0.7}>
                        <Icon type="material" name="close" size={20} color={appColors.grey2} />
                    </TouchableOpacity>

                    {/* ── Loading State ─────────────────────────────────────── */}
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={appColors.AppBlue} />
                            <Text style={styles.loadingText}>Loading profile...</Text>
                        </View>
                    ) : fetchError && !profile ? (
                        /* ── Error State ──────────────────────────────────────── */
                        <View style={styles.loadingContainer}>
                            <Icon type="material" name="error-outline" size={48} color={appColors.grey3} />
                            <Text style={styles.loadingText}>Unable to load profile</Text>
                            <Text style={styles.errorSubText}>Please try again later</Text>
                        </View>
                    ) : (
                        /* ── Profile Content ──────────────────────────────────── */
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            bounces={false}
                            contentContainerStyle={styles.scrollContent}
                        >
                            {/* ── Header Band ─────────────────────────────────── */}
                            <View style={styles.headerBand}>
                                {/* Innerspark branding watermark (subtle, on the edge) */}
                                <Image
                                    source={appImages.logoRecWhite}
                                    style={styles.brandWatermark}
                                    resizeMode="contain"
                                />
                                {/* "Preview" label so therapist knows what this is */}
                                <View style={styles.previewBadge}>
                                    <Icon type="material" name="visibility" size={12} color="#FFFFFF" />
                                    <Text style={styles.previewBadgeText}>Client View</Text>
                                </View>

                                {/* Avatar positioned to overlap the header/content boundary */}
                                <View style={styles.avatarWrapper}>
                                    {profileImage ? (
                                        <Image 
                                            key={avatarLoadError ? 'fallback' : 'primary'}
                                            source={{ uri: avatarLoadError ? resolveTherapistImage(rawProfileImage, 1) : profileImage }} 
                                            style={styles.avatar} 
                                            onError={() => {
                                                if (!avatarLoadError) {
                                                    setAvatarLoadError(true);
                                                }
                                            }}
                                        />
                                    ) : (
                                        <View style={styles.avatarPlaceholder}>
                                            <Text style={styles.avatarInitials}>{initials}</Text>
                                        </View>
                                    )}
                                    {/* Verified checkmark */}
                                    <View style={styles.verifiedBadge}>
                                        <Icon type="material" name="verified" size={18} color="#FFFFFF" />
                                    </View>
                                </View>
                            </View>

                            {/* ── Name & Specialization ────────────────────────── */}
                            <View style={styles.nameBlock}>
                                <Text style={styles.fullName}>{firstName} {lastName}</Text>
                                {specialization ? (
                                    <Text style={styles.specialization}>{specialization}</Text>
                                ) : null}
                                {location ? (
                                    <View style={styles.locationRow}>
                                        <Icon type="material" name="location-on" size={14} color={appColors.grey3} />
                                        <Text style={styles.locationText}>{location}</Text>
                                    </View>
                                ) : null}
                            </View>

                            {/* ── Quick Stats Row ──────────────────────────────── */}
                            <View style={styles.statsRow}>
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>⭐ {Number(rating).toFixed(1)}</Text>
                                    <Text style={styles.statLabel}>Rating</Text>
                                </View>
                                <View style={styles.statDivider} />
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>{totalSessions}</Text>
                                    <Text style={styles.statLabel}>Sessions</Text>
                                </View>
                                <View style={styles.statDivider} />
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>{yearsOfExperience || '—'}</Text>
                                    <Text style={styles.statLabel}>Experience</Text>
                                </View>
                            </View>

                            {/* ── Bio / About Section ──────────────────────────── */}
                            {bio ? (
                                <View style={styles.section}>
                                    <View style={styles.sectionHeader}>
                                        <Icon type="material" name="format-quote" size={18} color={appColors.AppBlue} />
                                        <Text style={styles.sectionTitle}>About</Text>
                                    </View>
                                    <Text style={styles.bioText}>{bio}</Text>
                                </View>
                            ) : null}

                            {/* ── Professional Details ─────────────────────────── */}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Icon type="material" name="badge" size={18} color={appColors.AppBlue} />
                                    <Text style={styles.sectionTitle}>Professional Details</Text>
                                </View>

                                <View style={styles.infoGrid}>
                                    {specialization ? (
                                        <InfoRow
                                            icon="psychology"
                                            iconColor="#7C4DFF"
                                            bgColor="#EDE7F6"
                                            label="Specialization"
                                            value={specialization}
                                        />
                                    ) : null}
                                    {education ? (
                                        <InfoRow
                                            icon="school"
                                            iconColor="#4CAF50"
                                            bgColor="#E8F5E9"
                                            label="Education"
                                            value={education}
                                        />
                                    ) : null}
                                    {languages ? (
                                        <InfoRow
                                            icon="translate"
                                            iconColor="#2196F3"
                                            bgColor="#E3F2FD"
                                            label="Languages"
                                            value={languages}
                                        />
                                    ) : null}
                                    {yearsOfExperience ? (
                                        <InfoRow
                                            icon="workspace-premium"
                                            iconColor="#FF9800"
                                            bgColor="#FFF3E0"
                                            label="Experience"
                                            value={yearsOfExperience}
                                        />
                                    ) : null}
                                </View>
                            </View>

                            {/* ── Contact Information ──────────────────────────── */}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Icon type="material" name="contact-mail" size={18} color={appColors.AppBlue} />
                                    <Text style={styles.sectionTitle}>Contact</Text>
                                </View>

                                <View style={styles.infoGrid}>
                                    {email ? (
                                        <InfoRow
                                            icon="email"
                                            iconColor="#9C27B0"
                                            bgColor="#F3E5F5"
                                            label="Email"
                                            value={email}
                                        />
                                    ) : null}
                                    {phone ? (
                                        <InfoRow
                                            icon="phone"
                                            iconColor="#00BCD4"
                                            bgColor="#E0F7FA"
                                            label="Phone"
                                            value={phone}
                                        />
                                    ) : null}
                                    {location ? (
                                        <InfoRow
                                            icon="location-on"
                                            iconColor="#FF5722"
                                            bgColor="#FBE9E7"
                                            label="Location"
                                            value={location}
                                        />
                                    ) : null}
                                </View>
                            </View>

                            {/* ── Availability Schedule ────────────────────────── */}
                            {availability.length > 0 ? (
                                <View style={styles.section}>
                                    <View style={styles.sectionHeader}>
                                        <Icon type="material" name="schedule" size={18} color={appColors.AppBlue} />
                                        <Text style={styles.sectionTitle}>Availability</Text>
                                    </View>
                                    <View style={styles.availabilityGrid}>
                                        {availability.map((slot, index) => (
                                            <View key={index} style={styles.availabilityChip}>
                                                <Text style={styles.availabilityDay}>{slot.day}</Text>
                                                <Text style={styles.availabilityHours}>{slot.hours}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            ) : null}

                            {/* ── Footer note ──────────────────────────────────── */}
                            <View style={styles.footerNote}>
                                <Icon type="material" name="info-outline" size={14} color={appColors.grey4} />
                                <Text style={styles.footerNoteText}>
                                    This is how your profile appears to clients
                                </Text>
                            </View>

                            <View style={{ height: 16 }} />
                        </ScrollView>
                    )}
                </View>
            </View>
        </Modal>
    );
};

// ── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dismissArea: {
        ...StyleSheet.absoluteFillObject,
    },
    cardContainer: {
        width: SCREEN_WIDTH * 0.92,
        maxHeight: '88%',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
    },
    closeButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        zIndex: 10,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    scrollContent: {
        paddingBottom: 4,
    },

    // ── Loading / Error ──
    loadingContainer: {
        paddingVertical: 80,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    loadingText: {
        fontSize: 14,
        color: appColors.grey2,
        fontFamily: appFonts.bodyTextMedium,
    },
    errorSubText: {
        fontSize: 12,
        color: appColors.grey4,
        fontFamily: appFonts.bodyTextRegular,
    },

    // ── Header band ──
    headerBand: {
        backgroundColor: appColors.AppBlue,
        paddingTop: 30,
        paddingBottom: 48,
        alignItems: 'center',
        position: 'relative',
    },
    brandWatermark: {
        position: 'absolute',
        top: 8,
        left: 12,
        width: 70,
        height: 22,
        opacity: 0.3,
    },
    previewBadge: {
        position: 'absolute',
        top: 10,
        right: 48,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
        gap: 4,
    },
    previewBadgeText: {
        fontSize: 10,
        color: '#FFFFFF',
        fontFamily: appFonts.bodyTextMedium,
        fontWeight: '600',
    },

    // ── Avatar ──
    avatarWrapper: {
        position: 'absolute',
        bottom: -38,
        alignSelf: 'center',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
    avatarPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#3A5AE8',
        borderWidth: 3,
        borderColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInitials: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontFamily: appFonts.headerTextBold,
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: 0,
        right: -2,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: appColors.AppGreen,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },

    // ── Name block ──
    nameBlock: {
        alignItems: 'center',
        paddingTop: 46,
        paddingBottom: 14,
        paddingHorizontal: 20,
    },
    fullName: {
        fontSize: 21,
        fontWeight: 'bold',
        color: appColors.grey1,
        fontFamily: appFonts.headerTextBold,
        textAlign: 'center',
    },
    specialization: {
        fontSize: 13,
        color: appColors.AppBlue,
        fontFamily: appFonts.bodyTextMedium,
        marginTop: 6,
        backgroundColor: appColors.AppBlue + '12',
        paddingHorizontal: 14,
        paddingVertical: 4,
        borderRadius: 12,
        overflow: 'hidden',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
        gap: 3,
    },
    locationText: {
        fontSize: 12,
        color: appColors.grey3,
        fontFamily: appFonts.bodyTextRegular,
    },

    // ── Stats row ──
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 18,
        paddingVertical: 14,
        backgroundColor: '#F8F9FD',
        borderRadius: 14,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 15,
        fontWeight: 'bold',
        color: appColors.grey1,
        fontFamily: appFonts.headerTextBold,
    },
    statLabel: {
        fontSize: 11,
        color: appColors.grey3,
        fontFamily: appFonts.bodyTextRegular,
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: appColors.grey5,
    },

    // ── Sections ──
    section: {
        marginHorizontal: 20,
        marginBottom: 18,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 6,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: appColors.grey1,
        fontFamily: appFonts.headerTextBold,
    },
    bioText: {
        fontSize: 13,
        color: appColors.grey2,
        fontFamily: appFonts.bodyTextRegular,
        lineHeight: 21,
    },

    // ── Info grid ──
    infoGrid: {
        gap: 2,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
    },
    infoIconCircle: {
        width: 34,
        height: 34,
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 11,
        color: appColors.grey3,
        fontFamily: appFonts.bodyTextRegular,
    },
    infoValue: {
        fontSize: 13,
        color: appColors.grey1,
        fontFamily: appFonts.bodyTextMedium,
        marginTop: 1,
    },

    // ── Availability ──
    availabilityGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    availabilityChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F4FF',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        gap: 4,
    },
    availabilityDay: {
        fontSize: 12,
        fontWeight: '600',
        color: appColors.AppBlue,
        fontFamily: appFonts.bodyTextMedium,
    },
    availabilityHours: {
        fontSize: 11,
        color: appColors.grey2,
        fontFamily: appFonts.bodyTextRegular,
    },

    // ── Footer ──
    footerNote: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        marginHorizontal: 20,
        marginTop: 4,
        paddingVertical: 10,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: appColors.grey5,
    },
    footerNoteText: {
        fontSize: 11,
        color: appColors.grey4,
        fontFamily: appFonts.bodyTextRegular,
        fontStyle: 'italic',
    },
});

export default TherapistProfilePreviewCard;
