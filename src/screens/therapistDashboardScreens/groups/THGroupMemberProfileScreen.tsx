/**
 * Group Member Profile Screen - Basic profile info for group members
 * No notes or chat features - just basic information
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/themed';
import { appColors, appFonts } from '../../../global/Styles';
import ISGenericHeader from '../../../components/ISGenericHeader';
import ISStatusBar from '../../../components/ISStatusBar';

const THGroupMemberProfileScreen = ({ navigation, route }: any) => {
  const { member } = route.params || {};

  return (
    <SafeAreaView style={styles.container}>
      <ISStatusBar />
      <ISGenericHeader title="Member Profile" navigation={navigation} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Member Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLargeText}>{member?.avatar || '👤'}</Text>
          </View>
          <Text style={styles.memberName}>{member?.name || 'Member'}</Text>
          
          {member?.role === 'moderator' && (
            <View style={styles.moderatorBadge}>
              <Icon type="material" name="shield" size={16} color={appColors.AppBlue} />
              <Text style={styles.moderatorBadgeText}>Moderator</Text>
            </View>
          )}

          <View style={styles.statusBadge}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor:
                    member?.status === 'active'
                      ? appColors.AppGreen
                      : member?.status === 'muted'
                      ? '#FF9800'
                      : appColors.grey3,
                },
              ]}
            />
            <Text style={styles.statusText}>
              {member?.status === 'active'
                ? 'Active'
                : member?.status === 'muted'
                ? 'Muted'
                : 'Inactive'}
            </Text>
          </View>
        </View>

        {/* Member Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Icon type="material" name="event" size={24} color={appColors.AppBlue} />
            <Text style={styles.statValue}>{member?.attendance || '0%'}</Text>
            <Text style={styles.statLabel}>Attendance</Text>
          </View>

          <View style={styles.statCard}>
            <Icon type="material" name="calendar-today" size={24} color={appColors.AppGreen} />
            <Text style={styles.statValue}>{member?.joinedDate || 'N/A'}</Text>
            <Text style={styles.statLabel}>Joined</Text>
          </View>

          <View style={styles.statCard}>
            <Icon type="material" name="access-time" size={24} color="#FF9800" />
            <Text style={styles.statValue}>{member?.lastActive || 'N/A'}</Text>
            <Text style={styles.statLabel}>Last Active</Text>
          </View>
        </View>

        {/* Basic Information Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Basic Information</Text>

          <View style={styles.infoRow}>
            <Icon type="material" name="person" size={20} color={appColors.grey3} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>{member?.name || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon type="material" name="shield" size={20} color={appColors.grey3} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Role</Text>
              <Text style={styles.infoValue}>
                {member?.role === 'moderator' ? 'Moderator' : 'Member'}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon type="material" name="info" size={20} color={appColors.grey3} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Status</Text>
              <Text style={styles.infoValue}>
                {member?.status === 'active'
                  ? 'Active'
                  : member?.status === 'muted'
                  ? 'Muted (5 min)'
                  : 'Inactive'}
              </Text>
            </View>
          </View>
        </View>

        {/* Group Activity Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Group Activity</Text>

          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Icon type="material" name="event" size={20} color={appColors.AppBlue} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Attendance Rate</Text>
              <Text style={styles.activityDescription}>
                {member?.attendance || '0%'} of group sessions attended
              </Text>
            </View>
          </View>

          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Icon type="material" name="calendar-today" size={20} color={appColors.AppGreen} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Member Since</Text>
              <Text style={styles.activityDescription}>
                Joined the group in {member?.joinedDate || 'N/A'}
              </Text>
            </View>
          </View>

          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Icon type="material" name="access-time" size={20} color="#FF9800" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Last Active</Text>
              <Text style={styles.activityDescription}>
                Last seen {member?.lastActive || 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {/* Info Notice */}
        <View style={styles.noticeCard}>
          <Icon type="material" name="info" size={20} color={appColors.AppBlue} />
          <Text style={styles.noticeText}>
            This is a group member profile. For full client details and therapy notes, please use
            the individual chat system.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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
    padding: 16,
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: appColors.AppLightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarLargeText: {
    fontSize: 48,
  },
  memberName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 8,
  },
  moderatorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
    marginBottom: 8,
  },
  moderatorBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: appColors.AppBlue,
    fontFamily: appFonts.bodyTextMedium,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: appColors.grey6,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextMedium,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: appColors.grey6,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: appColors.AppLightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextMedium,
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 13,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
  },
  noticeCard: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginBottom: 16,
  },
  noticeText: {
    flex: 1,
    fontSize: 13,
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
    lineHeight: 18,
  },
});

export default THGroupMemberProfileScreen;
