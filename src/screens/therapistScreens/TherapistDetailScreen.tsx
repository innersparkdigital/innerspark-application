/**
 * Therapist Detail Screen - Shows therapist profile and booking options
 */
import React, { useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Avatar, Button } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { scale, moderateScale } from '../../global/Scaling';
import { useToast } from 'native-base';
import { loadTherapistDetails } from '../../utils/therapistsManager';
import { getReviews } from '../../api/therapist/reviews';

const SCREEN_WIDTH = Dimensions.get('window').width;

import { NavigationProp, RouteProp } from '@react-navigation/native';

interface SessionType {
  id: string;
  name: string;
  price: string;
  duration: string;
}

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

interface TimeSlot {
  id: number;
  date: string;
  time: string;
  available: boolean;
}

interface Therapist {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  price: string;
  priceUnit: string;
  image: any;
  available: boolean;
  bio: string;
  nextAvailable: string;
  reviews: number;
  location?: string;
  tags?: string[];
  languages?: string[];
  sessionTypes?: SessionType[];
  availableSlots?: TimeSlot[];
}

interface TherapistDetailScreenProps {
  navigation: NavigationProp<any>;
  route: RouteProp<{ params: { therapist: Therapist } }, 'params'>;
}

const TherapistDetailScreen: React.FC<TherapistDetailScreenProps> = ({ navigation, route }) => {
  const { therapist } = route.params;
  const toast = useToast();
  const [selectedTab, setSelectedTab] = useState('About');
  const [selectedSessionType, setSelectedSessionType] = useState('individual');
  const [isDMEnabled, setIsDMEnabled] = useState(false); // DM enabled after booking
  const [selectedSlot, setSelectedSlot] = useState<any>(null); // Track selected slot
  const [isLoading, setIsLoading] = useState(false);
  const [sessionTypes, setSessionTypes] = useState<SessionType[]>([]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsSummary, setReviewsSummary] = useState<any>(null);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const tabs = ['About', 'Reviews', 'Availability'];

  // Load full details on mount
  React.useEffect(() => {
    fetchTherapistDetails();
    fetchReviewsData();
  }, [therapist.id]);

  const fetchTherapistDetails = async () => {
    setIsLoading(true);
    const result = await loadTherapistDetails(therapist.id.toString(), therapist);
    if (result.success && result.therapist) {
      setSessionTypes(result.therapist.sessionTypes || []);
      setAvailableSlots(result.therapist.availableSlots || []);

      // Set default selected session type if available
      if (result.therapist.sessionTypes && result.therapist.sessionTypes.length > 0) {
        setSelectedSessionType(result.therapist.sessionTypes[0].id);
      }
    }
    setIsLoading(false);
  };

  const fetchReviewsData = async () => {
    try {
      console.log(`⭐ Starting reviews fetch for therapist ID: ${therapist.id}`);
      setIsLoadingReviews(true);
      const res = await getReviews(therapist.id.toString());
      console.log(`⭐ Reviews fetch completed with success: ${res.success}`);
      if (res.success && res.data) {
        const data = res.data as any;
        setReviews(data.reviews || []);
        if (data.summary) {
          setReviewsSummary(data.summary);
        }
      }
    } catch (e) {
      console.log('⚠️ Failed to load reviews:', e);
      setReviews([]);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Reload both therapist core details and their reviews
    await Promise.all([
      fetchTherapistDetails(),
      fetchReviewsData()
    ]);
    setIsRefreshing(false);
  };

  const handleBookNow = () => {
    if (!therapist.available) {
      toast.show({
        description: 'This therapist is currently unavailable',
        duration: 3000,
      });
      return;
    }

    if (!selectedSlot) {
      toast.show({
        description: 'Please select an available time slot from the Availability tab',
        duration: 3000,
      });
      // Switch to Availability tab to help user
      setSelectedTab('Availability');
      return;
    }

    const selectedSession = sessionTypes.find(st => st.id === selectedSessionType);

    console.log('🚀 [ TherapistDetailScreen ] Navigating to Checkout with:', {
      therapistId: therapist.id,
      slotId: selectedSlot?.id,
      sessionId: selectedSession?.id || '1',
      fullSlot: selectedSlot
    });

    navigation.navigate('BookingCheckoutScreen', {
      therapist,
      selectedSlot: selectedSlot,
      sessionId: selectedSession?.id || 1,
      sessionType: selectedSession?.name || 'Individual Therapy',
      sessionPrice: selectedSession?.price || therapist.price,
      sessionDuration: selectedSession?.duration || '60 min',
      location: therapist.location || 'Virtual Session',
    });
    // Enable DM after booking
    setIsDMEnabled(true);
  };

  const handleDM = () => {
    if (isDMEnabled) {
      // Navigate to chat/messaging screen
      toast.show({
        description: 'Opening direct message with therapist...',
        duration: 2000,
      });
      // navigation.navigate('ChatScreen', { therapist });
    } else {
      toast.show({
        description: 'Please book a session first to enable direct messaging',
        duration: 3000,
      });
    }
  };

  const handleSlotSelect = (slot: any) => {
    const isAvailable = slot.available || slot.status === 'available';
    if (isAvailable) {
      const normalizedSlot = {
        ...slot,
        date: slot.date || slot.av_date,
        time: slot.time || slot.av_time,
      };
      setSelectedSlot(normalizedSlot);
      toast.show({
        description: `Selected: ${normalizedSlot.date} at ${normalizedSlot.time}`,
        duration: 2000,
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="star"
        type="material"
        color={index < rating ? "#FFD700" : "#E0E0E0"}
        size={moderateScale(16)}
      />
    ));
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'About':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bioText}>{therapist.bio}</Text>

            <Text style={styles.sectionTitle}>Specializations</Text>
            <View style={styles.specializationContainer}>
              <View style={styles.specializationChip}>
                <Text style={styles.specializationText}>{therapist.specialty}</Text>
              </View>
              {Array.isArray(therapist.tags) && therapist.tags.map((tag: string, index: number) => (
                <View key={index} style={styles.specializationChip}>
                  <Text style={styles.specializationText}>{tag}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Languages</Text>
            <View style={styles.specializationContainer}>
              {Array.isArray(therapist.languages) && therapist.languages.map((lang: string, index: number) => (
                <View key={index} style={styles.specializationChip}>
                  <Text style={styles.specializationText}>{lang}</Text>
                </View>
              ))}
            </View>
          </View>
        );

      case 'Reviews':
        return (
          <View style={styles.tabContent}>
            <View style={styles.reviewsHeader}>
              <Text style={styles.sectionTitle}>Reviews ({reviewsSummary?.totalReviews ?? therapist.reviews ?? reviews.length})</Text>
              <View style={styles.overallRating}>
                <Text style={styles.ratingNumber}>{reviewsSummary?.averageRating ?? therapist.rating ?? 0}</Text>
                <View style={styles.starsContainer}>
                  {renderStars(Math.floor(reviewsSummary?.averageRating ?? therapist.rating ?? 0))}
                </View>
              </View>
            </View>

            {isLoadingReviews ? (
              <ActivityIndicator size="large" color={appColors.AppBlue} style={{ marginTop: scale(30) }} />
            ) : reviews.length > 0 ? reviews.map((review) => (
              <View key={review.id} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewerName}>{review.clientName || review.name}</Text>
                  <Text style={styles.reviewDate}>{review.date}</Text>
                </View>
                <View style={styles.reviewRating}>
                  {renderStars(review.rating)}
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
              </View>
            )) : (
              <View style={styles.emptySlotsContainer}>
                <Icon name="rate-review" type="material" color={appColors.AppGray} size={moderateScale(48)} />
                <Text style={styles.emptySlotsText}>No reviews yet.</Text>
                <Text style={styles.emptySlotsSubtext}>This therapist hasn't received any reviews yet.</Text>
              </View>
            )}
          </View>
        );

      case 'Availability':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Available Time Slots</Text>
            {isLoading ? (
              <ActivityIndicator size="large" color={appColors.AppBlue} style={{ marginTop: scale(30) }} />
            ) : (
              <View style={styles.slotsContainer}>
                {availableSlots.length > 0 ? availableSlots.map((slot: any) => {
                  const isAvailable = slot.available || slot.status === 'available';
                  return (
                    <TouchableOpacity
                      key={slot.id}
                      style={[
                        styles.slotItem,
                        !isAvailable && styles.slotUnavailable,
                        selectedSlot?.id === slot.id && styles.slotSelected
                      ]}
                      onPress={() => handleSlotSelect(slot)}
                      disabled={!isAvailable}
                    >
                      <Text style={[
                        styles.slotDate,
                        !isAvailable && styles.slotTextUnavailable
                      ]}>
                        {slot.date}
                      </Text>
                      <Text style={[
                        styles.slotTime,
                        !isAvailable && styles.slotTextUnavailable
                      ]}>
                        {slot.time}
                      </Text>
                      {!isAvailable && (
                        <Text style={styles.slotUnavailableText}>Booked</Text>
                      )}
                    </TouchableOpacity>
                  );
                }) : (
                  <View style={styles.emptySlotsContainer}>
                    <Icon name="event-busy" type="material" color={appColors.AppGray} size={moderateScale(48)} />
                    <Text style={styles.emptySlotsText}>No available slots right now.</Text>
                    <Text style={styles.emptySlotsSubtext}>Check back later or contact the therapist directly.</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={appColors.AppBlue} barStyle="light-content" />

      {/* Custom Header matching screenshot */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" type="material" color={appColors.CardBackground} size={moderateScale(24)} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{therapist.name}</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Icon name="more-vert" type="material" color={appColors.CardBackground} size={moderateScale(24)} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[appColors.AppBlue]}
          />
        }
      >
        {/* Profile Header matching screenshot */}
        <View style={styles.profileHeader}>
          <View style={styles.profileContent}>
            <Avatar
              source={therapist.image}
              size={scale(85)}
              rounded
              containerStyle={[styles.profileAvatar, { borderWidth: 3, borderColor: appColors.AppLightGray }]}
              avatarStyle={{ width: '100%', height: '100%', resizeMode: 'cover' }}
            />

            <View style={styles.profileInfo}>
              <View style={styles.nameSection}>
                <Text style={styles.therapistName} numberOfLines={2}>{therapist.name}</Text>
                <Icon name="verified" type="material" color="#4CAF50" size={moderateScale(18)} style={styles.verifiedIcon} />
              </View>

              <Text style={styles.therapistSpecialty}>{therapist.specialty}</Text>

              <View style={[styles.ratingContainer, { marginTop: scale(4) }]}>
                <View style={styles.starsContainer}>
                  <Icon name="star" type="material" color="#FFD700" size={moderateScale(16)} />
                  <Text style={{ fontSize: moderateScale(14), fontWeight: '600', color: appColors.grey1, marginLeft: scale(4) }}>{therapist.rating}</Text>
                </View>
                <Text style={styles.reviewCount}>({therapist.reviews} reviews)</Text>
              </View>

              <View style={styles.locationContainer}>
                <Icon name="location-on" type="material" color={appColors.grey2} size={moderateScale(14)} />
                <Text style={styles.locationText}>{therapist.location}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Session Types */}
        <View style={styles.sessionTypesSection}>
          <Text style={styles.sectionTitle}>Session Types</Text>
          {isLoading ? (
            <ActivityIndicator size="small" color={appColors.AppBlue} style={{ marginTop: scale(10) }} />
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sessionTypesScroll}>
              {sessionTypes.length === 0 ? (
                <Text style={[styles.bioText, { marginTop: scale(10) }]}>No session types available.</Text>
              ) : (
                sessionTypes.map((sessionType) => (
                  <TouchableOpacity
                    key={sessionType.id}
                    style={[
                      styles.sessionTypeCard,
                      selectedSessionType === sessionType.id && styles.selectedSessionType
                    ]}
                    onPress={() => setSelectedSessionType(sessionType.id)}
                  >
                    <Text style={[
                      styles.sessionTypeName,
                      selectedSessionType === sessionType.id && styles.selectedSessionTypeName
                    ]}>
                      {sessionType.name}
                    </Text>
                    <Text style={[
                      styles.sessionTypePrice,
                      selectedSessionType === sessionType.id && styles.selectedSessionTypePrice
                    ]}>
                      {sessionType.price}
                    </Text>
                    <Text style={[
                      styles.sessionTypeDuration,
                      selectedSessionType === sessionType.id && styles.selectedSessionTypeDuration
                    ]}>
                      {sessionType.duration}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          )}
        </View>

        {/* Price and Availability */}
        <View style={styles.priceSection}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              {sessionTypes.find(st => st.id === selectedSessionType)?.price || therapist.price}
            </Text>
            <Text style={styles.priceUnit}>
              {sessionTypes.find(st => st.id === selectedSessionType)?.duration || therapist.priceUnit}
            </Text>
          </View>
          <View style={[
            styles.availabilityBadge,
            therapist.available ? styles.available : styles.unavailable
          ]}>
            <Text style={[
              styles.availabilityText,
              therapist.available ? styles.availableText : styles.unavailableText
            ]}>
              {therapist.available ? 'Available' : 'Busy'}
            </Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                selectedTab === tab && styles.activeTab
              ]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text style={[
                styles.tabText,
                selectedTab === tab && styles.activeTabText
              ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {renderTabContent()}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.bookingFooter}>
        <Button
          title={therapist.available ? "Book Session" : "Currently Unavailable"}
          buttonStyle={[
            styles.bookButton,
            !therapist.available && styles.disabledButton
          ]}
          titleStyle={[
            styles.bookButtonText,
            !therapist.available && styles.disabledButtonText
          ]}
          onPress={handleBookNow}
          disabled={!therapist.available}
        />

        <Button
          title="Direct Message"
          buttonStyle={[
            styles.dmButton,
            !isDMEnabled && styles.disabledButton
          ]}
          titleStyle={[
            styles.dmButtonText,
            !isDMEnabled && styles.disabledButtonText
          ]}
          onPress={handleDM}
          disabled={!isDMEnabled}
          icon={{
            name: 'chat',
            type: 'material',
            color: isDMEnabled ? appColors.AppBlue : appColors.AppGray,
            size: moderateScale(20),
          }}
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
    paddingTop: scale(parameters.headerHeightS),
    paddingBottom: scale(20),
    paddingHorizontal: scale(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(1) },
    shadowOpacity: 0.1,
    shadowRadius: scale(2),
  },
  backButton: {
    padding: scale(8),
    borderRadius: scale(20),
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  menuButton: {
    padding: scale(8),
    borderRadius: scale(20),
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: appColors.CardBackground,
    margin: scale(20),
    borderRadius: scale(20),
    padding: scale(20),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  profileAvatar: {
    marginRight: scale(15),
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: scale(2),
  },
  verifiedIcon: {
    marginLeft: scale(4),
    marginTop: scale(2),
  },
  therapistName: {
    flexShrink: 1,
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  therapistSpecialty: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    marginBottom: scale(4),
    fontFamily: appFonts.headerTextRegular,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: scale(8),
  },
  locationText: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    marginLeft: scale(6),
    lineHeight: scale(18),
    fontFamily: appFonts.headerTextRegular,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(5),
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: scale(8),
  },
  rating: {
    fontSize: moderateScale(16),
    color: appColors.grey1,
    marginLeft: scale(5),
    fontFamily: appFonts.headerTextMedium,
  },
  reviewCount: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    marginLeft: scale(5),
    fontFamily: appFonts.headerTextRegular,
  },
  experience: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
  },
  priceSection: {
    backgroundColor: appColors.CardBackground,
    marginHorizontal: scale(20),
    marginBottom: scale(20),
    borderRadius: scale(15),
    padding: scale(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  priceContainer: {
    alignItems: 'flex-start',
  },
  price: {
    fontSize: moderateScale(28),
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
  },
  priceUnit: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
  },
  availabilityBadge: {
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderRadius: scale(15),
  },
  available: {
    backgroundColor: '#E8F5E8',
  },
  unavailable: {
    backgroundColor: '#FFE8E8',
  },
  availabilityText: {
    fontSize: moderateScale(14),
    fontFamily: appFonts.bodyTextMedium,
  },
  availableText: {
    color: '#4CAF50',
  },
  unavailableText: {
    color: '#F44336',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: appColors.CardBackground,
    marginHorizontal: scale(20),
    marginBottom: scale(20),
    borderRadius: scale(15),
    padding: scale(5),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: scale(12),
    alignItems: 'center',
    borderRadius: scale(10),
  },
  activeTab: {
    backgroundColor: appColors.AppBlue,
  },
  tabText: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextMedium,
  },
  activeTabText: {
    color: appColors.CardBackground,
    fontWeight: 'bold',
  },
  tabContent: {
    backgroundColor: appColors.CardBackground,
    marginHorizontal: scale(20),
    marginBottom: scale(20),
    borderRadius: scale(15),
    padding: scale(20),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: scale(15),
    fontFamily: appFonts.headerTextBold,
  },
  bioText: {
    fontSize: moderateScale(15),
    color: appColors.grey2,
    lineHeight: scale(22),
    marginBottom: scale(20),
    fontFamily: appFonts.bodyTextRegular,
  },
  specializationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: scale(20),
  },
  specializationChip: {
    backgroundColor: appColors.AppLightGray,
    borderRadius: scale(20),
    paddingHorizontal: scale(15),
    paddingVertical: scale(8),
    marginRight: scale(10),
    marginBottom: scale(10),
  },
  specializationText: {
    fontSize: moderateScale(13),
    color: appColors.AppBlue,
    fontFamily: appFonts.bodyTextMedium,
  },
  credentialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(12),
  },
  credentialText: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    marginLeft: scale(12),
    flex: 1,
    fontFamily: appFonts.bodyTextRegular,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(20),
  },
  overallRating: {
    alignItems: 'center',
  },
  ratingNumber: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
  },
  reviewItem: {
    borderBottomWidth: 0.5,
    borderBottomColor: appColors.grey4,
    paddingBottom: scale(15),
    marginBottom: scale(15),
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(8),
  },
  reviewerName: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  reviewDate: {
    fontSize: moderateScale(12),
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
  },
  reviewRating: {
    flexDirection: 'row',
    marginBottom: scale(8),
  },
  reviewComment: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    lineHeight: scale(20),
    fontFamily: appFonts.bodyTextRegular,
  },
  slotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emptySlotsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(40),
    width: '100%',
  },
  emptySlotsText: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: appColors.grey2,
    marginTop: scale(12),
    fontFamily: appFonts.bodyTextBold,
    textAlign: 'center',
  },
  emptySlotsSubtext: {
    fontSize: moderateScale(13),
    color: appColors.grey3,
    marginTop: scale(6),
    fontFamily: appFonts.bodyTextRegular,
    textAlign: 'center',
  },
  slotItem: {
    backgroundColor: appColors.AppLightGray,
    borderRadius: scale(12),
    padding: scale(15),
    width: '48%',
    marginBottom: scale(12),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: appColors.grey4,
  },
  slotUnavailable: {
    backgroundColor: '#F5F5F5',
    opacity: 0.6,
  },
  slotSelected: {
    backgroundColor: appColors.AppBlue + '20',
    borderColor: appColors.AppBlue,
    borderWidth: 2,
  },
  slotDate: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: scale(5),
    fontFamily: appFonts.headerTextBold,
  },
  slotTime: {
    fontSize: moderateScale(16),
    color: appColors.AppBlue,
    fontFamily: appFonts.bodyTextMedium,
  },
  slotTextUnavailable: {
    color: appColors.grey3,
  },
  slotUnavailableText: {
    fontSize: moderateScale(12),
    color: '#F44336',
    marginTop: scale(5),
    fontFamily: appFonts.bodyTextMedium,
  },
  bookingFooter: {
    backgroundColor: appColors.CardBackground,
    padding: scale(20),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bookButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: scale(15),
    paddingVertical: scale(15),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  bookButtonText: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  disabledButton: {
    backgroundColor: appColors.AppLightGray,
  },
  disabledButtonText: {
    color: appColors.grey3,
  },
  bottomSpacing: {
    height: scale(20),
  },
  // Session Types Styles
  sessionTypesSection: {
    backgroundColor: appColors.CardBackground,
    marginHorizontal: scale(20),
    marginBottom: scale(15),
    padding: scale(20),
    borderRadius: scale(15),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sessionTypesScroll: {
    marginTop: scale(10),
  },
  sessionTypeCard: {
    backgroundColor: appColors.AppLightGray,
    borderRadius: scale(12),
    padding: scale(15),
    marginRight: scale(10),
    minWidth: scale(140),
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedSessionType: {
    backgroundColor: appColors.AppBlue + '15',
    borderColor: appColors.AppBlue,
  },
  sessionTypeName: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    color: appColors.grey1,
    textAlign: 'center',
    marginBottom: scale(5),
    fontFamily: appFonts.headerTextBold,
  },
  selectedSessionTypeName: {
    color: appColors.AppBlue,
  },
  sessionTypePrice: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: appColors.AppBlue,
    textAlign: 'center',
    marginBottom: scale(3),
    fontFamily: appFonts.headerTextBold,
  },
  selectedSessionTypePrice: {
    color: appColors.AppBlue,
  },
  sessionTypeDuration: {
    fontSize: moderateScale(12),
    color: appColors.grey2,
    textAlign: 'center',
    fontFamily: appFonts.bodyTextRegular,
  },
  selectedSessionTypeDuration: {
    color: appColors.AppBlue,
  },
  // Donate Tab Styles
  donateDescription: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    lineHeight: scale(20),
    marginBottom: scale(20),
    fontFamily: appFonts.bodyTextRegular,
  },
  donateAmountContainer: {
    marginBottom: scale(25),
  },
  donateAmountLabel: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: scale(15),
    fontFamily: appFonts.headerTextBold,
  },
  donateAmountOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  donateAmountChip: {
    backgroundColor: appColors.AppLightGray,
    borderRadius: scale(20),
    paddingVertical: scale(10),
    paddingHorizontal: scale(20),
    marginBottom: scale(10),
    borderWidth: 1,
    borderColor: appColors.AppBlue,
  },
  donateAmountText: {
    fontSize: moderateScale(14),
    color: appColors.AppBlue,
    fontWeight: '500',
    fontFamily: appFonts.bodyTextMedium,
  },
  donateButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: scale(25),
    paddingVertical: scale(15),
  },
  donateButtonText: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: appColors.CardBackground,
    marginLeft: scale(10),
    fontFamily: appFonts.headerTextBold,
  },
  // DM Button Styles
  dmButton: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(25),
    paddingVertical: scale(15),
    marginTop: scale(10),
    borderWidth: 2,
    borderColor: appColors.AppBlue,
  },
  dmButtonText: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: appColors.AppBlue,
    marginLeft: scale(10),
    fontFamily: appFonts.headerTextBold,
  },
});

export default TherapistDetailScreen;
