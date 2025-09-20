/**
 * Notification Detail Screen - Shows full notification content
 */
import React from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Avatar, Button } from '@rneui/base';
import { appColors, parameters, appFonts } from '../global/Styles';
import { useToast } from 'native-base';
import { NavigationProp, RouteProp } from '@react-navigation/native';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'appointment' | 'reminder' | 'system' | 'event' | 'goal';
  timestamp: string;
  isRead: boolean;
  avatar?: any;
  actionData?: any;
}

interface NotificationDetailScreenProps {
  navigation: NavigationProp<any>;
  route: RouteProp<{ params: { notification: Notification } }, 'params'>;
}

const NotificationDetailScreen: React.FC<NotificationDetailScreenProps> = ({ navigation, route }) => {
  const { notification } = route.params;
  const toast = useToast();

  const formatFullTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getNotificationIcon = (type: string) => {
    const iconMap = {
      appointment: { name: 'event', color: appColors.AppBlue },
      reminder: { name: 'notifications', color: '#FF9800' },
      system: { name: 'info', color: appColors.grey2 },
      event: { name: 'event-available', color: '#4CAF50' },
      goal: { name: 'flag', color: '#9C27B0' },
    };
    return iconMap[type] || iconMap.system;
  };

  const handleAction = () => {
    const { type, actionData } = notification;
    
    switch (type) {
      case 'appointment':
        if (actionData?.therapistId) {
          navigation.navigate('TherapistDetailScreen', { therapistId: actionData.therapistId });
        }
        break;
      case 'event':
        if (actionData?.eventId) {
          navigation.navigate('EventDetailScreen', { eventId: actionData.eventId });
        }
        break;
      case 'goal':
        if (actionData?.goalId) {
          navigation.navigate('GoalDetailScreen', { goalId: actionData.goalId });
        }
        break;
      case 'reminder':
        navigation.navigate('LHBottomTabs', { screen: 'MoodScreen' });
        break;
      default:
        toast.show({
          description: 'Action completed',
          duration: 2000,
        });
    }
  };

  const getActionButtonText = () => {
    switch (notification.type) {
      case 'appointment': return 'View Appointment';
      case 'event': return 'View Event';
      case 'goal': return 'View Goal';
      case 'reminder': return 'Log Mood';
      default: return 'Take Action';
    }
  };

  const iconConfig = getNotificationIcon(notification.type);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={appColors.StatusBarColor} barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" type="material" color={appColors.grey1} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Notification Icon/Avatar */}
          <View style={styles.iconSection}>
            {notification.avatar ? (
              <Avatar source={notification.avatar} size={80} rounded />
            ) : (
              <View style={[styles.iconWrapper, { backgroundColor: iconConfig.color + '20' }]}>
                <Icon
                  name={iconConfig.name}
                  type="material"
                  color={iconConfig.color}
                  size={40}
                />
              </View>
            )}
          </View>

          {/* Notification Content */}
          <View style={styles.contentSection}>
            <Text style={styles.title}>{notification.title}</Text>
            
            <View style={styles.metaRow}>
              <View style={styles.typeChip}>
                <Text style={styles.typeText}>{notification.type.toUpperCase()}</Text>
              </View>
              <Text style={styles.timestamp}>
                {formatFullTimestamp(notification.timestamp)}
              </Text>
            </View>

            <Text style={styles.message}>{notification.message}</Text>

            {/* Extended content based on type */}
            {notification.type === 'appointment' && (
              <View style={styles.extendedContent}>
                <Text style={styles.extendedTitle}>Appointment Details</Text>
                <Text style={styles.extendedText}>
                  Don't forget to prepare any questions you'd like to discuss during your session. 
                  You can reschedule or cancel up to 24 hours before your appointment.
                </Text>
              </View>
            )}

            {notification.type === 'goal' && (
              <View style={styles.extendedContent}>
                <Text style={styles.extendedTitle}>Goal Progress</Text>
                <Text style={styles.extendedText}>
                  Keep up the great work! Consistency is key to building healthy habits. 
                  Check your progress and set new milestones to stay motivated.
                </Text>
              </View>
            )}

            {notification.type === 'event' && (
              <View style={styles.extendedContent}>
                <Text style={styles.extendedTitle}>Event Information</Text>
                <Text style={styles.extendedText}>
                  This event is designed to help you learn valuable skills for mental health support. 
                  Registration includes all materials and a certificate of completion.
                </Text>
              </View>
            )}

            {notification.type === 'reminder' && (
              <View style={styles.extendedContent}>
                <Text style={styles.extendedTitle}>Why Track Your Mood?</Text>
                <Text style={styles.extendedText}>
                  Regular mood tracking helps identify patterns and triggers, leading to better 
                  self-awareness and improved mental health outcomes.
                </Text>
              </View>
            )}

            {notification.type === 'system' && (
              <View style={styles.extendedContent}>
                <Text style={styles.extendedTitle}>What's New</Text>
                <Text style={styles.extendedText}>
                  We're constantly improving your experience with new features and enhancements. 
                  Update to the latest version to enjoy all the benefits.
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Action Button */}
      {notification.actionData && (
        <View style={styles.bottomContainer}>
          <Button
            title={getActionButtonText()}
            onPress={handleAction}
            buttonStyle={styles.actionButton}
            titleStyle={styles.actionButtonText}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.AppLightGray,
  },
  header: {
    backgroundColor: appColors.CardBackground,
    paddingTop: parameters.headerHeightS,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  iconSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentSection: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: appFonts.headerTextBold,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  typeChip: {
    backgroundColor: appColors.AppLightGray,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  typeText: {
    fontSize: 12,
    color: appColors.AppBlue,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  timestamp: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
  },
  message: {
    fontSize: 16,
    color: appColors.grey1,
    lineHeight: 24,
    marginBottom: 20,
    fontFamily: appFonts.headerTextRegular,
  },
  extendedContent: {
    borderTopWidth: 1,
    borderTopColor: appColors.AppLightGray,
    paddingTop: 20,
  },
  extendedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: 12,
    fontFamily: appFonts.headerTextBold,
  },
  extendedText: {
    fontSize: 15,
    color: appColors.grey2,
    lineHeight: 22,
    fontFamily: appFonts.headerTextRegular,
  },
  bottomContainer: {
    backgroundColor: appColors.CardBackground,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: 25,
    paddingVertical: 15,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
});

export default NotificationDetailScreen;
