/**
 * Today Mood Screen - Daily mood check-in with streak milestones
 */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { scale, moderateScale } from '../../global/Scaling';
import { useToast } from 'native-base';
import { NavigationProp } from '@react-navigation/native';
import MoodCheckInCard from '../../components/MoodCheckInCard';
import { moodOptions as globalMoodOptions } from '../../global/Data';
import { selectHasCheckedInToday, selectTodayMoodData, selectExtendedMoodStats, selectMoodSubmitting } from '../../features/mood/moodSlice';
import { saveMoodCheckIn } from '../../utils/moodCheckInManager';
import ISAlert, { useISAlert } from '../../components/alerts/ISAlert';

interface MoodEntry {
  id: string;
  date: string;
  moodValue: number;
  moodEmoji: string;
  moodLabel: string;
  note: string;
  timestamp: string;
  pointsEarned: number;
}

interface TodayMoodScreenProps {
  navigation: NavigationProp<any>;
  route?: any;
}

const TodayMoodScreen: React.FC<TodayMoodScreenProps> = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const alert = useISAlert();
  const preSelectedMood = route?.params?.preSelectedMood;
  const [selectedMood, setSelectedMood] = useState<number | null>(preSelectedMood?.id || null);
  const [moodNote, setMoodNote] = useState('');
  const [selectedMoodObj, setSelectedMoodObj] = useState<any>(preSelectedMood || null);
  const [isTypingReflection, setIsTypingReflection] = useState(false);

  // Get mood data from Redux
  const hasCheckedInToday = useSelector(selectHasCheckedInToday);
  const todayEntry = useSelector(selectTodayMoodData);
  const { currentStreak, totalPoints, milestonesReached } = useSelector(selectExtendedMoodStats);
  const isSubmitting = useSelector(selectMoodSubmitting);
  const userDetails = useSelector((state: any) => state.userData.userDetails);

  // Mood-specific reflection prompts
  const reflectionPromptsByMood: { [key: number]: string[] } = {
    1: [ // Great
      "What made today so wonderful?",
      "What are you most grateful for right now?",
      "How can you carry this positive energy forward?",
      "What accomplishment are you proud of today?",
    ],
    2: [ // Good
      "What positive moments stood out today?",
      "What brought a smile to your face?",
      "How did you take care of yourself today?",
      "What are you looking forward to?",
    ],
    3: [ // Okay
      "What's on your mind right now?",
      "What would make today feel better?",
      "How are you taking care of yourself?",
      "What small win can you celebrate today?",
    ],
    4: [ // Bad
      "What's been challenging for you today?",
      "What support do you need right now?",
      "How can you be kind to yourself today?",
      "What's one thing that might help you feel better?",
    ],
    5: [ // Terrible
      "What's weighing on you right now?",
      "Who can you reach out to for support?",
      "What do you need most in this moment?",
      "Remember: This feeling is temporary. What helps you cope?",
    ],
  };

  const [currentPrompt, setCurrentPrompt] = useState("What's on your mind today?");

  // MVP: Streak milestones (7, 14, 30 days)
  const MILESTONES = [7, 14, 30];
  const nextMilestone = MILESTONES.find(m => m > currentStreak) || 30;
  const streakProgressPercent = Math.max(0, Math.min(100, Math.floor((currentStreak / nextMilestone) * 100)));

  // Update prompt when mood changes
  useEffect(() => {
    if (selectedMood) {
      const prompts = reflectionPromptsByMood[selectedMood] || [];
      const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
      setCurrentPrompt(randomPrompt || "What's on your mind today?");
    }
  }, [selectedMood]);

  // Data is loaded from global state via MoodScreen/HomeScreen
  // No need to load here

  const handleMoodSelect = (mood: any) => {
    setSelectedMood(mood.id);
    setSelectedMoodObj(mood);
  };

  const handleMoodSubmit = async () => {
    if (selectedMood === null) {
      toast.show({
        description: 'Please select your mood first',
        duration: 2000,
      });
      return;
    }

    if (moodNote.trim().length < 5) {
      toast.show({
        description: 'Please add a short reflection (at least 5 characters)',
        duration: 2000,
      });
      return;
    }

    if (!userDetails?.userId) {
      toast.show({
        description: 'User session not found. Please log in again.',
        duration: 3000,
      });
      return;
    }

    try {
      // Call real API to log mood
      const result = await saveMoodCheckIn(userDetails.userId, selectedMood, moodNote.trim());

      if (result.success && result.data) {
        // Check if milestone was reached
        const isMilestone = result.data.isMilestone || false;
        const newStreak = result.data.currentStreak || currentStreak + 1;
        const milestoneMessage = isMilestone
          ? '\n\n🎁 Milestone reached! Check your rewards.'
          : '';

        // Show success message focused on streak
        alert.show({
          type: 'success',
          title: '🎉 Mood Logged Successfully!',
          message: `Current streak: ${newStreak} day${newStreak === 1 ? '' : 's'}${milestoneMessage}`,
          actions: [
            { text: 'View History', onPress: () => navigation.navigate('MoodHistoryScreen') },
            { text: 'Great!', onPress: () => navigation.goBack() },
          ],
        });

        // Reset form
        setSelectedMood(null);
        setMoodNote('');
        setSelectedMoodObj(null);
      } else {
        toast.show({
          description: result.error || 'Failed to save mood. Please try again.',
          duration: 3000,
        });
      }
    } catch (error) {
      console.log('Error submitting mood:', error);
      toast.show({
        description: 'Failed to save mood. Please try again.',
        duration: 3000,
      });
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const TodayMoodCard: React.FC = () => {
    if (!todayEntry) return null;

    return (
      <View style={styles.todayCard}>
        <View style={styles.todayHeader}>
          <Text style={styles.todayTitle}>Today's Mood</Text>
          <Text style={styles.todayTime}>Logged at {formatTime(todayEntry.timestamp)}</Text>
        </View>

        <View style={styles.todayMoodDisplay}>
          <Text style={styles.todayEmoji}>{todayEntry.emoji}</Text>
          <View style={styles.todayMoodInfo}>
            <Text style={styles.todayMoodLabel}>{todayEntry.mood}</Text>
            <Text style={styles.todayMoodNote}>"{todayEntry.note}"</Text>
          </View>
        </View>

        {/* MVP: Points removed - will show milestone rewards later */}
      </View>
    );
  };

  const MoodSelector: React.FC = () => (
    <View style={styles.moodSelectorContainer}>
      <MoodCheckInCard
        title="How are you feeling today?"
        moodOptions={globalMoodOptions}
        selectedMood={selectedMoodObj}
        onMoodSelect={handleMoodSelect}
        centerTitle={true}
        disabled={isSubmitting}
      />
    </View>
  );

  // Note: Reflection section inlined in render to avoid remounts that blur the TextInput

  const StatsHeader: React.FC = () => (
    <View style={styles.statsHeader}>
      <View style={styles.statCard}>
        <Icon name="local-fire-department" type="material" color="#FF5722" size={scale(24)} />
        <Text style={styles.statValue}>{currentStreak}</Text>
        <Text style={styles.statLabel}>Day Streak</Text>
      </View>

      <View style={styles.statCard}>
        <Icon name="emoji-events" type="material" color="#FFD700" size={scale(24)} />
        <Text style={styles.statValue}>{currentStreak >= 30 ? '3/3' : currentStreak >= 14 ? '2/3' : currentStreak >= 7 ? '1/3' : '0/3'}</Text>
        <Text style={styles.statLabel}>Milestones</Text>
      </View>

      <TouchableOpacity
        style={styles.statCard}
        onPress={() => navigation.navigate('MoodHistoryScreen')}
      >
        <Icon name="history" type="material" color={appColors.AppBlue} size={scale(24)} />
        <Text style={styles.statValue}>View</Text>
        <Text style={styles.statLabel}>History</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" type="material" color={appColors.CardBackground} size={scale(24)} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daily Mood Check-in</Text>
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => navigation.navigate('MoodHistoryScreen')}
        >
          <Icon name="history" type="material" color={appColors.CardBackground} size={scale(24)} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="none"
        scrollEnabled={!isTypingReflection}
      >
        {/* Today's Mood Card or Selector */}
        {todayEntry ? (
          <TodayMoodCard />
        ) : (
          <>
            <MoodSelector />
            {selectedMood && (
              <View style={styles.reflectionSection}>
                <Text style={styles.reflectionTitle}>Daily Reflection</Text>
                <Text style={styles.reflectionPrompt}>{currentPrompt}</Text>
                <TextInput
                  style={styles.reflectionInput}
                  multiline
                  numberOfLines={4}
                  placeholder="Share your thoughts... (minimum 5 characters)"
                  value={moodNote}
                  onChangeText={setMoodNote}
                  maxLength={300}
                  textAlignVertical="top"
                  blurOnSubmit={false}
                  onFocus={() => setIsTypingReflection(true)}
                  onBlur={() => setIsTypingReflection(false)}
                  editable={!isSubmitting}
                />
                <View style={styles.inputFooter}>
                  <Text style={styles.characterCount}>{moodNote.length}/300</Text>
                  <View style={styles.streakProgressContainer}>
                    <View style={styles.streakProgressTrack}>
                      <View style={[styles.streakProgressFill, { width: `${streakProgressPercent}%` }]} />
                    </View>
                    <Text style={styles.nextMilestoneText}>Next reward: {nextMilestone} days</Text>
                  </View>
                </View>
              </View>
            )}
          </>
        )}

        {/* Submit Button */}
        {!todayEntry && selectedMood && (
          <View style={styles.submitSection}>
            <Button
              title="Log My Mood"
              onPress={handleMoodSubmit}
              loading={isSubmitting}
              disabled={isSubmitting || selectedMood === null}
              buttonStyle={styles.submitButton}
              titleStyle={styles.submitButtonText}
            />
            <Text style={styles.submitNote}>
              Keep your streak going! Rewards unlock at 7, 14, and 30 days.
            </Text>
          </View>
        )}

        {/* Compact Stats Row - Moved to Bottom */}
        {!todayEntry && <StatsHeader />}

        {/* Already Logged Message */}
        {todayEntry && (
          <View style={styles.completedSection}>
            <Icon name="check-circle" type="material" color="#4CAF50" size={scale(48)} />
            <Text style={styles.completedTitle}>Today's Check-in Complete!</Text>
            <Text style={styles.completedMessage}>
              Come back tomorrow to continue your streak!
            </Text>
            <TouchableOpacity
              style={styles.viewHistoryButton}
              onPress={() => navigation.navigate('MoodHistoryScreen')}
            >
              <Text style={styles.viewHistoryText}>View Mood History</Text>
            </TouchableOpacity>
          </View>
        )}
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
  header: {
    backgroundColor: appColors.AppBlue,
    paddingTop: scale(parameters.headerHeightS),
    paddingBottom: scale(20),
    paddingHorizontal: scale(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: scale(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(2) },
    shadowOpacity: 0.2,
    shadowRadius: scale(4),
  },
  backButton: {
    padding: scale(5),
  },
  headerTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  historyButton: {
    padding: scale(5),
  },
  scrollView: {
    flex: 1,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: appColors.CardBackground,
    marginHorizontal: scale(20),
    marginTop: scale(20),
    marginBottom: scale(30),
    paddingVertical: scale(16),
    paddingHorizontal: scale(12),
    borderRadius: scale(12),
    elevation: scale(1),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(1) },
    shadowOpacity: 0.05,
    shadowRadius: scale(2),
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
    marginTop: scale(4),
  },
  statLabel: {
    fontSize: moderateScale(11),
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginTop: scale(2),
    textAlign: 'center',
  },
  todayCard: {
    backgroundColor: appColors.CardBackground,
    margin: scale(20),
    marginTop: scale(15),
    padding: scale(20),
    borderRadius: scale(16),
    elevation: scale(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(1) },
    shadowOpacity: 0.1,
    shadowRadius: scale(2),
  },
  todayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(16),
  },
  todayTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  todayTime: {
    fontSize: moderateScale(12),
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
  },
  todayMoodDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(16),
  },
  todayEmoji: {
    fontSize: moderateScale(48),
    marginRight: scale(16),
  },
  todayMoodInfo: {
    flex: 1,
  },
  todayMoodLabel: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: scale(4),
  },
  todayMoodNote: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    fontStyle: 'italic',
  },
  todayPoints: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: scale(8),
    padding: scale(12),
  },
  pointsText: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    color: '#E65100',
    fontFamily: appFonts.headerTextBold,
    marginLeft: scale(8),
  },
  moodSelectorContainer: {
    margin: scale(20),
    marginTop: scale(15),
  },
  reflectionSection: {
    backgroundColor: appColors.CardBackground,
    margin: scale(20),
    marginTop: 0,
    padding: scale(20),
    borderRadius: scale(16),
    elevation: scale(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(1) },
    shadowOpacity: 0.1,
    shadowRadius: scale(2),
  },
  reflectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: scale(12),
  },
  reflectionPrompt: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    marginBottom: scale(16),
    fontStyle: 'italic',
  },
  reflectionInput: {
    width: '100%',
    borderWidth: scale(1),
    borderColor: appColors.grey5,
    borderRadius: scale(8),
    padding: scale(12),
    fontSize: moderateScale(16),
    color: appColors.grey1,
    fontFamily: appFonts.headerTextRegular,
    textAlignVertical: 'top',
    minHeight: scale(100),
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: scale(8),
  },
  characterCount: {
    fontSize: moderateScale(12),
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
  },
  streakProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    flex: 1,
  },
  streakProgressTrack: {
    flex: 1,
    height: scale(6),
    borderRadius: scale(3),
    backgroundColor: appColors.AppLightGray,
    overflow: 'hidden',
  },
  streakProgressFill: {
    height: '100%',
    backgroundColor: appColors.AppBlue,
    borderRadius: scale(3),
  },
  nextMilestoneText: {
    fontSize: moderateScale(11),
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
  },
  submitSection: {
    margin: scale(20),
    marginTop: 0,
  },
  submitButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: scale(25),
    paddingVertical: scale(16),
  },
  submitButtonText: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  submitNote: {
    fontSize: moderateScale(12),
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    textAlign: 'center',
    marginTop: scale(12),
  },
  completedSection: {
    alignItems: 'center',
    padding: scale(40),
    margin: scale(20),
    marginTop: 0,
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(16),
    elevation: scale(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(1) },
    shadowOpacity: 0.1,
    shadowRadius: scale(2),
  },
  completedTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginTop: scale(16),
    marginBottom: scale(8),
  },
  completedMessage: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    textAlign: 'center',
    marginBottom: scale(20),
  },
  viewHistoryButton: {
    backgroundColor: appColors.AppBlue + '20',
    borderRadius: scale(20),
    paddingHorizontal: scale(20),
    paddingVertical: scale(10),
  },
  viewHistoryText: {
    fontSize: moderateScale(14),
    color: appColors.AppBlue,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
});

export default TodayMoodScreen;
