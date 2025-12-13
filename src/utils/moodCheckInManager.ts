/**
 * Mood Check-in Manager
 * Handles check-in status and data management with Redux integration
 */
import store from '../app/store';
import { 
  setTodayCheckIn, 
  setMoodStats, 
  addMoodEntry,
  setLoading,
  setError,
  setMoodHistory,
  setInsightsData,
  setMilestonesData,
  setLoadingInsights,
  setLoadingMilestones,
  setLoadingHistory,
  setSubmitting,
} from '../features/mood/moodSlice';
import { 
  getTodayMood, 
  logMood as logMoodAPI, 
  getMoodHistory, 
  getMoodInsights, 
  getMoodMilestones 
} from '../api/client/mood';

export interface TodayMoodData {
  id: string;
  mood: string;
  emoji: string;
  moodValue: number;
  note: string;
  pointsEarned: number;
  timestamp: string;
  date: string;
}

/**
 * Load all mood data for a user
 * Convenience function to load today's status, history, insights, and milestones
 */
export const loadAllMoodData = async (userId: string) => {
  try {
    // Load data in parallel for better performance
    await Promise.all([
      loadTodayCheckInStatus(userId),
      loadMoodHistory(userId, 'week'),
      loadMoodInsights(userId),
      loadMoodMilestones(userId),
    ]);
  } catch (error) {
    console.log('Error loading mood data:', error);
  }
};

/**
 * Load today's check-in status from API and update Redux
 * This should be called on app start or when navigating to mood screens
 */
export const loadTodayCheckInStatus = async (userId: string) => {
  const dispatch = store.dispatch;
  
  try {
    dispatch(setLoading(true));
    
    const response = await getTodayMood(userId);
    
    if (response.success && response.data) {
      const { hasCheckedIn, todayMood, stats } = response.data;
      
      // Update check-in status
      if (hasCheckedIn && todayMood) {
        const moodData: TodayMoodData = {
          id: todayMood.moodId || todayMood.id || '1',
          mood: todayMood.moodLabel || todayMood.mood || 'Good',
          emoji: todayMood.moodEmoji || todayMood.emoji || '😊',
          moodValue: todayMood.moodValue || 3,
          note: todayMood.note || '',
          pointsEarned: todayMood.pointsEarned || 0,
          timestamp: todayMood.timestamp || new Date().toISOString(),
          date: todayMood.date || new Date().toISOString(),
        };
        dispatch(setTodayCheckIn(moodData));
      }
      
      // Update stats from today's response
      if (stats) {
        dispatch(setMoodStats({
          currentStreak: stats.currentStreak || 0,
          totalPoints: stats.totalPoints || 0,
          totalCheckIns: stats.totalCheckIns || 0,
          milestonesReached: stats.milestonesReached || 0,
          nextMilestone: stats.nextMilestone || 7,
        }));
      }
    }
    
    dispatch(setLoading(false));
  } catch (error) {
    console.log('Error loading today check-in status:', error);
    dispatch(setError(error instanceof Error ? error.message : 'Failed to load check-in status'));
  }
};

/**
 * Load mood history from API and update Redux
 */
export const loadMoodHistory = async (userId: string, period: string = 'week', page: number = 1, limit: number = 20) => {
  const dispatch = store.dispatch;
  
  try {
    dispatch(setLoadingHistory(true));
    
    const response = await getMoodHistory(userId, period, page, limit);
    
    if (response.success && response.data) {
      const { entries, stats, pagination } = response.data;
      
      // Update mood history
      dispatch(setMoodHistory({ entries: entries || [], pagination }));
      
      // Update stats from history response
      if (stats) {
        dispatch(setMoodStats({
          currentStreak: stats.currentStreak || 0,
          totalPoints: stats.totalPoints || 0,
          totalCheckIns: stats.totalCheckIns || 0,
          milestonesReached: stats.milestonesReached || 0,
          nextMilestone: stats.nextMilestone || 7,
          averageMood: stats.averageMood,
          mostCommonMood: stats.mostCommonMood,
        }));
      }
    }
    
    dispatch(setLoadingHistory(false));
  } catch (error) {
    console.log('Error loading mood history:', error);
    dispatch(setLoadingHistory(false));
  }
};

