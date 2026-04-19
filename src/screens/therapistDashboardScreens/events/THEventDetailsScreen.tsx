import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    ActivityIndicator, Image, Linking, FlatList,
    RefreshControl, useWindowDimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button } from '@rneui/themed';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { appColors, appFonts } from '../../../global/Styles';
import { moderateScale } from '../../../global/Scaling';
import { appImages } from '../../../global/Data';
import ISGenericHeader from '../../../components/ISGenericHeader';
import ISStatusBar from '../../../components/ISStatusBar';
import ISClientAvatar from '../../../components/ISClientAvatar';
import { therapistMediaUrl } from '../../../api/LHAPI';
import {
    getEventById, deleteEvent, startEvent,
    completeEvent, getEventAttendees, checkInAttendee
} from '../../../api/therapist';
import ISAlert, { useISAlert } from '../../../components/alerts/ISAlert';

type Tab = 'overview' | 'attendees' | 'agenda';

interface Attendee {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    registeredAt: string;
    paymentStatus: 'completed' | 'pending' | string;
    paymentAmount?: number;
    attended: boolean;
    avatar?: string;
}

interface AttendeeStats {
    totalRegistered: number;
    paidCount: number;
    pendingPayment: number;
    totalRevenue: number;
}

interface AgendaItem {
    time: string;
    title: string;
    duration?: string;
    speaker?: string;
}

interface Speaker {
    name: string;
    title?: string;
    bio?: string;
}

