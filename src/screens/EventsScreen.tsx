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
      
      if (activeTab === 'my-events') {
        console.log('📞 Calling getMyEvents API...');
        apiResponse = await getMyEvents(userId);
      } else {
        console.log('📞 Calling getEvents API...');
        apiResponse = await getEvents(1, 20);
      }
      
      console.log('✅ API Response:', JSON.stringify(apiResponse, null, 2));
      
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
          // Handle cover image - prepend uploads base URL if it's a relative path, fallback to default
          coverImage: event.coverImage && !event.coverImage.startsWith('http') 
            ? { uri: `${UPLOADS_BASE_URL}/${event.coverImage}` }
            : event.coverImage 
              ? { uri: event.coverImage }
              : require('../assets/images/is-default.png'),
          location: event.location || 'Location TBD',
          isOnline: event.isOnline || false,
          totalSeats: event.totalSeats || 0,
          availableSeats: event.availableSeats || 0,
          price: event.price || 0,
          currency: event.currency || 'UGX',
          category: event.category || 'General',
          organizer: event.organizer || 'InnerSpark',
          // Handle organizer image - prepend uploads base URL if it's a relative path, fallback to avatar placeholder
          organizerImage: event.organizerImage && !event.organizerImage.startsWith('http')
            ? { uri: `${UPLOADS_BASE_URL}/${event.organizerImage}` }
            : event.organizerImage
              ? { uri: event.organizerImage }
              : require('../assets/images/avatar-placeholder.png'),
          // For my-events, all returned events are registered by definition
          // The API doesn't return isRegistered field, so we set it based on the tab
          isRegistered: activeTab === 'my-events' ? true : (event.isRegistered || false),
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
        // If viewing all events, extract registered ones
        const registeredIds = mappedEvents.filter(e => e.isRegistered).map(e => e.id);
        dispatch(setRegisteredEventIds(registeredIds));
        console.log('✅ Updated registered event IDs in store:', registeredIds);
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
      <Skeleton animation="pulse" width="100%" height={180} style={styles.skeletonImage} />
      <View style={styles.eventContent}>
        <Skeleton animation="pulse" width="90%" height={24} style={{ marginVertical: 8 }} />
        <Skeleton animation="pulse" width="100%" height={16} />
        <Skeleton animation="pulse" width="80%" height={16} style={{ marginTop: 4 }} />
      </View>
    </View>
  );

  const EmptyState: React.FC = () => (
    <View style={styles.emptyContainer}>
      <Icon name="event-busy" type="material" color={appColors.AppGray} size={80} />
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
              <Icon name="arrow-back" type="material" color={appColors.CardBackground} size={24} />
            </TouchableOpacity>
          ) : (
            <View style={styles.backButton} />
          )}
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Mental Health Events</Text>
            <Text style={styles.headerSubtitle}>Workshops, seminars & community gatherings</Text>
          </View>
          <View style={styles.headerRightPlaceholder} />
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'events' && styles.activeTab]}
          onPress={() => setActiveTab('events')}
        >
          <Icon 
            name="event" 
            type="material" 
            color={activeTab === 'events' ? appColors.AppBlue : appColors.grey3} 
            size={20} 
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
            size={20} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'my-events' && styles.activeTabText
          ]}>
            My Events
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Events List with header to own entire scroll area */}
        <FlatList
          ref={eventsListRef}
          data={isLoading ? Array(3).fill({}) : filteredEvents}
          keyExtractor={(item, index) => (isLoading ? index.toString() : item.id?.toString())}
          renderItem={({ item }) => (
            isLoading ? (
              <EventSkeleton />
            ) : (
              <EventCard
                event={item}
                variant={activeTab === 'my-events' ? 'my' : 'public'}
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
                showCategories={activeTab === 'events'}
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
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerRightPlaceholder: {
    width: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  headerSubtitle: {
    fontSize: 14,
    color: appColors.CardBackground,
    opacity: 0.9,
    marginTop: 4,
    fontFamily: appFonts.headerTextRegular,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: appColors.CardBackground,
    paddingHorizontal: 20,
    paddingVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: appColors.AppBlue + '15',
  },
  tabText: {
    fontSize: 14,
    color: appColors.grey3,
    marginLeft: 6,
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
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 16,
    color: appColors.grey1,
    fontFamily: appFonts.headerTextRegular,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryChip: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    elevation: 1,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCategoryChip: {
    backgroundColor: appColors.AppBlue,
  },
  categoryChipText: {
    fontSize: 14,
    color: appColors.grey1,
    fontFamily: appFonts.headerTextMedium,
    textAlign: 'center',
  },
  selectedCategoryText: {
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextMedium,
  },
  listContainer: {
    paddingBottom: 20,
  },
  eventCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: appColors.AppLightGray,
  },
  skeletonImage: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  eventContent: {
    padding: 16,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventDateContainer: {
    alignItems: 'flex-start',
  },
  eventDate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
  },
  eventTime: {
    fontSize: 12,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
  },
  categoryBadge: {
    backgroundColor: appColors.AppLightGray,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  categoryText: {
    fontSize: 12,
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextMedium,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: 8,
    fontFamily: appFonts.headerTextBold,
  },
  eventDescription: {
    fontSize: 14,
    color: appColors.grey2,
    lineHeight: 20,
    marginBottom: 12,
    fontFamily: appFonts.headerTextRegular,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationText: {
    fontSize: 13,
    color: appColors.grey2,
    marginLeft: 6,
    fontFamily: appFonts.headerTextRegular,
  },
  seatsText: {
    fontSize: 12,
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
    fontSize: 13,
    color: appColors.grey2,
    marginLeft: 8,
    fontFamily: appFonts.headerTextRegular,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  freeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
    fontFamily: appFonts.headerTextBold,
  },
  priceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
  },
  registeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: appColors.AppLightGray,
  },
  registeredText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 6,
    fontFamily: appFonts.headerTextMedium,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.grey1,
    marginTop: 16,
    fontFamily: appFonts.headerTextBold,
  },
  emptySubtitle: {
    fontSize: 14,
    color: appColors.grey2,
    textAlign: 'center',
    marginTop: 8,
    marginHorizontal: 40,
    fontFamily: appFonts.headerTextRegular,
  },
  retryButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 16,
  },
  retryButtonText: {
    color: appColors.CardBackground,
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  searchResultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 8,
    marginBottom: 12,
  },
  searchResultsText: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextMedium,
  },
  clearFiltersButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  clearFiltersText: {
    fontSize: 14,
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextMedium,
  },
});

export default EventsScreen;
