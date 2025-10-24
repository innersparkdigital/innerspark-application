import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../features/user/userSlice';
import userDataReducer from '../features/user/userDataSlice';
import signupFlowReducer from '../features/flow/signupFlowSlice';
import appSessionReducer from '../features/app/appSessionSlice';
import appStartReducer from '../features/app/appStartSlice';

// Therapist-specific slices
import therapistDashboardReducer from '../features/therapist/dashboardSlice';
import therapistAppointmentsReducer from '../features/therapist/appointmentsSlice';
import therapistClientsReducer from '../features/therapist/clientsSlice';
import therapistRequestsReducer from '../features/therapist/requestsSlice';
import therapistGroupsReducer from '../features/therapist/groupsSlice';
import therapistAnalyticsReducer from '../features/therapist/analyticsSlice';


export default configureStore({
    reducer: {
        user: userReducer,
        userData: userDataReducer,
        signupFlow: signupFlowReducer,
        //recycleFlow: recycleFlowReducer,
        appSession: appSessionReducer,
        appStart: appStartReducer,
        
        // Therapist-specific reducers
        therapistDashboard: therapistDashboardReducer,
        therapistAppointments: therapistAppointmentsReducer,
        therapistClients: therapistClientsReducer,
        therapistRequests: therapistRequestsReducer,
        therapistGroups: therapistGroupsReducer,
        therapistAnalytics: therapistAnalyticsReducer,

       
    }
})