/**
 * Booking Confirmation Screen - Success screen after booking
 */
import React, { useEffect } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommonActions } from '@react-navigation/native';
import { Icon, Avatar, Button } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { scale, moderateScale } from '../../global/Scaling';
import { useToast } from 'native-base';
import { useSelector } from 'react-redux';
import { resolveSessionType } from '../../utils/appointmentUtils';
import { selectSessionTypes } from '../../features/appointments/appointmentsSlice';

const BookingConfirmationScreen = ({ navigation, route }) => {
  const { therapist, appointmentDetails } = route.params;
  const toast = useToast();
  const sessionTypes = useSelector(selectSessionTypes);
  const userDetails = useSelector((state) => state.userData.userDetails);
  const userAvatar = userDetails?.profileImage || userDetails?.avatar;

  // Animation values
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);



  const handleShareReceipt = async () => {
    try {
      const shareMessage = `Booking Confirmation:\n\nTherapist: ${therapist.name}\nDate: ${appointmentDetails.date}\nTime: ${appointmentDetails.time}\nType: ${appointmentDetails.sessionType || 'Individual Therapy'}\nLocation: ${appointmentDetails.location}\n\nVia InnerSpark App`;
      await Share.share({
        message: shareMessage,
        title: 'Your InnerSpark Appointment',
      });
    } catch (error) {
      toast.show({
        description: 'Failed to share receipt.',
        duration: 2000,
      });
    }
  };

  const handleGoToAppointments = () => {
    // Correctly reset the stack to show the Appointments screen on top of the bottom tabs
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: 'LHBottomTabs' },
          { name: 'AppointmentsScreen' },
        ],
      })
    );
  };

  const handleGoHome = () => {
    // Similarly reset the stack but focused on the bottom tabs (Home/Therapists)
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name: 'LHBottomTabs' }
        ],
      })
    );
  };

  const calculateReminderTime = () => {
    // Standard platform reminder window
    return '24 hours before your session starts';
  };

  const formatDateTime = () => {
    return `${appointmentDetails.date} ${appointmentDetails.time}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={appColors.AppBlue} barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoHome}
        >
          <Icon name="close" type="material" color={appColors.grey1} size={moderateScale(28)} />
        </TouchableOpacity>
        <View style={styles.headerSpacer} />
        <TouchableOpacity onPress={handleShareReceipt} style={styles.shareButton}>
          <Icon name="share" type="material" color={appColors.AppBlue} size={moderateScale(24)} />
        </TouchableOpacity>
        <View style={{ width: scale(15) }} />
        <Avatar
          source={userAvatar ? { uri: userAvatar } : require('../../assets/images/avatar-placeholder.png')}
          size={scale(40)}
          rounded
          containerStyle={{ borderWidth: 1, borderColor: appColors.AppLightGray }}
          avatarStyle={{ resizeMode: 'cover' }}
        />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/* Success Message */}
        <Animated.View
          style={[
            styles.successContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.successIcon}>
            <Icon name="check" type="material" color={appColors.CardBackground} size={moderateScale(32)} />
          </View>
          <Text style={styles.successTitle}>Appointment Confirmed!</Text>
        </Animated.View>

        {/* Appointment Details Card */}
        <Animated.View
          style={[
            styles.appointmentCard,
            { opacity: fadeAnim },
          ]}
        >
          <View style={styles.dateTimeContainer}>
            <Text style={styles.appointmentDate}>
              {appointmentDetails.date}
            </Text>
            <Text style={styles.appointmentTime}>
              {appointmentDetails.time}
            </Text>
          </View>

          <View style={styles.therapistInfo}>
            <Text style={styles.therapistName}>
              {therapist.name} - <Text style={styles.therapistTitle}>Therapist</Text>
            </Text>
          </View>

          <View style={styles.locationContainer}>
            <Icon name="location-on" type="material" color={appColors.grey2} size={moderateScale(18)} />
            <Text style={styles.locationText}>{appointmentDetails.location}</Text>
          </View>
        </Animated.View>

        {/* Success Illustration */}
        <Animated.View
          style={[
            styles.illustrationContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.phoneIllustration}>
            <View style={styles.phoneScreen}>
              <View style={styles.phoneCheckmark}>
                <Icon name="check" type="material" color={appColors.CardBackground} size={moderateScale(40)} />
              </View>
            </View>
            <View style={styles.phoneButton} />
          </View>

          {/* Animated circles around phone */}
          <View style={styles.circleContainer}>
            <View style={[styles.circle, styles.circle1]} />
            <View style={[styles.circle, styles.circle2]} />
          </View>
        </Animated.View>

        {/* Booking Details Summary */}
        <Animated.View
          style={[
            styles.summaryCard,
            { opacity: fadeAnim },
          ]}
        >
          <Text style={styles.summaryTitle}>Booking Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Booking ID:</Text>
            <Text style={styles.summaryValue}>{appointmentDetails.bookingId}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Session Type:</Text>
            <Text style={styles.summaryValue}>{resolveSessionType(appointmentDetails.sessionType, sessionTypes)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Duration:</Text>
            <Text style={styles.summaryValue}>{appointmentDetails.duration || '50 minutes'}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Payment:</Text>
            <Text style={styles.summaryValue}>
              {appointmentDetails.paymentMethod?.name || 'WellnessVault'}
            </Text>
          </View>

          {appointmentDetails.reason && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Reason:</Text>
              <Text style={styles.summaryValue}>{appointmentDetails.reason}</Text>
            </View>
          )}
        </Animated.View>

        {/* Reminder Info */}
        <Animated.View
          style={[
            styles.reminderCard,
            { opacity: fadeAnim },
          ]}
        >
          <Icon name="notifications" type="material" color={appColors.AppBlue} size={moderateScale(24)} />
          <Text style={styles.reminderText}>
            We'll send you a reminder {calculateReminderTime()}
          </Text>
        </Animated.View>

      </ScrollView>

      {/* Action Buttons */}
      <Animated.View
        style={[
          styles.actionsFooter,
          { opacity: fadeAnim },
        ]}
      >


        <TouchableOpacity
          style={styles.appointmentsButton}
          onPress={handleGoToAppointments}
        >
          <Text style={styles.appointmentsButtonText}>Go to Appointments</Text>
        </TouchableOpacity>
      </Animated.View>
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
    paddingBottom: scale(20),
    paddingHorizontal: scale(20),
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: scale(8),
    borderRadius: scale(20),
    marginRight: scale(15),
  },
  headerSpacer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: scale(20),
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: scale(30),
  },
  successIcon: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scale(15),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  successTitle: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  appointmentCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(20),
    padding: scale(25),
    marginBottom: scale(30),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(15),
  },
  appointmentDate: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: appColors.grey1,
    marginRight: scale(15),
    fontFamily: appFonts.bodyTextBold,
  },
  appointmentTime: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: '#4CAF50',
    fontFamily: appFonts.bodyTextBold,
  },
  therapistInfo: {
    marginBottom: scale(15),
  },
  therapistName: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextBold,
  },
  therapistTitle: {
    fontWeight: 'normal',
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    marginLeft: scale(8),
    flex: 1,
    fontFamily: appFonts.bodyTextRegular,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: scale(30),
    position: 'relative',
  },
  phoneIllustration: {
    alignItems: 'center',
    zIndex: 2,
  },
  phoneScreen: {
    width: scale(120),
    height: scale(200),
    backgroundColor: appColors.AppBlue,
    borderRadius: scale(20),
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  phoneCheckmark: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneButton: {
    width: scale(40),
    height: scale(8),
    backgroundColor: appColors.AppBlue,
    borderRadius: scale(4),
    marginTop: scale(10),
  },
  circleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderStyle: 'dashed',
    borderRadius: 1000,
  },
  circle1: {
    width: scale(200),
    height: scale(200),
    opacity: 0.3,
  },
  circle2: {
    width: scale(250),
    height: scale(250),
    opacity: 0.2,
  },
  summaryCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(15),
    padding: scale(20),
    marginBottom: scale(20),
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  summaryTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: scale(15),
    fontFamily: appFonts.bodyTextBold,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(10),
  },
  summaryLabel: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
  },
  summaryValue: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextMedium,
    flex: 1,
    textAlign: 'right',
  },
  reminderCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(15),
    padding: scale(20),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(20),
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  reminderText: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    marginLeft: scale(12),
    flex: 1,
    fontFamily: appFonts.bodyTextRegular,
    textAlign: 'center',
  },
  actionsFooter: {
    backgroundColor: appColors.CardBackground,
    padding: scale(20),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  appointmentsButton: {
    alignItems: 'center',
    paddingVertical: scale(15),
  },
  appointmentsButtonText: {
    fontSize: moderateScale(16),
    color: appColors.AppBlue,
    fontFamily: appFonts.buttonTextMedium,
  },
});

export default BookingConfirmationScreen;
