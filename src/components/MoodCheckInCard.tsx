/**
 * MoodCheckInCard - Reusable mood check-in component
 * Can be used across different screens for mood tracking
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { appColors, appFonts } from '../global/Styles';

export interface MoodOption {
  id: number;
  name: string;
  emoji: string;
  color: string;
}

interface MoodCheckInCardProps {
  title?: string;
  subtitle?: string;
  moodOptions: MoodOption[];
  selectedMood: MoodOption | null;
  onMoodSelect: (mood: MoodOption) => void;
  containerStyle?: object;
  showNavigationHint?: boolean;
  navigationHintText?: string;
  centerTitle?: boolean;
}

const MoodCheckInCard: React.FC<MoodCheckInCardProps> = ({
  title = 'How are you feeling today?',
  subtitle,
  moodOptions,
  selectedMood,
  onMoodSelect,
  containerStyle,
  showNavigationHint = false,
  navigationHintText = 'Tap a mood to log your daily check-in',
  centerTitle = false,
}) => {
  return (
    <View style={[styles.moodCard, containerStyle]}>
      <View style={styles.headerContainer}>
        <Text style={[styles.sectionTitle, centerTitle && styles.centeredTitle]}>{title}</Text>
        {subtitle && <Text style={[styles.subtitle, centerTitle && styles.centeredText]}>{subtitle}</Text>}
        {showNavigationHint && (
          <Text style={[styles.navigationHint, centerTitle && styles.centeredText]}>{navigationHintText}</Text>
        )}
      </View>
      <View style={styles.moodContainer}>
        {moodOptions.map((mood) => (
          <View key={mood.id} style={styles.moodButtonContainer}>
            <TouchableOpacity
              style={[
                styles.moodButton,
                selectedMood?.id === mood.id && {
                  borderColor: mood.color,
                  borderWidth: 3,
                  backgroundColor: mood.color + '20',
                },
              ]}
              onPress={() => onMoodSelect(mood)}
            >
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
            </TouchableOpacity>
            <Text
              style={[
                styles.moodText,
                { color: mood.color },
                selectedMood?.id === mood.id && { fontWeight: 'bold' },
              ]}
            >
              {mood.name}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  moodCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: appFonts.headerTextBold,
    color: appColors.grey1,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: appFonts.bodyTextRegular,
    color: appColors.grey3,
    marginBottom: 4,
  },
  navigationHint: {
    fontSize: 12,
    fontFamily: appFonts.bodyTextRegular,
    color: appColors.AppBlue,
    fontStyle: 'italic',
  },
  centeredTitle: {
    textAlign: 'center',
  },
  centeredText: {
    textAlign: 'center',
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moodButtonContainer: {
    alignItems: 'center',
    flex: 1,
  },
  moodButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: appColors.AppLightGray,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  moodEmoji: {
    fontSize: 28,
  },
  moodText: {
    fontSize: 12,
    fontFamily: appFonts.headerTextMedium,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default MoodCheckInCard;
