import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/themed';
import { useSelector } from 'react-redux';
import { appColors, appFonts } from '../../global/Styles';
import ISGenericHeader from '../../components/ISGenericHeader';
import ISStatusBar from '../../components/ISStatusBar';
import { getEvents } from '../../api/therapist';

interface Event {
    id: string;
    title: string;
    date: string;
    time: string;
    attendees: number;
    status: 'upcoming' | 'completed' | 'cancelled';
    type: string;
    description?: string;
    location?: string;
}

const THEventsScreen = ({ navigation }: any) => {
    const userDetails = useSelector((state: any) => state.userData.userDetails);
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'upcoming' | 'completed'>('upcoming');

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            setLoading(true);
            const therapistId = userDetails?.id || '52863268761';
            const response: any = await getEvents(therapistId);

            if (response?.data?.events) {
                setEvents(response.data.events);
            } else {
                setEvents([]);
            }
        } catch (error) {
            console.error('Failed to load events:', error);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadEvents();
        setRefreshing(false);
    };

    const filteredEvents = events.filter(event => {
        if (selectedFilter === 'all') return true;
        return event.status === selectedFilter;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'upcoming': return appColors.AppBlue;
            case 'completed': return appColors.AppGreen;
            case 'cancelled': return '#F44336';
            default: return appColors.grey3;
        }
    };

    const renderEvent = ({ item }: { item: Event }) => (
        <TouchableOpacity
            style={styles.eventCard}
            onPress={() => navigation.navigate('THEventDetailsScreen', { event: item })}
            activeOpacity={0.7}
        >
            <View style={styles.eventDateContainer}>
                <Text style={styles.eventMonth}>{new Date(item.date).toLocaleString('default', { month: 'short' }).toUpperCase()}</Text>
                <Text style={styles.eventDay}>{new Date(item.date).getDate()}</Text>
            </View>

            <View style={styles.eventContent}>
                <View style={styles.eventHeader}>
                    <Text style={styles.eventTitle}>{item.title}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
                        <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
                    </View>
                </View>

                <View style={styles.eventMeta}>
                    <View style={styles.metaItem}>
                        <Icon type="material" name="schedule" size={14} color={appColors.grey3} />
                        <Text style={styles.metaText}>{item.time}</Text>
                    </View>
                    <Text style={styles.metaDivider}>•</Text>
                    <View style={styles.metaItem}>
                        <Icon type="material" name="people" size={14} color={appColors.grey3} />
                        <Text style={styles.metaText}>{item.attendees} registered</Text>
                    </View>
                </View>

                <Text style={styles.eventType}>{item.type}</Text>
            </View>

            <Icon type="material" name="chevron-right" size={24} color={appColors.grey4} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ISStatusBar />
            <ISGenericHeader
                title="My Events"
                navigation={navigation}
                hasRightIcon={true}
                rightIconName="add"
                rightIconOnPress={() => navigation.navigate('THCreateEventScreen')}
            />

            <View style={styles.filterContainer}>
                {['upcoming', 'completed', 'all'].map((filter) => (
                    <TouchableOpacity
                        key={filter}
                        style={[styles.filterTab, selectedFilter === filter && styles.filterTabActive]}
                        onPress={() => setSelectedFilter(filter as any)}
                    >
                        <Text style={[styles.filterText, selectedFilter === filter && styles.filterTextActive]}>
                            {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={appColors.AppBlue} />
                    <Text style={styles.loadingText}>Loading events...</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredEvents}
                    renderItem={renderEvent}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[appColors.AppBlue]} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Icon type="material" name="event-busy" size={60} color={appColors.grey4} />
                            <Text style={styles.emptyTitle}>No Events Found</Text>
                            <Text style={styles.emptyText}>
                                {selectedFilter === 'upcoming'
                                    ? 'You have no upcoming events scheduled'
                                    : `No ${selectedFilter} events found`}
                            </Text>
                            <TouchableOpacity
                                style={styles.createButton}
                                onPress={() => navigation.navigate('THCreateEventScreen')}
                            >
                                <Icon type="material" name="add" size={20} color="#FFF" />
                                <Text style={styles.createButtonText}>Create New Event</Text>
                            </TouchableOpacity>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: appColors.AppLightGray,
    },
    filterContainer: {
        flexDirection: 'row',
        padding: 16,
        gap: 12,
    },
    filterTab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: appColors.grey5,
    },
    filterTabActive: {
        backgroundColor: appColors.AppBlue,
        borderColor: appColors.AppBlue,
    },
    filterText: {
        fontSize: 14,
        color: appColors.grey3,
        fontFamily: appFonts.bodyTextMedium,
    },
    filterTextActive: {
        color: '#FFF',
        fontWeight: '600',
    },
    listContent: {
        padding: 16,
        paddingTop: 0,
    },
    eventCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    eventDateContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        backgroundColor: appColors.AppBlue + '10',
        borderRadius: 8,
        marginRight: 12,
        width: 60,
    },
    eventMonth: {
        fontSize: 12,
        color: appColors.AppBlue,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    eventDay: {
        fontSize: 20,
        fontWeight: 'bold',
        color: appColors.AppBlue,
    },
    eventContent: {
        flex: 1,
    },
    eventHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: appColors.grey1,
        fontFamily: appFonts.headerTextBold,
        flex: 1,
        marginRight: 8,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    eventMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 12,
        color: appColors.grey3,
        fontFamily: appFonts.bodyTextRegular,
    },
    metaDivider: {
        marginHorizontal: 6,
        color: appColors.grey4,
    },
    eventType: {
        fontSize: 12,
        color: appColors.AppBlue,
        fontFamily: appFonts.bodyTextMedium,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 12,
        color: appColors.grey3,
        fontSize: 14,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: appColors.grey2,
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: appColors.grey3,
        textAlign: 'center',
        marginBottom: 24,
    },
    createButton: {
        flexDirection: 'row',
        backgroundColor: appColors.AppBlue,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 24,
        alignItems: 'center',
        gap: 8,
    },
    createButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default THEventsScreen;
