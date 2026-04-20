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
import { getTherapistProfile } from '../../api/therapist/dashboard';
import { resolveSessionType } from '../../utils/appointmentUtils';
import { useSelector } from 'react-redux';
import { useToast } from 'native-base';
import ISAlert, { useISAlert } from '../../components/alerts/ISAlert';
import { bookChatSession } from '../../api/client/messages';
import ISTherapistAvatar from '../../components/ISTherapistAvatar';
import { getAvatarInitials } from '../../utils/textHelpers';

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
      const response = await getTherapistProfile(therapist.partnerId);
      setProfileData(response.data || response);
    } catch (error) {
      console.error('❌ Error fetching therapist profile metadata', error);
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
    id: profileData?.id || profileData?.user_id || therapist?.partnerId || '',
    name: profileData?.firstName && profileData?.lastName
      ? `${profileData.firstName} ${profileData.lastName}`
      : profileData?.name || therapist?.partnerName || 'Unknown Therapist',
    credentials: profileData?.credentials || '',
    avatar: profileData?.avatar || profileData?.profileImage || profileData?.profile_image || therapist?.partnerAvatar,
    specialty: profileData?.specialization || profileData?.specialties || profileData?.specialty || '',
    education: profileData?.education || '',
    location: profileData?.location || '',
    yearsOfExperience: profileData?.yearsOfExperience || profileData?.experience || profileData?.years_of_experience || '0',
    rating: profileData?.rating ? Number(profileData.rating).toFixed(1) : '5.0',
    totalSessions: profileData?.totalSessions || 0,
    bio: profileData?.bio || '',
    approach: profileData?.approach || '',
    languages: profileData?.languages 
      ? (typeof profileData.languages === 'string' ? profileData.languages.split(',').map((l: string) => l.trim()) : profileData.languages) 
      : [],
    availability: profileData?.availability || {},
    email: profileData?.email || therapist?.partnerEmail || '',
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
  
  const renderStatsRow = () => (
    <View style={styles.statsDashboard}>
      <View style={[styles.statBox, { backgroundColor: appColors.AppBlue + '10' }]}>
        <Text style={styles.statNumber}>{therapistProfile.totalSessions}</Text>
        <Text style={styles.statLabel}>Sessions</Text>
      </View>
      <View style={[styles.statBox, { backgroundColor: appColors.AppOrange + '10' }]}>
        <Text style={styles.statNumber}>{therapistProfile.rating}</Text>
        <Text style={styles.statLabel}>Rating</Text>
      </View>
      <View style={[styles.statBox, { backgroundColor: appColors.AppGreen + '10' }]}>
        <Text style={styles.statNumber}>{therapistProfile.yearsOfExperience}</Text>
        <Text style={styles.statLabel}>Exp. Years</Text>
      </View>
    </View>
  );

  /*
  const renderWeeklySchedule = () => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const availability = therapistProfile.availability;
    
    if (!availability || Object.keys(availability).length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weekly Availability</Text>
        <View style={styles.scheduleContainer}>
          {days.map(day => {
            const timeSlots = availability[day];
            return (
              <View key={day} style={styles.scheduleRow}>
                <Text style={styles.dayLabel}>{day.charAt(0).toUpperCase() + day.slice(1)}</Text>
                <View style={styles.timeSlotsContainer}>
                  {timeSlots && timeSlots.length > 0 ? (
                    timeSlots.map((slot: string, idx: number) => (
                      <Text key={idx} style={styles.timeText}>{slot}</Text>
                    ))
                  ) : (
                    <Text style={[styles.timeText, { color: appColors.grey4 }]}>Offline</Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  };
  */

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
            {/* Profile Header Hero */}
            <View style={styles.headerCard}>
              <View style={styles.avatarContainer}>
                <ISTherapistAvatar
                  therapistId={therapistProfile.id}
                  initialAvatar={therapistProfile.avatar}
                  size={scale(120)}
                  rounded
                  title={getAvatarInitials(therapistProfile.name)}
                  titleStyle={styles.avatarText}
                  containerStyle={styles.avatarShadow}
                />
              </View>
            </View>

            <View style={styles.contentOverlay}>
              <Text style={styles.therapistName}>{therapistProfile.name}</Text>
              {!!therapistProfile.credentials && <Text style={styles.credentials}>{therapistProfile.credentials}</Text>}

              {/* Stats Row */}
              {renderStatsRow()}

              {/* Professional Insights Section */}
              <View style={styles.insightsCard}>
                <Text style={styles.sectionTitle}>Professional Insights</Text>
                {!!therapistProfile.specialty && renderInfoCard('psychology', 'Specialization', therapistProfile.specialty)}
                {!!therapistProfile.education && renderInfoCard('school', 'Education', therapistProfile.education)}
                {!!therapistProfile.location && renderInfoCard('location-on', 'Location', therapistProfile.location)}
              </View>

              {/* About Section */}
            {!!therapistProfile.bio && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>About</Text>
                <Text style={styles.bioText}>{therapistProfile.bio}</Text>
              </View>
            )}

            {/* Weekly Schedule */}
            {/* {renderWeeklySchedule()} */}

            {/* Languages */}
            {therapistProfile.languages?.length > 0 && renderInfoCard('language', 'Languages', therapistProfile.languages.join(', '))}

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
                style={styles.pillButton}
                onPress={() => navigation.goBack()}
              >
                <Icon name="chat" type="material" size={moderateScale(20)} color={appColors.CardBackground} />
                <Text style={styles.pillButtonText}>Back to Chat</Text>
              </TouchableOpacity>
            </View>
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
    backgroundColor: appColors.AppBlue,
    height: scale(140),
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: scale(30),
    borderBottomRightRadius: scale(30),
  },
  avatarContainer: {
    position: 'absolute',
    bottom: scale(-50),
    zIndex: 10,
  },
  avatarShadow: {
    borderWidth: scale(6),
    borderColor: appColors.CardBackground,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(4) },
    shadowOpacity: 0.2,
    shadowRadius: scale(6),
  },
  contentOverlay: {
    marginTop: scale(60),
    paddingHorizontal: scale(16),
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
  statsDashboard: {
    flexDirection: 'row',
    marginBottom: scale(20),
    gap: scale(10),
    backgroundColor: appColors.CardBackground,
    padding: scale(12),
    borderRadius: scale(16),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statBox: {
    flex: 1,
    borderRadius: scale(12),
    paddingVertical: scale(14),
    alignItems: 'center',
  },
  statNumber: {
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  statLabel: {
    fontSize: moderateScale(11),
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
    marginTop: scale(2),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  insightsCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(20),
    padding: scale(16),
    marginBottom: scale(20),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  scheduleContainer: {
    backgroundColor: appColors.grey6,
    borderRadius: scale(12),
    padding: scale(12),
    gap: scale(10),
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: appColors.grey2,
    fontFamily: appFonts.headerTextBold,
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    gap: scale(6),
  },
  timeText: {
    fontSize: moderateScale(13),
    color: appColors.AppBlue,
    fontFamily: appFonts.bodyTextMedium,
    fontWeight: '600',
  },
  pillButton: {
    flexDirection: 'row',
    backgroundColor: appColors.AppBlue,
    paddingVertical: scale(16),
    borderRadius: scale(30),
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(10),
    elevation: 6,
    shadowColor: appColors.AppBlue,
    shadowOffset: { width: 0, height: scale(4) },
    shadowOpacity: 0.3,
    shadowRadius: scale(8),
    marginBottom: scale(20),
  },
  pillButtonText: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
    letterSpacing: 0.5,
  },
  section: {
    backgroundColor: appColors.CardBackground,
    padding: scale(20),
    marginBottom: scale(20),
    borderRadius: scale(20),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: scale(16),
  },
  bioText: {
    fontSize: moderateScale(15),
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
    lineHeight: scale(24),
  },
  infoCard: {
    flexDirection: 'row',
    paddingVertical: scale(12),
    borderBottomWidth: 1,
    borderBottomColor: appColors.grey6,
  },
  infoIconContainer: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(12),
    backgroundColor: appColors.grey6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(16),
  },
  infoContent: {
    flex: 1,
    justifyContent: 'center',
  },
  infoTitle: {
    fontSize: moderateScale(12),
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    marginBottom: scale(2),
  },
  infoText: {
    fontSize: moderateScale(15),
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextMedium,
    fontWeight: '600',
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
