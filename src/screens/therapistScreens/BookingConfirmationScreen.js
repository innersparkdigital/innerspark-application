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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Avatar, Button } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';

const BookingConfirmationScreen = ({ navigation, route }) => {
  const { therapist, appointmentDetails } = route.params;
  const toast = useToast();
  
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

  const handleAddToCalendar = () => {
    toast.show({
      description: 'Appointment added to your calendar',
      duration: 2000,
    });
  };

  const handleGoToAppointments = () => {
    navigation.navigate('AppointmentsScreen');
  };

  const calculateReminderTime = () => {
    // Mock calculation - in real app, this would calculate actual time difference
    return '2 days 3 hours before the appointment';
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
          onPress={() => navigation.navigate('LHBottomTabs', { screen: 'TherapistsScreen' })}
        >
          <Icon name="arrow-back" type="material" color={appColors.grey1} size={24} />
        </TouchableOpacity>
        <View style={styles.headerSpacer} />
        <Avatar
          source={therapist.image}
          size={40}
          rounded
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
            <Icon name="check" type="material" color={appColors.CardBackground} size={32} />
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
            <Icon name="location-on" type="material" color={appColors.grey2} size={18} />
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
                <Icon name="check" type="material" color={appColors.CardBackground} size={40} />
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
            <Text style={styles.summaryValue}>{appointmentDetails.sessionType || 'Individual Therapy'}</Text>
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
          <Icon name="notifications" type="material" color={appColors.AppBlue} size={24} />
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
        <Button
          title="Add to calendar"
          buttonStyle={styles.calendarButton}
          titleStyle={styles.calendarButtonText}
          onPress={handleAddToCalendar}
        />
        
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
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerSpacer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  successIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.appTextBold,
  },
  appointmentCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 20,
    padding: 25,
    marginBottom: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  appointmentDate: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.grey1,
    marginRight: 15,
    fontFamily: appFonts.appTextBold,
  },
  appointmentTime: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    fontFamily: appFonts.appTextBold,
  },
  therapistInfo: {
    marginBottom: 15,
  },
  therapistName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.appTextBold,
  },
  therapistTitle: {
    fontWeight: 'normal',
    color: appColors.grey2,
    fontFamily: appFonts.appTextRegular,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: appColors.grey2,
    marginLeft: 8,
    flex: 1,
    fontFamily: appFonts.appTextRegular,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  phoneIllustration: {
    alignItems: 'center',
    zIndex: 2,
  },
  phoneScreen: {
    width: 120,
    height: 200,
    backgroundColor: appColors.AppBlue,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  phoneCheckmark: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneButton: {
    width: 40,
    height: 8,
    backgroundColor: appColors.AppBlue,
    borderRadius: 4,
    marginTop: 10,
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
    width: 200,
    height: 200,
    opacity: 0.3,
  },
  circle2: {
    width: 250,
    height: 250,
    opacity: 0.2,
  },
  summaryCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: 15,
    fontFamily: appFonts.appTextBold,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.appTextRegular,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.appTextMedium,
    flex: 1,
    textAlign: 'right',
  },
  reminderCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  reminderText: {
    fontSize: 14,
    color: appColors.grey2,
    marginLeft: 12,
    flex: 1,
    fontFamily: appFonts.appTextRegular,
    textAlign: 'center',
  },
  actionsFooter: {
    backgroundColor: appColors.CardBackground,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  calendarButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: 15,
    paddingVertical: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  calendarButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.appTextBold,
  },
  appointmentsButton: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  appointmentsButtonText: {
    fontSize: 16,
    color: appColors.AppBlue,
    fontFamily: appFonts.appTextMedium,
  },
});

export default BookingConfirmationScreen;
