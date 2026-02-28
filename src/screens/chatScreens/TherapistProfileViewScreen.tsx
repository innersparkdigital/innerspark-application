/**
 * Therapist Profile View Screen - For clients to view their therapist's profile
 * Accessible from DMThreadScreen via info icon
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Icon } from '@rneui/base';
import { appColors, appFonts } from '../../global/Styles';
import { scale, moderateScale } from '../../global/Scaling';
import ISGenericHeader from '../../components/ISGenericHeader';
import ISStatusBar from '../../components/ISStatusBar';

interface TherapistProfileViewScreenProps {
  navigation: any;
  route: any;
}

const TherapistProfileViewScreen: React.FC<TherapistProfileViewScreenProps> = ({ navigation, route }) => {
  const { therapist } = route.params || {};

  // Mock therapist profile data
  const therapistProfile = {
    id: therapist?.partnerId || 'therapist_1',
    name: therapist?.partnerName || 'Dr. Sarah Johnson',
    credentials: 'PhD, Licensed Clinical Psychologist',
    avatar: therapist?.partnerAvatar,
    specialty: 'Anxiety & Depression',
    yearsOfExperience: 12,
    bio: 'I specialize in helping individuals overcome anxiety and depression through evidence-based therapeutic approaches. My practice focuses on creating a safe, non-judgmental space where clients can explore their thoughts and feelings.',
    approach: 'Cognitive Behavioral Therapy (CBT), Mindfulness-Based Therapy',
    languages: ['English', 'Spanish'],
    availability: 'Monday - Friday, 9:00 AM - 6:00 PM',
    responseTime: 'Usually responds within 2-4 hours',
    isOnline: therapist?.isOnline || false,
    email: therapist?.partnerEmail || 'sarah.johnson@innerspark.com',
    sessionTypes: ['Individual Therapy', 'Group Therapy', 'Online Sessions'],
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
        {/* Profile Header */}
        <View style={styles.headerCard}>
          <View style={styles.avatarContainer}>
            {therapistProfile.avatar ? (
              <Avatar
                source={therapistProfile.avatar}
                size={scale(100)}
                rounded
              />
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
          <Text style={styles.credentials}>{therapistProfile.credentials}</Text>

          <View style={styles.specialtyBadge}>
            <Icon name="psychology" type="material" size={moderateScale(16)} color={appColors.AppBlue} />
            <Text style={styles.specialtyText}>{therapistProfile.specialty}</Text>
          </View>

          <View style={styles.experienceBadge}>
            <Text style={styles.experienceText}>
              {therapistProfile.yearsOfExperience} years of experience
            </Text>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bioText}>{therapistProfile.bio}</Text>
        </View>

        {/* Approach */}
        {renderInfoCard(
          'lightbulb',
          'Therapeutic Approach',
          therapistProfile.approach
        )}

        {/* Languages */}
        {renderInfoCard(
          'language',
          'Languages',
          therapistProfile.languages.join(', ')
        )}

        {/* Availability */}
        {renderInfoCard(
          'schedule',
          'Availability',
          therapistProfile.availability
        )}

        {/* Response Time */}
        {renderInfoCard(
          'access-time',
          'Response Time',
          therapistProfile.responseTime
        )}

        {/* Session Types */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session Types</Text>
          <View style={styles.sessionTypesContainer}>
            {therapistProfile.sessionTypes.map((type, index) => (
              <View key={index} style={styles.sessionTypeBadge}>
                <Icon name="check-circle" type="material" size={moderateScale(16)} color={appColors.AppGreen} />
                <Text style={styles.sessionTypeText}>{type}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Contact Info */}
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

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.AppLightGray,
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
  bottomPadding: {
    height: scale(30),
  },
});

export default TherapistProfileViewScreen;
