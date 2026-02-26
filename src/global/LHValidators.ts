/**
 * InnerSpark 
 * Reusable Validators
 */

import { Platform } from 'react-native';
import { z } from 'zod';

// Regex patterns for validation
const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

// Phone regex: Requires country code (+256) OR leading zero (0), followed by exactly 9 digits
// Examples: +256705161188, +256 705161188, 0705161188
// Note: Spaces are removed before validation on Android
const phoneRegex = /^(\+\d{3}|0)\d{9}$/;

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


/**
 * Check if User email is verified. 0 = not verified, 1 = verified
 * This checks the value of the field rather than the email validity
 * @param value - The email to validate.
 * @returns Returns true if the email is verified, false if it is not.
 * 
 * Example: isEmailVerified(0) // Returns: false
 * Example: isEmailVerified(1) // Returns: true
 */
export const isEmailVerified = (value: number | string): boolean => {
  return value === 1 || value === '1';
};

/**
 * Check if User phone is verified. 0 = not verified, 1 = verified
 * This checks the value of the field rather than the phone validity
 * @param value - The phone to validate.
 * @returns Returns true if the phone is verified, false if it is not.
 * 
 * Example: isPhoneVerified(0) // Returns: false
 * Example: isPhoneVerified(1) // Returns: true
 */
export const isPhoneVerified = (value: number | string): boolean => {
  return value === 1 || value === '1';
};

/**
 * Relationship Validator - must be at least 2 characters, max 30 characters
 * Can contain letters, spaces, hyphens, and apostrophes
 * Cannot start with a space
 * @param value - The relationship to validate.
 * @returns Returns true if the relationship is valid, false if it is not.
 * 
 * Example: isValidRelationship('Mother') // Returns: true
 * Example: isValidRelationship('Best Friend') // Returns: true
 * Example: isValidRelationship('M') // Returns: false (too short)
 */
export const isValidRelationship = (value: string): boolean => {
  if (!value || value.length < 2 || value.length > 30) return false;
  if (value.startsWith(' ')) return false;
  return /^[a-zA-Z\s\-']+$/.test(value);
};


// ─────────────────────────────────────────────────────────────────────────────
// Event Form Validation (Zod v3)
// ─────────────────────────────────────────────────────────────────────────────

const EVENT_CATEGORIES = ['Workshop', 'Training', 'Seminar', 'Summit'] as const;

/**
 * Zod v3 schema for creating or editing a therapist event.
 * Cross-field checks (end > start, date not past) are handled in validateEventForm().
 */
export const eventFormSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be 100 characters or fewer')
    .refine((v) => v.trim().length > 0, 'Title cannot be blank'),

  description: z
    .string({ required_error: 'Description is required' })
    .min(20, 'Description must be at least 20 characters')
    .max(1000, 'Description must be 1 000 characters or fewer')
    .refine((v) => v.trim().length > 0, 'Description cannot be blank'),

  category: z.enum(EVENT_CATEGORIES, {
    errorMap: () => ({ message: 'Please select a valid category' }),
  }),

  location: z
    .string({ required_error: 'Location is required' })
    .min(3, 'Location must be at least 3 characters')
    .max(200, 'Location is too long'),

  maxAttendees: z
    .number({ invalid_type_error: 'Max attendees must be a number', required_error: 'Max attendees is required' })
    .int('Max attendees must be a whole number')
    .min(1, 'At least 1 attendee is required')
    .max(10000, 'Max attendees cannot exceed 10 000'),

  price: z
    .number({ invalid_type_error: 'Price must be a number', required_error: 'Price is required' })
    .min(0, 'Price cannot be negative')
    .max(10_000_000, 'Price seems too high'),

  date: z.date({ required_error: 'Event date is required' }),
  startTime: z.date({ required_error: 'Start time is required' }),
  endTime: z.date({ required_error: 'End time is required' }),
});

export type EventFormData = z.infer<typeof eventFormSchema>;
export type EventFormErrors = Partial<Record<keyof EventFormData, string>>;

