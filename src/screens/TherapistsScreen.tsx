/**
 * Therapists Screen - Find and connect with therapists
 */
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
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
  const [viewType, setViewType] = useState('compact'); // 'compact' or 'detailed'
  const [showFilters, setShowFilters] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);

  // Load therapists on mount
  useEffect(() => {
    loadTherapists();
  }, []);

  // Refresh therapists whenever the screen/tab gains focus
  useFocusEffect(
    useCallback(() => {
      refreshTherapists();
    }, [])
  );

  // Dynamically extract unique specialties from loaded therapists
  const specialties = useMemo(() => {
    const rawList = (therapists as Therapist[] || []).map(t => t.specialty);
    // Split by comma if the API returned comma-separated lists, trim, and filter uniques
    const splitSpecs = rawList.flatMap(s => s ? s.split(',').map(item => item.trim()) : []);
    const uniqueSpecs = Array.from(new Set(splitSpecs)).filter(Boolean);
    return ['All Specialities', ...uniqueSpecs];
  }, [therapists]);

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
          size={scale(65)}
          rounded
          containerStyle={[styles.avatar, { borderWidth: 2, borderColor: appColors.AppLightGray }]}
          avatarStyle={{ width: '100%', height: '100%', resizeMode: 'cover' }}
        />

        <View style={[styles.therapistInfo, { justifyContent: 'center' }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1, paddingRight: scale(8) }}>
              <Text style={styles.therapistName} numberOfLines={1}>{therapist.name}</Text>
              <Text style={styles.therapistSpecialty} numberOfLines={1}>{therapist.specialty}</Text>
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

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: scale(4) }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="star" type="material" color="#FFD700" size={moderateScale(14)} />
              <Text style={{ fontSize: moderateScale(13), fontWeight: '600', color: appColors.grey1, marginLeft: scale(4) }}>{therapist.rating}</Text>
              <Text style={styles.reviewCount} numberOfLines={1}>({therapist.reviews})</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={{ fontSize: moderateScale(14), fontWeight: 'bold', color: appColors.AppBlue, fontFamily: appFonts.headerTextBold }}>{therapist.price}</Text>
              <Text style={{ fontSize: moderateScale(10), color: appColors.grey3, marginLeft: scale(2), fontFamily: appFonts.bodyTextRegular }}>{therapist.priceUnit}</Text>
            </View>
          </View>
        </View>
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
          size={scale(75)}
          rounded
          containerStyle={[styles.avatar, { borderWidth: 2, borderColor: appColors.AppLightGray }]}
          avatarStyle={{ width: '100%', height: '100%', resizeMode: 'cover' }}
        />
        <View style={[styles.therapistInfo, { justifyContent: 'center' }]}>
          <View style={{ flex: 1, paddingRight: scale(8) }}>
            <Text style={styles.therapistName} numberOfLines={1}>{therapist.name}</Text>
            <Text style={styles.therapistSpecialty} numberOfLines={1}>{therapist.specialty}</Text>
          </View>

          <View style={[styles.ratingContainer, { marginTop: scale(4), justifyContent: 'space-between', paddingRight: scale(8) }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="star" type="material" color="#FFD700" size={moderateScale(16)} />
              <Text style={styles.rating}>{therapist.rating}</Text>
              <Text style={styles.reviewCount}>({therapist.reviews} reviews)</Text>
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
        </View>
      </View>

      <Text style={styles.therapistBio} numberOfLines={1}>{therapist.bio}</Text>

      <View style={styles.therapistFooter}>
        <View style={[styles.nextAvailableContainer, { flexDirection: 'column', alignItems: 'flex-start' }]}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: scale(4) }}>
            <Text style={styles.price}>{therapist.price}</Text>
            <Text style={styles.priceUnit}>{therapist.priceUnit}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="schedule" type="material" color={appColors.AppBlue} size={moderateScale(14)} />
            <Text style={[styles.nextAvailableText, { marginLeft: scale(4) }]}>Next: {therapist.nextAvailable}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.bookButton,
            { alignSelf: 'flex-end', marginLeft: 'auto' },
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
        <View style={[styles.searchContainer, searchQuery.length > 0 && styles.searchContainerFocused]}>
          <Icon
            name="search"
            type="material"
            color={searchQuery.length > 0 ? appColors.AppBlue : appColors.AppGray}
            size={moderateScale(20)}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search therapists or specialties..."
            value={searchQuery}
            onChangeText={setSearchQuery}
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

        {/* Therapists List */}
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
        // @ts-ignore
        visibilitySetter={(val: any) => setShowDonateModal(val)}
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
