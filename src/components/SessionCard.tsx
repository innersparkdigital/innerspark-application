/**
 * SessionCard - Enhanced session card with status badges and urgency indicators
 * Used in horizontal scroll for multiple sessions
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Icon } from '@rneui/base';
import { appColors, appFonts } from '../global/Styles';
import { scale, moderateScale } from '../global/Scaling';
import { getImageSource, FALLBACK_IMAGES } from '../utils/imageHelpers';

interface Session {
  id: number | string;
  therapistName: string;
  specialty: string;
  date: string;
  time: string;
  duration: string | number;
  type: string;
  avatar?: any;
  therapistImage?: string | null;
  status?: 'confirmed' | 'pending' | 'cancelled' | 'upcoming';
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
      case 'confirmed':
      case 'upcoming': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'cancelled': return '#F44336';
      default: return appColors.grey3;
    }
  };

  const statusColor = getStatusColor(session.status);
  const therapistAvatar = getImageSource(session.therapistImage || session.avatar, FALLBACK_IMAGES.avatar);

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        compact && styles.compactContainer,
        session.urgent && styles.urgentContainer
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Premium Header with Background Accent */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image 
            source={therapistAvatar} 
            style={styles.avatarImage}
            resizeMode="cover"
          />
          {/* Status Dot Ring */}
          <View style={[styles.avatarRing, { borderColor: statusColor }]} />
        </View>
        
        <View style={styles.sessionInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.therapistName} numberOfLines={1}>
              {session.therapistName}
            </Text>
            <View style={[styles.typeBadge, { backgroundColor: session.type === 'Video Call' ? '#4CAF5020' : '#FF980020' }]}>
              <Icon
                name={session.type === 'Video Call' ? 'videocam' : 'location-on'}
                type="material"
                color={session.type === 'Video Call' ? '#4CAF50' : '#FF9800'}
                size={moderateScale(12)}
              />
            </View>
          </View>
          <Text style={styles.sessionSpecialty} numberOfLines={1}>
            {session.specialty || 'Professional Therapist'}
          </Text>
        </View>

        {/* Floating Urgency/Status Badge */}
        <View style={[styles.floatingBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.floatingBadgeText}>
            {session.urgent ? 'Starting Soon' : (session.status?.toUpperCase() || 'UPCOMING')}
          </Text>
        </View>
      </View>

      {/* Decorative Divider */}
      <View style={styles.divider} />

      {/* Details Section - World Class Layout */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <View style={styles.iconCircle}>
            <Icon name="event" type="material" color={appColors.CardBackground} size={moderateScale(14)} />
          </View>
          <View>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{session.date}</Text>
          </View>
        </View>

        <View style={styles.detailItem}>
          <View style={styles.iconCircle}>
            <Icon name="schedule" type="material" color={appColors.CardBackground} size={moderateScale(14)} />
          </View>
          <View>
            <Text style={styles.detailLabel}>Time</Text>
            <Text style={styles.detailValue}>{session.time}</Text>
          </View>
        </View>

        <View style={styles.detailItem}>
          <View style={styles.iconCircle}>
            <Icon name="timer" type="material" color={appColors.CardBackground} size={moderateScale(14)} />
          </View>
          <View>
            <Text style={styles.detailLabel}>Duration</Text>
            <Text style={styles.detailValue}>{session.duration} min</Text>
          </View>
        </View>
      </View>

      {/* Modern Join Action */}
      {!compact && onJoin && (
        <TouchableOpacity 
          style={styles.joinButton}
          onPress={onJoin}
        >
          <Text style={styles.joinButtonText}>
            {session.date === 'Today' ? 'Join Session' : 'View Details'}
          </Text>
          <Icon name="chevron-right" type="material" color={appColors.CardBackground} size={moderateScale(18)} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: appColors.AppBlue, // Premium brand background
    borderRadius: moderateScale(24),
    padding: moderateScale(20),
    marginRight: scale(16),
    width: moderateScale(310),
    elevation: 8,
    shadowColor: appColors.AppBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    overflow: 'hidden',
  },
  compactContainer: {
    width: moderateScale(290),
    padding: moderateScale(16),
  },
  urgentContainer: {
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(20),
    position: 'relative',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: scale(12),
  },
  avatarImage: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  avatarRing: {
    position: 'absolute',
    top: -moderateScale(2),
    left: -moderateScale(2),
    right: -moderateScale(2),
    bottom: -moderateScale(2),
    borderRadius: moderateScale(30),
    borderWidth: 2,
    opacity: 0.6,
  },
  sessionInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(2),
  },
  therapistName: {
    fontSize: moderateScale(17),
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
    marginRight: scale(6),
  },
  typeBadge: {
    padding: scale(3),
    borderRadius: moderateScale(6),
  },
  sessionSpecialty: {
    fontSize: moderateScale(13),
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: appFonts.headerTextRegular,
  },
  floatingBadge: {
    position: 'absolute',
    top: -moderateScale(5),
    right: -moderateScale(5),
    paddingVertical: scale(4),
    paddingHorizontal: scale(10),
    borderRadius: moderateScale(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  floatingBadgeText: {
    fontSize: moderateScale(9),
    fontWeight: 'bold',
    color: '#FFF',
    fontFamily: appFonts.headerTextBold,
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginBottom: scale(20),
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(20),
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: moderateScale(14),
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(8),
  },
  detailLabel: {
    fontSize: moderateScale(10),
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: appFonts.headerTextRegular,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: moderateScale(12),
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  joinButton: {
    flexDirection: 'row',
    backgroundColor: appColors.CardBackground,
    paddingVertical: scale(12),
    paddingHorizontal: scale(16),
    borderRadius: moderateScale(14),
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  joinButtonText: {
    fontSize: moderateScale(15),
    fontWeight: '700',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
    marginRight: scale(6),
  },
});

export default SessionCard;
