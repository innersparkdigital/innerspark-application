/**
 * Mood Slice - Redux state management for mood tracking
 * Manages check-in status, mood data, streaks, and milestone rewards
 * MVP: Points deferred until milestones (7, 14, 30 days)
 */
import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from '@reduxjs/toolkit';

const initialState = {
  // Today's check-in status
  hasCheckedInToday: false,
  todayMoodData: null, // { id, mood, emoji, moodValue, note, pointsEarned, timestamp, date }
  
  // User mood stats (from getTodayMood and getMoodHistory)
  currentStreak: 0,
  totalPoints: 0,
  totalCheckIns: 0,
  milestonesReached: 0,
  nextMilestone: 7, // Default first milestone
  averageMood: null,
  mostCommonMood: null,
  longestStreak: 0,
  
  // Mood history (from getMoodHistory)
  moodHistory: [], // Array of mood entries
  historyPagination: {
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
  },
  
  // Insights data (from getMoodInsights)
  insights: [], // Array of insight objects
  patterns: [], // Mood patterns detected
  recommendations: [], // Personalized recommendations
  bestTimeOfDay: null, // Best time for user's mood
  weeklyImprovement: null, // Percentage improvement this week
  
  // Milestones data (from getMoodMilestones)
  milestones: [], // Array: [{ days, reward, reached, daysRemaining }]
  nextMilestoneData: null, // { days, reward, daysRemaining }
  availablePoints: 0,
  usedPoints: 0,
  redeemOptions: [],
  
  // Loading states
  isLoading: false,
  isSubmitting: false,
  isLoadingInsights: false,
  isLoadingMilestones: false,
  isLoadingHistory: false,
  error: null,
  
  // Last updated timestamp
  lastUpdated: null,
};

const moodSlice = createSlice({
  name: 'mood',
  initialState,
  reducers: {
    // Set today's check-in status
    setTodayCheckIn: (state, action) => {
      state.hasCheckedInToday = true;
      state.todayMoodData = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    
    // Clear today's check-in (for testing or new day)
    clearTodayCheckIn: (state) => {
      state.hasCheckedInToday = false;
      state.todayMoodData = null;
    },
    
    // Update mood stats
    setMoodStats: (state, action) => {
      const { 
        currentStreak, 
        totalPoints, 
        totalCheckIns, 
        milestonesReached, 
        nextMilestone,
        averageMood,
        mostCommonMood,
        longestStreak 
      } = action.payload;
      
      if (currentStreak !== undefined) state.currentStreak = currentStreak;
      if (totalPoints !== undefined) state.totalPoints = totalPoints;
      if (totalCheckIns !== undefined) state.totalCheckIns = totalCheckIns;
      if (milestonesReached !== undefined) state.milestonesReached = milestonesReached;
      if (nextMilestone !== undefined) state.nextMilestone = nextMilestone;
      if (averageMood !== undefined) state.averageMood = averageMood;
      if (mostCommonMood !== undefined) state.mostCommonMood = mostCommonMood;
      if (longestStreak !== undefined) state.longestStreak = longestStreak;
    },
    
    // Add points after check-in (MVP: Called only at milestones)
    addPoints: (state, action) => {
      state.totalPoints += action.payload;
    },
    
    // Increment streak
    incrementStreak: (state) => {
      state.currentStreak += 1;
    },
    
    // Set mood history with pagination
    setMoodHistory: (state, action) => {
      const { entries, pagination } = action.payload;
      state.moodHistory = entries || [];
      if (pagination) {
        state.historyPagination = pagination;
      }
    },
    
    // Append mood history (for pagination)
    appendMoodHistory: (state, action) => {
      const { entries, pagination } = action.payload;
      state.moodHistory = [...state.moodHistory, ...(entries || [])];
      if (pagination) {
        state.historyPagination = pagination;
      }
    },
    
    // Add new mood entry to history
    addMoodEntry: (state, action) => {
      state.moodHistory.unshift(action.payload);
      state.totalCheckIns += 1;
    },
    
    // Set loading state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    // Set submitting state
    setSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    },
    
    // Set error
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
      state.isSubmitting = false;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Set insights data
    setInsightsData: (state, action) => {
      const { insights, patterns, recommendations, bestTimeOfDay, weeklyImprovement } = action.payload;
      state.insights = insights || [];
      state.patterns = patterns || [];
      state.recommendations = recommendations || [];
      state.bestTimeOfDay = bestTimeOfDay;
      state.weeklyImprovement = weeklyImprovement;
    },
    
    // Set milestones data
    setMilestonesData: (state, action) => {
      const { 
        milestones, 
        nextMilestone, 
        currentStreak, 
        longestStreak,
        availablePoints,
        usedPoints,
        totalPoints,
        milestonesReached,
        redeemOptions 
      } = action.payload;
      
      state.milestones = milestones || [];
      state.nextMilestoneData = nextMilestone;
      if (currentStreak !== undefined) state.currentStreak = currentStreak;
      if (longestStreak !== undefined) state.longestStreak = longestStreak;
      if (availablePoints !== undefined) state.availablePoints = availablePoints;
      if (usedPoints !== undefined) state.usedPoints = usedPoints;
      if (totalPoints !== undefined) state.totalPoints = totalPoints;
      if (milestonesReached !== undefined) state.milestonesReached = milestonesReached;
      state.redeemOptions = redeemOptions || [];
    },
    
    // Set loading insights state
    setLoadingInsights: (state, action) => {
      state.isLoadingInsights = action.payload;
    },
    
    // Set loading milestones state
    setLoadingMilestones: (state, action) => {
      state.isLoadingMilestones = action.payload;
    },
    
    // Set loading history state
    setLoadingHistory: (state, action) => {
      state.isLoadingHistory = action.payload;
    },
    
    // Reset mood state (for logout)
    resetMoodState: () => initialState,
  },
});

