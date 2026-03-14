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
  clearTodayCheckIn,
} from '../features/mood/moodSlice';
import { 
  getTodayMood, 
  logMood as logMoodAPI, 
  getMoodHistory, 
  getMoodInsights, 
  getMoodMilestones 
} from '../api/client/mood';
import { storeItemLS } from '../global/StorageActions';
import { cancelTodayMoodReminders } from '../api/LHNotifications';

/**
 * Get color for mood value
 */
const getMoodColor = (moodValue: number): string => {
  const colors: { [key: number]: string } = {
    1: '#4CAF50', // Great - Green
    2: '#8BC34A', // Good - Light Green
    3: '#FFC107', // Okay - Amber
    4: '#FF9800', // Bad - Orange
    5: '#F44336', // Terrible - Red
  };
  return colors[moodValue] || '#9E9E9E';
};

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
      } else if (hasCheckedIn === false) {
        // Explicitly clear if the API says we haven't checked in
        dispatch(clearTodayCheckIn());
      }
      
      // Update stats from today's response - Definitive source for current streak
      if (stats) {
        const statsToUpdate: any = {};
        if (stats.currentStreak !== undefined && stats.currentStreak !== null) statsToUpdate.currentStreak = stats.currentStreak;
        if (stats.totalPoints !== undefined && stats.totalPoints !== null) statsToUpdate.totalPoints = stats.totalPoints;
        if (stats.totalCheckIns !== undefined && stats.totalCheckIns !== null) statsToUpdate.totalCheckIns = stats.totalCheckIns;
        if (stats.milestonesReached !== undefined && stats.milestonesReached !== null) statsToUpdate.milestonesReached = stats.milestonesReached;
        if (stats.nextMilestone !== undefined && stats.nextMilestone !== null) statsToUpdate.nextMilestone = stats.nextMilestone;
        
        if (Object.keys(statsToUpdate).length > 0) {
          dispatch(setMoodStats(statsToUpdate));
        }
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
      
      // Map API response fields to UI expected fields
      const mappedEntries = (entries || []).map((entry: any) => ({
        ...entry,
        emoji: entry.moodEmoji || entry.emoji,
        mood: entry.moodLabel || entry.mood,
        color: getMoodColor(entry.moodValue),
      }));
      
      // Update mood history
      dispatch(setMoodHistory({ entries: mappedEntries, pagination }));
      
      // Update stats from history response - Secondary source
      if (stats) {
        const statsToUpdate: any = {};
        // History is authoritative for average and most common mood
        if (stats.averageMood !== undefined && stats.averageMood !== null) statsToUpdate.averageMood = stats.averageMood;
        if (stats.mostCommonMood !== undefined && stats.mostCommonMood !== null) statsToUpdate.mostCommonMood = stats.mostCommonMood;
        
        // Use history for these ONLY if they are missing from state, otherwise Today API is better
        const currentState = store.getState().mood;
        if (!currentState.totalCheckIns && stats.totalCheckIns) statsToUpdate.totalCheckIns = stats.totalCheckIns;
        
        if (Object.keys(statsToUpdate).length > 0) {
          dispatch(setMoodStats(statsToUpdate));
        }
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
      const insightsData: any = {};
      
      // Mandatory arrays
      insightsData.insights = response.data.insights || [];
      insightsData.patterns = response.data.patterns || [];
      insightsData.recommendations = response.data.recommendations || [];
      
      // Optional fields - only update if present
      if (response.data.bestTimeOfDay !== undefined) insightsData.bestTimeOfDay = response.data.bestTimeOfDay;
      if (response.data.weeklyImprovement !== undefined) insightsData.weeklyImprovement = response.data.weeklyImprovement;
      
      dispatch(setInsightsData(insightsData));
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
      const milestoneUpdate: any = {};
      
      // Required arrays
      // milestoneUpdate.milestones = response.data.milestones || []; // Keep current
      milestoneUpdate.redeemOptions = response.data.redeemOptions || []; // Keep current
      
      const currentState = store.getState().mood;
      
      // Optional fields - Milestones is authoritative for milestonesReached and nextMilestone
      if (response.data.milestonesReached !== undefined && response.data.milestonesReached !== null) milestoneUpdate.milestonesReached = response.data.milestonesReached;
      if (response.data.nextMilestone !== undefined && response.data.nextMilestone !== null) milestoneUpdate.nextMilestone = response.data.nextMilestone;
      
      // Use these ONLY as fallbacks if not already set by Today API
      if (!currentState.currentStreak && response.data.currentStreak) milestoneUpdate.currentStreak = response.data.currentStreak;
      if (!currentState.longestStreak && response.data.longestStreak) milestoneUpdate.longestStreak = response.data.longestStreak;
      if (!currentState.totalPoints && response.data.totalPoints) milestoneUpdate.totalPoints = response.data.totalPoints;
      
      // Points info is usually unique to milestones
      if (response.data.availablePoints !== undefined) milestoneUpdate.availablePoints = response.data.availablePoints;
      if (response.data.usedPoints !== undefined) milestoneUpdate.usedPoints = response.data.usedPoints;
      
      dispatch(setMilestonesData(milestoneUpdate));
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
      const statsToUpdate: any = {};
      if (response.data.currentStreak !== undefined) statsToUpdate.currentStreak = response.data.currentStreak;
      if (response.data.totalPoints !== undefined) statsToUpdate.totalPoints = response.data.totalPoints;
      if (response.data.milestonesReached !== undefined) statsToUpdate.milestonesReached = response.data.milestonesReached;
      if (response.data.nextMilestone !== undefined) statsToUpdate.nextMilestone = response.data.nextMilestone;
      
      if (Object.keys(statsToUpdate).length > 0) {
        dispatch(setMoodStats(statsToUpdate));
      }
      
      // Local Guard: Mark as checked in today and cancel future reminders for today
      const todayStr = new Date().toISOString().split('T')[0];
      await storeItemLS('lastMoodCheckInDateLS', todayStr);
      await cancelTodayMoodReminders();
      
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
