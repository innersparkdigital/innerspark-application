import { useState, useEffect } from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';

const STORAGE_KEY = '@innerspark_wellness_state';

interface WellnessState {
  date: string;
  completedIndices: number[];
}

export const useDailyWellnessTips = (totalTipsCount: number) => {
  const [completedTips, setCompletedTips] = useState<Set<number>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadState();
  }, []);

  const loadState = async () => {
    try {
      const storedData = await EncryptedStorage.getItem(STORAGE_KEY);
      const today = new Date().toDateString();

      if (storedData) {
        const parsed: WellnessState = JSON.parse(storedData);
        if (parsed.date === today) {
          setCompletedTips(new Set(parsed.completedIndices));
        } else {
          // New day, reset state completely
          await resetState(today);
        }
      } else {
        await resetState(today);
      }
    } catch (e) {
      console.log('Error loading daily wellness state:', e);
    } finally {
      setIsLoaded(true);
    }
  };

  const resetState = async (today: string) => {
    try {
      setCompletedTips(new Set());
      await EncryptedStorage.setItem(STORAGE_KEY, JSON.stringify({
        date: today,
        completedIndices: []
      }));
    } catch (e) {
      console.log('Error resetting daily wellness state:', e);
    }
  };

  const markAsCompleted = async (index: number) => {
    try {
      const newCompleted = new Set(completedTips);
      newCompleted.add(index);
      setCompletedTips(newCompleted);

      const today = new Date().toDateString();
      await EncryptedStorage.setItem(STORAGE_KEY, JSON.stringify({
        date: today,
        completedIndices: Array.from(newCompleted)
      }));
    } catch (e) {
      console.log('Error saving daily wellness state:', e);
    }
  };

  const allCompleted = isLoaded && totalTipsCount > 0 && completedTips.size >= totalTipsCount;

  return { completedTips, markAsCompleted, allCompleted, isLoaded };
};
