import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    RefreshControl, ActivityIndicator, useWindowDimensions,
    ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/themed';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { appColors, appFonts } from '../../global/Styles';
import { scale, moderateScale } from '../../global/Scaling';
import ISGenericHeader from '../../components/ISGenericHeader';
import ISStatusBar from '../../components/ISStatusBar';
import { getEvents } from '../../api/therapist';
import { isPastEvent } from '../../utils/dateHelpers';

type StatusFilter = 'upcoming' | 'ongoing' | 'completed' | 'cancelled' | 'past' | 'all';
type CategoryFilter = 'all' | 'Workshop' | 'Training' | 'Seminar' | 'Summit';

interface EventStats {
    totalEvents: number;
    upcomingEvents: number;
    totalRegistrations: number;
}

interface Event {
    id: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    registeredCount: number;
    maxAttendees: number;
    status: 'upcoming' | 'completed' | 'cancelled' | 'ongoing';
    category: string;
    description?: string;
    location?: string;
    price?: number;
    currency?: string;
    image?: string;
}

const STATUS_FILTERS: { key: StatusFilter; label: string; color: string }[] = [
    { key: 'upcoming', label: 'Upcoming', color: appColors.AppBlue },
    { key: 'ongoing', label: 'Ongoing', color: '#FF9800' },
    { key: 'completed', label: 'Completed', color: appColors.AppGreen },
    { key: 'cancelled', label: 'Cancelled', color: '#F44336' },
    { key: 'past', label: 'Past', color: appColors.grey3 },
    { key: 'all', label: 'All', color: appColors.grey2 },
];

const CATEGORIES: { key: CategoryFilter; label: string }[] = [
    { key: 'all', label: '✦  All' },
    { key: 'Workshop', label: 'Workshop' },
    { key: 'Training', label: 'Training' },
    { key: 'Seminar', label: 'Seminar' },
    { key: 'Summit', label: 'Summit' },
];

const PAGE_LIMIT = 20;

