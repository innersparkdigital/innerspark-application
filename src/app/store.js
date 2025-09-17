import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../features/user/userSlice';
import userDataReducer from '../features/user/userDataSlice';
import signupFlowReducer from '../features/flow/signupFlowSlice';
import appSessionReducer from '../features/app/appSessionSlice';
import appStartReducer from '../features/app/appStartSlice';
//import recycleDataReducer from '../features/recycle/recycleDataSlice';
//import userSettingsReducer from '../features/settings/userSettingsSlice';
//import giftcardDataReducer from '../features/giftcard/giftcardDataSlice';
//import utilityDataReducer from '../features/utility/utilityDataSlice';
//import donateDataReducer from '../features/donate/donateDataSlice'; 



export default configureStore({
    reducer: {
        user: userReducer,
        userData: userDataReducer,
        signupFlow: signupFlowReducer,
        //recycleFlow: recycleFlowReducer,
        appSession: appSessionReducer,
        appStart: appStartReducer,
        //recycleData: recycleDataReducer,
        //userSettings: userSettingsReducer,
        //giftcardData: giftcardDataReducer,
        //utilityData: utilityDataReducer,
        //donateData: donateDataReducer,
       
    }
})