/**
 * Therapists Screen - Find and connect with therapists
 */
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  FlatList,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button, Avatar } from '@rneui/base';
import { appColors, parameters, appFonts } from '../global/Styles';
import { scale, moderateScale } from '../global/Scaling';
import { useToast } from 'native-base';
import { appImages } from '../global/Data';
import LHGenericHeader from '../components/LHGenericHeader';
import ISStatusBar from '../components/ISStatusBar';
import PanicButtonComponent from '../components/PanicButtonComponent';
import LHGenericFeatureModal from '../components/LHGenericFeatureModal';
import {
  selectTherapists,
  selectTherapistsLoading,
  selectTherapistsRefreshing,
} from '../features/therapists/therapistsSlice';
import { loadTherapists, refreshTherapists } from '../utils/therapistsManager';

import { NavigationProp, RouteProp } from '@react-navigation/native';

interface Therapist {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  location: string;
  image: any;
  reviews: number;
  experience: string;
  price: string;
  priceUnit: string;
  available: boolean;
  bio: string;
  nextAvailable: string;
}

interface TherapistsScreenProps {
  navigation: NavigationProp<any>;
  route: RouteProp<any, any>;
}

const TherapistsScreen: React.FC<TherapistsScreenProps> = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const toast = useToast();

  // Check if we came from outside bottom tabs (need back button)
  const showBackButton = route?.params?.showBackButton || false;

  // Get therapists from Redux
  const therapists = useSelector(selectTherapists);
  const isLoading = useSelector(selectTherapistsLoading);
  const isRefreshing = useSelector(selectTherapistsRefreshing);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialities');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState(['Anxiety therapy', 'Dr. Sarah', 'Couples counseling']);
  const [viewType, setViewType] = useState('compact'); // 'compact' or 'detailed'
  const [showFilters, setShowFilters] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);

  // Load therapists on mount
  useEffect(() => {
    loadTherapists();
  }, []);

  // Removed inline mock data - now using API data from Redux
  // Mock data moved to src/global/MockData.ts
  const mockTherapists = [
    {
      id: 1,
      name: 'Dr. Nakato Aisha',
      specialty: 'Therapist - Specialist',
      rating: 5,
      location: 'Kampala Down Town - 2 km',
      image: require('../assets/images/dummy-people/d-person1.png'),
      reviews: 342,
      experience: '12 years',
      price: 'UGX 60,000',
      priceUnit: '/session',
      available: true,
      bio: 'Specialized in cognitive behavioral therapy and mindfulness techniques.',
      nextAvailable: 'Today 2:00 PM',
    },
    {
      id: 2,
      name: 'Dr. Okello Samuel',
      specialty: 'Therapist',
      rating: 4,
      location: 'Nakawa - 3 km',
      image: require('../assets/images/dummy-people/d-person2.png'),
      reviews: 187,
      experience: '8 years',
      price: 'UGX 50,000',
      priceUnit: '/session',
      available: true,
      bio: 'Expert in anxiety and depression treatment with holistic approach.',
      nextAvailable: 'Tomorrow 10:00 AM',
    },
    {
      id: 3,
      name: 'Dr. Namukasa Grace',
      specialty: 'Counselor',
      rating: 5,
      location: 'Mukono - 10 km',
      image: require('../assets/images/dummy-people/d-person3.png'),
      reviews: 456,
      experience: '15 years',
      price: 'UGX 65,000',
      priceUnit: '/session',
      available: false,
      bio: 'Specializes in trauma therapy and PTSD treatment.',
      nextAvailable: 'Next week',
    },
    {
      id: 4,
      name: 'Dr. Wasswa David',
      specialty: 'Specialist',
      rating: 4,
      location: 'Kampala Central - 5 km',
      image: require('../assets/images/dummy-people/d-person4.png'),
      reviews: 289,
      experience: '10 years',
      price: 'UGX 55,000',
      priceUnit: '/session',
      available: true,
      bio: 'Focused on adolescent mental health and behavioral issues.',
      nextAvailable: 'Today 4:30 PM',
    },
    {
      id: 5,
      name: 'Dr. Nabirye Faith',
      specialty: 'Therapist',
      rating: 5,
      location: 'Ntinda - 4 km',
      image: require('../assets/images/dummy-people/d-person1.png'),
      reviews: 412,
      experience: '11 years',
      price: 'UGX 58,000',
      priceUnit: '/session',
      available: true,
      bio: 'Specializes in family therapy and relationship counseling.',
      nextAvailable: 'Today 3:00 PM',
    },
    {
      id: 6,
      name: 'Dr. Mugisha Patrick',
      specialty: 'Counselor',
      rating: 4,
      location: 'Entebbe - 12 km',
      image: require('../assets/images/dummy-people/d-person2.png'),
      reviews: 156,
      experience: '7 years',
      price: 'UGX 48,000',
      priceUnit: '/session',
      available: true,
      bio: 'Expert in stress management and workplace mental health.',
      nextAvailable: 'Tomorrow 9:00 AM',
    },
    {
      id: 7,
      name: 'Dr. Nansubuga Rebecca',
      specialty: 'Therapist - Specialist',
      rating: 5,
      location: 'Kololo - 3 km',
      image: require('../assets/images/dummy-people/d-person3.png'),
      reviews: 523,
      experience: '14 years',
      price: 'UGX 70,000',
      priceUnit: '/session',
      available: true,
      bio: 'Renowned for treating complex anxiety disorders and phobias.',
      nextAvailable: 'Today 5:00 PM',
    },
    {
      id: 8,
      name: 'Dr. Kato Moses',
      specialty: 'Therapist',
      rating: 4,
      location: 'Bugolobi - 6 km',
      image: require('../assets/images/dummy-people/d-person4.png'),
      reviews: 234,
      experience: '9 years',
      price: 'UGX 52,000',
      priceUnit: '/session',
      available: false,
      bio: 'Specializes in addiction recovery and substance abuse counseling.',
      nextAvailable: 'Monday 2:00 PM',
    },
    {
      id: 9,
      name: 'Dr. Namutebi Sarah',
      specialty: 'Counselor',
      rating: 5,
      location: 'Muyenga - 7 km',
      image: require('../assets/images/dummy-people/d-person1.png'),
      reviews: 378,
      experience: '13 years',
      price: 'UGX 62,000',
      priceUnit: '/session',
      available: true,
      bio: 'Expert in grief counseling and bereavement support.',
      nextAvailable: 'Tomorrow 11:00 AM',
    },
    {
      id: 10,
      name: 'Dr. Ssemakula John',
      specialty: 'Specialist',
      rating: 4,
      location: 'Wandegeya - 4 km',
      image: require('../assets/images/dummy-people/d-person2.png'),
      reviews: 198,
      experience: '8 years',
      price: 'UGX 50,000',
      priceUnit: '/session',
      available: true,
      bio: 'Focuses on youth mental health and academic stress management.',
      nextAvailable: 'Today 6:00 PM',
    },
    {
      id: 11,
      name: 'Dr. Nakimuli Esther',
      specialty: 'Therapist',
      rating: 5,
      location: 'Naalya - 8 km',
      image: require('../assets/images/dummy-people/d-person3.png'),
      reviews: 445,
      experience: '16 years',
      price: 'UGX 68,000',
      priceUnit: '/session',
      available: true,
      bio: 'Specializes in post-partum depression and maternal mental health.',
      nextAvailable: 'Tomorrow 2:00 PM',
    },
    {
      id: 12,
      name: 'Dr. Opio Daniel',
      specialty: 'Counselor',
      rating: 4,
      location: 'Kireka - 9 km',
      image: require('../assets/images/dummy-people/d-person4.png'),
      reviews: 167,
      experience: '6 years',
      price: 'UGX 45,000',
      priceUnit: '/session',
      available: true,
      bio: 'Expert in anger management and emotional regulation techniques.',
      nextAvailable: 'Today 1:00 PM',
    },
    {
      id: 13,
      name: 'Dr. Nambi Christine',
      specialty: 'Therapist - Specialist',
      rating: 5,
      location: 'Lubowa - 11 km',
      image: require('../assets/images/dummy-people/d-person1.png'),
      reviews: 501,
      experience: '17 years',
      price: 'UGX 75,000',
      priceUnit: '/session',
      available: false,
      bio: 'Leading expert in bipolar disorder and mood stabilization therapy.',
      nextAvailable: 'Next Friday',
    },
    {
      id: 14,
      name: 'Dr. Babirye Juliet',
      specialty: 'Therapist',
      rating: 4,
      location: 'Kansanga - 5 km',
      image: require('../assets/images/dummy-people/d-person2.png'),
      reviews: 312,
      experience: '10 years',
      price: 'UGX 56,000',
      priceUnit: '/session',
      available: true,
      bio: 'Specializes in eating disorders and body image issues.',
      nextAvailable: 'Tomorrow 3:30 PM',
    },
    {
      id: 15,
      name: 'Dr. Mukasa Robert',
      specialty: 'Specialist',
      rating: 5,
      location: 'Kabalagala - 6 km',
      image: require('../assets/images/dummy-people/d-person3.png'),
      reviews: 467,
      experience: '14 years',
      price: 'UGX 64,000',
      priceUnit: '/session',
      available: true,
      bio: 'Expert in sleep disorders and insomnia treatment with CBT-I approach.',
      nextAvailable: 'Today 7:00 PM',
    },
  ];

  const specialties = ['All Specialities', 'Therapist', 'Specialist', 'Counselor'];

  const filteredTherapists = (therapists as Therapist[] || []).filter((therapist: Therapist) => {
    const matchesSearch = therapist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      therapist.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All Specialities' ||
      therapist.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase());
    return matchesSearch && matchesSpecialty;
  });

  const notifyWithToast = (description: string) => {
    toast.show({
      description: description,
      duration: 2000,
    });
  };

  const handleBookSession = (therapist: Therapist) => {
    if (therapist.available) {
      navigation.navigate('TherapistDetailScreen', { therapist });
    } else {
      notifyWithToast('This therapist is currently unavailable');
    }
  };

  // Profile view
  const handleViewProfile = (therapist: Therapist) => {
    navigation.navigate('TherapistDetailScreen', { therapist });
  };

  // Search focus 
  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  // Search blur
  const handleSearchBlur = () => {
    setIsSearchFocused(false);
  };

  // Recent search press
  const handleRecentSearchPress = (searchTerm: string) => {
    setSearchQuery(searchTerm);
    setIsSearchFocused(false);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
  };

  // Toggle View type
  const toggleViewType = () => {
    setViewType(viewType === 'compact' ? 'detailed' : 'compact');
  };

  // Toggle filters
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Start matching quiz
  const handleStartMatchingQuiz = () => {
    navigation.navigate('TherapistMatchingQuizScreen');
  };

  // Pull to refresh handler
  const onRefresh = async () => {
    await refreshTherapists({
      specialty: selectedSpecialty !== 'All Specialities' ? selectedSpecialty : null,
    });
  };

  // Render stars
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="star"
        type="material"
        color={index < rating ? "#FFD700" : "#E0E0E0"}
        size={moderateScale(14)}
      />
    ));
  };

  // Compact therapist card
  const CompactTherapistCard: React.FC<{ therapist: Therapist }> = ({ therapist }) => (
    <TouchableOpacity
      style={styles.therapistCard}
      onPress={() => handleViewProfile(therapist)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <Avatar
          source={therapist.image}
          size={scale(60)}
          rounded
          containerStyle={styles.avatar}
        />

        <View style={styles.therapistInfo}>
          <Text style={styles.therapistName}>{therapist.name}</Text>
          <Text style={styles.therapistSpecialty}>{therapist.specialty}</Text>
          <Text style={styles.therapistLocation}>{therapist.location}</Text>

          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>
              {renderStars(therapist.rating)}
            </View>
            <Text style={styles.reviewCount}>({therapist.reviews})</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.menuButton}>
          <Icon name="more-vert" type="material" color={appColors.grey2} size={24} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // Detailed therapist card
  const DetailedTherapistCard: React.FC<{ therapist: Therapist }> = ({ therapist }) => (
    <TouchableOpacity
      style={styles.detailedTherapistCard}
      onPress={() => handleViewProfile(therapist)}
      activeOpacity={0.7}
    >
      <View style={styles.therapistHeader}>
        <Avatar
          source={therapist.image}
          size={scale(70)}
          rounded
          containerStyle={styles.avatar}
        />
        <View style={styles.therapistInfo}>
          <Text style={styles.therapistName}>{therapist.name}</Text>
          <Text style={styles.therapistSpecialty}>{therapist.specialty}</Text>
          <View style={styles.ratingContainer}>
            <Icon name="star" type="material" color="#FFD700" size={moderateScale(16)} />
            <Text style={styles.rating}>{therapist.rating}</Text>
            <Text style={styles.reviewCount}>({therapist.reviews} reviews)</Text>
          </View>
          <Text style={styles.experience}>{therapist.experience} experience</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{therapist.price}</Text>
          <Text style={styles.priceUnit}>{therapist.priceUnit}</Text>
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
      </View>

      <Text style={styles.therapistBio} numberOfLines={2}>{therapist.bio}</Text>

      <View style={styles.therapistFooter}>
        <View style={styles.nextAvailableContainer}>
          <Icon name="schedule" type="material" color={appColors.AppBlue} size={moderateScale(16)} />
          <Text style={styles.nextAvailableText}>Next: {therapist.nextAvailable}</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.bookButton,
            !therapist.available && styles.disabledButton
          ]}
          onPress={(e) => {
            e.stopPropagation();
            handleBookSession(therapist);
          }}
          disabled={!therapist.available}
        >
          <Text style={[
            styles.bookButtonText,
            !therapist.available && styles.disabledButtonText
          ]}>
            {therapist.available ? 'Book Now' : 'Unavailable'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const TherapistCard: React.FC<{ therapist: Therapist }> = ({ therapist }) => {
    return viewType === 'compact' ?
      <CompactTherapistCard therapist={therapist} /> :
      <DetailedTherapistCard therapist={therapist} />;
  };

  const therapistsListRef = useRef<FlatList>(null);
  useEffect(() => {
    // Scroll to top whenever specialty or search changes
    requestAnimationFrame(() => {
      therapistsListRef.current?.scrollToOffset({ offset: 0, animated: false });
    });
  }, [selectedSpecialty, searchQuery]);

  return (
    <SafeAreaView style={styles.container}>
      <ISStatusBar backgroundColor={appColors.AppBlue} />

      {showBackButton ? (
        <LHGenericHeader
          title="Find Therapists"
          subtitle="Connect with mental health professionals"
          showLeftIcon={true}
          leftIconPressed={() => navigation.goBack()}
          leftIconName="arrow-back"
          leftIconType="material"
          rightIcon={null}
          rightIconPressed={() => { }}
        />
      ) : (
        // Custom Header like MoodScreen
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Find Therapists</Text>
              <Text style={styles.headerSubtitle}>Connect with mental health professionals</Text>
            </View>

            <TouchableOpacity
              style={styles.donateButton}
              onPress={() => setShowDonateModal(true)}
              activeOpacity={0.7}
            >
              <Icon name="favorite" type="material" color={appColors.CardBackground} size={moderateScale(20)} />
              <Text style={styles.donateText}>Donate</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.content}>
        {/* Search Bar */}
        <View style={[styles.searchContainer, isSearchFocused && styles.searchContainerFocused]}>
          <Icon
            name="search"
            type="material"
            color={isSearchFocused ? appColors.AppBlue : appColors.AppGray}
            size={moderateScale(20)}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search therapists or specialties..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            placeholderTextColor={appColors.AppGray}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Icon
                name="close"
                type="material"
                color={appColors.AppGray}
                size={moderateScale(20)}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Search Expanded State */}
        {isSearchFocused && (
          <View style={styles.searchExpandedContainer}>
            <Text style={styles.searchSectionTitle}>Recent Searches</Text>
            {recentSearches.map((search, index) => (
              <TouchableOpacity
                key={index}
                style={styles.recentSearchItem}
                onPress={() => handleRecentSearchPress(search)}
              >
                <Icon
                  name="history"
                  type="material"
                  color={appColors.AppGray}
                  size={moderateScale(18)}
                />
                <Text style={styles.recentSearchText}>{search}</Text>
              </TouchableOpacity>
            ))}

            <Text style={styles.searchSectionTitle}>Popular Specialties</Text>
            {['Anxiety & Depression', 'Relationship Counseling', 'Trauma Therapy'].map((specialty, index) => (
              <TouchableOpacity
                key={index}
                style={styles.recentSearchItem}
                onPress={() => handleRecentSearchPress(specialty)}
              >
                <Icon
                  name="trending-up"
                  type="material"
                  color={appColors.AppBlue}
                  size={moderateScale(18)}
                />
                <Text style={styles.recentSearchText}>{specialty}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Therapists List - Hidden when search is focused */}
        {!isSearchFocused && (
          <FlatList
            ref={therapistsListRef}
            data={filteredTherapists}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <TherapistCard therapist={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            ListHeaderComponent={
              <View>
                {/* Filter Section */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterText}>All Specialities</Text>
                  <View style={styles.filterActions}>
                    <TouchableOpacity style={styles.viewToggleButton} onPress={toggleViewType}>
                      <Icon
                        name={viewType === 'compact' ? 'view-list' : 'view-module'}
                        type="material"
                        color={appColors.grey2}
                        size={moderateScale(24)}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterButton} onPress={toggleFilters}>
                      <Icon name="tune" type="material" color={appColors.grey2} size={moderateScale(24)} />
                    </TouchableOpacity>
                  </View>
                </View>
                {/* Specialty Filter Chips */}
                {showFilters && (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.specialtyContainer}
                  >
                    {specialties.map((specialty) => (
                      <TouchableOpacity
                        key={specialty}
                        style={[
                          styles.specialtyChip,
                          selectedSpecialty === specialty && styles.selectedSpecialtyChip
                        ]}
                        onPress={() => setSelectedSpecialty(specialty)}
                      >
                        <Text style={[
                          styles.specialtyText,
                          selectedSpecialty === specialty && styles.selectedSpecialtyText
                        ]}>
                          {specialty}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
              </View>
            }
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing as boolean}
                onRefresh={onRefresh}
                colors={[appColors.AppBlue]}
                tintColor={appColors.AppBlue}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Icon
                  name="person-search"
                  type="material"
                  color={appColors.AppGray}
                  size={moderateScale(60)}
                />
                <Text style={styles.emptyText}>No therapists found</Text>
                <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
              </View>
            }
          />
        )}
      </View>
      {/* Floating Matching Quiz Button */}
      <TouchableOpacity style={styles.fab} onPress={handleStartMatchingQuiz} activeOpacity={0.85}>
        <Icon name="psychology" type="material" color={appColors.CardBackground} size={moderateScale(26)} />
        <Text style={styles.fabText}>Match</Text>
      </TouchableOpacity>

      {/* Panic Button */}
      <PanicButtonComponent
        position="bottom-left"
        size="medium"
        quickAction="modal"
      />

      {/* @ts-ignore */}
      <LHGenericFeatureModal
        title="Donate Feature"
        description="The donation feature is coming soon! You'll be able to support mental health initiatives and help others access therapy services."
        buttonTitle="GOT IT"
        isModVisible={showDonateModal}
        visibilitySetter={(val: boolean) => setShowDonateModal(val)}
        isDismissable={true}
        hasIcon={true}
        iconType="material"
        iconName="favorite"
      />
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.AppLightGray,
  },
  content: {
    flex: 1,
    padding: scale(20),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(25),
    paddingHorizontal: scale(15),
    marginBottom: scale(20),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: scale(1),
    borderColor: appColors.AppLightGray,
  },
  searchIcon: {
    marginRight: scale(10),
  },
  searchInput: {
    flex: 1,
    paddingVertical: scale(15),
    fontSize: moderateScale(16),
    color: appColors.AppBlue,
    fontFamily: appFonts.bodyTextRegular,
  },
  searchContainerFocused: {
    borderColor: appColors.AppBlue,
    borderWidth: scale(2),
  },
  clearButton: {
    padding: scale(5),
  },
  searchExpandedContainer: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(15),
    padding: scale(20),
    marginBottom: scale(20),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchSectionTitle: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: scale(15),
    marginTop: scale(10),
    fontFamily: appFonts.bodyTextBold,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(12),
    paddingHorizontal: scale(5),
    borderBottomWidth: 0.5,
    borderBottomColor: appColors.grey4,
  },
  recentSearchText: {
    fontSize: moderateScale(15),
    color: appColors.grey1,
    marginLeft: scale(12),
    fontFamily: appFonts.bodyTextRegular,
  },
  specialtyContainer: {
    marginBottom: scale(20),
  },
  specialtyChip: {
    backgroundColor: appColors.AppLightGray,
    borderRadius: scale(20),
    paddingHorizontal: scale(15),
    paddingVertical: scale(8),
    marginRight: scale(10),
    height: scale(36),
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedSpecialtyChip: {
    backgroundColor: appColors.AppBlue,
  },
  specialtyText: {
    fontSize: moderateScale(14),
    color: appColors.AppGray,
    fontFamily: appFonts.bodyTextMedium,
    textAlign: 'center',
  },
  selectedSpecialtyText: {
    color: appColors.CardBackground,
    fontFamily: appFonts.bodyTextMedium,
  },
  listContainer: {
    paddingBottom: scale(20),
  },
  filterSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(20),
  },
  filterText: {
    fontSize: moderateScale(16),
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextMedium,
  },
  filterActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewToggleButton: {
    padding: scale(8),
    marginRight: scale(8),
  },
  filterButton: {
    padding: scale(8),
  },
  therapistCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(15),
    padding: scale(15),
    marginBottom: scale(15),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: scale(15),
  },
  therapistInfo: {
    flex: 1,
  },
  therapistName: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: scale(3),
    fontFamily: appFonts.bodyTextBold,
  },
  therapistSpecialty: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    marginBottom: scale(3),
    fontFamily: appFonts.bodyTextRegular,
  },
  therapistLocation: {
    fontSize: moderateScale(13),
    color: appColors.grey2,
    marginBottom: scale(8),
    fontFamily: appFonts.bodyTextRegular,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: scale(8),
  },
  reviewCount: {
    fontSize: moderateScale(12),
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
  },
  menuButton: {
    padding: scale(8),
  },
  detailedTherapistCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(20),
    padding: scale(20),
    marginBottom: scale(15),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  therapistHeader: {
    flexDirection: 'row',
    marginBottom: scale(15),
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.bodyTextBold,
  },
  priceUnit: {
    fontSize: moderateScale(12),
    color: appColors.grey2,
    marginBottom: scale(8),
    fontFamily: appFonts.bodyTextRegular,
  },
  rating: {
    fontSize: moderateScale(14),
    color: appColors.grey1,
    marginLeft: scale(4),
    fontFamily: appFonts.bodyTextMedium,
  },
  experience: {
    fontSize: moderateScale(13),
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
  },
  availabilityBadge: {
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    borderRadius: scale(10),
  },
  available: {
    backgroundColor: '#E8F5E8',
  },
  unavailable: {
    backgroundColor: '#FFE8E8',
  },
  availabilityText: {
    fontSize: moderateScale(12),
    fontFamily: appFonts.bodyTextMedium,
  },
  availableText: {
    color: '#4CAF50',
  },
  unavailableText: {
    color: '#F44336',
  },
  therapistBio: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    marginBottom: scale(15),
    lineHeight: moderateScale(20),
    fontFamily: appFonts.bodyTextRegular,
  },
  therapistFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nextAvailableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  nextAvailableText: {
    fontSize: moderateScale(13),
    color: appColors.AppBlue,
    marginLeft: scale(6),
    fontFamily: appFonts.bodyTextMedium,
  },
  bookButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: scale(20),
    paddingVertical: scale(10),
    paddingHorizontal: scale(20),
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: moderateScale(14),
    color: appColors.CardBackground,
    fontWeight: '600',
    fontFamily: appFonts.bodyTextMedium,
  },
  disabledButton: {
    backgroundColor: appColors.AppLightGray,
  },
  disabledButtonText: {
    color: appColors.AppGray,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(60),
  },
  emptyText: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: appColors.AppGray,
    marginTop: scale(20),
    fontFamily: appFonts.bodyTextBold,
  },
  emptySubtext: {
    fontSize: moderateScale(14),
    color: appColors.AppGray,
    textAlign: 'center',
    marginTop: scale(8),
  },
  header: {
    backgroundColor: appColors.AppBlue,
    paddingTop: parameters.headerHeightS,
    paddingBottom: scale(25),
    paddingHorizontal: scale(20),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTextContainer: {
    flex: 1,
    marginRight: scale(15),
  },
  donateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    paddingHorizontal: scale(12),
    paddingVertical: scale(8),
    borderRadius: scale(20),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  donateText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextMedium,
  },
  headerTitle: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  headerSubtitle: {
    fontSize: moderateScale(16),
    color: appColors.CardBackground,
    fontFamily: appFonts.bodyTextRegular,
    opacity: 0.9,
    marginTop: scale(4),
  },
  fab: {
    position: 'absolute',
    right: scale(20),
    bottom: scale(24),
    backgroundColor: appColors.AppBlue,
    borderRadius: scale(28),
    paddingHorizontal: scale(18),
    height: scale(56),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  fabText: {
    color: appColors.CardBackground,
    fontSize: moderateScale(14),
    fontFamily: appFonts.bodyTextMedium,
    marginLeft: scale(8),
    fontWeight: '700',
  },
});

export default TherapistsScreen;
