/**
 * InnerSpark 
 * Reusable Validators
 */

import { Platform } from 'react-native';

// Regex patterns for validation
const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
// the phone regex, if a phone has 9 digits it's not valid, it must be 10 digits if the first digit is 0 and 13+ and not more than 15 if the country code is included (e.g +256704123456)
const phoneRegex = /^(\+[1-9]\d{1,14}|0\d{9})$/; // phone number regex

// Helper function to clean input on Android
const cleanInput = (value: string): string => {
  return Platform.OS === 'android' ? value.replace(/ /g, '') : value;
};

/** Email or Phone Number Validator 
 * @param value - The value to validate.
 * @returns Returns true if the value is a valid email or phone number, false if it is not.
 * 
 * Example: isValidEmailOrPhone('john.doe@example.com') // Returns: true
 * Example: isValidEmailOrPhone('+256704123456') // Returns: true
 * Example: isValidEmailOrPhone('invalid-value') // Returns: false
 */
export const isValidEmailOrPhone = (value: string): boolean => {
  const cleanedValue = cleanInput(value);
  
  // Try email validation first
  if (emailRegex.test(cleanedValue)) return true;
  
  // Try phone validation
  return phoneRegex.test(cleanedValue);
};

/** Phone Number Validator 
 * @param value - The phone number to validate.
 * @returns Returns true if the phone number is valid, false if it is not.
 * 
 * Example: isValidPhoneNumber('+256704123456') // Returns: true
 * Example: isValidPhoneNumber('1234567890') // Returns: false
 */
export const isValidPhoneNumber = (value: string): boolean => {
  const cleanedValue = cleanInput(value);
  return phoneRegex.test(cleanedValue);
};

/** Email address validator 
 * @param value - The email address to validate.
 * @returns Returns true if the email address is valid, false if it is not.
 * 
 * Example: isValidEmailAddress('john.doe@example.com') // Returns: true
 * Example: isValidEmailAddress('invalid-email') // Returns: false
 */
export const isValidEmailAddress = (value: string): boolean => {
  const cleanedValue = cleanInput(value);
  return emailRegex.test(cleanedValue);
};

/** Name Validator - must be at least 3 characters and only alphabets and spaces
 * Name can't be numbers or special characters 
 * max length is 30 characters
 * cannot start with a space
 * @param value - The name to validate.
 * @returns Returns true if the name is valid, false if it is not.
 * 
 * Example: isValidName('John') // Returns: true
 * Example: isValidName('Jo') // Returns: false
 */
export const isValidName = (value: string): boolean => {
  if (value.length < 3 || value.length > 20) return false;
  if (value.startsWith(' ')) return false;
  return /^[a-zA-Z\s]+$/.test(value);
};


/**
 * Checks if the provided login type is 'email'.
 * 
 * @param type - The login type, which can be either 'email' or 'phone'.
 * @returns Returns true if the type is 'email', false if it is not.
 * 
 * Example: isEmailLoginType('email') // Returns: true
 * Example: isEmailLoginType('phone') // Returns: false
 */
export const isEmailLoginType = (type: string): boolean => {
  return type === 'email';
};

/**
 * Password Validator - must be at least 8 characters
 * @param value - The password to validate.
 * @returns Returns true if the password is at least 8 characters, false if it is not.
 * 
 * Example: isValidPassword('password123') // Returns: true
 * Example: isValidPassword('pass') // Returns: false
 */
export const isValidPassword = (value: string): boolean => {
  return value.length >= 8;
};