/**
 * Validates the event creation / edit form using the eventFormSchema.
 * Returns a record of { fieldName: errorMessage }. An empty object means the form is valid.
 * Cross-field rules (end time after start, date not in the past) are also applied here.
 *
 * @param data - The form data to validate, typed as EventFormData.
 * @returns An EventFormErrors object mapping each invalid field to its error message.
 *
 * Example: validateEventForm({ title: 'Hi', ... }) // Returns: { title: 'Title must be at least 5 characters' }
 * Example: validateEventForm({ ...validData }) // Returns: {} (empty = valid)
 */
export const validateEventForm = (data: EventFormData): EventFormErrors => {
  const errors: EventFormErrors = {};

  const result = eventFormSchema.safeParse(data);
  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof EventFormData;
      if (field && !errors[field]) {
        errors[field] = issue.message;
      }
    }
  }

  // Cross-field: end time must be strictly after start time
  if (!errors.endTime && !errors.startTime && data.endTime <= data.startTime) {
    errors.endTime = 'End time must be after start time';
  }

  // Cross-field: event date cannot be in the past
  if (!errors.date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (data.date < today) {
      errors.date = 'Event date cannot be in the past';
    }
  }

  return errors;
};

// ─────────────────────────────────────────────────────────────────────────────
// Feedback Form Validations (Zod v3)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Zod v3 schema for Post-Session Feedback.
 */
export const postSessionFeedbackSchema = z.object({
  overallRating: z.number().min(1, 'Overall rating is required').max(5),
  therapistRating: z.number().min(1, 'Therapist rating is required').max(5),
  sessionEffectiveness: z.number().min(1).max(5),
  communicationRating: z.number().min(1).max(5),
  environmentRating: z.number().min(1).max(5),
  whatWentWell: z
    .string({ required_error: 'This field is required' })
    .min(10, 'Please provide more detail (minimum 10 characters)')
    .max(500, 'Keep it under 500 characters'),
  goalProgress: z
    .string({ required_error: 'This field is required' })
    .min(5, 'Please describe your progress toward goals')
    .max(300, 'Keep it under 300 characters'),
  recommendToOthers: z.boolean({
    required_error: 'Please indicate if you would recommend this therapist',
    invalid_type_error: 'Please indicate if you would recommend this therapist'
  }),
});

export type PostSessionFeedbackData = z.infer<typeof postSessionFeedbackSchema>;
export type PostSessionFeedbackErrors = Partial<Record<keyof PostSessionFeedbackData, string>>;

export const validatePostSessionFeedback = (data: PostSessionFeedbackData): PostSessionFeedbackErrors => {
  const errors: PostSessionFeedbackErrors = {};
  const result = postSessionFeedbackSchema.safeParse(data);

  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof PostSessionFeedbackData;
      if (field && !errors[field]) {
        errors[field] = issue.message;
      }
    }
  }
  return errors;
};

/**
 * Zod v3 schema for General Feedback (SendFeedbackScreen).
 */
export const sendFeedbackSchema = z.object({
  type: z.enum(['bug', 'feature', 'improvement', 'compliment', 'other']),
  subject: z
    .string({ required_error: 'Subject is required' })
    .min(3, 'Subject must be at least 3 characters')
    .max(100, 'Subject is too long'),
  message: z
    .string({ required_error: 'Message is required' })
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message is too long'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),
});

export type SendFeedbackData = z.infer<typeof sendFeedbackSchema>;
export type SendFeedbackErrors = Partial<Record<keyof SendFeedbackData, string>>;

export const validateSendFeedback = (data: SendFeedbackData): SendFeedbackErrors => {
  const errors: SendFeedbackErrors = {};
  const result = sendFeedbackSchema.safeParse(data);

  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof SendFeedbackData;
      if (field && !errors[field]) {
        errors[field] = issue.message;
      }
    }
  }
  return errors;
};