const THEventsScreen = ({ navigation }: any) => {
    const userDetails = useSelector((state: any) => state.userData.userDetails);
    const { width } = useWindowDimensions();

    const [events, setEvents] = useState<Event[]>([]);
    const [stats, setStats] = useState<EventStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    const [statusFilter, setStatusFilter] = useState<StatusFilter>('upcoming');
    const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Refs for status ScrollView to auto-scroll active tab into view
    const statusScrollRef = useRef<ScrollView>(null);
    const statusItemPositions = useRef<Record<string, number>>({});

    // Ref for category ScrollView to auto-scroll active chip into view
    const categoryScrollRef = useRef<ScrollView>(null);
    const categoryItemPositions = useRef<Record<string, number>>({});

    const loadEvents = useCallback(async (page = 1, reset = true) => {
        try {
            if (reset) setLoading(true);
            else setLoadingMore(true);

            const therapistId = userDetails?.userId;
            const filters: any = { page, limit: PAGE_LIMIT };

            // ── Backend filters (existing logic) ─────────────────────────────
            // Send the status and category to the backend for server-side filtering.
            // 'past' is a local-only filter, so we fetch 'upcoming' from backend
            // and then apply our local date check to find the ones that have passed.
            if (statusFilter === 'past') {
                // Backend doesn't know about 'past' status yet — fetch all and filter locally
                // (no status filter sent, so backend returns everything)
            } else if (statusFilter !== 'all') {
                filters.status = statusFilter;
            }
            if (categoryFilter !== 'all') filters.category = categoryFilter;

            const response: any = await getEvents(therapistId, filters);

            if (response?.data) {
                let newEvents: Event[] = response.data.events || [];

                // ── Local Date Helper: Additional check (can be removed later) ──
                // The backend doesn't automatically update event status when dates pass,
                // so we verify each event's date/time locally to keep the UI accurate.

                if (statusFilter === 'upcoming') {
                    // Only show events that are truly upcoming:
                    // status must be 'upcoming' AND the event date/time must not have passed
                    newEvents = newEvents.filter(e =>
                        e.status === 'upcoming' && !isPastEvent(e.date, e.endTime)
                    );
                } else if (statusFilter === 'past') {
                    // Catch events still stuck as 'upcoming' on the backend
                    // but whose dates have already passed (backend hasn't updated status yet).
                    // Completed and cancelled events have their own tabs.
                    newEvents = newEvents.filter(e =>
                        e.status === 'upcoming' && isPastEvent(e.date, e.endTime)
                    );
                }

                setEvents(reset ? newEvents : (prev) => [...prev, ...newEvents]);
                if (response.data.stats) setStats(response.data.stats);
                if (response.data.pagination) {
                    setCurrentPage(response.data.pagination.currentPage);
                    setTotalPages(response.data.pagination.totalPages);
                }
            }
        } catch (error: any) {
            const msg = error.backendMessage || error.message || 'Failed to load events';
            console.error('Events Error:', msg);
            if (reset) setEvents([]);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [userDetails?.userId, statusFilter, categoryFilter]);

    useEffect(() => {
        loadEvents(1, true);
    }, [loadEvents]);

    // Reload whenever the screen comes back into focus (after create / edit / delete)
    useFocusEffect(
        useCallback(() => {
            loadEvents(1, true);
        }, [loadEvents])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await loadEvents(1, true);
        setRefreshing(false);
    };

    const handleLoadMore = () => {
        if (!loadingMore && currentPage < totalPages) {
            loadEvents(currentPage + 1, false);
        }
    };

    const handleStatusSelect = (key: StatusFilter) => {
        setStatusFilter(key);
        const x = statusItemPositions.current[key];
        if (x !== undefined && statusScrollRef.current) {
            statusScrollRef.current.scrollTo({ x: Math.max(0, x - 16), animated: true });
        }
    };

    const handleCategorySelect = (key: CategoryFilter) => {
        setCategoryFilter(key);
        // Scroll the selected chip into view
        const x = categoryItemPositions.current[key];
        if (x !== undefined && categoryScrollRef.current) {
            categoryScrollRef.current.scrollTo({ x: Math.max(0, x - 16), animated: true });
        }
    };

    const getStatusColor = (status: string) => {
        const found = STATUS_FILTERS.find(f => f.key === status);
        return found?.color ?? appColors.grey3;
    };

    const renderEvent = ({ item }: { item: Event }) => (
        <TouchableOpacity
            style={styles.eventCard}
            onPress={() => navigation.navigate('THEventDetailsScreen', { event: item })}
            activeOpacity={0.75}
        >
            {/* Date block */}
            <View style={[styles.eventDateBlock, { backgroundColor: getStatusColor(item.status) + '12' }]}>
                <Text style={[styles.eventMonth, { color: getStatusColor(item.status) }]}>
                    {new Date(item.date).toLocaleString('default', { month: 'short' }).toUpperCase()}
                </Text>
                <Text style={[styles.eventDay, { color: getStatusColor(item.status) }]}>
                    {new Date(item.date).getDate()}
                </Text>
            </View>

            {/* Content */}
            <View style={styles.eventContent}>
                <View style={styles.eventTopRow}>
                    <Text style={styles.eventTitle} numberOfLines={1}>{item.title}</Text>
                    <View style={[styles.statusPill, { backgroundColor: getStatusColor(item.status) + '18' }]}>
                        <Text style={[styles.statusPillText, { color: getStatusColor(item.status) }]}>
                            {item.status}
                        </Text>
                    </View>
                </View>

                <View style={styles.eventMeta}>
                    <Icon type="material" name="schedule" size={12} color={appColors.grey4} />
                    <Text style={styles.metaText}>{item.startTime} – {item.endTime}</Text>
                    <View style={styles.metaDot} />
                    <Icon type="material" name="people" size={12} color={appColors.grey4} />
                    <Text style={styles.metaText}>{item.registeredCount ?? 0}/{item.maxAttendees}</Text>
                </View>

                <View style={styles.categoryPill}>
                    <Text style={styles.categoryPillText}>{item.category}</Text>
                </View>
            </View>

            <Icon type="material" name="chevron-right" size={20} color={appColors.grey5} />
        </TouchableOpacity>
    );

    // ── Stats Bar ──────────────────────────────────────────────────────────────

    const renderStatsBar = () => {
        if (!stats) return null;
        const statFontSize = Math.max(16, width * 0.047);
        return (
            <View style={styles.statsBar}>
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { fontSize: statFontSize }]}>{stats.totalEvents}</Text>
                    <Text style={styles.statLabel}>Total</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { fontSize: statFontSize }]}>{stats.upcomingEvents}</Text>
                    <Text style={styles.statLabel}>Upcoming</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { fontSize: statFontSize }]}>{stats.totalRegistrations}</Text>
                    <Text style={styles.statLabel}>Registrations</Text>
                </View>
            </View>
        );
    };

    // ── Filter header — never unmounted so filters stay visible during loading ──

    const renderListHeader = () => (
        <View style={styles.filtersWrapper}>
            {renderStatsBar()}

            {/* ── Status tabs — horizontal scroll ──────────────────── */}
            <ScrollView
                ref={statusScrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.statusRow}
            >
                {STATUS_FILTERS.map(({ key, label, color }) => {
                    const active = statusFilter === key;
                    return (
                        <TouchableOpacity
                            key={key}
                            style={[
                                styles.statusTab,
                                active && { backgroundColor: color, borderColor: color }
                            ]}
                            onPress={() => handleStatusSelect(key)}
                            onLayout={(e) => {
                                statusItemPositions.current[key] = e.nativeEvent.layout.x;
                            }}
                            activeOpacity={0.75}
                        >
                            {active && (
                                <View style={[styles.statusDot, { backgroundColor: '#FFF' }]} />
                            )}
                            <Text style={[
                                styles.statusTabText,
                                active && { color: '#FFF', fontWeight: '700' }
                            ]}>
                                {label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {/* ── Category chips — horizontal scroll ──────────────────── */}
            <ScrollView
                ref={categoryScrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryRow}
            >
                {CATEGORIES.map(({ key, label }) => {
                    const active = categoryFilter === key;
                    return (
                        <TouchableOpacity
                            key={key}
                            style={[styles.categoryChip, active && styles.categoryChipActive]}
                            onPress={() => handleCategorySelect(key)}
                            onLayout={(e) => {
                                categoryItemPositions.current[key] = e.nativeEvent.layout.x;
                            }}
                            activeOpacity={0.75}
                        >
                            <Text style={[styles.categoryChipText, active && styles.categoryChipTextActive]}>
                                {label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {/* Inline loading bar under filters */}
            {loading && (
                <View style={styles.inlineLoader}>
                    <ActivityIndicator size="small" color={appColors.AppBlue} />
                    <Text style={styles.inlineLoaderText}>Loading events…</Text>
                </View>
            )}
        </View>
    );

    const renderFooter = () =>
        loadingMore ? (
            <View style={styles.loadMoreRow}>
                <ActivityIndicator size="small" color={appColors.AppBlue} />
            </View>
        ) : <View style={{ height: 32 }} />;

    const renderEmpty = () => {
        if (loading) return null; // inline loader handles it
        return (
            <View style={styles.emptyState}>
                <View style={styles.emptyIconWrap}>
                    <Icon type="material" name="event-busy" size={44} color={appColors.AppBlue + '80'} />
                </View>
                <Text style={styles.emptyTitle}>No Events Found</Text>
                <Text style={styles.emptyText}>
                    {statusFilter === 'upcoming'
                        ? 'No upcoming events scheduled'
                        : statusFilter === 'past'
                            ? 'No past events found'
                            : statusFilter === 'ongoing'
                                ? 'No events currently running'
                                : `No ${statusFilter} events`}
                    {categoryFilter !== 'all' ? ` in ${categoryFilter}` : ''}
                </Text>
                {statusFilter === 'upcoming' && (
                    <TouchableOpacity
                        style={styles.createButton}
                        onPress={() => navigation.navigate('THCreateEventScreen')}
                    >
                        <Icon type="material" name="add" size={18} color="#FFF" />
                        <Text style={styles.createButtonText}>Create Event</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ISStatusBar />
            <ISGenericHeader
                title="My Events"
                navigation={navigation}
                hasRightIcon
                rightIconName="add"
                rightIconOnPress={() => navigation.navigate('THCreateEventScreen')}
            />

            <FlatList
                data={events}
                renderItem={renderEvent}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={renderListHeader}
                ListEmptyComponent={renderEmpty}
                ListFooterComponent={renderFooter}
                contentContainerStyle={{ flexGrow: 1 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[appColors.AppBlue]}
                        tintColor={appColors.AppBlue}
                    />
                }
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.3}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: appColors.AppLightGray,
    },

    // ── Filters header ─────────────────────────────────────────────────────────
    filtersWrapper: {
        backgroundColor: appColors.AppLightGray,
        paddingBottom: 4,
    },

    // Stats bar
    statsBar: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        marginHorizontal: 16,
        marginTop: 14,
        marginBottom: 6,
        borderRadius: 16,
        paddingVertical: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontWeight: '800',
        color: appColors.grey1,
        fontFamily: appFonts.headerTextBold,
    },
    statLabel: {
        fontSize: 11,
        color: appColors.grey3,
        marginTop: 2,
        fontFamily: appFonts.bodyTextRegular,
    },
    statDivider: {
        width: 1,
        backgroundColor: appColors.grey6,
        marginVertical: 4,
    },

    // Status tabs row (horizontal scroll content container)
    statusRow: {
        flexDirection: 'row',
        paddingHorizontal: 14,
        paddingTop: 12,
        paddingBottom: 2,
        gap: 8,
    },
    statusTab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 7,
        paddingHorizontal: 14,
        borderRadius: 20,
        backgroundColor: '#FFF',
        borderWidth: 1.5,
        borderColor: appColors.grey5,
        gap: 5,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    statusTabText: {
        fontSize: 13,
        color: appColors.grey3,
        fontFamily: appFonts.bodyTextMedium,
    },

    // Category horizontal scroll
    categoryRow: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        gap: 8,
        flexDirection: 'row',
    },
    categoryChip: {
        paddingVertical: 5,
        paddingHorizontal: 14,
        borderRadius: 14,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: appColors.grey5,
    },
    categoryChipActive: {
        backgroundColor: appColors.AppBlue,
        borderColor: appColors.AppBlue,
    },
    categoryChipText: {
        fontSize: 12,
        color: appColors.grey3,
        fontFamily: appFonts.bodyTextMedium,
    },
    categoryChipTextActive: {
        color: '#FFF',
        fontWeight: '700',
    },

    // Inline loader (shown below filters while fetching)
    inlineLoader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        gap: 8,
    },
    inlineLoaderText: {
        fontSize: 13,
        color: appColors.grey3,
        fontFamily: appFonts.bodyTextRegular,
    },

    // ── Event Card ─────────────────────────────────────────────────────────────
    eventCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 14,
        padding: 12,
        marginHorizontal: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
        gap: 10,
    },
    eventDateBlock: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 52,
        paddingVertical: 10,
        borderRadius: 10,
    },
    eventMonth: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.5,
        marginBottom: 1,
    },
    eventDay: {
        fontSize: moderateScale(22),
        fontWeight: '900',
        lineHeight: 26,
    },
    eventContent: {
        flex: 1,
        gap: 4,
    },
    eventTopRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 6,
    },
    eventTitle: {
        flex: 1,
        fontSize: 14,
        fontWeight: '700',
        color: appColors.grey1,
        fontFamily: appFonts.headerTextBold,
    },
    statusPill: {
        paddingHorizontal: 7,
        paddingVertical: 2,
        borderRadius: 10,
        alignSelf: 'flex-start',
    },
    statusPillText: {
        fontSize: 9,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 0.4,
    },
    eventMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 11,
        color: appColors.grey3,
        fontFamily: appFonts.bodyTextRegular,
    },
    metaDot: {
        width: 3,
        height: 3,
        borderRadius: 2,
        backgroundColor: appColors.grey5,
        marginHorizontal: 2,
    },
    categoryPill: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        backgroundColor: appColors.AppBlue + '10',
    },
    categoryPillText: {
        fontSize: 10,
        color: appColors.AppBlue,
        fontWeight: '600',
        fontFamily: appFonts.bodyTextMedium,
    },

    // ── Load more ──────────────────────────────────────────────────────────────
    loadMoreRow: {
        paddingVertical: 20,
        alignItems: 'center',
    },

    // ── Empty state ────────────────────────────────────────────────────────────
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: scale(40),
        gap: 10,
    },
    emptyIconWrap: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: appColors.AppBlue + '0E',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    emptyTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: appColors.grey2,
        fontFamily: appFonts.headerTextBold,
    },
    emptyText: {
        fontSize: 13,
        color: appColors.grey3,
        textAlign: 'center',
        lineHeight: 20,
        fontFamily: appFonts.bodyTextRegular,
    },
    createButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: appColors.AppBlue,
        paddingVertical: 12,
        paddingHorizontal: 22,
        borderRadius: 24,
        gap: 6,
        marginTop: 8,
    },
    createButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '700',
        fontFamily: appFonts.bodyTextMedium,
    },
});

export default THEventsScreen;
