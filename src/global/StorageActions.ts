import EncryptedStorage from 'react-native-encrypted-storage'

// Common Local Storage Actions

/* Store Item */
export const storeItemLS = async (key, item) => {
    try {
        await EncryptedStorage.setItem(key, JSON.stringify(item));
        // console.log("User session stored successfully!")
    } catch (error) {
        // there was an error on the native side
        //console.log(error.code)
    }
}


/* Retrieve Item */
export const retrieveItemLS = async (key) => {
    try {
        const retItem = await EncryptedStorage.getItem(key);
        if (retItem !== undefined ) {
            return retItem; // Return the retrieved item
        } else {
            return null;
        }
    } catch( error ) {
        // console.log(error.code);
    }

}


/* Remove Item */
export const removeItemLS = async (key) => {
    try {
        await EncryptedStorage.removeItem(key);
        //console.log("congrats! You've just removed the value!")
    } catch(error){
        // There was an error on the native side
        console.log(error.code);
    }
} 

/* Clear Storage */
export const clearStorage = async () => {
    try {
        await EncryptedStorage.clear();
    } catch (error) {
        console.log(error.code);
    }
}



// --------------------------------------------------------------------------------------

/* Store User Session */
export const storeUserSession = async () => {
    try {
        await EncryptedStorage.setItem("userToken", JSON.stringify(token));
        // console.log("User session stored successfully!")
    } catch (error) {
        // there was an error on the native side
        //console.log(error.code)
    }
}

/* Retrieve User Session */
export const retrieveUserSession = async () => {
    try {
        const session = await EncryptedStorage.getItem("userToken");
        if (session !== undefined ) {
            // congrats! You have retrieved the data
            //console.log(session)
        }
    } catch( error ) {
        // There was an error on the native side
        // console.log(error.code)
    }
}

/* Remove User Session */
export const removeUserSession = async () => {
    try {
        await EncryptedStorage.removeItem("userToken");
        // console.log("congrats! You've just removed the value!");
    } catch(error){
        // There was an error on the native side
        //console.log(error.code)
    }
} 

