/**
 * SessionCard - Enhanced session card with status badges and urgency indicators
 * Used in horizontal scroll for multiple sessions
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Icon } from '@rneui/base';
import { appColors, appFonts } from '../global/Styles';

interface Session {
  id: number | string;
  therapistName: string;
  specialty: string;
  date: string;
  time: string;
  duration: string;
  type: string;
  avatar?: any;
  status?: 'confirmed' | 'pending' | 'cancelled';
  urgent?: boolean;
}

interface SessionCardProps {
  session: Session;
  onPress?: () => void;
  onJoin?: () => void;
  compact?: boolean;
}

const SessionCard: React.FC<SessionCardProps> = ({ 
  session, 
  onPress, 
  onJoin,
  compact = false 
}) => {
  const getStatusColor = (status?: string) => {
    switch(status) {
      case 'confirmed': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'cancelled': return '#F44336';
      default: return appColors.grey3;
    }
  };

  const getStatusText = (status?: string) => {
    switch(status) {
      case 'confirmed': return 'Confirmed';
      case 'pending': return 'Pending';
      case 'cancelled': return 'Cancelled';
      default: return '';
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        compact && styles.compactContainer,
        session.urgent && styles.urgentContainer
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Urgent Badge */}
      {session.urgent && (
        <View style={styles.urgentBadge}>
          <Icon name="schedule" type="material" color="#fff" size={14} />
          <Text style={styles.urgentText}>Starting Soon</Text>
        </View>
      )}

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.therapistAvatar}>
          {session.avatar ? (
            <Image 
              source={session.avatar} 
              style={styles.avatarImage}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.avatarText}>
              {session.therapistName.split(' ').map(n => n[0]).join('')}
            </Text>
          )}
        </View>
        
        <View style={styles.sessionInfo}>
          <Text style={styles.therapistName} numberOfLines={1}>
            {session.therapistName}
          </Text>
          <Text style={styles.sessionSpecialty} numberOfLines={1}>
            {session.specialty}
          </Text>
        </View>
        
        <View style={styles.sessionType}>
          <Icon
            name={session.type === 'Video Call' ? 'videocam' : 'location-on'}
            type="material"
            color={session.type === 'Video Call' ? '#4CAF50' : '#FF9800'}
            size={20}
          />
        </View>
      </View>

      {/* Details */}
      <View style={styles.details}>
        <View style={styles.timeRow}>
          <Icon name="schedule" type="material" color={appColors.grey3} size={16} />
          <Text style={styles.dateTime}>
            {session.date} at {session.time}
          </Text>
        </View>
        
        <View style={styles.timeRow}>
          <Icon name="timer" type="material" color={appColors.grey3} size={16} />
          <Text style={styles.duration}>{session.duration}</Text>
        </View>
      </View>

      {/* Status Badge */}
      {session.status && (
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(session.status) + '20' }]}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(session.status) }]} />
          <Text style={[styles.statusText, { color: getStatusColor(session.status) }]}>
            {getStatusText(session.status)}
          </Text>
        </View>
      )}

      {/* Action Button */}
      {!compact && onJoin && (
        <TouchableOpacity 
          style={styles.joinButton}
          onPress={onJoin}
        >
          <Text style={styles.joinButtonText}>
            {session.date === 'Today' ? 'Join Now' : 'View Details'}
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: 300,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  compactContainer: {
    width: 280,
    padding: 14,
  },
  urgentContainer: {
    borderWidth: 2,
    borderColor: '#FF9800',
  },
  urgentBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    backgroundColor: '#FF9800',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
    zIndex: 1,
  },
  urgentText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 4,
    fontFamily: appFonts.headerTextBold,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  therapistAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: appColors.AppBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  sessionInfo: {
    flex: 1,
  },
  therapistName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 2,
  },
  sessionSpecialty: {
    fontSize: 13,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
  },
  sessionType: {
    marginLeft: 8,
  },
  details: {
    marginBottom: 12,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  dateTime: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    marginLeft: 8,
  },
  duration: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    marginLeft: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: appFonts.headerTextSemiBold,
  },
  joinButton: {
    backgroundColor: appColors.AppBlue,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  joinButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextSemiBold,
  },
});

export default SessionCard;
