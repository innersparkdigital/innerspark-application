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
  setError 
} from '../features/mood/moodSlice';

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
 * Load today's check-in status from API and update Redux
 * This should be called on app start or when navigating to mood screens
 */
export const loadTodayCheckInStatus = async () => {
  const dispatch = store.dispatch;
  
  try {
    dispatch(setLoading(true));
    
    // TODO: Replace with actual API call
    // const response = await APIInstance.get('/mood/today');
    
    const today = new Date().toDateString();
    
    // Mock: No check-in for testing
    // If API returns no data, Redux state remains hasCheckedInToday: false
    
    // Mock: With check-in (uncomment to test)
    // const mockData: TodayMoodData = {
    //   id: '1',
    //   mood: 'Happy',
    //   emoji: '😊',
    //   moodValue: 4,
    //   note: 'Had a great day with friends!',
    //   pointsEarned: 500,
    //   timestamp: new Date().toISOString(),
    //   date: today,
    // };
    // dispatch(setTodayCheckIn(mockData));
    
    dispatch(setLoading(false));
  } catch (error) {
    console.error('Error loading today check-in status:', error);
    dispatch(setError(error instanceof Error ? error.message : 'Failed to load check-in status'));
  }
};

/**
 * Load user mood stats from API and update Redux
 */
export const loadMoodStats = async () => {
  const dispatch = store.dispatch;
  
  try {
    // TODO: Replace with actual API call
    // const response = await APIInstance.get('/mood/stats');
    
    // Mock stats
    const mockStats = {
      currentStreak: 7,
      totalPoints: 3500,
      totalCheckIns: 15,
    };
    
    dispatch(setMoodStats(mockStats));
  } catch (error) {
    console.error('Error loading mood stats:', error);
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
 * Save mood check-in
 * @param moodData - Mood check-in data to save
 */
export const saveMoodCheckIn = async (moodData: Partial<TodayMoodData>): Promise<boolean> => {
  try {
    // TODO: Replace with actual API call
    // const response = await APIInstance.post('/mood/checkin', moodData);
    
    console.log('Saving mood check-in:', moodData);
    
    // Mock success
    return true;
  } catch (error) {
    console.error('Error saving mood check-in:', error);
    return false;
  }
};
