import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button } from '@rneui/themed';
import { useSelector } from 'react-redux';
import { appColors, appFonts } from '../../../global/Styles';
import ISGenericHeader from '../../../components/ISGenericHeader';
import ISStatusBar from '../../../components/ISStatusBar';
import { getEventById, deleteEvent } from '../../../api/therapist';

const THEventDetailsScreen = ({ navigation, route }: any) => {
    const { event: initialEvent } = route.params;
    const userDetails = useSelector((state: any) => state.userData.userDetails);
    const [event, setEvent] = useState(initialEvent);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchEventDetails();
    }, []);

    const fetchEventDetails = async () => {
        try {
            setLoading(true);
            const therapistId = userDetails?.userId;
            const response: any = await getEventById(initialEvent.id, therapistId);
            if (response?.success) {
                setEvent(response.data);
            }
        } catch (error: any) {
            console.error('Fetch Event Details Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete Event',
            'Are you sure you want to delete this event? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const therapistId = userDetails?.userId;
                            const res: any = await deleteEvent(event.id, therapistId);
                            if (res?.success) {
                                Alert.alert('Success', 'Event deleted successfully');
                                navigation.goBack();
                            }
                        } catch (error: any) {
                            Alert.alert('Error', error.backendMessage || 'Failed to delete event');
                        }
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <ISStatusBar />
                <ISGenericHeader title="Event Details" navigation={navigation} />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={appColors.AppBlue} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ISStatusBar />
            <ISGenericHeader
                title="Event Details"
                navigation={navigation}
                hasRightIcon={true}
                rightIconName="edit"
                rightIconOnPress={() => navigation.navigate('THCreateEventScreen', { event })}
            />

            <ScrollView style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.dateBadge}>
                        <Text style={styles.dateMonth}>{new Date(event.date).toLocaleString('default', { month: 'short' }).toUpperCase()}</Text>
                        <Text style={styles.dateDay}>{new Date(event.date).getDate()}</Text>
                    </View>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{event.title}</Text>
                        <Text style={styles.category}>{event.category}</Text>
                    </View>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Icon type="material" name="people" size={24} color={appColors.AppBlue} />
                        <Text style={styles.statValue}>{event.registeredCount || 0}</Text>
                        <Text style={styles.statLabel}>Registered</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Icon type="material" name="event-seat" size={24} color={appColors.AppBlue} />
                        <Text style={styles.statValue}>{event.maxAttendees}</Text>
                        <Text style={styles.statLabel}>Capacity</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Icon type="material" name="payments" size={24} color={appColors.AppBlue} />
                        <Text style={styles.statValue}>{event.price > 0 ? `${event.price} UGX` : 'Free'}</Text>
                        <Text style={styles.statLabel}>Price</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Time & Location</Text>
                    <View style={styles.infoRow}>
                        <Icon type="material" name="schedule" size={20} color={appColors.grey3} />
                        <Text style={styles.infoText}>{event.startTime} - {event.endTime}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Icon type="material" name="location-on" size={20} color={appColors.grey3} />
                        <Text style={styles.infoText}>{event.location}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About this Event</Text>
                    <Text style={styles.description}>{event.description}</Text>
                </View>

                <Button
                    title="Delete Event"
                    type="outline"
                    buttonStyle={styles.deleteButton}
                    titleStyle={styles.deleteButtonText}
                    onPress={handleDelete}
                />

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    dateBadge: {
        backgroundColor: appColors.AppBlue + '10',
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
        marginRight: 16,
        width: 70,
    },
    dateMonth: {
        fontSize: 14,
        fontWeight: 'bold',
        color: appColors.AppBlue,
    },
    dateDay: {
        fontSize: 24,
        fontWeight: 'bold',
        color: appColors.AppBlue,
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: appColors.grey1,
        fontFamily: appFonts.headerTextBold,
        marginBottom: 4,
    },
    category: {
        fontSize: 14,
        color: appColors.AppBlue,
        fontFamily: appFonts.bodyTextMedium,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: appColors.AppLightGray,
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: appColors.grey1,
        marginTop: 8,
    },
    statLabel: {
        fontSize: 12,
        color: appColors.grey3,
        marginTop: 2,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: appColors.grey1,
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 8,
    },
    infoText: {
        fontSize: 15,
        color: appColors.grey2,
    },
    description: {
        fontSize: 15,
        color: appColors.grey2,
        lineHeight: 22,
    },
    deleteButton: {
        borderColor: '#F44336',
        borderRadius: 12,
        marginTop: 20,
        paddingVertical: 12,
    },
    deleteButtonText: {
        color: '#F44336',
        fontWeight: '600',
    },
});

export default THEventDetailsScreen;
