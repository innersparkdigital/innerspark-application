/**
 * Today Mood Screen - Daily mood check-in with loyalty points
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';
import { NavigationProp } from '@react-navigation/native';

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
}

const TodayMoodScreen: React.FC<TodayMoodScreenProps> = ({ navigation }) => {
  const toast = useToast();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodNote, setMoodNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [todayEntry, setTodayEntry] = useState<MoodEntry | null>(null);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

  const moodOptions = [
    { id: 1, emoji: '😢', label: 'Terrible', color: '#F44336', description: 'Very difficult day' },
    { id: 2, emoji: '😔', label: 'Bad', color: '#FF9800', description: 'Challenging moments' },
    { id: 3, emoji: '😐', label: 'Okay', color: '#FFC107', description: 'Neutral feelings' },
    { id: 4, emoji: '🙂', label: 'Good', color: '#8BC34A', description: 'Positive moments' },
    { id: 5, emoji: '😊', label: 'Great', color: '#4CAF50', description: 'Wonderful day' },
  ];

  const reflectionPrompts = [
    "What made you feel this way today?",
    "What are you grateful for right now?",
    "How did you take care of yourself today?",
    "What challenged you today and how did you handle it?",
    "What's one thing you learned about yourself today?",
    "How did your interactions with others affect your mood?",
    "What would make tomorrow better?",
  ];

  const [currentPrompt] = useState(
    reflectionPrompts[Math.floor(Math.random() * reflectionPrompts.length)]
  );

  useEffect(() => {
    loadTodayMood();
    loadUserStats();
  }, []);

  const loadTodayMood = async () => {
    try {
      // Check if user already logged mood today
      const today = new Date().toDateString();
      
      // Mock check for existing entry
      const mockTodayEntry: MoodEntry | null = null; // Would come from API
      
      setTodayEntry(mockTodayEntry);
    } catch (error) {
      console.error('Error loading today mood:', error);
    }
  };

  const loadUserStats = async () => {
    try {
      // Mock user stats - would come from API
      setCurrentStreak(7); // 7-day streak
      setTotalPoints(3500); // Total loyalty points
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
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

    setIsSubmitting(true);
    try {
      const selectedMoodData = moodOptions.find(mood => mood.id === selectedMood)!;
      const pointsEarned = 500; // UGX 500 per check-in
      
      const newEntry: MoodEntry = {
        id: Date.now().toString(),
        date: new Date().toDateString(),
        moodValue: selectedMood,
        moodEmoji: selectedMoodData.emoji,
        moodLabel: selectedMoodData.label,
        note: moodNote.trim(),
        timestamp: new Date().toISOString(),
        pointsEarned,
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update local state
      setTodayEntry(newEntry);
      setCurrentStreak(prev => prev + 1);
      setTotalPoints(prev => prev + pointsEarned);

      // Show success with points earned
      Alert.alert(
        '🎉 Mood Logged Successfully!',
        `You earned UGX ${pointsEarned} loyalty points!\n\nCurrent streak: ${currentStreak + 1} days\nTotal points: UGX ${totalPoints + pointsEarned}`,
        [
          { text: 'View History', onPress: () => navigation.navigate('MoodHistoryScreen') },
          { text: 'Great!', style: 'default' }
        ]
      );

      // Reset form
      setSelectedMood(null);
      setMoodNote('');

    } catch (error) {
      toast.show({
        description: 'Failed to save mood. Please try again.',
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
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
          <Text style={styles.todayEmoji}>{todayEntry.moodEmoji}</Text>
          <View style={styles.todayMoodInfo}>
            <Text style={styles.todayMoodLabel}>{todayEntry.moodLabel}</Text>
            <Text style={styles.todayMoodNote}>"{todayEntry.note}"</Text>
          </View>
        </View>

        <View style={styles.todayPoints}>
          <Icon name="stars" type="material" color="#FFD700" size={20} />
          <Text style={styles.pointsText}>+UGX {todayEntry.pointsEarned} earned</Text>
        </View>
      </View>
    );
  };

  const MoodSelector: React.FC = () => (
    <View style={styles.moodSelector}>
      <Text style={styles.selectorTitle}>How are you feeling today?</Text>
      <View style={styles.moodOptions}>
        {moodOptions.map((mood) => (
          <TouchableOpacity
            key={mood.id}
            style={[
              styles.moodOption,
              selectedMood === mood.id && styles.selectedMoodOption,
              { borderColor: mood.color }
            ]}
            onPress={() => setSelectedMood(mood.id)}
          >
            <Text style={styles.moodEmoji}>{mood.emoji}</Text>
            <Text style={[styles.moodLabel, { color: mood.color }]}>{mood.label}</Text>
            <Text style={styles.moodDescription}>{mood.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const ReflectionSection: React.FC = () => (
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
      />
      <View style={styles.inputFooter}>
        <Text style={styles.characterCount}>{moodNote.length}/300</Text>
        <View style={styles.pointsIndicator}>
          <Icon name="stars" type="material" color="#FFD700" size={16} />
          <Text style={styles.pointsIndicatorText}>+UGX 500</Text>
        </View>
      </View>
    </View>
  );

  const StatsHeader: React.FC = () => (
    <View style={styles.statsHeader}>
      <View style={styles.statCard}>
        <Icon name="local-fire-department" type="material" color="#FF5722" size={24} />
        <Text style={styles.statValue}>{currentStreak}</Text>
        <Text style={styles.statLabel}>Day Streak</Text>
      </View>
      
      <View style={styles.statCard}>
        <Icon name="stars" type="material" color="#FFD700" size={24} />
        <Text style={styles.statValue}>UGX {totalPoints.toLocaleString()}</Text>
        <Text style={styles.statLabel}>Total Points</Text>
      </View>

      <TouchableOpacity 
        style={styles.statCard}
        onPress={() => navigation.navigate('MoodPointsScreen')}
      >
        <Icon name="redeem" type="material" color={appColors.AppBlue} size={24} />
        <Text style={styles.statValue}>Redeem</Text>
        <Text style={styles.statLabel}>Loyalty Points</Text>
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
          <Icon name="arrow-back" type="material" color={appColors.grey1} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daily Mood Check-in</Text>
        <TouchableOpacity 
          style={styles.historyButton}
          onPress={() => navigation.navigate('MoodHistoryScreen')}
        >
          <Icon name="history" type="material" color={appColors.AppBlue} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Stats Header */}
        <StatsHeader />

        {/* Today's Mood Card or Selector */}
        {todayEntry ? (
          <TodayMoodCard />
        ) : (
          <>
            <MoodSelector />
            {selectedMood && <ReflectionSection />}
          </>
        )}

        {/* Submit Button */}
        {!todayEntry && selectedMood && (
          <View style={styles.submitSection}>
            <Button
              title="Log My Mood & Earn Points"
              onPress={handleMoodSubmit}
              loading={isSubmitting}
              disabled={isSubmitting || selectedMood === null}
              buttonStyle={styles.submitButton}
              titleStyle={styles.submitButtonText}
            />
            <Text style={styles.submitNote}>
              Complete your daily check-in to earn UGX 500 loyalty points!
            </Text>
          </View>
        )}

        {/* Already Logged Message */}
        {todayEntry && (
          <View style={styles.completedSection}>
            <Icon name="check-circle" type="material" color="#4CAF50" size={48} />
            <Text style={styles.completedTitle}>Today's Check-in Complete!</Text>
            <Text style={styles.completedMessage}>
              Come back tomorrow for your next daily check-in and earn more loyalty points.
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.AppLightGray,
  },
  header: {
    backgroundColor: appColors.CardBackground,
    paddingTop: parameters.headerHeightS,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  historyButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  statCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginTop: 4,
    textAlign: 'center',
  },
  todayCard: {
    backgroundColor: appColors.CardBackground,
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  todayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  todayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  todayTime: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
  },
  todayMoodDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  todayEmoji: {
    fontSize: 48,
    marginRight: 16,
  },
  todayMoodInfo: {
    flex: 1,
  },
  todayMoodLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 4,
  },
  todayMoodNote: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    fontStyle: 'italic',
  },
  todayPoints: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    padding: 12,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E65100',
    fontFamily: appFonts.headerTextBold,
    marginLeft: 8,
  },
  moodSelector: {
    backgroundColor: appColors.CardBackground,
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 20,
    textAlign: 'center',
  },
  moodOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodOption: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: appColors.grey5,
    flex: 1,
    marginHorizontal: 2,
  },
  selectedMoodOption: {
    backgroundColor: appColors.AppLightGray,
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
    marginBottom: 4,
  },
  moodDescription: {
    fontSize: 10,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    textAlign: 'center',
  },
  reflectionSection: {
    backgroundColor: appColors.CardBackground,
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  reflectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 12,
  },
  reflectionPrompt: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  reflectionInput: {
    borderWidth: 1,
    borderColor: appColors.grey5,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: appColors.grey1,
    fontFamily: appFonts.headerTextRegular,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  characterCount: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
  },
  pointsIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsIndicatorText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#E65100',
    fontFamily: appFonts.headerTextBold,
    marginLeft: 4,
  },
  submitSection: {
    margin: 20,
    marginTop: 0,
  },
  submitButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: 25,
    paddingVertical: 16,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  submitNote: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    textAlign: 'center',
    marginTop: 12,
  },
  completedSection: {
    alignItems: 'center',
    padding: 40,
    margin: 20,
    marginTop: 0,
    backgroundColor: appColors.CardBackground,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  completedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginTop: 16,
    marginBottom: 8,
  },
  completedMessage: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    textAlign: 'center',
    marginBottom: 20,
  },
  viewHistoryButton: {
    backgroundColor: appColors.AppBlue + '20',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  viewHistoryText: {
    fontSize: 14,
    color: appColors.AppBlue,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
});

export default TodayMoodScreen;
