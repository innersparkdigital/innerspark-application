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

const TherapistsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [isLoading, setIsLoading] = useState(false);

  // Mock therapist data
  const therapists = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Anxiety & Depression',
      rating: 4.9,
      experience: '8 years',
      price: '$80/session',
      image: appImages.defaultAvatar,
      available: true,
      bio: 'Specialized in cognitive behavioral therapy and mindfulness techniques.',
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Relationship Counseling',
      rating: 4.8,
      experience: '12 years',
      price: '$90/session',
      image: appImages.defaultAvatar,
      available: true,
      bio: 'Expert in couples therapy and family counseling.',
    },
    {
      id: 3,
      name: 'Dr. Emily Davis',
      specialty: 'Trauma Therapy',
      rating: 4.9,
      experience: '10 years',
      price: '$85/session',
      image: appImages.defaultAvatar,
      available: false,
      bio: 'Specializes in PTSD treatment and trauma recovery.',
    },
    {
      id: 4,
      name: 'Dr. James Wilson',
      specialty: 'Teen Counseling',
      rating: 4.7,
      experience: '6 years',
      price: '$75/session',
      image: appImages.defaultAvatar,
      available: true,
      bio: 'Focused on adolescent mental health and behavioral issues.',
    },
  ];

  const specialties = ['All', 'Anxiety & Depression', 'Relationship Counseling', 'Trauma Therapy', 'Teen Counseling'];

  const filteredTherapists = therapists.filter(therapist => {
    const matchesSearch = therapist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         therapist.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || therapist.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const notifyWithToast = (description) => {
    toast.show({
      description: description,
      duration: 2000,
    });
  };

  const handleBookSession = (therapist) => {
    notifyWithToast(`Booking session with ${therapist.name}...`);
    // Navigate to booking screen or implement booking logic
  };

  const handleViewProfile = (therapist) => {
    notifyWithToast(`Viewing ${therapist.name}'s profile`);
    // Navigate to therapist profile screen
  };

  const TherapistCard = ({ therapist }) => (
    <View style={styles.therapistCard}>
      <View style={styles.therapistHeader}>
        <Avatar
          source={therapist.image}
          size={60}
          rounded
          containerStyle={styles.avatar}
        />
        <View style={styles.therapistInfo}>
          <Text style={styles.therapistName}>{therapist.name}</Text>
          <Text style={styles.therapistSpecialty}>{therapist.specialty}</Text>
          <View style={styles.ratingContainer}>
            <Icon name="star" type="material" color="#FFD700" size={16} />
            <Text style={styles.rating}>{therapist.rating}</Text>
            <Text style={styles.experience}>• {therapist.experience}</Text>
          </View>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{therapist.price}</Text>
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
      
      <Text style={styles.therapistBio}>{therapist.bio}</Text>
      
      <View style={styles.therapistActions}>
        <TouchableOpacity
          style={styles.viewProfileButton}
          onPress={() => handleViewProfile(therapist)}
        >
          <Text style={styles.viewProfileText}>View Profile</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.bookButton,
            !therapist.available && styles.disabledButton
          ]}
          onPress={() => handleBookSession(therapist)}
          disabled={!therapist.available}
        >
          <Text style={[
            styles.bookButtonText,
            !therapist.available && styles.disabledButtonText
          ]}>
            {therapist.available ? 'Book Session' : 'Unavailable'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={appColors.StatusBarColor} barStyle="light-content" />
      
      <LHGenericHeader
        title="Find Therapists"
        subtitle="Connect with mental health professionals"
        navigation={navigation}
      />

      <View style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon
            name="search"
            type="material"
            color={appColors.AppGray}
            size={20}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search therapists or specialties..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={appColors.AppGray}
          />
        </View>

        {/* Specialty Filter */}
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

        {/* Therapists List */}
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.CardBackground,
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
  therapistCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  therapistHeader: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  avatar: {
    marginRight: 15,
  },
  therapistInfo: {
    flex: 1,
  },
  therapistName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    marginBottom: 5,
    fontFamily: appFonts.appTextBold,
  },
  therapistSpecialty: {
    fontSize: 14,
    color: appColors.AppGray,
    marginBottom: 5,
    fontFamily: appFonts.appTextRegular,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: appColors.AppBlue,
    marginLeft: 5,
    fontFamily: appFonts.appTextMedium,
  },
  experience: {
    fontSize: 14,
    color: appColors.AppGray,
    marginLeft: 5,
    fontFamily: appFonts.appTextRegular,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    marginBottom: 5,
    fontFamily: appFonts.appTextBold,
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
    color: appColors.AppGray,
    marginBottom: 15,
    lineHeight: 20,
    fontFamily: appFonts.appTextRegular,
  },
  therapistActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewProfileButton: {
    flex: 1,
    backgroundColor: appColors.AppLightGray,
    borderRadius: 25,
    paddingVertical: 12,
    marginRight: 10,
    alignItems: 'center',
  },
  viewProfileText: {
    fontSize: 14,
    color: appColors.AppBlue,
    fontWeight: '600',
    fontFamily: appFonts.appTextMedium,
  },
  bookButton: {
    flex: 1,
    backgroundColor: appColors.AppBlue,
    borderRadius: 25,
    paddingVertical: 12,
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
    marginTop: 5,
    fontFamily: appFonts.appTextRegular,
  },
});

export default TherapistsScreen;
