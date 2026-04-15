/**
 * Therapist Profile View Screen - For clients to view their therapist's profile
 * Accessible from DMThreadScreen via info icon
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Icon } from '@rneui/base';
import { appColors, appFonts } from '../../global/Styles';
import { scale, moderateScale } from '../../global/Scaling';
import ISGenericHeader from '../../components/ISGenericHeader';
import ISStatusBar from '../../components/ISStatusBar';
import { getTherapistAvailability } from '../../api/client/therapists';
import { useSelector } from 'react-redux';
import { useToast } from 'native-base';
import ISAlert, { useISAlert } from '../../components/alerts/ISAlert';
import { bookChatSession } from '../../api/client/messages';

interface TherapistProfileViewScreenProps {
  navigation: any;
  route: any;
}

const TherapistProfileViewScreen: React.FC<TherapistProfileViewScreenProps> = ({ navigation, route }) => {
  const { therapist } = route.params || {};
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);

  const userId = useSelector((state: any) => state.userData?.userDetails?.userId);
  const toast = useToast();
  const alert = useISAlert();

  useEffect(() => {
    if (therapist?.partnerId) {
      fetchProfile();
    } else {
      setIsLoading(false);
    }
  }, [therapist]);

  const fetchProfile = async () => {
    try {
      const response = await getTherapistAvailability(therapist.partnerId);
      setProfileData(response.data || response.therapist || response);
    } catch (error) {
      console.error('❌ Error fetching therapist profile', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookSession = () => {
    if (!selectedSlot) return;
    alert.show({
      type: 'confirm',
      title: 'Book Session',
      message: `Are you sure you want to book this chat session for ${selectedSlot.date || selectedSlot.start_date || selectedSlot.date_time} at ${selectedSlot.time || selectedSlot.start_time}?`,
      confirmText: 'Book',
      cancelText: 'Cancel',
      onConfirm: async () => {
        try {
          const response = await bookChatSession(
            userId, 
            therapistProfile.id, 
            selectedSlot.date || selectedSlot.start_date, 
            selectedSlot.time || selectedSlot.start_time
          );
          toast.show({ description: 'Session booked successfully!', duration: 3000 });
          const newChatId = response.data?.chat_id || response.chat_id || response.id;
          if (newChatId) {
            navigation.navigate('DMThreadScreen', { 
              chatId: newChatId,
              partnerName: therapistProfile.name,
              partnerAvatar: therapistProfile.avatar,
              partnerRole: 'therapist'
            });
          } else {
             navigation.goBack();
          }
        } catch (error: any) {
          alert.show({
            type: 'error',
            title: 'Booking Failed',
            message: error.response?.data?.error || error.response?.data?.message || error.message || 'Could not book session',
          });
        }
      }
    });
  };

  const therapistProfile = {
    id: profileData?.user_id || therapist?.partnerId || '',
    name: profileData?.firstName && profileData?.lastName
      ? `${profileData.firstName} ${profileData.lastName}`
      : profileData?.name || therapist?.partnerName || 'Unknown Therapist',
    credentials: profileData?.credentials || '',
    avatar: profileData?.avatar || therapist?.partnerAvatar,
    specialty: profileData?.specialities || profileData?.specialty || '',
    yearsOfExperience: profileData?.experience || profileData?.yearsOfExperience || profileData?.years_of_experience || '',
    bio: profileData?.bio || '',
    approach: profileData?.approach || '',
    languages: profileData?.languages ? profileData.languages.split(',').map((l: string) => l.trim()) : [],
    availability: profileData?.availability === 1 ? 'Available' : 'Unavailable',
    responseTime: profileData?.responseTime || profileData?.response_time || '',
    isOnline: therapist?.isOnline || false,
    email: profileData?.email || therapist?.partnerEmail || '',
    sessionTypes: profileData?.sessionTypes || profileData?.session_types || [],
  };

  const renderInfoCard = (icon: string, title: string, content: string, iconType: string = 'material') => (
    <View style={styles.infoCard}>
      <View style={styles.infoIconContainer}>
        <Icon name={icon} type={iconType} size={moderateScale(20)} color={appColors.AppBlue} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoTitle}>{title}</Text>
        <Text style={styles.infoText}>{content}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ISStatusBar />
      <ISGenericHeader
        title="Therapist Profile"
        hasLightBackground={false}
        navigation={navigation}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={appColors.AppBlue} />
          </View>
        ) : (
          <>
            {/* Profile Header */}
            <View style={styles.headerCard}>
              <View style={styles.avatarContainer}>
                {therapistProfile.avatar ? (
                  <Avatar source={therapistProfile.avatar} size={scale(100)} rounded />
                ) : (
                  <Avatar
                    title={therapistProfile.name.split(' ').map((n: string) => n[0]).join('')}
                    size={scale(100)}
                    rounded
                    containerStyle={{ backgroundColor: appColors.AppBlue }}
                    titleStyle={styles.avatarText}
                  />
                )}
                {therapistProfile.isOnline && <View style={styles.onlineIndicator} />}
              </View>

              <Text style={styles.therapistName}>{therapistProfile.name}</Text>
              {!!therapistProfile.credentials && <Text style={styles.credentials}>{therapistProfile.credentials}</Text>}

              {!!therapistProfile.specialty && (
                <View style={styles.specialtyBadge}>
                  <Icon name="psychology" type="material" size={moderateScale(16)} color={appColors.AppBlue} />
                  <Text style={styles.specialtyText}>{therapistProfile.specialty}</Text>
                </View>
              )}

              {!!therapistProfile.yearsOfExperience && (
                <View style={styles.experienceBadge}>
                  <Text style={styles.experienceText}>
                    {therapistProfile.yearsOfExperience}
                  </Text>
                </View>
              )}
            </View>

            {/* About Section */}
            {!!therapistProfile.bio && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>About</Text>
                <Text style={styles.bioText}>{therapistProfile.bio}</Text>
              </View>
            )}

            {/* Approach */}
            {!!therapistProfile.approach && renderInfoCard('lightbulb', 'Therapeutic Approach', therapistProfile.approach)}

            {/* Languages */}
            {therapistProfile.languages?.length > 0 && renderInfoCard('language', 'Languages', therapistProfile.languages.join(', '))}

            {/* Availability */}
            {!!therapistProfile.availability && renderInfoCard('schedule', 'Availability', therapistProfile.availability)}

            {/* Chat Slots */}
            {profileData?.slots && profileData.slots.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Available 1-on-1 Sessions</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.slotsContainer}>
                  {profileData.slots.map((slot: any, idx: number) => {
                    const isSelected = selectedSlot === slot;
                    return (
                      <TouchableOpacity 
                        key={idx} 
                        style={[styles.slotBadge, isSelected && styles.slotBadgeSelected]}
                        onPress={() => setSelectedSlot(slot)}
                      >
                        <Text style={[styles.slotDate, isSelected && styles.slotTextSelected]}>{slot.date || slot.start_date}</Text>
                        <Text style={[styles.slotTime, isSelected && styles.slotTextSelected]}>{slot.time || slot.start_time}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
                {selectedSlot && (
                  <TouchableOpacity style={[styles.primaryButton, { marginTop: scale(12) }]} onPress={handleBookSession}>
                    <Icon name="event-available" type="material" size={scale(16)} color={appColors.CardBackground} />
                    <Text style={styles.primaryButtonText}>Confirm Booking</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Response Time */}
            {!!therapistProfile.responseTime && renderInfoCard('access-time', 'Response Time', therapistProfile.responseTime)}

            {/* Session Types */}
            {therapistProfile.sessionTypes?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Session Types</Text>
                <View style={styles.sessionTypesContainer}>
                  {therapistProfile.sessionTypes.map((type: string, index: number) => (
                    <View key={index} style={styles.sessionTypeBadge}>
                      <Icon name="check-circle" type="material" size={moderateScale(16)} color={appColors.AppGreen} />
                      <Text style={styles.sessionTypeText}>{type}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Contact Info */}
            {!!therapistProfile.email && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Contact</Text>
                <View style={styles.contactCard}>
                  <Icon name="email" type="material" size={moderateScale(20)} color={appColors.grey3} />
                  <Text style={styles.contactText}>{therapistProfile.email}</Text>
                </View>
                <View style={styles.contactNote}>
                  <Icon name="info" type="material" size={moderateScale(16)} color={appColors.grey3} />
                  <Text style={styles.contactNoteText}>
                    For session-related questions, please use the chat or schedule an appointment
                  </Text>
                </View>
              </View>
            )}

            {/* Action Button */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => navigation.goBack()}
              >
                <Icon name="chat" type="material" size={moderateScale(20)} color={appColors.CardBackground} />
                <Text style={styles.primaryButtonText}>Back to Chat</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        <View style={styles.bottomPadding} />
      </ScrollView>
      <ISAlert ref={alert.ref} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.AppLightGray,
  },
  loadingContainer: {
    flex: 1,
    minHeight: scale(300),
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  headerCard: {
    backgroundColor: appColors.CardBackground,
    paddingVertical: scale(30),
    paddingHorizontal: scale(20),
    alignItems: 'center',
    marginBottom: scale(16),
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: scale(16),
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: scale(5),
    right: scale(5),
    width: scale(20),
    height: scale(20),
    borderRadius: scale(10),
    backgroundColor: appColors.AppGreen,
    borderWidth: scale(3),
    borderColor: appColors.CardBackground,
  },
  avatarText: {
    fontSize: moderateScale(36),
    fontWeight: 'bold',
    color: appColors.CardBackground,
  },
  therapistName: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: scale(4),
  },
  credentials: {
    fontSize: moderateScale(14),
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    marginBottom: scale(12),
  },
  specialtyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.AppBlue + '15',
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
    borderRadius: scale(20),
    marginBottom: scale(8),
    gap: scale(6),
  },
  specialtyText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
  },
  experienceBadge: {
    backgroundColor: appColors.grey6,
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderRadius: scale(12),
  },
  experienceText: {
    fontSize: moderateScale(12),
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
  },
  section: {
    backgroundColor: appColors.CardBackground,
    padding: scale(16),
    marginBottom: scale(16),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: scale(12),
  },
  bioText: {
    fontSize: moderateScale(15),
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
    lineHeight: scale(22),
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: appColors.CardBackground,
    padding: scale(16),
    marginBottom: scale(12),
    borderRadius: scale(12),
    marginHorizontal: scale(16),
  },
  infoIconContainer: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: appColors.AppBlue + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(12),
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: appColors.grey2,
    fontFamily: appFonts.headerTextBold,
    marginBottom: scale(4),
  },
  infoText: {
    fontSize: moderateScale(15),
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextRegular,
    lineHeight: scale(20),
  },
  sessionTypesContainer: {
    gap: scale(10),
  },
  sessionTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  sessionTypeText: {
    fontSize: moderateScale(15),
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextRegular,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.AppLightGray,
    padding: scale(12),
    borderRadius: scale(8),
    gap: scale(10),
    marginBottom: scale(12),
  },
  contactText: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
  },
  contactNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: scale(8),
    backgroundColor: appColors.AppBlue + '10',
    padding: scale(12),
    borderRadius: scale(8),
  },
  contactNoteText: {
    flex: 1,
    fontSize: moderateScale(13),
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
    lineHeight: scale(18),
  },
  actionsContainer: {
    paddingHorizontal: scale(16),
    gap: scale(12),
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: appColors.AppBlue,
    paddingVertical: scale(14),
    borderRadius: scale(12),
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
  },
  primaryButtonText: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  secondaryButton: {
    flexDirection: 'row',
    backgroundColor: appColors.CardBackground,
    paddingVertical: scale(14),
    borderRadius: scale(12),
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
    borderWidth: scale(2),
    borderColor: appColors.AppBlue,
  },
  secondaryButtonText: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
  },
  slotsContainer: {
    gap: scale(10),
    paddingBottom: scale(8),
  },
  slotBadge: {
    backgroundColor: appColors.AppBlue + '15',
    paddingHorizontal: scale(12),
    paddingVertical: scale(8),
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  slotBadgeSelected: {
    backgroundColor: appColors.AppBlue,
    borderColor: appColors.AppBlue,
  },
  slotDate: {
    fontSize: moderateScale(12),
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
    marginBottom: scale(4),
  },
  slotTime: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
  },
  slotTextSelected: {
    color: appColors.CardBackground,
  },
  bottomPadding: {
    height: scale(30),
  },
});

export default TherapistProfileViewScreen;
