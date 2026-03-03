/**
 * Goals Manager
 * Handles goals API calls with graceful error handling
 * Returns empty arrays for 404 (endpoint not implemented yet)
 */
import store from '../app/store';
import {
  setGoals,
  setLoading,
  setRefreshing,
  setError,
  updateGoalInList,
  removeGoalFromList,
  addGoalToList,
} from '../features/goals/goalsSlice';
import {
  getGoals,
  createGoal,
  updateGoal,
  completeGoal,
  deleteGoal,
} from '../api/client/goals';

/**
 * Load goals from API
 * Returns empty array if endpoint not implemented (404)
 */
export const loadGoals = async (status = 'all') => {
  store.dispatch(setLoading(true));

  try {
    const state: any = store.getState();
    const userId = state.userData?.userDetails?.userId;

    if (!userId) {
      console.log('❌ Error: userId not found in Redux state');
      store.dispatch(setGoals({ goals: [], stats: { total: 0, active: 0, completed: 0, paused: 0 } }));
      return;
    }

    console.log('🎯 Loading goals from API with status:', status);
    const response = await getGoals(status, userId);
    console.log('✅ API Response:', JSON.stringify(response, null, 2));

    if (response.success && response.data) {
      const goals = response.data.goals || [];
      const stats = response.data.stats || { total: 0, active: 0, completed: 0, paused: 0 };
      console.log('📊 Goals count:', goals.length);

      store.dispatch(setGoals({ goals, stats }));
    } else {
      console.log('⚠️ API response missing success or data:', response);
      store.dispatch(setGoals({ goals: [], stats: { total: 0, active: 0, completed: 0, paused: 0 } }));
    }
  } catch (error: any) {
    console.log('❌ Error loading goals:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
    });

    // Handle 404 - endpoint not implemented yet, return empty state
    if (error?.response?.status === 404) {
      console.log('📦 GET /client/goals endpoint returns 404, showing empty state');
      store.dispatch(setGoals({ goals: [], stats: { total: 0, active: 0, completed: 0, paused: 0 } }));
    } else {
      // Other errors - set error state with empty data
      console.log('⚠️ Non-404 error, showing empty state');
      store.dispatch(setGoals({ goals: [], stats: { total: 0, active: 0, completed: 0, paused: 0 } }));
      store.dispatch(setError(error?.message || 'Failed to load goals'));
    }
  } finally {
    store.dispatch(setLoading(false));
  }
};

/**
 * Refresh goals list
 */
export const refreshGoals = async (status = 'all') => {
  store.dispatch(setRefreshing(true));

  try {
    const state: any = store.getState();
    const userId = state.userData?.userDetails?.userId;

    if (!userId) {
      store.dispatch(setGoals({ goals: [], stats: { total: 0, active: 0, completed: 0, paused: 0 } }));
      return;
    }

    console.log('🔄 Refreshing goals with status:', status);
    const response = await getGoals(status, userId);

    if (response.success && response.data) {
      const goals = response.data.goals || [];
      const stats = response.data.stats || { total: 0, active: 0, completed: 0, paused: 0 };
      store.dispatch(setGoals({ goals, stats }));
    } else {
      store.dispatch(setGoals({ goals: [], stats: { total: 0, active: 0, completed: 0, paused: 0 } }));
    }
  } catch (error: any) {
    console.log('Error refreshing goals:', error);

    // Handle 404 gracefully - show empty state
    if (error?.response?.status === 404) {
      store.dispatch(setGoals({ goals: [], stats: { total: 0, active: 0, completed: 0, paused: 0 } }));
    } else {
      store.dispatch(setGoals({ goals: [], stats: { total: 0, active: 0, completed: 0, paused: 0 } }));
      store.dispatch(setError(error?.message || 'Failed to refresh goals'));
    }
  } finally {
    store.dispatch(setRefreshing(false));
  }
};

/**
 * Create a new goal
 */
