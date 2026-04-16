/**
 * Events Screen - Mental Health Events and Workshops
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  Image,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Avatar, Skeleton } from '@rneui/base';
import { appColors, appFonts } from '../global/Styles';
import { scale, moderateScale } from '../global/Scaling';
import PanicButtonComponent from '../components/PanicButtonComponent';
import { useToast } from 'native-base';
import LHGenericHeader from '../components/LHGenericHeader';
import EventCard from '../components/events/EventCard';
import EventFilterBar from '../components/events/EventFilterBar';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { getEvents, getMyEvents } from '../api/client/events';
import { UPLOADS_BASE_URL } from '../config/env';
import { setRegisteredEventIds } from '../features/events/eventsSlice';
import { getImageSource, FALLBACK_IMAGES } from '../utils/imageHelpers';

interface Event {
  id: number;
  title: string;
  shortDescription: string;
  date: string;
  time: string;
  coverImage: any;
  location: string;
  isOnline: boolean;
  totalSeats: number;
  availableSeats: number;
  price: number;
  currency: string;
  category: string;
  organizer: string;
  organizerImage: any;
  isRegistered: boolean;
  // Registration data (only for my-events)
  registrationId?: string;
  status?: string;
  registeredAt?: string;
  confirmationCode?: string;
  meetingLink?: string;
  paidAmount?: number;
}

interface EventsScreenProps {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
}

const EventsScreen: React.FC<EventsScreenProps> = ({ navigation, route }) => {
  const toast = useToast();
  const dispatch = useDispatch();
  const userId = useSelector((state: any) => state.userData.userDetails.userId);
  const [activeTab, setActiveTab] = useState<'events' | 'my-events'>('events');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'list' | 'gallery'>('gallery');
  const [events, setEvents] = useState<Event[]>([]);
  const eventsListRef = useRef<FlatList>(null);

  const categories = ['All', 'Workshop', 'Training', 'Seminar', 'Summit'];

  useEffect(() => {
    // Respect initialTab when navigated with params
    const init = (route?.params as any)?.initialTab as 'events' | 'my-events' | undefined;
    if (init === 'events' || init === 'my-events') {
      setActiveTab(init);
    }
    loadEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reload events when tab changes
  useEffect(() => {
    loadEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      console.log('🔄 Loading events...');
      console.log('📋 Active Tab:', activeTab);
      console.log('👤 User ID:', userId);

      let apiResponse;
      let myEventIds = new Set<number>();

      if (activeTab === 'my-events') {
        console.log('📞 Calling getMyEvents API...');
        apiResponse = await getMyEvents(userId);
      } else {
        console.log('📞 Calling getEvents API... (and myEvents background sync)');
        // Fetch public events and user's registrations concurrently to merge state accurately
        const [publicRes, myRes] = await Promise.all([
          getEvents(1, 20),
          getMyEvents(userId).catch(() => ({ data: { events: [] } }))
        ]);
        apiResponse = publicRes;

        // Extract IDs of events user is registered for
        const myEventsList = myRes?.data?.events || [];
        myEventsList.forEach((e: any) => myEventIds.add(e.id));
      }

      console.log('✅ API Response received');

      // Extract events from API response
      const apiEvents = apiResponse?.data?.events || [];
      console.log('📊 Events count:', apiEvents.length);

      // Map API events to our Event interface
      const mappedEvents: Event[] = apiEvents
        .filter((event: any) => {
          // For my-events, filter out cancelled registrations
          if (activeTab === 'my-events') {
            return event.status !== 'cancelled';
          }
          return true;
        })
        .map((event: any) => ({
          id: event.id,
          title: event.title,
          shortDescription: event.shortDescription || event.description || '',
          date: event.date,
          time: event.time,
          // Handle cover image - use robust parsing util
          coverImage: getImageSource(event.coverImage, FALLBACK_IMAGES.event),
          location: event.location || 'Innerspark HQ',
          isOnline: event.isOnline || false,
          totalSeats: event.totalSeats || 0,
          availableSeats: event.availableSeats || 0,
          price: event.price || 0,
          currency: event.currency || 'UGX',
          category: event.category || 'General',
          organizer: event.organizer || 'InnerSpark',
          // Handle organizer image - use robust parsing util
          organizerImage: getImageSource(event.organizerImage, FALLBACK_IMAGES.avatar),
          // Check mapping against myEventIds set if the backend missed the boolean toggle
          isRegistered: activeTab === 'my-events' ? true : (myEventIds.has(event.id) || event.isRegistered || false),
          // Include registration data for my-events
          ...(activeTab === 'my-events' && {
            registrationId: event.registrationId,
            status: event.status,
            registeredAt: event.registeredAt,
            confirmationCode: event.confirmationCode,
            meetingLink: event.meetingLink,
            paidAmount: event.paidAmount,
          }),
        }));

      console.log('✅ Mapped Events:', mappedEvents.length);

      // Use real API data
      setEvents(mappedEvents);

      // Update Redux store with registered event IDs
      if (activeTab === 'my-events') {
        // If viewing my-events, these are all registered
        const registeredIds = mappedEvents.map(e => e.id);
        dispatch(setRegisteredEventIds(registeredIds));
        console.log('✅ Updated registered event IDs in store:', registeredIds);
      } else {
        // If viewing all events, ensure Redux state is hydrated with true registered IDs
        // because the 'events' tab now has background synced 'myEventIds'
        const registeredIds = mappedEvents.filter(e => e.isRegistered).map(e => e.id);

        // Ensure any myEventIds are also included even if they aren't on page 1 of public events
        const allKnownRegisteredIds = Array.from(new Set([...registeredIds, ...Array.from(myEventIds)]));

        dispatch(setRegisteredEventIds(allKnownRegisteredIds));
        console.log('✅ Updated registered event IDs in store:', allKnownRegisteredIds);
      }

      // toast.show({
      //   description: `Loaded ${mappedEvents.length} event${mappedEvents.length !== 1 ? 's' : ''} successfully!`,
      //   duration: 2000,
      //   placement: 'top',
      // });

    } catch (error: any) {
      console.error('❌ Error loading events:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        stack: error.stack,
      });

      // Clear events on error
      setEvents([]);

      // Only show user-friendly message in toast
      const userMessage = error.response?.data?.message || 'Failed to load events. Please try again.';
      toast.show({
        description: userMessage,
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadEvents();
  };

  const filteredEvents = events.filter(event => {
    // Search filter - check title, description, location, organizer
    const searchLower = searchQuery.toLowerCase().trim();
    const matchesSearch = searchLower === '' ||
      event.title.toLowerCase().includes(searchLower) ||
      event.shortDescription.toLowerCase().includes(searchLower) ||
      event.location.toLowerCase().includes(searchLower) ||
      event.organizer.toLowerCase().includes(searchLower) ||
      event.category.toLowerCase().includes(searchLower);

    // Category filter (only for events tab)
    const matchesCategory = activeTab === 'events'
      ? (selectedCategory === 'All' || event.category === selectedCategory)
      : true;

    // Tab filter
    const matchesTab = activeTab === 'events' ? true : event.isRegistered;

    return matchesSearch && matchesCategory && matchesTab;
  });

  const handleEventPress = (event: Event) => {
    const fromMyEvents = activeTab === 'my-events';
    if (fromMyEvents) {
      // Pass full event with registration data for instant loading
      navigation.navigate('MyEventDetailScreen', { event });
    } else {
      navigation.navigate('EventDetailScreen', { event });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const getSeatsStatus = (event: Event) => {
    if (event.availableSeats === 0) {
      return { text: 'Sold Out', color: '#F44336' };
    } else if (event.availableSeats <= 10) {
      return { text: `${event.availableSeats} seats left`, color: '#FF9800' };
    } else {
      return { text: `${event.availableSeats} available`, color: '#4CAF50' };
    }
  };

  // Scroll to top whenever filters/search/tab change and the filtered data updates
  useEffect(() => {
    requestAnimationFrame(() => {
      eventsListRef.current?.scrollToOffset({ offset: 0, animated: false });
    });
  }, [searchQuery, selectedCategory, activeTab, events.length]);

  const EventSkeleton: React.FC = () => (
    <View style={styles.eventCard}>
      <Skeleton animation="pulse" width="100%" height={scale(180)} style={styles.skeletonImage} />
      <View style={styles.eventContent}>
        <Skeleton animation="pulse" width="90%" height={scale(24)} style={{ marginVertical: scale(8) }} />
        <Skeleton animation="pulse" width="100%" height={scale(16)} />
        <Skeleton animation="pulse" width="80%" height={scale(16)} style={{ marginTop: scale(4) }} />
      </View>
    </View>
  );

  const EmptyState: React.FC = () => (
    <View style={styles.emptyContainer}>
      <Icon name="event-busy" type="material" color={appColors.AppGray} size={moderateScale(80)} />
      <Text style={styles.emptyTitle}>
        {activeTab === 'my-events' ? 'No Registered Events' : 'No Events Found'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {activeTab === 'my-events'
          ? 'Browse events and register to see them here.'
          : (searchQuery || selectedCategory !== 'All' ? 'Try adjusting your search or filters' : 'Check back later for upcoming events')}
      </Text>
      {activeTab === 'events' && (
        <TouchableOpacity style={styles.retryButton} onPress={loadEvents}>
          <Text style={styles.retryButtonText}>Refresh</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={appColors.AppBlue} barStyle="light-content" />
      <PanicButtonComponent position="bottom-right" size="medium" quickAction="screen" />

      <View style={styles.header}>
        <View style={styles.headerRow}>
          {navigation.canGoBack && navigation.canGoBack() ? (
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" type="material" color={appColors.CardBackground} size={moderateScale(24)} />
            </TouchableOpacity>
          ) : (
            <View style={styles.backButton} />
          )}
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Mental Health Events</Text>
            <Text style={styles.headerSubtitle}>Workshops, seminars & more.</Text>
          </View>
          <View style={styles.headerRightPlaceholder} />
        </View>
      </View>

      {/* Tab Navigation & View Mode Toggles */}
      <View style={styles.tabBarWrapper}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'events' && styles.activeTab]}
            onPress={() => setActiveTab('events')}
          >
            <Icon
              name="event"
              type="material"
              color={activeTab === 'events' ? appColors.AppBlue : appColors.grey3}
              size={moderateScale(20)}
            />
            <Text style={[
              styles.tabText,
              activeTab === 'events' && styles.activeTabText
            ]}>
              Events
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'my-events' && styles.activeTab]}
            onPress={() => setActiveTab('my-events')}
          >
            <Icon
              name="event-available"
              type="material"
              color={activeTab === 'my-events' ? appColors.AppBlue : appColors.grey3}
              size={moderateScale(20)}
            />
            <Text style={[
              styles.tabText,
              activeTab === 'my-events' && styles.activeTabText
            ]}>
              My Events
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.viewToggles}>
          <TouchableOpacity
            onPress={() => setViewMode('list')}
            style={[styles.viewToggleBtn, viewMode === 'list' && styles.viewToggleBtnActive]}
          >
            <Icon name="view-list" type="material" color={viewMode === 'list' ? appColors.AppBlue : appColors.grey3} size={moderateScale(22)} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setViewMode('gallery')}
            style={[styles.viewToggleBtn, viewMode === 'gallery' && styles.viewToggleBtnActive]}
          >
            <Icon name="grid-view" type="material" color={viewMode === 'gallery' ? appColors.AppBlue : appColors.grey3} size={moderateScale(19)} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {/* Events List with header to own entire scroll area */}
        <FlatList
          ref={eventsListRef}
          key={`flatlist-${viewMode}`}
          data={isLoading ? Array(3).fill({}) : filteredEvents}
          keyExtractor={(item, index) => (isLoading ? index.toString() : item.id?.toString())}
          renderItem={({ item }) => (
            isLoading ? (
              <EventSkeleton />
            ) : (
              <EventCard
                event={item}
                variant={activeTab === 'my-events' ? 'my' : 'public'}
                viewMode={viewMode}
                onPress={() => handleEventPress(item)}
                onViewTicket={activeTab === 'my-events' ? () => navigation.navigate('MyEventDetailScreen', { event: item, registrationId: `R-${item.id}` }) : undefined}
                onAddToCalendar={activeTab === 'my-events' ? () => toast.show({ description: 'Upcoming Calendar Feature', duration: 2000 }) : undefined}
              />
            )
          )}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              <EventFilterBar
                searchQuery={searchQuery}
                onChangeSearch={setSearchQuery}
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                showCategories={activeTab === 'events' && showFilters}
                onToggleFilters={() => setShowFilters(!showFilters)}
              />
              {(searchQuery.trim() !== '' || selectedCategory !== 'All') && (
                <View style={styles.searchResultsHeader}>
                  <Text style={styles.searchResultsText}>
                    {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
                  </Text>
                  {(searchQuery.trim() !== '' || selectedCategory !== 'All') && (
                    <TouchableOpacity
                      onPress={() => {
                        setSearchQuery('');
                        setSelectedCategory('All');
                      }}
                      style={styles.clearFiltersButton}
                    >
                      <Text style={styles.clearFiltersText}>Clear filters</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </>
          }
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[appColors.AppBlue]}
            />
          }
          ListEmptyComponent={!isLoading ? <EmptyState /> : null}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.AppLightGray,
  },
  header: {
    backgroundColor: appColors.AppBlue,
    paddingTop: scale(16),
    paddingBottom: scale(20),
    paddingHorizontal: scale(20),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: scale(8),
    borderRadius: scale(20),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerRightPlaceholder: {
    width: scale(40),
  },
  headerTitle: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  headerSubtitle: {
    fontSize: moderateScale(14),
    color: appColors.CardBackground,
    opacity: 0.9,
    marginTop: scale(4),
    fontFamily: appFonts.headerTextRegular,
  },
  content: {
    flex: 1,
    padding: scale(20),
  },
  tabBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.CardBackground,
    paddingHorizontal: scale(15),
    elevation: scale(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(1) },
    shadowOpacity: 0.1,
    shadowRadius: scale(2),
    zIndex: 10,
  },
  tabContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: scale(10),
  },
  viewToggles: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.AppLightGray + '80',
    borderRadius: scale(20),
    padding: scale(4),
  },
  viewToggleBtn: {
    padding: scale(6),
    borderRadius: scale(16),
  },
  viewToggleBtnActive: {
    backgroundColor: appColors.CardBackground,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(12),
    paddingHorizontal: scale(16),
    borderRadius: scale(25),
    marginHorizontal: scale(4),
  },
  activeTab: {
    backgroundColor: appColors.AppBlue + '15',
  },
  tabText: {
    fontSize: moderateScale(14),
    color: appColors.grey3,
    marginLeft: scale(6),
    fontFamily: appFonts.headerTextRegular,
  },
  activeTabText: {
    color: appColors.AppBlue,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(25),
    paddingHorizontal: scale(15),
    marginBottom: scale(15),
    elevation: scale(2),
  },
  searchInput: {
    flex: 1,
    paddingVertical: scale(12),
    paddingHorizontal: scale(10),
    fontSize: moderateScale(16),
    color: appColors.grey1,
    fontFamily: appFonts.headerTextRegular,
  },
  categoryContainer: {
    marginBottom: scale(20),
  },
  categoryChip: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(20),
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
    marginRight: scale(10),
    elevation: 1,
    height: scale(36),
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCategoryChip: {
    backgroundColor: appColors.AppBlue,
  },
  categoryChipText: {
    fontSize: moderateScale(14),
    color: appColors.grey1,
    fontFamily: appFonts.headerTextMedium,
    textAlign: 'center',
  },
  selectedCategoryText: {
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextMedium,
  },
  listContainer: {
    paddingBottom: scale(20),
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: scale(4),
  },
  eventCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(15),
    marginBottom: scale(20),
    elevation: scale(3),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(2) },
    shadowOpacity: 0.1,
    shadowRadius: scale(4),
  },
  eventImage: {
    width: '100%',
    height: scale(180),
    borderTopLeftRadius: scale(15),
    borderTopRightRadius: scale(15),
    backgroundColor: appColors.AppLightGray,
  },
  skeletonImage: {
    borderTopLeftRadius: scale(15),
    borderTopRightRadius: scale(15),
  },
  eventContent: {
    padding: scale(16),
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(12),
  },
  eventDateContainer: {
    alignItems: 'flex-start',
  },
  eventDate: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
  },
  eventTime: {
    fontSize: moderateScale(12),
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
  },
  categoryBadge: {
    backgroundColor: appColors.AppLightGray,
    borderRadius: scale(12),
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
  },
  categoryText: {
    fontSize: moderateScale(12),
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextMedium,
  },
  eventTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: scale(8),
    fontFamily: appFonts.headerTextBold,
  },
  eventDescription: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    lineHeight: moderateScale(20),
    marginBottom: scale(12),
    fontFamily: appFonts.headerTextRegular,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(12),
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationText: {
    fontSize: moderateScale(13),
    color: appColors.grey2,
    marginLeft: scale(6),
    fontFamily: appFonts.headerTextRegular,
  },
  seatsText: {
    fontSize: moderateScale(12),
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  eventMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  organizerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  organizerText: {
    fontSize: moderateScale(13),
    color: appColors.grey2,
    marginLeft: scale(8),
    fontFamily: appFonts.headerTextRegular,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  freeText: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    color: '#4CAF50',
    fontFamily: appFonts.headerTextBold,
  },
  priceText: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
  },
  registeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scale(8),
    paddingTop: scale(8),
    borderTopWidth: scale(1),
    borderTopColor: appColors.AppLightGray,
  },
  registeredText: {
    fontSize: moderateScale(12),
    color: '#4CAF50',
    marginLeft: scale(6),
    fontFamily: appFonts.headerTextMedium,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(60),
  },
  emptyTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: appColors.grey1,
    marginTop: scale(16),
    fontFamily: appFonts.headerTextBold,
  },
  emptySubtitle: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    textAlign: 'center',
    marginTop: scale(8),
    marginHorizontal: scale(40),
    fontFamily: appFonts.headerTextRegular,
  },
  retryButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: scale(20),
    paddingVertical: scale(10),
    paddingHorizontal: scale(20),
    marginTop: scale(16),
  },
  retryButtonText: {
    color: appColors.CardBackground,
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  searchResultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(4),
    paddingVertical: scale(8),
    marginBottom: scale(12),
  },
  searchResultsText: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    fontFamily: appFonts.headerTextMedium,
  },
  clearFiltersButton: {
    paddingVertical: scale(4),
    paddingHorizontal: scale(12),
  },
  clearFiltersText: {
    fontSize: moderateScale(14),
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextMedium,
  },
});

export default EventsScreen;
