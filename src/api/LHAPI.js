import axios from 'axios';
import { API_BASE_URL, API_VERSION, AUTH_TOKEN } from '../config/env';

console.log('🔧 === LHAPI.js LOADED ===');
console.log('  Imported API_BASE_URL:', API_BASE_URL);
console.log('  Imported API_VERSION:', API_VERSION);
console.log('  Imported AUTH_TOKEN:', AUTH_TOKEN);
console.log('🔧 === END LHAPI.js ===');

export const baseUrlRoot = API_BASE_URL;
export const baseUrlV1 = API_VERSION;
export const authToken = AUTH_TOKEN;

export const APIInstance = axios.create({ 
    baseURL: baseUrlRoot + baseUrlV1,
    timeout: 30000, // 30 second timeout to prevent 524 errors
    headers: {
        'x-api-key': authToken,
        'Content-Type': 'application/json',
    }
}); // Axios instance for API requests

export const baseUrl = baseUrlRoot + baseUrlV1; // Base URL for API requests

// Default global headers
export const APIGlobaltHeaders = () => {
    // axios.defaults.headers.common['Authorization'] = authToken;
    axios.defaults.headers.common['x-api-key'] = authToken;
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    // add timeout as well
    axios.defaults.timeout = 30000;

}

// Custom Axios Instance for multipart form data -- (i.e avatar, etc)
export const profileInstance = axios.create({
    baseURL: baseUrl,
    timeout: 60000, // 60 second timeout for file uploads
  });

 // defaults AXIOS form the profile instance
 // profileInstance.defaults.headers.common['Authorization'] = authToken;
 profileInstance.defaults.headers.common['x-api-key'] = authToken;
 //profileInstance.defaults.headers.common['Accept'] = 'application/json';
 profileInstance.defaults.headers.post['Content-Type'] = "multipart/form-data";
 


// #### Refesh or update Application Session Data
// parameters are in order
export const yoUpdateAppBioData = async ( params = {
    userId, 
    dispatch, 
    yoAppBioUpdater : null, 
    userMoodUpdater : null, 
    storageHandler : null,
} ) => {

    console.log("Updating App Bio data...");

    // making a request to the API
    try {
        const response = await axios.post(`${baseUrl}/app-bio`, { user: params.userId });

        // checking the status
        if (response.status === 200) {
            // If status is successful
            if (response.data.status === "success"){ 
                console.log(response.data);

                if ( params.yoAppBioUpdater && params.dispatch ) {
                    params.dispatch(params.yoAppBioUpdater(response.data)); // update redux store App bio data
                    params.storageHandler("yoAppBioLS", response.data); // store App Bio Data locally
                }

                /** Update Mood in real-time and locally */
                if ( params.userMoodUpdater && params.dispatch ) {
                    params.dispatch(params.userMoodUpdater(response.data.mood)); 
                    params.storageHandler("userMoodLS", response.data.mood); // Local Mood for the logged in user
                }

                console.log("Updating App bio data Completed...");

            } else {
                console.log(response.data);
                console.log("An error has occurred."); // what exactly went wrong?
            }

        } else {

            throw new Error("error while updating app data.");

        }

    } catch (error) {
        console.log(error.message);
        // notifyWithToast("Oops? There's been an error!"); // do we need this
    }

}
