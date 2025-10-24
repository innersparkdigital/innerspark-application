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
        <Icon name={icon} type={iconType} size={20} color={appColors.AppBlue} />
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
                size={100}
                rounded
              />
            ) : (
              <Avatar
                title={therapistProfile.name.split(' ').map(n => n[0]).join('')}
                size={100}
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
            <Icon name="psychology" type="material" size={16} color={appColors.AppBlue} />
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
                <Icon name="check-circle" type="material" size={16} color={appColors.AppGreen} />
                <Text style={styles.sessionTypeText}>{type}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <View style={styles.contactCard}>
            <Icon name="email" type="material" size={20} color={appColors.grey3} />
            <Text style={styles.contactText}>{therapistProfile.email}</Text>
          </View>
          <View style={styles.contactNote}>
            <Icon name="info" type="material" size={16} color={appColors.grey3} />
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
            <Icon name="chat" type="material" size={20} color={appColors.CardBackground} />
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
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: appColors.AppGreen,
    borderWidth: 3,
    borderColor: appColors.CardBackground,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: appColors.CardBackground,
  },
  therapistName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 4,
  },
  credentials: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    marginBottom: 12,
  },
  specialtyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.AppBlue + '15',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
    gap: 6,
  },
  specialtyText: {
    fontSize: 14,
    fontWeight: '600',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
  },
  experienceBadge: {
    backgroundColor: appColors.grey6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  experienceText: {
    fontSize: 12,
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
  },
  section: {
    backgroundColor: appColors.CardBackground,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 12,
  },
  bioText: {
    fontSize: 15,
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
    lineHeight: 22,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: appColors.CardBackground,
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: appColors.AppBlue + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: appColors.grey2,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 15,
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextRegular,
    lineHeight: 20,
  },
  sessionTypesContainer: {
    gap: 10,
  },
  sessionTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sessionTypeText: {
    fontSize: 15,
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextRegular,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.AppLightGray,
    padding: 12,
    borderRadius: 8,
    gap: 10,
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
  },
  contactNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: appColors.AppBlue + '10',
    padding: 12,
    borderRadius: 8,
  },
  contactNoteText: {
    flex: 1,
    fontSize: 13,
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
    lineHeight: 18,
  },
  actionsContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: appColors.AppBlue,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  secondaryButton: {
    flexDirection: 'row',
    backgroundColor: appColors.CardBackground,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: appColors.AppBlue,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
  },
  bottomPadding: {
    height: 30,
  },
});

export default TherapistProfileViewScreen;
