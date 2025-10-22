/**
 * Client Profile Screen - View client details and history
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/themed';
import { appColors, appFonts } from '../../../global/Styles';
import ISGenericHeader from '../../../components/ISGenericHeader';
import ISStatusBar from '../../../components/ISStatusBar';

const THClientProfileScreen = ({ navigation, route }: any) => {
  const { client } = route.params;
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'notes'>('overview');

  // Mock data
  const clientDetails = {
    id: client?.id || '1',
    name: client?.name || 'John Doe',
    avatar: client?.avatar || '👨',
    email: 'john.doe@email.com',
    phone: '+256 784 123 456',
    age: 32,
    gender: 'Male',
    joinedDate: 'January 15, 2024',
    totalSessions: 12,
    upcomingSessions: 2,
    lastSession: '2 days ago',
    status: 'Active',
    emergencyContact: {
      name: 'Jane Doe',
      relationship: 'Spouse',
      phone: '+256 784 987 654',
    },
  };

  const sessions = [
    { id: '1', date: 'Oct 20, 2025', type: 'Individual', duration: '60 min', status: 'Completed', notes: 'Good progress on anxiety management' },
    { id: '2', date: 'Oct 13, 2025', type: 'Individual', duration: '60 min', status: 'Completed', notes: 'Discussed coping strategies' },
    { id: '3', date: 'Oct 6, 2025', type: 'Individual', duration: '60 min', status: 'Completed', notes: 'Initial assessment completed' },
    { id: '4', date: 'Oct 27, 2025', type: 'Individual', duration: '60 min', status: 'Upcoming', notes: '' },
  ];

  const notes = [
    { id: '1', date: 'Oct 20, 2025', title: 'Progress Update', content: 'Client showing significant improvement in managing anxiety symptoms. Recommended continuing current treatment plan.' },
    { id: '2', date: 'Oct 13, 2025', title: 'Coping Strategies', content: 'Introduced breathing exercises and mindfulness techniques. Client receptive to new approaches.' },
    { id: '3', date: 'Oct 6, 2025', title: 'Initial Assessment', content: 'Client presents with generalized anxiety. History of work-related stress. No previous therapy experience.' },
  ];

  const renderOverview = () => (
    <View>
      {/* Contact Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Icon type="material" name="email" size={20} color={appColors.grey3} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{clientDetails.email}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Icon type="material" name="phone" size={20} color={appColors.grey3} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{clientDetails.phone}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Personal Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Icon type="material" name="cake" size={20} color={appColors.grey3} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Age</Text>
              <Text style={styles.infoValue}>{clientDetails.age} years</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Icon type="material" name="person" size={20} color={appColors.grey3} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Gender</Text>
              <Text style={styles.infoValue}>{clientDetails.gender}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Icon type="material" name="event" size={20} color={appColors.grey3} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Client Since</Text>
              <Text style={styles.infoValue}>{clientDetails.joinedDate}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Emergency Contact */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Contact</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Icon type="material" name="contact-emergency" size={20} color={appColors.grey3} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>{clientDetails.emergencyContact.name}</Text>
              <Text style={styles.infoValue}>{clientDetails.emergencyContact.relationship}</Text>
              <Text style={styles.infoValue}>{clientDetails.emergencyContact.phone}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('THScheduleAppointmentScreen', { client: clientDetails })}
          >
            <Icon type="material" name="event" size={24} color={appColors.AppBlue} />
            <Text style={styles.actionText}>Schedule</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('THChatConversationScreen', { client: clientDetails })}
          >
            <Icon type="material" name="chat" size={24} color={appColors.AppGreen} />
            <Text style={styles.actionText}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setActiveTab('notes')}
          >
            <Icon type="material" name="note" size={24} color="#FF9800" />
            <Text style={styles.actionText}>Notes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderSessions = () => (
    <View style={styles.section}>
      {sessions.map((session) => (
        <View key={session.id} style={styles.sessionCard}>
          <View style={styles.sessionHeader}>
            <View style={styles.sessionLeft}>
              <Text style={styles.sessionDate}>{session.date}</Text>
              <Text style={styles.sessionType}>{session.type} • {session.duration}</Text>
            </View>
            <View style={[
              styles.statusBadge,
              session.status === 'Completed' ? styles.statusCompleted : styles.statusUpcoming
            ]}>
              <Text style={[
                styles.statusText,
                session.status === 'Completed' ? styles.statusTextCompleted : styles.statusTextUpcoming
              ]}>
                {session.status}
              </Text>
            </View>
          </View>
          {session.notes ? (
            <Text style={styles.sessionNotes}>{session.notes}</Text>
          ) : null}
        </View>
      ))}
    </View>
  );

  const renderNotes = () => (
    <View style={styles.section}>
      {notes.map((note) => (
        <View key={note.id} style={styles.noteCard}>
          <View style={styles.noteHeader}>
            <Text style={styles.noteTitle}>{note.title}</Text>
            <Text style={styles.noteDate}>{note.date}</Text>
          </View>
          <Text style={styles.noteContent}>{note.content}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ISStatusBar />
      <ISGenericHeader title="Client Profile" navigation={navigation} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Text style={styles.avatar}>{clientDetails.avatar}</Text>
          <Text style={styles.name}>{clientDetails.name}</Text>
          <View style={[styles.statusBadge, styles.statusActive]}>
            <View style={styles.statusDot} />
            <Text style={styles.statusActiveText}>{clientDetails.status}</Text>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{clientDetails.totalSessions}</Text>
            <Text style={styles.statLabel}>Total Sessions</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{clientDetails.upcomingSessions}</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{clientDetails.lastSession}</Text>
            <Text style={styles.statLabel}>Last Session</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'overview' && styles.tabActive]}
            onPress={() => setActiveTab('overview')}
          >
            <Text style={[styles.tabText, activeTab === 'overview' && styles.tabTextActive]}>
              Overview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'sessions' && styles.tabActive]}
            onPress={() => setActiveTab('sessions')}
          >
            <Text style={[styles.tabText, activeTab === 'sessions' && styles.tabTextActive]}>
              Sessions
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'notes' && styles.tabActive]}
            onPress={() => setActiveTab('notes')}
          >
            <Text style={[styles.tabText, activeTab === 'notes' && styles.tabTextActive]}>
              Notes
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'sessions' && renderSessions()}
        {activeTab === 'notes' && renderNotes()}

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
  },
  profileHeader: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 32,
    marginBottom: 16,
  },
  avatar: {
    fontSize: 64,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 8,
  },
  statusActive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.AppGreen + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: appColors.AppGreen,
  },
  statusActiveText: {
    fontSize: 13,
    fontWeight: '600',
    color: appColors.AppGreen,
    fontFamily: appFonts.bodyTextMedium,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    textAlign: 'center',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: appColors.AppBlue,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextMedium,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: appColors.grey2,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    gap: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextMedium,
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextMedium,
  },
  sessionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  sessionLeft: {
    flex: 1,
  },
  sessionDate: {
    fontSize: 15,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 4,
  },
  sessionType: {
    fontSize: 13,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusCompleted: {
    backgroundColor: appColors.AppGreen + '20',
  },
  statusUpcoming: {
    backgroundColor: appColors.AppBlue + '20',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: appFonts.bodyTextMedium,
  },
  statusTextCompleted: {
    color: appColors.AppGreen,
  },
  statusTextUpcoming: {
    color: appColors.AppBlue,
  },
  sessionNotes: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
    lineHeight: 20,
  },
  noteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  noteDate: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
  },
  noteContent: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
    lineHeight: 20,
  },
});

export default THClientProfileScreen;
