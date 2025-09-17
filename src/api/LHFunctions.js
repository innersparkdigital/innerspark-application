/**
 * InnerSpark API Functions
 * @author: InnerSpark Dev Team
 * @date: 2025-09-17
 * @description: API Functions for the InnerSpark API
*/
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import {
     updateUserNotifications, 
     updateUserDetails,
     updateUserNotificationCount,
} from '../features/user/userDataSlice';
import { APIGlobaltHeaders, baseUrlRoot, baseUrlV1 } from './LHAPI';
import { storeItemLS } from '../global/StorageActions';


const baseUrl = baseUrlRoot + baseUrlV1; // Base URL for API requests
APIGlobaltHeaders(); // API Global Headers Invocation 


// ### API FUNCTIONS ###


/**
 * @description: Get App Home Data
 * @param dispatch the dispatch hook reference
 * @param userID the User ID 
 * @param loadingSetter Optional. The loading status setter
 * @returns: user data
 */
export const getAppHomeData = async ({ dispatch, userID, loadingSetter=null }) => {

    try {

        if (loadingSetter != null) { loadingSetter(true); } // set loading state
        console.log("Loading App home data started...");

        const response = await axios.post(`${baseUrl}/app-home`, { "user" : userID, });

        // checking the status
        if (response.status === 200) {

            // If status is successful
            if (response.data.status === "success"){ 
                // all the retrieved data --- just for testing
                // console.log(response.data);

                // Dispatching to Redux Store
                const userNotificationCount = response.data.notifications_count; // notifications count
                const userDetailsData = {
                    userId: response.data.user.userid,
                    name: response.data.user.name,
                    email: response.data.user.email,
                    phone: response.data.user.phone,
                    image: response.data.user.image,
                    pin: response.data.user.pin,
                    email_verified: response.data.user.email_verified,
                    phone_verified: response.data.user.phone_verified,
                    active: response.data.user.active,         
                };


                // console.log("--- App Home User Details ---");
                // console.log(userDetailsData);

                // Dispatching the action to store the data in Redux Store
                dispatch(updateUserNotificationCount(userNotificationCount)); // store notifications count
                dispatch(updateUserDetails(userDetailsData)); // store user details

                // Storing User Data on local storage
                storeItemLS("userDetailsLS", userDetailsData);
                storeItemLS("userNotificationCountLS", userNotificationCount); // Notification Count


                // Reset the loading setter 
                if (loadingSetter != null) { loadingSetter(false); }

                console.log("Loading App home data complete.");

            } else {
                // status == 'failed' --- User not found
                console.log(response.data);

                // Reset the loading setter
                if (loadingSetter != null) { loadingSetter(false); }

            }

        } else {

            throw new Error("loading app data failed.");
        }

        } catch (error) {
            console.log(error.message);
           
            // Reset the loading setter
            if (loadingSetter != null) { loadingSetter(false); }

            console.log("Loading App home data failed.");

    }

}




// ### END OF API FUNCTIONS ###



