import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../features/user/userSlice';
import userDataReducer from '../features/user/userDataSlice';
import signupFlowReducer from '../features/flow/signupFlowSlice';
import appSessionReducer from '../features/app/appSessionSlice';
import appStartReducer from '../features/app/appStartSlice';

// Mood tracking slice
import moodReducer from '../features/mood/moodSlice';

// Subscription slice
import subscriptionReducer from '../features/subscription/subscriptionSlice';

// Therapist-specific slices
import therapistDashboardReducer from '../features/therapist/dashboardSlice';
import therapistAppointmentsReducer from '../features/therapist/appointmentsSlice';
import therapistClientsReducer from '../features/therapist/clientsSlice';
import therapistRequestsReducer from '../features/therapist/requestsSlice';
import therapistGroupsReducer from '../features/therapist/groupsSlice';
import therapistAnalyticsReducer from '../features/therapist/analyticsSlice';

// User settings slice
import userSettingsReducer from '../features/settings/userSettingsSlice';


export default configureStore({
    reducer: {
        user: userReducer,
        userData: userDataReducer,
        signupFlow: signupFlowReducer,
        //recycleFlow: recycleFlowReducer,
        appSession: appSessionReducer,
        appStart: appStartReducer,
        
        // Mood tracking reducer
        mood: moodReducer,
        
        // Subscription reducer
        subscription: subscriptionReducer,
        
        // User settings reducer (appearance, accessibility, etc.)
        userSettings: userSettingsReducer,
        
        // Therapist-specific reducers
        therapistDashboard: therapistDashboardReducer,
        therapistAppointments: therapistAppointmentsReducer,
        therapistClients: therapistClientsReducer,
        therapistRequests: therapistRequestsReducer,
        therapistGroups: therapistGroupsReducer,
        therapistAnalytics: therapistAnalyticsReducer,

       
    }
})