const THEventDetailsScreen = ({ navigation, route }: any) => {
    const { event: initialEvent } = route.params;
    const userDetails = useSelector((state: any) => state.userData.userDetails);
    const { width, height } = useWindowDimensions();

    const [event, setEvent] = useState(initialEvent);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<Tab>('overview');

    // Attendees state
    const [attendees, setAttendees] = useState<Attendee[]>([]);
    const [attendeeStats, setAttendeeStats] = useState<AttendeeStats | null>(null);
    const [attendeesLoading, setAttendeesLoading] = useState(false);
    const [checkingIn, setCheckingIn] = useState<string | null>(null);

    // Refresh state
    const [refreshing, setRefreshing] = useState(false);

    // Action state
    const [actionLoading, setActionLoading] = useState(false);

    const therapistId = userDetails?.userId;

    // Imperative alert
    const alert = useISAlert();

    useEffect(() => {
        fetchEventDetails();
    }, []);

    // Re-fetch when returning from the edit screen so edits reflect immediately
    useFocusEffect(
        useCallback(() => {
            fetchEventDetails();
        }, [])
    );

    const fetchEventDetails = async () => {
        try {
            setLoading(true);
            const response: any = await getEventById(initialEvent.id, therapistId);
            if (response?.success || response?.data) {
                setEvent(response.data || response);
            }
        } catch (error: any) {
            console.error('Fetch Event Details Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchEventDetails();
        if (activeTab === 'attendees') {
            setAttendees([]);
            setAttendeeStats(null);
            await fetchAttendees(true);
        }
        setRefreshing(false);
    }, [activeTab]);

    const fetchAttendees = useCallback(async (force = false) => {
        if (attendees.length > 0 && !force) return; // already loaded
        try {
            setAttendeesLoading(true);
            const response: any = await getEventAttendees(event.id, therapistId);
            if (response?.data) {
                setAttendees(response.data.attendees || []);
                setAttendeeStats(response.data.stats || null);
            }
        } catch (error: any) {
            console.error('Fetch Attendees Error:', error);
            alert.show({
                type: 'error',
                title: 'Failed to Load Attendees',
                message: error.backendMessage || 'Could not load attendees. Please try again.',
                confirmText: 'OK',
            });
        } finally {
            setAttendeesLoading(false);
        }
    }, [event.id, therapistId, attendees.length]);

    const handleTabChange = (tab: Tab) => {
        setActiveTab(tab);
        if (tab === 'attendees' && attendees.length === 0) {
            fetchAttendees(false);
        }
    };

    // ── Actions ──────────────────────────────────────────────────────────────

    const handleStartEvent = () => {
        alert.show({
            type: 'confirm',
            title: 'Start Event',
            message: 'Are you ready to start this event? Attendees will be notified.',
            confirmText: 'Start Event',
            cancelText: 'Not Yet',
            onConfirm: async () => {
                try {
                    setActionLoading(true);
                    const res: any = await startEvent(event.id, therapistId);
                    if (res?.success) {
                        alert.show({
                            type: 'success',
                            title: 'Event Started!',
                            message: res.message || 'Event has been started.',
                            confirmText: 'OK',
                        });
                        setEvent((prev: any) => ({ ...prev, status: 'ongoing' }));
                    }
                } catch (error: any) {
                    alert.show({
                        type: 'error',
                        title: 'Failed to Start',
                        message: error.backendMessage || 'Failed to start event',
                        confirmText: 'OK',
                    });
                } finally {
                    setActionLoading(false);
                }
            },
        });
    };

    const handleCompleteEvent = () => {
        alert.show({
            type: 'confirm',
            title: 'Complete Event',
            message: 'Mark this event as completed?',
            confirmText: 'Complete',
            cancelText: 'Not Yet',
            onConfirm: async () => {
                try {
                    setActionLoading(true);
                    const res: any = await completeEvent(event.id, therapistId);
                    if (res?.success) {
                        alert.show({
                            type: 'success',
                            title: 'Event Completed!',
                            message: res.message || 'Event has been completed.',
                            confirmText: 'OK',
                        });
                        setEvent((prev: any) => ({ ...prev, status: 'completed' }));
                    }
                } catch (error: any) {
                    alert.show({
                        type: 'error',
                        title: 'Failed to Complete',
                        message: error.backendMessage || 'Failed to complete event',
                        confirmText: 'OK',
                    });
                } finally {
                    setActionLoading(false);
                }
            },
        });
    };

    const handleDelete = () => {
        alert.show({
            type: 'destructive',
            title: 'Cancel Event',
            message: 'Are you sure? All attendees will be notified and refunded. This cannot be undone.',
            confirmText: 'Cancel Event',
            cancelText: 'Keep Event',
            onConfirm: async () => {
                try {
                    setActionLoading(true);
                    const res: any = await deleteEvent(event.id, therapistId);
                    if (res?.success) {
                        alert.show({
                            type: 'success',
                            title: 'Event Cancelled',
                            message: res.message || 'Event cancelled successfully.',
                            confirmText: 'OK',
                            onConfirm: () => navigation.goBack(),
                        });
                    }
                } catch (error: any) {
                    alert.show({
                        type: 'error',
                        title: 'Failed to Cancel',
                        message: error.backendMessage || 'Failed to cancel event',
                        confirmText: 'OK',
                    });
                } finally {
                    setActionLoading(false);
                }
            },
        });
    };

    const handleCheckIn = async (attendee: Attendee) => {
        if (attendee.attended) return;
        try {
            setCheckingIn(attendee.id);
            const res: any = await checkInAttendee(event.id, attendee.id, therapistId);
            if (res?.success) {
                setAttendees((prev) =>
                    prev.map((a) => a.id === attendee.id ? { ...a, attended: true } : a)
                );
            }
        } catch (error: any) {
            alert.show({
                type: 'error',
                title: 'Check-in Failed',
                message: error.backendMessage || 'Failed to check in attendee',
                confirmText: 'OK',
            });
        } finally {
            setCheckingIn(null);
        }
    };

    // ── Status helpers ────────────────────────────────────────────────────────

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'upcoming': return appColors.AppBlue;
            case 'completed': return appColors.AppGreen;
            case 'ongoing': return '#FF9800';
            case 'cancelled': return '#F44336';
            default: return appColors.grey3;
        }
    };

    const resolveEventImage = (image: string | null | undefined) => {
        if (!image || typeof image !== 'string') return appImages.isDefaultImage;
        if (image.startsWith('http')) return { uri: image };
 
        // Resolve therapist dashboard media base URL
        const cleanBase = therapistMediaUrl.endsWith('/') ? therapistMediaUrl.slice(0, -1) : therapistMediaUrl;
        
        // Ensure relative path starts with a single slash
        const cleanPath = image.startsWith('/') ? image : `/${image}`;
        
        return { uri: `${cleanBase}${cleanPath}` };
    };

    // ── Render sections ───────────────────────────────────────────────────────

    const renderOverviewTab = () => (
        <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={[appColors.AppBlue]}
                    tintColor={appColors.AppBlue}
                />
            }
        >
            {/* Image Banner — resolves absolute/relative remote images or local default fallback */}
            <Image
                source={resolveEventImage(event.image)}
                style={[styles.bannerImage, { height: Math.round(width * 0.46) }]}
                resizeMode="cover"
            />

            <View style={styles.overviewContent}>
                {/* Title & Category */}
                <View style={styles.titleRow}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.title}>{event.title}</Text>
                        <Text style={styles.categoryLabel}>{event.category}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(event.status) + '18' }]}>
                        <Text style={[styles.statusText, { color: getStatusColor(event.status) }]}>
                            {event.status?.toUpperCase()}
                        </Text>
                    </View>
                </View>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <View style={styles.statBlock}>
                        <Icon type="material" name="people" size={20} color={appColors.AppBlue} />
                        <Text style={styles.statValue}>{event.registeredCount ?? 0}</Text>
                        <Text style={styles.statLabel}>Registered</Text>
                    </View>
                    <View style={styles.statBlock}>
                        <Icon type="material" name="event-seat" size={20} color={appColors.AppBlue} />
                        <Text style={styles.statValue}>{event.maxAttendees}</Text>
                        <Text style={styles.statLabel}>Capacity</Text>
                    </View>
                    <View style={styles.statBlock}>
                        <Icon type="material" name="payments" size={20} color={appColors.AppBlue} />
                        <Text style={styles.statValue}>
                            {event.price > 0 ? `${(event.price / 1000).toFixed(0)}K` : 'Free'}
                        </Text>
                        <Text style={styles.statLabel}>
                            {event.price > 0 ? (event.currency || 'UGX') : ''}
                        </Text>
                    </View>
                </View>

                {/* Time & Location */}
                <View style={styles.infoCard}>
                    <Text style={styles.sectionTitle}>Date & Time</Text>
                    <View style={styles.infoRow}>
                        <Icon type="material" name="calendar-today" size={18} color={appColors.grey3} />
                        <Text style={styles.infoText}>
                            {new Date(event.date).toLocaleDateString('en-UG', {
                                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                            })}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Icon type="material" name="schedule" size={18} color={appColors.grey3} />
                        <Text style={styles.infoText}>{event.startTime} – {event.endTime}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Icon type="material" name="location-on" size={18} color={appColors.grey3} />
                        <Text style={styles.infoText}>{event.location}</Text>
                    </View>
                    {event.meetingLink ? (
                        <TouchableOpacity
                            style={styles.meetingLinkRow}
                            onPress={() => Linking.openURL(event.meetingLink)}
                        >
                            <Icon type="material" name="videocam" size={18} color={appColors.AppBlue} />
                            <Text style={styles.meetingLinkText}>Join Meeting Link</Text>
                            <Icon type="material" name="open-in-new" size={14} color={appColors.AppBlue} />
                        </TouchableOpacity>
                    ) : null}
                </View>

                {/* Description */}
                <View style={styles.infoCard}>
                    <Text style={styles.sectionTitle}>About this Event</Text>
                    <Text style={styles.description}>{event.description}</Text>
                </View>

                {/* Speakers */}
                {event.speakers && event.speakers.length > 0 && (
                    <View style={styles.infoCard}>
                        <Text style={styles.sectionTitle}>Speakers</Text>
                        {(event.speakers as Speaker[]).map((speaker, idx) => (
                            <View key={idx} style={styles.speakerRow}>
                                <View style={styles.speakerAvatar}>
                                    <Text style={styles.speakerInitial}>
                                        {speaker.name?.charAt(0).toUpperCase()}
                                    </Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.speakerName}>{speaker.name}</Text>
                                    {speaker.title ? (
                                        <Text style={styles.speakerTitle}>{speaker.title}</Text>
                                    ) : null}
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                <View style={{ height: 100 }} />
            </View>
        </ScrollView>
    );

    const renderAttendeesTab = () => {
        if (attendeesLoading) {
            return (
                <View style={styles.tabLoading}>
                    <ActivityIndicator size="large" color={appColors.AppBlue} />
                    <Text style={styles.loadingText}>Loading attendees...</Text>
                </View>
            );
        }

        return (
            <FlatList
                data={attendees}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 16, paddingBottom: 100, flexGrow: 1 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[appColors.AppBlue]}
                        tintColor={appColors.AppBlue}
                    />
                }
                ListHeaderComponent={
                    attendeeStats ? (
                        <View style={styles.attendeeStatsRow}>
                            <View style={styles.attendeeStatItem}>
                                <Text style={styles.statValue}>{attendeeStats.totalRegistered}</Text>
                                <Text style={styles.statLabel}>Registered</Text>
                            </View>
                            <View style={styles.attendeeStatItem}>
                                <Text style={[styles.statValue, { color: appColors.AppGreen }]}>
                                    {attendeeStats.paidCount}
                                </Text>
                                <Text style={styles.statLabel}>Paid</Text>
                            </View>
                            <View style={styles.attendeeStatItem}>
                                <Text style={[styles.statValue, { color: '#FF9800' }]}>
                                    {attendeeStats.pendingPayment}
                                </Text>
                                <Text style={styles.statLabel}>Pending</Text>
                            </View>
                            <View style={styles.attendeeStatItem}>
                                <Text style={styles.statValue}>
                                    {(attendeeStats.totalRevenue / 1000).toFixed(0)}K
                                </Text>
                                <Text style={styles.statLabel}>Revenue</Text>
                            </View>
                        </View>
                    ) : null
                }
                ListEmptyComponent={
                    <View style={styles.emptyStateCentered}>
                        <Icon type="material" name="people-outline" size={54} color={appColors.grey4} />
                        <Text style={styles.emptyTitle}>No Attendees Yet</Text>
                        <Text style={styles.emptyText}>
                            Attendees who register will appear here
                        </Text>
                    </View>
                }
                renderItem={({ item }: { item: Attendee }) => (
                    <View style={styles.attendeeCard}>
                        <ISClientAvatar 
                            clientId={item.id} 
                            initialAvatar={item.avatar} 
                            size={42} 
                            rounded 
                        />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.attendeeName}>{item.name}</Text>
                            <Text style={styles.attendeeEmail}>{item.email}</Text>
                            <View style={[
                                styles.paymentBadge,
                                { backgroundColor: item.paymentStatus === 'completed' ? appColors.AppGreen + '18' : '#FF9800' + '18' }
                            ]}>
                                <Text style={[
                                    styles.paymentBadgeText,
                                    { color: item.paymentStatus === 'completed' ? appColors.AppGreen : '#FF9800' }
                                ]}>
                                    {item.paymentStatus === 'completed' ? 'Paid' : 'Pending'}
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={[
                                styles.checkInButton,
                                item.attended && styles.checkInButtonDone
                            ]}
                            onPress={() => handleCheckIn(item)}
                            disabled={item.attended || checkingIn === item.id}
                        >
                            {checkingIn === item.id ? (
                                <ActivityIndicator size="small" color="#FFF" />
                            ) : (
                                <Icon
                                    type="material"
                                    name={item.attended ? 'check-circle' : 'radio-button-unchecked'}
                                    size={18}
                                    color={item.attended ? '#FFF' : appColors.AppBlue}
                                />
                            )}
                            <Text style={[
                                styles.checkInText,
                                item.attended && { color: '#FFF' }
                            ]}>
                                {item.attended ? 'Checked In' : 'Check In'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        );
    };

    const renderAgendaTab = () => {
        const agenda: AgendaItem[] = event.agenda || [];
        if (agenda.length === 0) {
            return (
                <View style={styles.tabLoading}>
                    <Icon type="material" name="list-alt" size={48} color={appColors.grey4} />
                    <Text style={styles.emptyTitle}>No Agenda Set</Text>
                    <Text style={styles.emptyText}>The agenda for this event hasn't been added yet</Text>
                </View>
            );
        }

        return (
            <ScrollView
                contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[appColors.AppBlue]}
                        tintColor={appColors.AppBlue}
                    />
                }
            >
                {agenda.map((item, idx) => (
                    <View key={idx} style={styles.agendaItem}>
                        <View style={styles.agendaTimeline}>
                            <View style={styles.agendaDot} />
                            {idx < agenda.length - 1 && <View style={styles.agendaLine} />}
                        </View>
                        <View style={styles.agendaContent}>
                            <Text style={styles.agendaTime}>{item.time}</Text>
                            <Text style={styles.agendaTitle}>{item.title}</Text>
                            {item.duration ? (
                                <Text style={styles.agendaDuration}>{item.duration}</Text>
                            ) : null}
                            {item.speaker ? (
                                <Text style={styles.agendaSpeaker}>🎤 {item.speaker}</Text>
                            ) : null}
                        </View>
                    </View>
                ))}
            </ScrollView>
        );
    };

    // ── Action bar ────────────────────────────────────────────────────────────

    const renderActionBar = () => {
        const status = event.status;
        if (status === 'completed' || status === 'cancelled') return null;

        return (
            <View style={styles.actionBar}>
                {status === 'upcoming' && (
                    <Button
                        title={actionLoading ? 'Starting...' : '▶  Start Event'}
                        buttonStyle={[styles.actionBtn, { backgroundColor: appColors.AppGreen }]}
                        titleStyle={styles.actionBtnText}
                        onPress={handleStartEvent}
                        disabled={actionLoading}
                        containerStyle={{ flex: 1 }}
                    />
                )}
                {status === 'ongoing' && (
                    <Button
                        title={actionLoading ? 'Completing...' : '✓  Complete Event'}
                        buttonStyle={[styles.actionBtn, { backgroundColor: appColors.AppBlue }]}
                        titleStyle={styles.actionBtnText}
                        onPress={handleCompleteEvent}
                        disabled={actionLoading}
                        containerStyle={{ flex: 1 }}
                    />
                )}
                {(status === 'upcoming' || status === 'ongoing') && (
                    <TouchableOpacity style={styles.deleteIconBtn} onPress={handleDelete} disabled={actionLoading}>
                        <Icon type="material" name="cancel" size={22} color="#F44336" />
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    // ── Loading state ──────────────────────────────────────────────────────────

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <ISStatusBar />
                <ISGenericHeader title="Event Details" navigation={navigation} />
                <View style={styles.tabLoading}>
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
                hasRightIcon={event.status !== 'completed' && event.status !== 'cancelled'}
                rightIconName="edit"
                rightIconOnPress={() => navigation.navigate('THCreateEventScreen', { event })}
            />

            {/* Tab bar */}
            <View style={styles.tabBar}>
                {(['overview', 'attendees', 'agenda'] as Tab[]).map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeTab === tab && styles.tabActive]}
                        onPress={() => handleTabChange(tab)}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            {tab === 'attendees' && attendeeStats
                                ? ` (${attendeeStats.totalRegistered})`
                                : ''}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={{ flex: 1 }}>
                {activeTab === 'overview' && renderOverviewTab()}
                {activeTab === 'attendees' && renderAttendeesTab()}
                {activeTab === 'agenda' && renderAgendaTab()}
            </View>

            {renderActionBar()}

            <ISAlert ref={alert.ref} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: appColors.AppLightGray,
    },
    // ── Tabs ───────────────────────────────────────────────────────────────────
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: appColors.grey6,
    },
    tab: {
        flex: 1,
        paddingVertical: 13,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabActive: {
        borderBottomColor: appColors.AppBlue,
    },
    tabText: {
        fontSize: 13,
        color: appColors.grey3,
        fontFamily: appFonts.bodyTextMedium,
        fontWeight: '500',
    },
    tabTextActive: {
        color: appColors.AppBlue,
        fontWeight: '700',
    },
    // ── Overview ───────────────────────────────────────────────────────────────
    bannerImage: {
        width: '100%',
    },
    overviewContent: {
        padding: 16,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    title: {
        fontSize: moderateScale(20),
        fontWeight: 'bold',
        color: appColors.grey1,
        fontFamily: appFonts.headerTextBold,
        marginBottom: 4,
    },
    categoryLabel: {
        fontSize: 13,
        color: appColors.AppBlue,
        fontFamily: appFonts.bodyTextMedium,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 14,
        marginLeft: 10,
        marginTop: 2,
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    statsRow: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 14,
        paddingVertical: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    statBlock: {
        flex: 1,
        alignItems: 'center',
        gap: 4,
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: appColors.grey1,
        fontFamily: appFonts.headerTextBold,
    },
    statLabel: {
        fontSize: 11,
        color: appColors.grey3,
        fontFamily: appFonts.bodyTextRegular,
    },
    infoCard: {
        backgroundColor: '#FFF',
        borderRadius: 14,
        padding: 16,
        marginBottom: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
        elevation: 1,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: appColors.grey1,
        fontFamily: appFonts.headerTextBold,
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        color: appColors.grey2,
        fontFamily: appFonts.bodyTextRegular,
        flex: 1,
    },
    meetingLinkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 6,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: appColors.grey6,
    },
    meetingLinkText: {
        fontSize: 14,
        color: appColors.AppBlue,
        fontFamily: appFonts.bodyTextMedium,
        flex: 1,
        fontWeight: '600',
    },
    description: {
        fontSize: 14,
        color: appColors.grey2,
        lineHeight: 22,
        fontFamily: appFonts.bodyTextRegular,
    },
    speakerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    speakerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: appColors.AppBlue + '20',
        alignItems: 'center',
        justifyContent: 'center',
    },
    speakerInitial: {
        fontSize: 16,
        fontWeight: 'bold',
        color: appColors.AppBlue,
    },
    speakerName: {
        fontSize: 14,
        fontWeight: '600',
        color: appColors.grey1,
        fontFamily: appFonts.bodyTextMedium,
    },
    speakerTitle: {
        fontSize: 12,
        color: appColors.grey3,
        fontFamily: appFonts.bodyTextRegular,
    },
    // ── Attendees ──────────────────────────────────────────────────────────────
    attendeeStatsRow: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 14,
        paddingVertical: 14,
        marginBottom: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    attendeeStatItem: {
        flex: 1,
        alignItems: 'center',
    },
    attendeeCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
        elevation: 1,
        gap: 10,
    },
    attendeeAvatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: appColors.AppBlue + '18',
        alignItems: 'center',
        justifyContent: 'center',
    },
    attendeeInitial: {
        fontSize: 16,
        fontWeight: 'bold',
        color: appColors.AppBlue,
        fontFamily: appFonts.headerTextBold,
    },
    attendeeName: {
        fontSize: 14,
        fontWeight: '600',
        color: appColors.grey1,
        fontFamily: appFonts.bodyTextMedium,
    },
    attendeeEmail: {
        fontSize: 11,
        color: appColors.grey3,
        fontFamily: appFonts.bodyTextRegular,
        marginBottom: 4,
    },
    paymentBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    paymentBadgeText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    checkInButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: appColors.AppBlue,
        backgroundColor: '#FFF',
    },
    checkInButtonDone: {
        backgroundColor: appColors.AppGreen,
        borderColor: appColors.AppGreen,
    },
    checkInText: {
        fontSize: 11,
        color: appColors.AppBlue,
        fontWeight: '600',
        fontFamily: appFonts.bodyTextMedium,
    },
    // ── Agenda ─────────────────────────────────────────────────────────────────
    agendaItem: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    agendaTimeline: {
        alignItems: 'center',
        width: 24,
        marginRight: 12,
    },
    agendaDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: appColors.AppBlue,
        marginTop: 4,
    },
    agendaLine: {
        flex: 1,
        width: 2,
        backgroundColor: appColors.AppBlue + '30',
        marginTop: 4,
    },
    agendaContent: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
        elevation: 1,
    },
    agendaTime: {
        fontSize: 12,
        color: appColors.AppBlue,
        fontWeight: '600',
        fontFamily: appFonts.bodyTextMedium,
        marginBottom: 2,
    },
    agendaTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: appColors.grey1,
        fontFamily: appFonts.bodyTextMedium,
    },
    agendaDuration: {
        fontSize: 12,
        color: appColors.grey3,
        marginTop: 2,
        fontFamily: appFonts.bodyTextRegular,
    },
    agendaSpeaker: {
        fontSize: 12,
        color: appColors.grey2,
        marginTop: 4,
        fontFamily: appFonts.bodyTextRegular,
    },
    // ── Shared ─────────────────────────────────────────────────────────────────
    tabLoading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: 40,
    },
    loadingText: {
        fontSize: 14,
        color: appColors.grey3,
        fontFamily: appFonts.bodyTextRegular,
    },
    emptyState: {
        alignItems: 'center',
        paddingTop: 40,
        gap: 8,
    },
    emptyStateCentered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: appColors.grey2,
        fontFamily: appFonts.headerTextBold,
    },
    emptyText: {
        fontSize: 13,
        color: appColors.grey3,
        textAlign: 'center',
        fontFamily: appFonts.bodyTextRegular,
    },
    // ── Action bar ─────────────────────────────────────────────────────────────
    actionBar: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: appColors.grey6,
        gap: 12,
        alignItems: 'center',
    },
    actionBtn: {
        borderRadius: 12,
        paddingVertical: 14,
    },
    actionBtnText: {
        fontSize: 15,
        fontWeight: '700',
    },
    deleteIconBtn: {
        width: 48,
        height: 48,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#F44336',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default THEventDetailsScreen;