/**
 * Load mood insights from API and update Redux
 */
export const loadMoodInsights = async (userId: string) => {
  const dispatch = store.dispatch;
  
  try {
    dispatch(setLoadingInsights(true));
    
    const response = await getMoodInsights(userId);
    
    if (response.success && response.data) {
      dispatch(setInsightsData({
        insights: response.data.insights || [],
        patterns: response.data.patterns || [],
        recommendations: response.data.recommendations || [],
        bestTimeOfDay: response.data.bestTimeOfDay,
        weeklyImprovement: response.data.weeklyImprovement,
      }));
    }
    
    dispatch(setLoadingInsights(false));
  } catch (error) {
    console.log('Error loading mood insights:', error);
    dispatch(setLoadingInsights(false));
  }
};

/**
 * Load mood milestones from API and update Redux
 */
export const loadMoodMilestones = async (userId: string) => {
  const dispatch = store.dispatch;
  
  try {
    dispatch(setLoadingMilestones(true));
    
    const response = await getMoodMilestones(userId);
    
    if (response.success && response.data) {
      dispatch(setMilestonesData({
        milestones: response.data.milestones || [],
        nextMilestone: response.data.nextMilestone,
        currentStreak: response.data.currentStreak,
        longestStreak: response.data.longestStreak,
        availablePoints: response.data.availablePoints || 0,
        usedPoints: response.data.usedPoints || 0,
        totalPoints: response.data.totalPoints || 0,
        milestonesReached: response.data.milestonesReached || 0,
        redeemOptions: response.data.redeemOptions || [],
      }));
    }
    
    dispatch(setLoadingMilestones(false));
  } catch (error) {
    console.log('Error loading mood milestones:', error);
    dispatch(setLoadingMilestones(false));
  }
};

/**
 * Format timestamp to relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (timestamp: string): string => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = now.getTime() - time.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  
  return 'Today';
};

/**
 * Save mood check-in (Log mood)
 * @param userId - User ID
 * @param moodValue - Mood value (1-5)
 * @param note - Optional note
 * @returns Promise with log mood response
 */
export const saveMoodCheckIn = async (
  userId: string, 
  moodValue: number, 
  note: string = ''
): Promise<{ success: boolean; data?: any; error?: string }> => {
  const dispatch = store.dispatch;
  
  try {
    dispatch(setSubmitting(true));
    
    const response = await logMoodAPI(userId, moodValue, note);
    
    if (response.success && response.data) {
      // Map API response to TodayMoodData format
      const moodData: TodayMoodData = {
        id: response.data.moodId,
        mood: response.data.moodLabel,
        emoji: response.data.moodEmoji,
        moodValue: moodValue,
        note: note,
        pointsEarned: response.data.pointsEarned || 0,
        timestamp: response.data.timestamp,
        date: new Date().toISOString(),
      };
      
      // Update Redux state
      dispatch(setTodayCheckIn(moodData));
      dispatch(addMoodEntry(moodData));
      
      // Update stats from log mood response
      dispatch(setMoodStats({
        currentStreak: response.data.currentStreak,
        totalPoints: response.data.totalPoints,
        milestonesReached: response.data.milestonesReached,
        nextMilestone: response.data.nextMilestone,
      }));
      
      dispatch(setSubmitting(false));
      return { success: true, data: response.data };
    }
    
    dispatch(setSubmitting(false));
    return { success: false, error: 'Failed to log mood' };
  } catch (error) {
    console.log('Error saving mood check-in:', error);
    dispatch(setSubmitting(false));
    dispatch(setError(error instanceof Error ? error.message : 'Failed to save check-in'));
    return { success: false, error: error instanceof Error ? error.message : 'Failed to save check-in' };
  }
};
