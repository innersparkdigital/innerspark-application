/**
 * TodayMoodSummaryCard - Shows completed mood check-in summary
 * Displays after user has logged their mood for the day
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from '@rneui/base';
import { appColors, appFonts } from '../global/Styles';

interface TodayMoodSummaryCardProps {
  mood: string;
  emoji: string;
  note: string;
  pointsEarned: number;
  timestamp: string;
  onPress: () => void;
  containerStyle?: object;
  // Optional display controls
  showReflection?: boolean;
  showPoints?: boolean;
  showDetailsButton?: boolean;
  compact?: boolean; // Compact mode for HomeScreen
}

const TodayMoodSummaryCard: React.FC<TodayMoodSummaryCardProps> = ({
  mood,
  emoji,
  note,
  pointsEarned,
  timestamp,
  onPress,
  containerStyle,
  showReflection = true,
  showPoints = true,
  showDetailsButton = true,
  compact = false,
}) => {
  return (
    <TouchableOpacity 
      style={[styles.card, containerStyle]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Header with checkmark */}
      <View style={styles.header}>
        <Text style={styles.title}>Your mood today</Text>
        <Icon name="check-circle" type="material" color="#4CAF50" size={24} />
      </View>

      {/* Mood Display */}
      <View style={styles.moodDisplay}>
        <Text style={styles.emoji}>{emoji}</Text>
        <View style={styles.moodInfo}>
          <Text style={styles.moodName}>Feeling {mood}</Text>
          <Text style={styles.timestamp}>{timestamp}</Text>
        </View>
      </View>

      {/* Note Preview - Conditional */}
      {showReflection && note && (
        <View style={styles.noteContainer}>
          <Text style={styles.noteLabel}>Your reflection:</Text>
          <Text style={styles.noteText} numberOfLines={compact ? 1 : 2}>
            "{note}"
          </Text>
        </View>
      )}

      {/* Points Earned - Conditional */}
      {showPoints && (
        <View style={styles.pointsContainer}>
          <Icon name="stars" type="material" color="#FFD700" size={20} />
          <Text style={styles.pointsText}>+{pointsEarned} points earned</Text>
        </View>
      )}

      {/* View Details Button - Conditional */}
      {showDetailsButton && (
        <View style={styles.footer}>
          <Text style={styles.viewDetailsText}>View Details</Text>
          <Icon name="chevron-right" type="material" color={appColors.AppBlue} size={20} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  moodDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: appColors.AppLightGray,
    borderRadius: 12,
  },
  emoji: {
    fontSize: 40,
    marginRight: 16,
  },
  moodInfo: {
    flex: 1,
  },
  moodName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 13,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
  },
  noteContainer: {
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: appColors.AppBlue,
  },
  noteLabel: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginBottom: 4,
  },
  noteText: {
    fontSize: 14,
    color: appColors.grey1,
    fontFamily: appFonts.headerTextRegular,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E65100',
    fontFamily: appFonts.headerTextBold,
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: appColors.grey5,
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '600',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
    marginRight: 4,
  },
});

export default TodayMoodSummaryCard;
