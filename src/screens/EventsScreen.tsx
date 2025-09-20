/**
 * Events Screen - Mental Health Events and Workshops
 */
import React, { useState, useEffect } from 'react';
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
import { useToast } from 'native-base';
import LHGenericHeader from '../components/LHGenericHeader';
import { NavigationProp } from '@react-navigation/native';

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
}

interface EventsScreenProps {
  navigation: NavigationProp<any>;
}

const EventsScreen: React.FC<EventsScreenProps> = ({ navigation }) => {
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [events, setEvents] = useState<Event[]>([]);

  // Mock events data
  const mockEvents: Event[] = [
    {
      id: 1,
      title: 'Mindfulness & Meditation Workshop',
      shortDescription: 'Learn mindfulness techniques to reduce stress and improve mental clarity.',
      date: '2024-01-15',
      time: '10:00 AM',
      coverImage: require('../assets/images/dummy-people/d-person1.png'),
      location: 'Wellness Center, Kampala',
      isOnline: false,
      totalSeats: 50,
      availableSeats: 12,
      price: 25000,
      currency: 'UGX',
      category: 'Workshop',
      organizer: 'Dr. Sarah Nakato',
      organizerImage: require('../assets/images/dummy-people/d-person1.png'),
      isRegistered: false,
    },
    {
      id: 2,
      title: 'Mental Health First Aid Training',
      shortDescription: 'Essential training for recognizing and responding to mental health crises.',
      date: '2024-01-20',
      time: '9:00 AM',
      coverImage: require('../assets/images/dummy-people/d-person2.png'),
      location: 'Online Event',
      isOnline: true,
      totalSeats: 100,
      availableSeats: 45,
      price: 0,
      currency: 'UGX',
      category: 'Training',
      organizer: 'Mental Health Uganda',
      organizerImage: require('../assets/images/dummy-people/d-person2.png'),
      isRegistered: true,
    },
    {
      id: 3,
      title: 'Anxiety Management Seminar',
      shortDescription: 'Learn practical strategies to manage anxiety and panic attacks.',
      date: '2024-01-25',
      time: '2:00 PM',
      coverImage: require('../assets/images/dummy-people/d-person3.png'),
      location: 'Makerere University, Kampala',
      isOnline: false,
      totalSeats: 75,
      availableSeats: 0,
      price: 15000,
      currency: 'UGX',
      category: 'Seminar',
      organizer: 'Prof. Mary Kiconco',
      organizerImage: require('../assets/images/dummy-people/d-person3.png'),
      isRegistered: false,
    },
  ];

  const categories = ['All', 'Workshop', 'Training', 'Seminar', 'Summit'];

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEvents(mockEvents);
    } catch (error) {
      toast.show({
        description: 'Failed to load events. Please try again.',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadEvents();
    setIsRefreshing(false);
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEventPress = (event: Event) => {
    navigation.navigate('EventDetailScreen', { event });
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

  const EventCard: React.FC<{ event: Event }> = ({ event }) => {
    const seatsStatus = getSeatsStatus(event);
    
    return (
      <TouchableOpacity
        style={styles.eventCard}
        onPress={() => handleEventPress(event)}
        activeOpacity={0.7}
      >
        <Image source={event.coverImage} style={styles.eventImage} />
        
        <View style={styles.eventContent}>
          <View style={styles.eventHeader}>
            <View style={styles.eventDateContainer}>
              <Text style={styles.eventDate}>{formatDate(event.date)}</Text>
              <Text style={styles.eventTime}>{event.time}</Text>
            </View>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{event.category}</Text>
            </View>
          </View>

          <Text style={styles.eventTitle} numberOfLines={2}>{event.title}</Text>
          <Text style={styles.eventDescription} numberOfLines={2}>{event.shortDescription}</Text>

          <View style={styles.eventFooter}>
            <View style={styles.locationContainer}>
              <Icon
                name={event.isOnline ? 'videocam' : 'location-on'}
                type="material"
                color={appColors.grey2}
                size={16}
              />
              <Text style={styles.locationText} numberOfLines={1}>
                {event.isOnline ? 'Online Event' : event.location}
              </Text>
            </View>

            <Text style={[styles.seatsText, { color: seatsStatus.color }]}>
              {seatsStatus.text}
            </Text>
          </View>

          <View style={styles.eventMeta}>
            <View style={styles.organizerContainer}>
              <Avatar source={event.organizerImage} size={24} rounded />
              <Text style={styles.organizerText}>{event.organizer}</Text>
            </View>

            <View style={styles.priceContainer}>
              {event.price === 0 ? (
                <Text style={styles.freeText}>FREE</Text>
              ) : (
                <Text style={styles.priceText}>{event.currency} {event.price.toLocaleString()}</Text>
              )}
            </View>
          </View>

          {event.isRegistered && (
            <View style={styles.registeredBadge}>
              <Icon name="check-circle" type="material" color="#4CAF50" size={16} />
              <Text style={styles.registeredText}>Registered</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

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
      <Text style={styles.emptyTitle}>No Events Found</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery || selectedCategory !== 'All'
          ? 'Try adjusting your search or filters'
          : 'Check back later for upcoming events'}
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={loadEvents}>
        <Text style={styles.retryButtonText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={appColors.StatusBarColor} barStyle="light-content" />
      
      <LHGenericHeader
        title="Mental Health Events"
        subtitle="Workshops, seminars & community gatherings"
        navigation={navigation}
      />

      <View style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="search" type="material" color={appColors.AppGray} size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search events..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={appColors.AppGray}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close" type="material" color={appColors.AppGray} size={20} />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.selectedCategoryChip
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryChipText,
                selectedCategory === category && styles.selectedCategoryText
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Events List */}
        <FlatList
          data={isLoading ? Array(3).fill({}) : filteredEvents}
          keyExtractor={(item, index) => isLoading ? index.toString() : item.id?.toString()}
          renderItem={({ item }) => 
            isLoading ? <EventSkeleton /> : <EventCard event={item} />
          }
          showsVerticalScrollIndicator={false}
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
  content: {
    flex: 1,
    padding: 20,
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
  },
  selectedCategoryChip: {
    backgroundColor: appColors.AppBlue,
  },
  categoryChipText: {
    fontSize: 14,
    color: appColors.grey1,
    fontFamily: appFonts.headerTextMedium,
  },
  selectedCategoryText: {
    color: appColors.CardBackground,
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
});

export default EventsScreen;
