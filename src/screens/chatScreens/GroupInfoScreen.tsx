/**
 * Group Info Screen - For clients to view group information
 * Accessible from ClientGroupChatScreen via info icon
 * Privacy-focused: No member names or personal info
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/base';
import { appColors, appFonts } from '../../global/Styles';
import { scale, moderateScale } from '../../global/Scaling';
import ISGenericHeader from '../../components/ISGenericHeader';
import ISStatusBar from '../../components/ISStatusBar';
import { useSelector } from 'react-redux';
import { getGroupById } from '../../api/client/groups';
import { decodeHTMLEntities } from '../../utils/textHelpers';

interface GroupInfoScreenProps {
  navigation: any;
  route: any;
}

const GroupInfoScreen: React.FC<GroupInfoScreenProps> = ({ navigation, route }) => {
  const { group, groupId, groupName, groupDescription, memberCount } = route.params || {};
  const userId = useSelector((state: any) => state.userData.userDetails.userId);

  const resolvedGroupId = group?.id || groupId;
  const [groupInfo, setGroupInfo] = useState({
    name: decodeHTMLEntities(group?.name || groupName || 'Support Group'),
    icon: group?.icon || group?.groupIcon || '\uD83D\uDCAC',
    description: decodeHTMLEntities(group?.description || groupDescription || ''),
    type: 'Therapy Group',
    facilitator: '',
    memberCount: group?.memberCount || memberCount || 0,
    createdDate: '',
    meetingSchedule: '',
    duration: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!resolvedGroupId) {
      setIsLoading(false);
      return;
    }
    const fetchDetails = async () => {
      try {
        const response = await getGroupById(resolvedGroupId, userId);
        const data = response.group || response.data || {};
        setGroupInfo(prev => ({
          ...prev,
          name: decodeHTMLEntities(data.name || prev.name),
          description: decodeHTMLEntities(data.description || prev.description),
          facilitator: decodeHTMLEntities(data.therapistName || data.facilitator || data.facilitatorName || ''),
          memberCount: data.memberCount || data.member_count || data.members || prev.memberCount,
          createdDate: data.createdAt || data.created_at || data.createdDate || '',
          meetingSchedule: data.meetingSchedule || data.meeting_schedule || data.schedule || '',
          duration: data.duration ? `${data.duration} minutes per session` : '',
          type: data.type || data.groupType || prev.type,
        }));
      } catch (err) {
        console.warn('GroupInfoScreen: Could not fetch group details', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [resolvedGroupId]);

  const guidelines = [
    'Respect confidentiality \u2014 what is shared in the group stays in the group',
    'Be respectful and non-judgmental of others',
    'Allow everyone a chance to speak',
    'Arrive on time and attend regularly',
    'Turn off notifications during sessions',
    'Share openly but respect your own boundaries',
  ];

  const renderInfoCard = (icon: string, title: string, content: string, iconType: string = 'material') => {
    if (!content) return null; // Don't render cards with empty content
    return (
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
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ISStatusBar />
      <ISGenericHeader
        title="Group Information"
        hasLightBackground={false}
        navigation={navigation}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Group Header */}
        <View style={styles.headerCard}>
          <View style={styles.iconContainer}>
            <Text style={styles.groupIcon}>{groupInfo.icon}</Text>
          </View>
          <Text style={styles.groupName}>{groupInfo.name}</Text>
          <Text style={styles.groupType}>{groupInfo.type}</Text>
          {!!groupInfo.description && (
            <Text style={styles.groupDescription}>{groupInfo.description}</Text>
          )}
        </View>

        <View style={styles.privacyCard}>
          <View style={styles.privacyHeader}>
            <Icon name="lock" type="material" size={moderateScale(20)} color={appColors.AppBlue} />
            <Text style={styles.privacyTitle}>Privacy & Protection</Text>
          </View>
          <Text style={styles.privacyText}>
            Member identities are protected for privacy. All group members appear as "Group Member"
            to maintain confidentiality and create a safe, judgment-free space.
          </Text>
          <View style={styles.privacyFeatures}>
            <View style={styles.privacyFeature}>
              <Icon name="check-circle" type="material" size={moderateScale(16)} color={appColors.AppGreen} />
              <Text style={styles.privacyFeatureText}>Anonymous participation</Text>
            </View>
            <View style={styles.privacyFeature}>
              <Icon name="check-circle" type="material" size={moderateScale(16)} color={appColors.AppGreen} />
              <Text style={styles.privacyFeatureText}>Confidential discussions</Text>
            </View>
            <View style={styles.privacyFeature}>
              <Icon name="check-circle" type="material" size={moderateScale(16)} color={appColors.AppGreen} />
              <Text style={styles.privacyFeatureText}>Safe environment</Text>
            </View>
          </View>
        </View>

        {isLoading ? (
          <View style={{ alignItems: 'center', paddingVertical: scale(24) }}>
            <ActivityIndicator size="small" color={appColors.AppBlue} />
          </View>
        ) : (
          <>
            {renderInfoCard('person', 'Facilitator', groupInfo.facilitator || 'Not specified')}
            {renderInfoCard('people', 'Group Size', `${groupInfo.memberCount} members`)}
            {renderInfoCard('schedule', 'Meeting Schedule', groupInfo.meetingSchedule || 'Not specified')}
            {renderInfoCard('access-time', 'Session Duration', groupInfo.duration || 'Not specified')}
            {!!groupInfo.createdDate && renderInfoCard('calendar-today', 'Started', groupInfo.createdDate)}
          </>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Group Guidelines</Text>
          <View style={styles.guidelinesContainer}>
            {guidelines.map((guideline, index) => (
              <View key={index} style={styles.guidelineItem}>
                <View style={styles.guidelineNumber}>
                  <Text style={styles.guidelineNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.guidelineText}>{guideline}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.supportCard}>
          <Icon name="info" type="material" size={moderateScale(20)} color={appColors.grey3} />
          <Text style={styles.supportText}>
            If you have questions or concerns about the group, please contact your facilitator
            through the chat or schedule a private session.
          </Text>
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
  iconContainer: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(40),
    backgroundColor: appColors.AppBlue + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scale(16),
  },
  groupIcon: {
    fontSize: moderateScale(40),
  },
  groupName: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: scale(4),
    textAlign: 'center',
  },
  groupType: {
    fontSize: moderateScale(14),
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
    marginBottom: scale(12),
  },
  groupDescription: {
    fontSize: moderateScale(15),
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
    textAlign: 'center',
    lineHeight: moderateScale(22),
  },
  privacyCard: {
    backgroundColor: appColors.AppBlue + '10',
    padding: scale(16),
    marginHorizontal: scale(16),
    marginBottom: scale(16),
    borderRadius: scale(12),
    borderLeftWidth: scale(4),
    borderLeftColor: appColors.AppBlue,
  },
  privacyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(12),
    gap: scale(8),
  },
  privacyTitle: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  privacyText: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
    lineHeight: moderateScale(20),
    marginBottom: scale(12),
  },
  privacyFeatures: {
    gap: scale(8),
  },
  privacyFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  privacyFeatureText: {
    fontSize: moderateScale(14),
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextRegular,
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
    lineHeight: moderateScale(20),
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
    marginBottom: scale(16),
  },
  focusContainer: {
    gap: scale(12),
  },
  focusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  focusText: {
    fontSize: moderateScale(15),
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextRegular,
    flex: 1,
  },
  guidelinesContainer: {
    gap: scale(16),
  },
  guidelineItem: {
    flexDirection: 'row',
    gap: scale(12),
  },
  guidelineNumber: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    backgroundColor: appColors.AppBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guidelineNumberText: {
    fontSize: moderateScale(12),
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  guidelineText: {
    flex: 1,
    fontSize: moderateScale(14),
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextRegular,
    lineHeight: moderateScale(20),
  },
  supportCard: {
    flexDirection: 'row',
    backgroundColor: appColors.grey6,
    padding: scale(16),
    marginHorizontal: scale(16),
    borderRadius: scale(12),
    gap: scale(12),
    alignItems: 'flex-start',
  },
  supportText: {
    flex: 1,
    fontSize: moderateScale(13),
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
    lineHeight: moderateScale(18),
  },
  bottomPadding: {
    height: scale(30),
  },
});

export default GroupInfoScreen;

