import { Alert, Platform } from 'react-native';

export type NotificationOptions = {
  title: string;
  message: string;
};

// Placeholder local notification utility.
// Integrate with a real library later (e.g., Notifee or react-native-push-notification).
const LocalNotification = {
  notify({ title, message }: NotificationOptions) {
    // Minimal fallback using Alert as a placeholder for local notifications
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      Alert.alert(title, message);
    }
  },
};

export default LocalNotification;
