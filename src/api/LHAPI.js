import axios from 'axios';
import Config from 'react-native-config';

export const baseUrlRoot = Config.API_BASE_URL || 'https://server.innersparkafrica.us/api';
export const baseUrlV1 = Config.API_VERSION || ''; // if version is present, it will use /v1 or /v2, etc.
export const authToken = Config.AUTH_TOKEN; // API Authorization token
// export const apiKey = Config.API_KEY;

export const APIInstance = axios.create({ baseURL: baseUrlRoot + baseUrlV1 }); // Axios instance for API requests

export const baseUrl = baseUrlRoot + baseUrlV1; // Base URL for API requests

// Default global headers
export const APIGlobaltHeaders = () => {
    // axios.defaults.headers.common['Authorization'] = authToken;
    axios.defaults.headers.common['x-api-key'] = authToken;
    axios.defaults.headers.post['Content-Type'] = 'application/json';

}

// Custom Axios Instance for multipart form data -- (i.e avatar, etc)
export const profileInstance = axios.create({
    baseURL: baseUrl,
    //timeout: 1000,
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
