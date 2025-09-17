/**
 * LaundryHouse 
 * Reusable components, methods, functions, etc. 
 * Keep it DRY baby!
 */
import axios from 'axios';
import { Platform } from 'react-native';
import { storeItemLS } from './StorageActions';
import { appImages } from './Data';
import { isValidPhoneNumber, isValidEmailAddress } from './LHValidators';


 // Toast Notifications 
export const notifyWithToast = (toast, description, placement="bottom", duration=1000) => {
    toast.show({ 
      description: description,
      placement: placement,
      duration: duration,
    
    })
}


/** 
 * Display the firstname of the name string which is separated by space 
 * @param {string} fullName - The user fullname that will be split
 * @returns {string} - The First name string is returned
 */
export const getFirstName = (fullName) => {
   return fullName.split(' ')[0];
}


/**
 * Returns the Greeting based on current user time
 * @returns A string containing The greeting based on current time
 */
export const getGreeting = () => {
    const currentHour = new Date().getHours();
    // console.log("Current Hour: ", currentHour);
  
    let greeting;
  
    if (currentHour >= 0 && currentHour < 12) {
        greeting = 'Good Morning';
    } else if (currentHour >= 12 && currentHour < 17) {
        greeting = 'Good Afternoon';
    } else {
        greeting = 'Good Evening';
    }
  
      return greeting;

 }; 


 /**
  * Retuns the day of the Week based on the given year
  * @param {string} date - The date to get the day of the week for.
  * @returns Return the day of the week
  * 
  */
 export const getDayOfWeek = (date) => {
    const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const newDate = new Date(date);
    const day = dayOfWeek[newDate.getDay()];
    return day;
   };

   
/**
 * Pluralize This
 * @param {number} count - The count to check for plurality.
 * @returns {string} - Returns "s" if the count is greater than 1, otherwise returns an empty string.
 * 
 * Example: pluralizeThis(1) // Returns: ""
 * Example: pluralizeThis(2) // Returns: "s"    
 */
export const pluralizeThis = (count) => {
    if(Number(count)) {
        if(Number(count) > 1) {
            return "s";
        } else {
            return "";
        }
    } 
}
 

 /**
  * Get the provider Icon using Biller's name or short code
  * @param network_provider The provider name or short code
  * @returns Return the provider Icon
  */
//  export const getProviderIcon = (network_provider) => {
//     switch (network_provider) {
//         case "AIRTEL":
//             return appImages.airtel;
//             break;

//         case "MTN":
//             return appImages.mtn;
//             break;
    
//         default:
//             return appImages.logoRound;
//             break;
//     }
// }
   

/**
  * Function to determine the phone number operator
  * @param phoneNumber The phone number whose operator is to be determined
  * @returns Return operator as a string. [MTN, ATL, VODAFONE, AIRTEL, OTHER]
  */
export const getPhoneNumberOperator = (phoneNumber) => {
    // Check if the number starts with "+256" (Uganda country code)
    if (phoneNumber.startsWith("+256")) {
        // Extract the next two digits after the country code
        const operatorCode = phoneNumber.substring(4, 6);

        // Check the operator code against registered codes
        switch (operatorCode) {
            case "70":
            case "75":
            case "74":
            case "20":
                return "AIRTEL"; // Airtel Uganda
            case "78":
            case "77":
            case "76":
            case "39":
            case "31":
                return "MTN"; // MTN Uganda
            default:
                return "OTHER"; // Other operators in Uganda
        }
    } else {
        return "OTHER"; // Number doesn't belong to Uganda
    }
}



/**
 * Masks the phone number, leaving only the last four digits visible 
 * and replacing the rest with asterisks.
 * 
 * @param {string} phone - The phone number to be masked.
 * @returns {string} - The masked phone number with asterisks for the first digits.
 * 
 * Example: maskPhoneNumber('+12345678901') // Returns: "*******8901"
 */
export const maskPhoneNumber = (phone) => {
    // Get the last four digits of the phone number using slice
    const lastFourDigits = phone.slice(-4);
    
    // Create a mask for the rest of the phone number using '*' characters
    const mask = '*'.repeat(phone.length - 4);
    
    // Combine the mask and the last four digits to form the masked phone number
    return `${mask}${lastFourDigits}`;
  
  }
  
  
  
  /**
   * Masks the middle part of an email address, showing only the first 
   * and last characters of the username part and the full domain.
   * 
   * @param {string} email - The email address to be masked.
   * @returns {string} - The masked email address with asterisks in the middle.
   * 
   * Example: maskEmail('johndoe@example.com') // Returns: "j*****e@example.com"
   */
  export const maskEmail = (email) => {
    // Split the email into two parts: the username and domain using the '@' symbol
    const [username, domain] = email.split('@');
    
    // Get the first character of the username
    const firstChar = username[0];
    
    // Get the last character of the username
    const lastChar = username[username.length - 1];
    
    // Create a mask for the middle part of the username using '*' characters
    const mask = '*'.repeat(Math.max(username.length - 2, 1)); 
    
    // Combine the first char, mask, last char, and domain to form the masked email
    return `${firstChar}${mask}${lastChar}@${domain}`;
  
  }
  
  
  /**
   * Normalizes a phone number by checking if it starts with a zero.
   * If it does, the zero is removed and the specified calling code is added.
   * 
   * @param {string} phone - The phone number to normalize.
   * @param {string} callingCode - The country calling code to prepend if the phone starts with '0'.
   * @returns {string} - The normalized phone number with the calling code if applicable.
   * 
   * Example: normalizePhone('0123456789', '+256') // Returns: '+256123456789'
   */
  export const normalizePhone = (phone, callingCode) => { 
    let normalizedPhone = '';
  
    // Check if the phone number is valid using isValidPhoneNumber function
    if (isValidPhoneNumber(phone)) { 
        // If the phone starts with '0', remove it and prepend the calling code
        if (phone[0] === "0") { 
            normalizedPhone = callingCode + phone.slice(1); 
        } else { 
            normalizedPhone = phone; // If it doesn't start with '0', return the phone as is
        }
    } else {
        normalizedPhone = phone; // If the phone number is not valid, return it as is
    }
  
    return normalizedPhone; // Return the normalized phone number
  };
  
  

/**
 * Create Form data
 * @param {object} photo - The photo object to be appended to the form data.
 * @param {object} user - The user object to be appended to the form data.
 * @returns {FormData} - The final form data object.
 */
export const createFormData = (photo, user) => {

    const data = new FormData();

    // Append image data
    data.append('image', { 
        name: photo.fileName,
        type: photo.type,
        uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
    });

    data.append('user', user);

    // return the final data
    return data;

};