// Export actions
export const {
  setTodayCheckIn,
  clearTodayCheckIn,
  setMoodStats,
  addPoints,
  incrementStreak,
  setMoodHistory,
  appendMoodHistory,
  addMoodEntry,
  setLoading,
  setSubmitting,
  setError,
  clearError,
  setInsightsData,
  setMilestonesData,
  setLoadingInsights,
  setLoadingMilestones,
  setLoadingHistory,
  resetMoodState,
} = moodSlice.actions;

// Selectors
export const selectHasCheckedInToday = (state) => state.mood.hasCheckedInToday;
export const selectTodayMoodData = (state) => state.mood.todayMoodData;

// Memoized selector to prevent unnecessary re-renders
// Returns the same object reference if values haven't changed
export const selectMoodStats = createSelector(
  [(state) => state.mood.currentStreak, 
   (state) => state.mood.totalPoints, 
   (state) => state.mood.totalCheckIns],
  (currentStreak, totalPoints, totalCheckIns) => ({
    currentStreak,
    totalPoints,
    totalCheckIns,
  })
);

export const selectMoodHistory = (state) => state.mood.moodHistory;
export const selectHistoryPagination = (state) => state.mood.historyPagination;
export const selectMoodInsights = (state) => state.mood.insights;
export const selectMoodPatterns = (state) => state.mood.patterns;
export const selectMoodRecommendations = (state) => state.mood.recommendations;
export const selectBestTimeOfDay = (state) => state.mood.bestTimeOfDay;
export const selectWeeklyImprovement = (state) => state.mood.weeklyImprovement;
export const selectMilestones = (state) => state.mood.milestones;
export const selectNextMilestoneData = (state) => state.mood.nextMilestoneData;
export const selectAvailablePoints = (state) => state.mood.availablePoints;
export const selectMoodLoading = (state) => state.mood.isLoading;
export const selectMoodSubmitting = (state) => state.mood.isSubmitting;
export const selectInsightsLoading = (state) => state.mood.isLoadingInsights;
export const selectMilestonesLoading = (state) => state.mood.isLoadingMilestones;
export const selectHistoryLoading = (state) => state.mood.isLoadingHistory;
export const selectMoodError = (state) => state.mood.error;

// Memoized selector for extended stats
export const selectExtendedMoodStats = createSelector(
  [
    (state) => state.mood.currentStreak,
    (state) => state.mood.totalPoints,
    (state) => state.mood.totalCheckIns,
    (state) => state.mood.milestonesReached,
    (state) => state.mood.nextMilestone,
    (state) => state.mood.averageMood,
    (state) => state.mood.mostCommonMood,
    (state) => state.mood.longestStreak,
  ],
  (currentStreak, totalPoints, totalCheckIns, milestonesReached, nextMilestone, averageMood, mostCommonMood, longestStreak) => ({
    currentStreak,
    totalPoints,
    totalCheckIns,
    milestonesReached,
    nextMilestone,
    averageMood,
    mostCommonMood,
    longestStreak,
  })
);

// Export reducer
export default moodSlice.reducer;
