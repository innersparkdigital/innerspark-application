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

// Events slice
import eventsReducer from '../features/events/eventsSlice';

// Emergency slice
import emergencyReducer from '../features/emergency/emergencySlice';

// Notifications slice
import notificationsReducer from '../features/notifications/notificationSlice';

// Dashboard slice
import dashboardReducer from '../features/dashboard/dashboardSlice';

// Therapists slice
import therapistsReducer from '../features/therapists/therapistsSlice';

// Appointments slice
import appointmentsReducer from '../features/appointments/appointmentsSlice';

// Goals slice
import goalsReducer from '../features/goals/goalsSlice';

// Reports slice
import reportsReducer from '../features/reports/reportsSlice';

// Wallet slice
import walletReducer from '../features/wallet/walletSlice';

// Support Tickets slice
import supportTicketsReducer from '../features/supportTickets/supportTicketsSlice';

// Chat slice
import chatReducer from '../features/chat/chatSlice';

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
        
        // Emergency reducer (contacts, crisis lines, safety plan)
        emergency: emergencyReducer,
        
        // User settings reducer (appearance, accessibility, etc.)
        userSettings: userSettingsReducer,
        
        // Notifications reducer
        notifications: notificationsReducer,
        
        // Dashboard reducer (home screen data)
        dashboard: dashboardReducer,
        
        // Therapist-specific reducers
        therapistDashboard: therapistDashboardReducer,
        therapistAppointments: therapistAppointmentsReducer,
        therapistClients: therapistClientsReducer,
        therapistRequests: therapistRequestsReducer,
        therapistGroups: therapistGroupsReducer,
        therapistAnalytics: therapistAnalyticsReducer,
        
        // Events reducer
        events: eventsReducer,
        
        // Therapists reducer (client-side therapist directory)
        therapists: therapistsReducer,
        
        // Appointments reducer (client appointments management)
        appointments: appointmentsReducer,
        
        // Goals reducer (client goals management)
        goals: goalsReducer,
        
        // Reports reducer (wellness reports and analytics)
        reports: reportsReducer,
        
        // Wallet reducer (wellness vault and transactions)
        wallet: walletReducer,
        
        // Support Tickets reducer
        supportTickets: supportTicketsReducer,
        chat: chatReducer,
    }
})