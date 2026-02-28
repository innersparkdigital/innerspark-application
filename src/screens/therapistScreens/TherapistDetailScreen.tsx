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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Avatar, Button } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { scale, moderateScale } from '../../global/Scaling';
import { useToast } from 'native-base';

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

  const tabs = ['About', 'Reviews', 'Availability'];

  // TODO: Fetch session types from therapist profile API
  // These should come from GET /api/v1/client/therapists/:therapistId
  const sessionTypes = [
    { id: 'individual', name: 'Individual Session', price: 'UGX 50,000', duration: '60 min' },
    { id: 'couple', name: 'Couple Session', price: 'UGX 75,000', duration: '90 min' },
    { id: 'group', name: 'Group Session', price: 'UGX 30,000', duration: '60 min' },
    { id: 'consultation', name: 'Consultation', price: 'UGX 25,000', duration: '30 min' },
  ];

  // TODO: Fetch availability from API
  // Use GET /api/v1/client/therapists/:therapistId/availability
  // Returns empty array if endpoint not implemented (404)
  const availableSlots = [
    { id: 1, date: 'Today', time: '2:00 PM', available: true },
    { id: 2, date: 'Today', time: '4:30 PM', available: true },
    { id: 3, date: 'Tomorrow', time: '10:00 AM', available: true },
    { id: 4, date: 'Tomorrow', time: '3:00 PM', available: false },
    { id: 5, date: 'Wed', time: '11:00 AM', available: true },
    { id: 6, date: 'Wed', time: '2:30 PM', available: true },
  ];

  // TODO: Fetch reviews from API
  // Use GET /api/v1/client/therapists/:therapistId/reviews
  // Returns empty array if endpoint not implemented (404)
  const reviews = [
    {
      id: 1,
      name: 'Sarah M.',
      rating: 5,
      comment: 'Dr. Johnson helped me tremendously with my anxiety. Highly recommend!',
      date: '2 weeks ago',
    },
    {
      id: 2,
      name: 'Mike R.',
      rating: 5,
      comment: 'Professional and caring. Great experience overall.',
      date: '1 month ago',
    },
    {
      id: 3,
      name: 'Lisa K.',
      rating: 4,
      comment: 'Very helpful sessions. Would definitely continue.',
      date: '3 weeks ago',
    },
  ];

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
    navigation.navigate('BookingCheckoutScreen', {
      therapist,
      selectedSlot: selectedSlot,
      sessionType: selectedSession?.name || 'Individual Therapy',
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

  const handleSlotSelect = (slot: TimeSlot) => {
    if (slot.available) {
      setSelectedSlot(slot);
      toast.show({
        description: `Selected: ${slot.date} at ${slot.time}`,
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
              <View style={styles.specializationChip}>
                <Text style={styles.specializationText}>Cognitive Behavioral Therapy</Text>
              </View>
              <View style={styles.specializationChip}>
                <Text style={styles.specializationText}>Mindfulness</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Education & Credentials</Text>
            <View style={styles.credentialItem}>
              <Icon name="school" type="material" color={appColors.AppBlue} size={moderateScale(20)} />
              <Text style={styles.credentialText}>PhD in Clinical Psychology - Stanford University</Text>
            </View>
            <View style={styles.credentialItem}>
              <Icon name="verified" type="material" color={appColors.AppBlue} size={moderateScale(20)} />
              <Text style={styles.credentialText}>Licensed Clinical Psychologist</Text>
            </View>
          </View>
        );

      case 'Reviews':
        return (
          <View style={styles.tabContent}>
            <View style={styles.reviewsHeader}>
              <Text style={styles.sectionTitle}>Reviews ({therapist.reviews})</Text>
              <View style={styles.overallRating}>
                <Text style={styles.ratingNumber}>{therapist.rating}</Text>
                <View style={styles.starsContainer}>
                  {renderStars(Math.floor(therapist.rating))}
                </View>
              </View>
            </View>

            {reviews.map((review) => (
              <View key={review.id} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewerName}>{review.name}</Text>
                  <Text style={styles.reviewDate}>{review.date}</Text>
                </View>
                <View style={styles.reviewRating}>
                  {renderStars(review.rating)}
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
              </View>
            ))}
          </View>
        );

      case 'Availability':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Available Time Slots</Text>
            <View style={styles.slotsContainer}>
              {availableSlots.map((slot) => (
                <TouchableOpacity
                  key={slot.id}
                  style={[
                    styles.slotItem,
                    !slot.available && styles.slotUnavailable,
                    selectedSlot?.id === slot.id && styles.slotSelected
                  ]}
                  onPress={() => handleSlotSelect(slot)}
                  disabled={!slot.available}
                >
                  <Text style={[
                    styles.slotDate,
                    !slot.available && styles.slotTextUnavailable
                  ]}>
                    {slot.date}
                  </Text>
                  <Text style={[
                    styles.slotTime,
                    !slot.available && styles.slotTextUnavailable
                  ]}>
                    {slot.time}
                  </Text>
                  {!slot.available && (
                    <Text style={styles.slotUnavailableText}>Booked</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
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
        <Text style={styles.headerTitle}>{therapist.name} Profile</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Icon name="more-vert" type="material" color={appColors.CardBackground} size={moderateScale(24)} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header matching screenshot */}
        <View style={styles.profileHeader}>
          <View style={styles.profileContent}>
            <Avatar
              source={therapist.image}
              size={scale(120)}
              rounded
              containerStyle={styles.profileAvatar}
            />

            <View style={styles.profileInfo}>
              <View style={styles.nameSection}>
                <Text style={styles.therapistName}>{therapist.name}</Text>
                <Icon name="verified" type="material" color="#4CAF50" size={moderateScale(20)} style={styles.verifiedIcon} />
              </View>

              <Text style={styles.therapistSpecialty}>{therapist.specialty}</Text>

              <View style={styles.ratingContainer}>
                <View style={styles.starsContainer}>
                  {renderStars(therapist.rating)}
                </View>
                <Text style={styles.reviewCount}>({therapist.reviews})</Text>
              </View>

              <View style={styles.locationContainer}>
                <Icon name="location-on" type="material" color={appColors.grey2} size={moderateScale(16)} />
                <Text style={styles.locationText}>2 Avenue Street{'\n'}Nakawa - Uganda - 3 km</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Session Types */}
        <View style={styles.sessionTypesSection}>
          <Text style={styles.sectionTitle}>Session Types</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sessionTypesScroll}>
            {sessionTypes.map((sessionType) => (
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
            ))}
          </ScrollView>
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
    marginRight: scale(20),
  },
  profileInfo: {
    flex: 1,
    paddingTop: scale(10),
  },
  nameSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(5),
  },
  verifiedIcon: {
    marginLeft: scale(8),
  },
  therapistName: {
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  therapistSpecialty: {
    fontSize: moderateScale(16),
    color: appColors.grey2,
    marginBottom: scale(8),
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