export const createNewGoal = async (goalData: any) => {
  try {
    const state: any = store.getState();
    const userId = state.userData?.userDetails?.userId;

    if (!userId) {
      console.log('❌ Error: userId not found in Redux state');
      return { success: false, error: 'User authentication error' };
    }

    const payload = { ...goalData, user_id: Number(userId) };

    console.log('🎯 Creating new goal:', payload);
    const response = await createGoal(payload);

    if (response.success && response.data) {
      console.log('✅ Goal created successfully:', response.data);

      // Add the new goal to the list (construct full goal object)
      const newGoal = {
        id: response.data.goalId,
        ...goalData,
        progress: response.data.progress || 0,
        createdAt: response.data.createdAt,
        status: 'active',
      };

      store.dispatch(addGoalToList(newGoal));

      return { success: true, data: response.data };
    } else {
      return { success: false, error: response.message || 'Failed to create goal' };
    }
  } catch (error: any) {
    console.log('❌ Error creating goal:', error?.message);
    return { success: false, error: error?.message || 'Failed to create goal' };
  }
};

/**
 * Update an existing goal
 */
export const updateExistingGoal = async (goalId: string | number, goalData: any) => {
  try {
    const state: any = store.getState();
    const userId = state.userData?.userDetails?.userId;

    if (!userId) {
      return { success: false, error: 'User authentication error' };
    }

    const payload = { ...goalData, user_id: Number(userId) };

    console.log('🎯 Updating goal:', goalId, payload);
    const response = await updateGoal(goalId.toString(), payload);

    if (response.success) {
      console.log('✅ Goal updated successfully');

      // Update the goal in Redux
      store.dispatch(updateGoalInList({ goalId, updates: goalData }));

      return { success: true, data: response.data };
    } else {
      return { success: false, error: response.message || 'Failed to update goal' };
    }
  } catch (error: any) {
    console.log('❌ Error updating goal:', error?.message);
    return { success: false, error: error?.message || 'Failed to update goal' };
  }
};

/**
 * Mark goal as completed
 */
export const markGoalComplete = async (goalId: string | number) => {
  try {
    const state: any = store.getState();
    const userId = state.userData?.userDetails?.userId;

    if (!userId) {
      return { success: false, error: 'User authentication error' };
    }

    console.log('🎯 Marking goal as complete:', goalId);
    const response = await completeGoal(goalId.toString(), userId);

    if (response.success && response.data) {
      console.log('✅ Goal marked as completed');

      // Update the goal in Redux
      store.dispatch(updateGoalInList({
        goalId,
        updates: {
          status: 'completed',
          progress: 100,
          completedAt: response.data.completedAt,
        }
      }));

      return { success: true, data: response.data };
    } else {
      return { success: false, error: response.message || 'Failed to mark goal as complete' };
    }
  } catch (error: any) {
    console.log('❌ Error marking goal as complete:', error?.message);

    if (error?.response?.status === 404) {
      return { success: false, error: 'Complete goal endpoint not implemented yet' };
    }

    return { success: false, error: error?.message || 'Failed to mark goal as complete' };
  }
};

/**
 * Delete a goal
 */
export const deleteExistingGoal = async (goalId: string | number) => {
  try {
    const state: any = store.getState();
    const userId = state.userData?.userDetails?.userId;

    if (!userId) {
      return { success: false, error: 'User authentication error' };
    }

    console.log('🎯 Deleting goal:', goalId);
    const response = await deleteGoal(goalId.toString(), userId);

    if (response.success) {
      console.log('✅ Goal deleted successfully');

      // Remove the goal from Redux
      store.dispatch(removeGoalFromList(goalId));

      return { success: true };
    } else {
      return { success: false, error: response.message || 'Failed to delete goal' };
    }
  } catch (error: any) {
    console.log('❌ Error deleting goal:', error?.message);
    return { success: false, error: error?.message || 'Failed to delete goal' };
  }
};
