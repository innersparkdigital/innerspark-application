/**
 * Therapists Screen - Find and connect with therapists
 */
import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button, Avatar } from '@rneui/base';
import { appColors, parameters, appFonts } from '../global/Styles';
import { useToast } from 'native-base';
import { appImages } from '../global/Data';
import LHGenericHeader from '../components/LHGenericHeader';

const SCREEN_WIDTH = Dimensions.get('window').width;

const TherapistsScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  
  // Check if we came from outside bottom tabs (need back button)
  const showBackButton = route?.params?.showBackButton || false;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialities');
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState(['Anxiety therapy', 'Dr. Sarah', 'Couples counseling']);
  const [viewType, setViewType] = useState('compact'); // 'compact' or 'detailed'
  const [showFilters, setShowFilters] = useState(false);

  // Mock therapist data with complete information
  const therapists = [
    {
      id: 1,
      name: 'Dr. Martin Pilier',
      specialty: 'Therapist - Specialist',
      rating: 3,
      location: 'Kampala Down Town - 2 km',
      image: require('../assets/images/dummy-people/d-person1.png'),
      reviews: 213,
      experience: '8 years',
      price: 'UGX 50,000',
      priceUnit: '/session',
      available: true,
      bio: 'Specialized in cognitive behavioral therapy and mindfulness techniques.',
      nextAvailable: 'Today 2:00 PM',
    },
    {
      id: 2,
      name: 'Dr. Clara Odding',
      specialty: 'Therapist',
      rating: 2,
      location: 'Nakawa - 3 km',
      image: require('../assets/images/dummy-people/d-person2.png'),
      reviews: 25,
      experience: '5 years',
      price: 'UGX 45,000',
      priceUnit: '/session',
      available: true,
      bio: 'Expert in anxiety and depression treatment.',
      nextAvailable: 'Tomorrow 10:00 AM',
    },
    {
      id: 3,
      name: 'Dr. Julien More',
      specialty: 'Therapist',
      rating: 5,
      location: 'Mukono - 10 km',
      image: require('../assets/images/dummy-people/d-person3.png'),
      reviews: 456,
      experience: '12 years',
      price: 'UGX 60,000',
      priceUnit: '/session',
      available: false,
      bio: 'Specializes in trauma therapy and PTSD treatment.',
      nextAvailable: 'Next week',
    },
    {
      id: 4,
      name: 'Dr. Sarah Johnson',
      specialty: 'Anxiety & Depression',
      rating: 4,
      location: 'Kampala Central - 5 km',
      image: require('../assets/images/dummy-people/d-person4.png'),
      reviews: 189,
      experience: '10 years',
      price: 'UGX 55,000',
      priceUnit: '/session',
      available: true,
      bio: 'Focused on adolescent mental health and behavioral issues.',
      nextAvailable: 'Today 4:30 PM',
    },
  ];

  const specialties = ['All Specialities', 'Therapist', 'Specialist', 'Counselor'];

  const filteredTherapists = therapists.filter(therapist => {
    const matchesSearch = therapist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         therapist.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All Specialities' || 
                            therapist.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase());
    return matchesSearch && matchesSpecialty;
  });

  const notifyWithToast = (description) => {
    toast.show({
      description: description,
      duration: 2000,
    });
  };

  const handleBookSession = (therapist) => {
    if (therapist.available) {
      navigation.navigate('TherapistDetailScreen', { therapist });
    } else {
      notifyWithToast('This therapist is currently unavailable');
    }
  };

  const handleViewProfile = (therapist) => {
    navigation.navigate('TherapistDetailScreen', { therapist });
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
  };

  const handleRecentSearchPress = (searchTerm) => {
    setSearchQuery(searchTerm);
    setIsSearchFocused(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const toggleViewType = () => {
    setViewType(viewType === 'compact' ? 'detailed' : 'compact');
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleStartMatchingQuiz = () => {
    navigation.navigate('TherapistMatchingQuizScreen');
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="star"
        type="material"
        color={index < rating ? "#FFD700" : "#E0E0E0"}
        size={14}
      />
    ));
  };

  const CompactTherapistCard = ({ therapist }) => (
    <TouchableOpacity 
      style={styles.therapistCard}
      onPress={() => handleViewProfile(therapist)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <Avatar
          source={therapist.image}
          size={60}
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

  const DetailedTherapistCard = ({ therapist }) => (
    <TouchableOpacity 
      style={styles.detailedTherapistCard}
      onPress={() => handleViewProfile(therapist)}
      activeOpacity={0.7}
    >
      <View style={styles.therapistHeader}>
        <Avatar
          source={therapist.image}
          size={70}
          rounded
          containerStyle={styles.avatar}
        />
        <View style={styles.therapistInfo}>
          <Text style={styles.therapistName}>{therapist.name}</Text>
          <Text style={styles.therapistSpecialty}>{therapist.specialty}</Text>
          <View style={styles.ratingContainer}>
            <Icon name="star" type="material" color="#FFD700" size={16} />
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
          <Icon name="schedule" type="material" color={appColors.AppBlue} size={16} />
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

  const TherapistCard = ({ therapist }) => {
    return viewType === 'compact' ? 
      <CompactTherapistCard therapist={therapist} /> : 
      <DetailedTherapistCard therapist={therapist} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={appColors.AppBlue} barStyle="light-content" />
      
      {showBackButton ? (
        <LHGenericHeader
          title="Find Therapists"
          subtitle="Connect with mental health professionals"
          showLeftIcon={true}
          leftIconPressed={() => navigation.goBack()}
        />
      ) : (
        // Custom Header like MoodScreen
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>Find Therapists</Text>
              <Text style={styles.headerSubtitle}>Connect with mental health professionals</Text>
            </View>
            <TouchableOpacity 
              style={styles.donateButton}
              onPress={() => navigation.navigate('DonationFundScreen')}
              activeOpacity={0.7}
            >
              <Icon name="favorite" type="material" color={appColors.CardBackground} size={24} />
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
            size={20}
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
                size={20}
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
                  size={18}
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
                  size={18}
                />
                <Text style={styles.recentSearchText}>{specialty}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Filter Section - Hidden when search is focused */}
        {!isSearchFocused && (
          <View style={styles.filterSection}>
            <Text style={styles.filterText}>All Specialities</Text>
            <View style={styles.filterActions}>
              <TouchableOpacity style={styles.viewToggleButton} onPress={toggleViewType}>
                <Icon 
                  name={viewType === 'compact' ? 'view-list' : 'view-module'} 
                  type="material" 
                  color={appColors.grey2} 
                  size={24} 
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterButton} onPress={toggleFilters}>
                <Icon name="tune" type="material" color={appColors.grey2} size={24} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Specialty Filter Chips - Show when filters are toggled */}
        {!isSearchFocused && showFilters && (
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

        {/* Therapists List - Hidden when search is focused */}
        {!isSearchFocused && (
          <FlatList
            data={filteredTherapists}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <TherapistCard therapist={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Icon
                  name="person-search"
                  type="material"
                  color={appColors.AppGray}
                  size={60}
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
        <Icon name="psychology" type="material" color={appColors.CardBackground} size={26} />
        <Text style={styles.fabText}>Match</Text>
      </TouchableOpacity>
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
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: appColors.AppLightGray,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: appColors.AppBlue,
    fontFamily: appFonts.appTextRegular,
  },
  searchContainerFocused: {
    borderColor: appColors.AppBlue,
    borderWidth: 2,
  },
  clearButton: {
    padding: 5,
  },
  searchExpandedContainer: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: 15,
    marginTop: 10,
    fontFamily: appFonts.appTextBold,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: appColors.grey4,
  },
  recentSearchText: {
    fontSize: 15,
    color: appColors.grey1,
    marginLeft: 12,
    fontFamily: appFonts.appTextRegular,
  },
  specialtyContainer: {
    marginBottom: 20,
  },
  specialtyChip: {
    backgroundColor: appColors.AppLightGray,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
  },
  selectedSpecialtyChip: {
    backgroundColor: appColors.AppBlue,
  },
  specialtyText: {
    fontSize: 14,
    color: appColors.AppGray,
    fontFamily: appFonts.appTextMedium,
  },
  selectedSpecialtyText: {
    color: appColors.CardBackground,
  },
  listContainer: {
    paddingBottom: 20,
  },
  filterSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  filterText: {
    fontSize: 16,
    color: appColors.grey1,
    fontFamily: appFonts.appTextMedium,
  },
  filterActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewToggleButton: {
    padding: 8,
    marginRight: 8,
  },
  filterButton: {
    padding: 8,
  },
  specialtyContainer: {
    marginBottom: 20,
  },
  specialtyChip: {
    backgroundColor: appColors.AppLightGray,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedSpecialtyChip: {
    backgroundColor: appColors.AppBlue,
  },
  specialtyText: {
    fontSize: 14,
    color: appColors.AppGray,
    fontFamily: appFonts.appTextMedium,
    textAlign: 'center',
  },
  selectedSpecialtyText: {
    color: appColors.CardBackground,
    fontFamily: appFonts.appTextMedium,
  },
  therapistCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
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
    marginRight: 15,
  },
  therapistInfo: {
    flex: 1,
  },
  therapistName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: 3,
    fontFamily: appFonts.appTextBold,
  },
  therapistSpecialty: {
    fontSize: 14,
    color: appColors.grey2,
    marginBottom: 3,
    fontFamily: appFonts.appTextRegular,
  },
  therapistLocation: {
    fontSize: 13,
    color: appColors.grey2,
    marginBottom: 8,
    fontFamily: appFonts.appTextRegular,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  reviewCount: {
    fontSize: 12,
    color: appColors.grey2,
    fontFamily: appFonts.appTextRegular,
  },
  menuButton: {
    padding: 8,
  },
  detailedTherapistCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  therapistHeader: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.appTextBold,
  },
  priceUnit: {
    fontSize: 12,
    color: appColors.grey2,
    marginBottom: 8,
    fontFamily: appFonts.appTextRegular,
  },
  rating: {
    fontSize: 14,
    color: appColors.grey1,
    marginLeft: 4,
    fontFamily: appFonts.appTextMedium,
  },
  experience: {
    fontSize: 13,
    color: appColors.grey2,
    fontFamily: appFonts.appTextRegular,
  },
  availabilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  available: {
    backgroundColor: '#E8F5E8',
  },
  unavailable: {
    backgroundColor: '#FFE8E8',
  },
  availabilityText: {
    fontSize: 12,
    fontFamily: appFonts.appTextMedium,
  },
  availableText: {
    color: '#4CAF50',
  },
  unavailableText: {
    color: '#F44336',
  },
  therapistBio: {
    fontSize: 14,
    color: appColors.grey2,
    marginBottom: 15,
    lineHeight: 20,
    fontFamily: appFonts.appTextRegular,
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
    fontSize: 13,
    color: appColors.AppBlue,
    marginLeft: 6,
    fontFamily: appFonts.appTextMedium,
  },
  bookButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: 14,
    color: appColors.CardBackground,
    fontWeight: '600',
    fontFamily: appFonts.appTextMedium,
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
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.AppGray,
    marginTop: 20,
    fontFamily: appFonts.appTextBold,
  },
  emptySubtext: {
    fontSize: 14,
    color: appColors.AppGray,
    textAlign: 'center',
    marginTop: 8,
  },
  header: {
    backgroundColor: appColors.AppBlue,
    paddingTop: parameters.headerHeightS,
    paddingBottom: 25,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  donateButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  headerSubtitle: {
    fontSize: 16,
    color: appColors.CardBackground,
    fontFamily: appFonts.regularText,
    opacity: 0.9,
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    backgroundColor: appColors.AppBlue,
    borderRadius: 28,
    paddingHorizontal: 18,
    height: 56,
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
    fontSize: 14,
    fontFamily: appFonts.appTextMedium,
    marginLeft: 8,
    fontWeight: '700',
  },
});

export default TherapistsScreen;
