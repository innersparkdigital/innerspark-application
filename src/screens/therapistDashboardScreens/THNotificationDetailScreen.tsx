/**
 * Therapist Notification Detail Screen - Shows full notification content for therapists
 */
import React, { useEffect } from 'react';
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
import { useSelector } from 'react-redux';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { scale, moderateScale } from '../../global/Scaling';
import { useToast } from 'native-base';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { markNotificationRead } from '../../utils/notificationManager';

interface Notification {
  id: string | number;
  title: string;
  message: string;
  type: string;
  timestamp: string;
  isRead: boolean;
  avatar?: any;
  actionData?: any;
}

interface THNotificationDetailScreenProps {
  navigation: NavigationProp<any>;
  route: RouteProp<{ params: { notification: Notification } }, 'params'>;
}

const THNotificationDetailScreen: React.FC<THNotificationDetailScreenProps> = ({ navigation, route }) => {
  const { notification } = route.params;
  const userDetails = useSelector((state: any) => state.userData.userDetails);
  const toast = useToast();

  // Mark as read when opened
  useEffect(() => {
    if (!notification.isRead && userDetails?.userId) {
      markNotificationRead(notification.id.toString(), userDetails.userId);
    }
  }, []);

  const formatFullTimestamp = (timestamp: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return timestamp;

    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getIconConfig = (type: string) => {
    const lowerType = type?.toLowerCase() || '';
    if (lowerType.includes('appointment')) return { name: 'event', color: appColors.AppBlue };
    if (lowerType.includes('message')) return { name: 'chat', color: '#FF9800' };
    if (lowerType.includes('group')) return { name: 'groups', color: appColors.AppGreen };
    if (lowerType.includes('alert') || lowerType.includes('system')) return { name: 'info', color: appColors.grey2 };
    return { name: 'notifications', color: appColors.AppBlue };
  };

  const handleAction = () => {
    const { type, actionData } = notification;
    const lowerType = type?.toLowerCase() || '';

    if (lowerType.includes('appointment') && actionData?.appointmentId) {
      // Navigate to therapist appointment details (assuming we have such a screen)
      navigation.navigate('THAppointmentDetailsScreen', { 
        appointment: { id: actionData.appointmentId } 
      });
    } else if (lowerType.includes('group') && actionData?.groupId) {
      navigation.navigate('THGroupDetailsScreen', { 
        group: { id: actionData.groupId } 
      });
    } else if (lowerType.includes('message') && actionData?.clientId) {
      navigation.navigate('THChatConversationScreen', { 
        client: { id: actionData.clientId, name: actionData.clientName || 'Client' } 
      });
    } else {
      toast.show({
        description: 'No specific action available for this notification',
        duration: 2000,
      });
    }
  };

  const getActionButtonText = () => {
    const lowerType = notification.type?.toLowerCase() || '';
    if (lowerType.includes('appointment')) return 'View Appointment';
    if (lowerType.includes('group')) return 'View Group';
    if (lowerType.includes('message')) return 'Open Chat';
    return 'Take Action';
  };

  const config = getIconConfig(notification.type);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={appColors.CardBackground} barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" type="material" color={appColors.grey1} size={moderateScale(24)} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Update</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.iconSection}>
            <View style={[styles.iconWrapper, { backgroundColor: config.color + '20' }]}>
              <Icon
                name={config.name}
                type="material"
                color={config.color}
                size={scale(40)}
              />
            </View>
          </View>

          <View style={styles.contentSection}>
            <Text style={styles.title}>{notification.title}</Text>

            <View style={styles.metaRow}>
              <View style={styles.typeChip}>
                <Text style={styles.typeText}>{notification.type?.replace('_', ' ').toUpperCase() || 'NOTIFICATION'}</Text>
              </View>
              <Text style={styles.timestamp}>
                {formatFullTimestamp(notification.timestamp)}
              </Text>
            </View>

            <Text style={styles.message}>{notification.message}</Text>

            {/* Support contexts */}
            <View style={styles.extendedContent}>
              <Text style={styles.extendedTitle}>InnerSpark Support</Text>
              <Text style={styles.extendedText}>
                We ensure you're always updated with client progress and session changes. 
                If you have questions about this notification, please contact our support team.
              </Text>
            </View>
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
    paddingBottom: scale(15),
    paddingHorizontal: scale(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: appColors.black,
    shadowOffset: { width: 0, height: scale(1) },
    shadowOpacity: 0.1,
    shadowRadius: scale(2),
  },
  backButton: {
    padding: scale(8),
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  placeholder: {
    width: scale(40),
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: scale(20),
  },
  iconSection: {
    alignItems: 'center',
    marginBottom: scale(24),
  },
  iconWrapper: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentSection: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(20),
    padding: scale(20),
    marginBottom: scale(20),
  },
  title: {
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: scale(16),
    textAlign: 'center',
    fontFamily: appFonts.headerTextBold,
    lineHeight: scale(28),
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(20),
    flexWrap: 'wrap',
  },
  typeChip: {
    backgroundColor: appColors.AppLightGray,
    borderRadius: scale(12),
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    marginBottom: scale(4),
  },
  typeText: {
    fontSize: moderateScale(11),
    color: appColors.AppBlue,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  timestamp: {
    fontSize: moderateScale(13),
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
  },
  message: {
    fontSize: moderateScale(15),
    color: appColors.grey1,
    lineHeight: scale(22),
    marginBottom: scale(20),
    fontFamily: appFonts.bodyTextRegular,
  },
  extendedContent: {
    borderTopWidth: 1,
    borderTopColor: appColors.AppLightGray,
    paddingTop: scale(20),
  },
  extendedTitle: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: scale(8),
    fontFamily: appFonts.headerTextBold,
  },
  extendedText: {
    fontSize: moderateScale(14),
    color: appColors.grey3,
    lineHeight: scale(20),
    fontFamily: appFonts.bodyTextRegular,
    fontStyle: 'italic',
  },
  bottomContainer: {
    backgroundColor: appColors.CardBackground,
    padding: scale(20),
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(-2) },
    shadowOpacity: 0.1,
    shadowRadius: scale(4),
  },
  actionButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: scale(30),
    paddingVertical: scale(14),
  },
  actionButtonText: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    fontFamily: appFonts.buttonTextBold,
  },
});

export default THNotificationDetailScreen;
