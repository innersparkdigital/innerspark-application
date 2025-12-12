/**
 * Event Detail Screen - Detailed view of mental health events
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  Modal,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Avatar, Button } from '@rneui/base';
import PaymentModal from '../../components/payments/PaymentModal';
import PaymentSuccessModal from '../../components/payments/PaymentSuccessModal';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { isValidPhoneNumber } from '../../global/LHValidators';
import { getPhoneNumberOperator } from '../../global/LHShortcuts';
import { useToast } from 'native-base';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import PaymentStatusPoller from '../../services/PaymentStatusPoller';
import { getEventById, registerForEvent, unregisterFromEvent, getMyEvents } from '../../api/client/events';
import { useSelector, useDispatch } from 'react-redux';
import { addRegisteredEventId, removeRegisteredEventId, selectIsEventRegistered } from '../../features/events/eventsSlice';
import { UPLOADS_BASE_URL } from '../../config/env';
import { getImageSource, FALLBACK_IMAGES } from '../../utils/imageHelpers';

interface Event {
  id: number;
  title: string;
  shortDescription: string;
  description?: string;
  date: string;
  time: string;
  coverImage: any;
  location: string;
  locationLink?: string;
  isOnline: boolean;
  totalSeats: number;
  availableSeats: number;
  price: number;
  currency: string;
  category: string;
  organizer: string;
  organizerImage: any;
  isRegistered: boolean;
  registrationDeadline?: string;
  schedule?: {
    startTime: string;
    endTime: string;
    agenda: Array<{
      time: string;
      activity: string;
      speaker?: string;
    }>;
  };
}

interface EventDetailScreenProps {
  navigation: NavigationProp<any>;
  route: RouteProp<{ params: { event?: Event; eventId?: number } }, 'params'>;
}

const EventDetailScreen: React.FC<EventDetailScreenProps> = ({ navigation, route }) => {
  const { event: passedEvent, eventId } = route.params;
  const toast = useToast();
  const dispatch = useDispatch();
  const userId = useSelector((state: any) => state.userData.userDetails.userId);
  
  // State for event data
  const [event, setEvent] = useState<Event | null>(passedEvent || null);
  const [isLoadingEvent, setIsLoadingEvent] = useState(!passedEvent);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Get registration status from Redux store (single source of truth)
  const isRegistered = useSelector(selectIsEventRegistered(event?.id || 0));
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('wellnessvault');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const walletBalance = 350000;
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [mmStep, setMmStep] = useState<'phone' | 'otp' | 'processing'>('phone');
  const [mmPhone, setMmPhone] = useState('');
  const [mmFormattedPhone, setMmFormattedPhone] = useState('');
  const [mmCountrySupported, setMmCountrySupported] = useState(true);
  const [mmOtp, setMmOtp] = useState('');
  const [mmPaymentRef, setMmPaymentRef] = useState<string | null>(null);
  const [mmError, setMmError] = useState<string>('');
  const [mmOtpAttempts, setMmOtpAttempts] = useState(0);
  const [mmOtpExpiry, setMmOtpExpiry] = useState<number | null>(null);

  const resetToMyEvents = () => {
    // Clear stack and land on EventsScreen (My Events), with LHBottomTabs beneath for back navigation
    navigation.reset({
      index: 1,
      routes: [
        { name: 'LHBottomTabs' } as any,
        { name: 'EventsScreen', params: { initialTab: 'my-events' } } as any,
      ],
    });
  };

  const resetMmState = () => {
    setMmStep('phone');
    setMmPhone('');
    setMmOtp('');
    setMmPaymentRef(null);
    setMmError('');
    setMmOtpAttempts(0);
    setMmOtpExpiry(null);
  };

  // Load event data on mount
  useEffect(() => {
    loadEventData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadEventData = async () => {
    // If event was passed, use it; otherwise fetch by ID
    if (passedEvent) {
      setEvent(passedEvent);
      // Update Redux store with registration status
      if (passedEvent.isRegistered) {
        dispatch(addRegisteredEventId(passedEvent.id));
      }
      setIsLoadingEvent(false);
      return;
    }

    if (!eventId) {
      toast.show({
        description: 'Event not found',
        duration: 3000,
      });
      navigation.goBack();
      return;
    }

    setIsLoadingEvent(true);
    try {
      console.log('🔄 Loading event details for ID:', eventId);
      const response = await getEventById(eventId.toString());
      console.log('✅ Event data loaded:', response);
      
      const eventData = response.data;
      
      // Map API response to Event interface
      const mappedEvent: Event = {
        id: eventData.id,
        title: eventData.title,
        shortDescription: eventData.shortDescription || eventData.description || '',
        description: eventData.description,
        date: eventData.date,
        time: eventData.time,
        coverImage: getImageSource(eventData.coverImage, FALLBACK_IMAGES.event),
        location: eventData.location || 'Location TBD',
        locationLink: eventData.locationLink,
        isOnline: eventData.isOnline || false,
        totalSeats: eventData.totalSeats || 0,
        availableSeats: eventData.availableSeats || 0,
        price: eventData.price || 0,
        currency: eventData.currency || 'UGX',
        category: eventData.category || 'General',
        organizer: eventData.organizer || 'InnerSpark',
        organizerImage: getImageSource(eventData.organizerImage, FALLBACK_IMAGES.avatar),
        isRegistered: eventData.isRegistered || false,
        registrationDeadline: eventData.registrationDeadline,
        schedule: eventData.schedule,
      };
      
      setEvent(mappedEvent);
      
      // Update Redux store with registration status from API
      if (mappedEvent.isRegistered) {
        dispatch(addRegisteredEventId(mappedEvent.id));
      } else {
        dispatch(removeRegisteredEventId(mappedEvent.id));
      }
    } catch (error: any) {
      console.error('❌ Error loading event:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        stack: error.stack,
      });
      
      // Only show user-friendly message in toast
      const userMessage = error.response?.data?.message || 'Failed to load event. Please try again.';
      toast.show({
        description: userMessage,
        duration: 3000,
      });
      navigation.goBack();
    } finally {
      setIsLoadingEvent(false);
    }
  };

  const handleRefresh = async () => {
    if (isRefreshing) return; // Prevent multiple simultaneous refreshes
    
    setIsRefreshing(true);
    try {
      await loadEventData();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRegistration = async () => {
    if (!event) return;
    
    if (!isRegistered && event.availableSeats === 0) {
      toast.show({
        description: 'Sorry, this event is sold out.',
        duration: 3000,
      });
      return;
    }

    // If unregistering, proceed directly
    if (isRegistered) {
      setIsLoading(true);
      try {
        console.log('🔄 Unregistering from event:', event.id);
        await unregisterFromEvent(event.id.toString(), userId);
        
        // Update Redux store immediately
        dispatch(removeRegisteredEventId(event.id));
        
        toast.show({
          description: 'Successfully unregistered from event',
          duration: 3000,
        });
        
        // Reload event data to update seat count
        await loadEventData();
      } catch (error: any) {
        console.error('❌ Unregistration error:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          stack: error.stack,
        });
        
        // Only show user-friendly message in toast
        const userMessage = error.response?.data?.message || 'Unregistration failed. Please try again.';
        toast.show({
          description: userMessage,
          duration: 3000,
        });
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // For paid events, show payment modal
    if (event.price > 0) {
      setShowPaymentModal(true);
    } else {
      // For free events, register directly
      await processRegistration();
    }
  };

  const processRegistration = async (paymentMethod: string = 'free', phoneNumber?: string) => {
    if (!event) return;
    
    setIsLoading(true);
    try {
      console.log('🔄 Registering for event:', event.id);
      await registerForEvent(event.id.toString(), userId, paymentMethod, phoneNumber || '');
      
      // Update Redux store immediately
      dispatch(addRegisteredEventId(event.id));
      
      toast.show({
        description: 'Successfully registered for event!',
        duration: 3000,
      });
      
      // Reload event data to update seat count
      await loadEventData();
    } catch (error: any) {
      console.error('❌ Registration error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        stack: error.stack,
      });
      
      // Check if this might be a duplicate registration error
      const responseData = error.response?.data;
      const isDuplicateRegistration = 
        (responseData?.message?.toLowerCase().includes('already registered')) ||
        (responseData?.details?.toLowerCase().includes('duplicate entry'));
      
      if (isDuplicateRegistration) {
        // Verify actual registration status by checking myEvents
        try {
          console.log('🔍 Verifying registration status from myEvents...');
          const myEventsResponse = await getMyEvents(userId);
          const myEvents = myEventsResponse.data?.events || [];
          
          // Check if event exists AND is not cancelled
          const registration = myEvents.find((e: any) => e.id === event.id);
          const isActuallyRegistered = registration && registration.status !== 'cancelled';
          
          console.log('✅ Verification result:', isActuallyRegistered ? 'REGISTERED' : 'NOT REGISTERED');
          if (registration) {
            console.log('   Registration status:', registration.status);
          }
          
          if (isActuallyRegistered) {
            // User is actually registered (and not cancelled)
            dispatch(addRegisteredEventId(event.id));
            toast.show({
              description: 'You are already registered for this event',
              duration: 3000,
            });
          } else {
            // User is NOT registered or registration was cancelled
            dispatch(removeRegisteredEventId(event.id));
            toast.show({
              description: 'Registration failed. Please try again.',
              duration: 3000,
            });
          }
          
          // Reload event data to sync seat count
          await loadEventData();
        } catch (verifyError) {
          console.error('❌ Error verifying registration:', verifyError);
          // Fallback: reload event data
          await loadEventData();
          toast.show({
            description: 'Please check your registered events',
            duration: 3000,
          });
        }
      } else {
        // Other errors - only show message field
        const userMessage = error.response?.data?.message || 'Registration failed. Please try again.';
        toast.show({
          description: userMessage,
          duration: 3000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentConfirm = async () => {
    if (isProcessingPayment) return;
    if (selectedPaymentMethod === 'wellnessvault') {
      if (event.price > walletBalance) {
        toast.show({ description: 'Insufficient WellnessVault balance', duration: 3000 });
        return;
      }
      try {
        setIsProcessingPayment(true);
        await new Promise<void>((resolve) => setTimeout(() => resolve(), 1500));
        await processRegistration();
        setShowPaymentModal(false);
        setShowSuccessModal(true);
      } finally {
        setIsProcessingPayment(false);
      }
      return;
    }
    // Mobile Money flow
    if (selectedPaymentMethod === 'mobile_money') {
      if (mmStep === 'phone') {
        if (!mmCountrySupported) {
          setMmError('Your selected country is not supported for Mobile Money');
          return;
        }
        if (!mmFormattedPhone || !isValidPhoneNumber(mmFormattedPhone)) {
          setMmError('Please enter a valid phone number');
          return;
        }
        const operator = getPhoneNumberOperator(mmFormattedPhone);
        if (operator === 'OTHER') {
          setMmError('Please enter a valid MTN or AIRTEL phone number');
          return;
        }
        setMmError('');
        await new Promise<void>((resolve) => setTimeout(() => resolve(), 800));
        setMmStep('otp');
        setMmOtp('');
        setMmOtpAttempts(0);
        setMmOtpExpiry(Date.now() + 2 * 60 * 1000);
        return;
      }
      if (mmStep === 'otp') {
        const now = Date.now();
        if (mmOtpExpiry && now > mmOtpExpiry) {
          setMmError('Code expired. Tap Resend to get a new code');
          return;
        }
        if (mmOtp.trim().length < 6) {
          setMmError('Enter the 6-digit OTP sent to your phone');
          return;
        }
        if (mmOtpAttempts >= 3) {
          setMmError('Too many attempts. Tap Resend to get a new code');
          return;
        }
        // Mock verify: accept only '123456' as correct OTP
        if (mmOtp.trim() !== '123456') {
          const next = mmOtpAttempts + 1;
          setMmOtpAttempts(next);
          setMmError(next >= 3 ? 'Too many attempts. Tap Resend to get a new code' : 'Incorrect code. Try again');
          return;
        }
        setMmError('');
        setIsProcessingPayment(true);
        await new Promise<void>((resolve) => setTimeout(() => resolve(), 900));
        setIsProcessingPayment(false);
        setMmStep('processing');
        const ref = `MM-${Date.now()}`;
        setMmPaymentRef(ref);
        PaymentStatusPoller.start(ref, async () => {
          await processRegistration();
          const handledInApp = showPaymentModal;
          if (handledInApp) {
            setShowPaymentModal(false);
            setShowSuccessModal(true);
          }
          return handledInApp;
        });
        return;
      }
      if (mmStep === 'processing') {
        setShowPaymentModal(false);
        resetMmState();
        resetToMyEvents();
        return;
      }
    }
  };

  const handleAddToCalendar = () => {
    Alert.alert(
      'Add to Calendar',
      'This will open your calendar app to add the event.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Add', onPress: () => {
          toast.show({
            description: 'Calendar integration coming soon!',
            duration: 2000,
          });
        }},
      ]
    );
  };

  const handleLocationPress = () => {
    if (!event) return;
    if (event.isOnline) {
      toast.show({
        description: 'Online event link will be shared after registration.',
        duration: 3000,
      });
    } else if (event.locationLink) {
      Linking.openURL(event.locationLink);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getRegistrationButtonConfig = () => {
    if (!event) {
      return {
        title: 'Loading...',
        disabled: true,
        color: appColors.AppGray,
      };
    }
    
    if (isLoading) {
      return {
        title: 'Processing...',
        disabled: true,
        color: appColors.AppGray,
      };
    }
    
    if (isRegistered) {
      return {
        title: 'Unregister',
        disabled: false,
        color: '#F44336',
      };
    }
    
    if (event.availableSeats === 0) {
      return {
        title: 'Sold Out',
        disabled: true,
        color: appColors.AppGray,
      };
    }
    
    return {
      title: event.price === 0 ? 'Register for Free' : `Register - ${event.currency} ${event.price.toLocaleString()}`,
      disabled: false,
      color: appColors.AppBlue,
    };
  };

  const buttonConfig = getRegistrationButtonConfig();

  // Show loading state
  if (isLoadingEvent || !event) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={appColors.AppBlue} barStyle="light-content" />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" type="material" color={appColors.CardBackground} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Event Details</Text>
          <View style={styles.shareButton} />
        </View>

        {/* Loading Indicator */}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={appColors.AppBlue} />
          <Text style={styles.loadingText}>Loading event details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={appColors.AppBlue} barStyle="light-content" />
      
      {/* Header (Blue) */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" type="material" color={appColors.CardBackground} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event Details</Text>
        <TouchableOpacity 
          style={styles.shareButton} 
          onPress={handleRefresh}
          disabled={isRefreshing}
        >
          <Icon 
            name="refresh" 
            type="material" 
            color={appColors.CardBackground} 
            size={24}
            style={isRefreshing ? { opacity: 0.5 } : {}}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Event Image */}
        <Image source={event.coverImage} style={styles.eventImage} />

        {/* Event Content */}
        <View style={styles.content}>
          {/* Event Header */}
          <View style={styles.eventHeader}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{event.category}</Text>
            </View>
            {isRegistered && (
              <View style={styles.registeredBadge}>
                <Icon name="check-circle" type="material" color="#4CAF50" size={16} />
                <Text style={styles.registeredText}>Registered</Text>
              </View>
            )}
          </View>

          <Text style={styles.eventTitle}>{event.title}</Text>
          
          {/* Event Meta Info */}
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Icon name="event" type="material" color={appColors.AppBlue} size={20} />
              <Text style={styles.metaText}>{formatDate(event.date)} at {event.time}</Text>
            </View>

            <TouchableOpacity style={styles.metaItem} onPress={handleLocationPress}>
              <Icon 
                name={event.isOnline ? 'videocam' : 'location-on'} 
                type="material" 
                color={appColors.AppBlue} 
                size={20} 
              />
              <Text style={[styles.metaText, event.locationLink && styles.linkText]}>
                {event.isOnline ? 'Online Event' : event.location}
              </Text>
            </TouchableOpacity>

            <View style={styles.metaItem}>
              <Icon name="people" type="material" color={appColors.AppBlue} size={20} />
              <Text style={styles.metaText}>
                {event.availableSeats} of {event.totalSeats} seats available
              </Text>
            </View>
          </View>

          {/* Organizer */}
          <View style={styles.organizerSection}>
            <Text style={styles.sectionTitle}>Organized by</Text>
            <View style={styles.organizerContainer}>
              <Avatar source={event.organizerImage} size={40} rounded />
              <Text style={styles.organizerName}>{event.organizer}</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>About this event</Text>
            <Text style={styles.description}>
              {event.description || event.shortDescription}
            </Text>
          </View>

          {/* Schedule */}
          {event.schedule && (
            <View style={styles.scheduleSection}>
              <Text style={styles.sectionTitle}>Schedule</Text>
              <Text style={styles.scheduleTime}>
                {event.schedule.startTime} - {event.schedule.endTime}
              </Text>
              {event.schedule.agenda.map((item, index) => (
                <View key={index} style={styles.agendaItem}>
                  <Text style={styles.agendaTime}>{item.time}</Text>
                  <View style={styles.agendaContent}>
                    <Text style={styles.agendaActivity}>{item.activity}</Text>
                    {item.speaker && (
                      <Text style={styles.agendaSpeaker}>by {item.speaker}</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Action Buttons */}
          {isRegistered && (
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.calendarButton}
                onPress={handleAddToCalendar}
              >
                <Icon name="event-available" type="material" color={appColors.AppBlue} size={20} />
                <Text style={styles.calendarButtonText}>Add to Calendar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Registration Button */}
      <View style={styles.bottomContainer}>
        <Button
          title={buttonConfig.title}
          onPress={handleRegistration}
          disabled={buttonConfig.disabled}
          loading={isLoading}
          buttonStyle={[styles.registerButton, { backgroundColor: buttonConfig.color }]}
          titleStyle={styles.registerButtonText}
        />
      </View>

      {/* Payment Modal */}
      <PaymentModal
        visible={showPaymentModal}
        title="Complete Payment"
        summaryTitle={event.title}
        summarySubtitle={`${formatDate(event.date)} at ${event.time}`}
        currency={event.currency}
        amount={event.price}
        selectedPaymentMethod={selectedPaymentMethod as any}
        onSelectPaymentMethod={(m) => {
          if (isProcessingPayment || (selectedPaymentMethod === 'mobile_money' && mmStep !== 'phone')) return;
          setSelectedPaymentMethod(m);
          setMmStep('phone');
        }}
        isProcessing={isProcessingPayment}
        onRequestClose={() => {
          if (isProcessingPayment || (selectedPaymentMethod === 'mobile_money' && mmStep === 'processing')) return;
          setShowPaymentModal(false);
          if (!(selectedPaymentMethod === 'mobile_money' && mmStep === 'processing')) { resetMmState(); }
        }}
        onCancel={() => {
          if (isProcessingPayment || (selectedPaymentMethod === 'mobile_money' && mmStep === 'processing')) return;
          setShowPaymentModal(false);
          if (!(selectedPaymentMethod === 'mobile_money' && mmStep === 'processing')) { resetMmState(); }
        }}
        onConfirm={handlePaymentConfirm}
        mmStep={mmStep}
        mmPhone={mmPhone}
        mmOtp={mmOtp}
        mmError={mmError}
        mmOtpAttempts={mmOtpAttempts}
        mmOtpExpiry={mmOtpExpiry}
        onChangeMmPhone={(t) => { setMmPhone(t); if (mmError) setMmError(''); }}
        onChangeMmFormattedPhone={(v) => setMmFormattedPhone(v || '')}
        onChangeMmCountrySupport={(supported) => setMmCountrySupported(!!supported)}
        onChangeMmOtp={(t) => { setMmOtp(t); if (mmError) setMmError(''); }}
        onChangeMmStep={(s) => setMmStep(s)}
        onResendOtp={async () => {
          await new Promise<void>((resolve)=> setTimeout(()=> resolve(), 700));
          setMmOtp('');
          setMmError('');
          setMmOtpAttempts(0);
          setMmOtpExpiry(Date.now() + 2 * 60 * 1000);
          toast.show({ description: 'OTP resent', duration: 1500 });
        }}
      />

      <PaymentSuccessModal
        visible={showSuccessModal}
        title="Payment Successful"
        subtitle="You are registered for this event."
        buttonText="Close"
        onClose={() => { setShowSuccessModal(false); resetToMyEvents(); }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.AppLightGray,
  },
  header: {
    backgroundColor: appColors.AppBlue,
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
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  shareButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: appColors.AppGray,
    fontFamily: appFonts.headerTextMedium,
  },
  scrollView: {
    flex: 1,
  },
  eventImage: {
    width: '100%',
    height: 250,
    backgroundColor: appColors.AppBlueOpacity,
  },
  content: {
    backgroundColor: appColors.CardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryBadge: {
    backgroundColor: appColors.AppLightGray,
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  categoryText: {
    fontSize: 12,
    color: appColors.AppBlue,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  registeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  registeredText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 4,
    fontFamily: appFonts.headerTextMedium,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: 20,
    lineHeight: 30,
    fontFamily: appFonts.headerTextBold,
  },
  metaContainer: {
    marginBottom: 24,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metaText: {
    fontSize: 16,
    color: appColors.grey1,
    marginLeft: 12,
    fontFamily: appFonts.headerTextRegular,
  },
  linkText: {
    color: appColors.AppBlue,
    textDecorationLine: 'underline',
  },
  organizerSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: 12,
    fontFamily: appFonts.headerTextBold,
  },
  organizerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  organizerName: {
    fontSize: 16,
    color: appColors.grey1,
    marginLeft: 12,
    fontFamily: appFonts.headerTextMedium,
  },
  descriptionSection: {
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: appColors.grey2,
    lineHeight: 24,
    fontFamily: appFonts.headerTextRegular,
  },
  scheduleSection: {
    marginBottom: 24,
  },
  scheduleTime: {
    fontSize: 16,
    color: appColors.AppBlue,
    fontWeight: 'bold',
    marginBottom: 16,
    fontFamily: appFonts.headerTextBold,
  },
  agendaItem: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: appColors.AppLightGray,
  },
  agendaTime: {
    fontSize: 14,
    color: appColors.AppBlue,
    fontWeight: 'bold',
    width: 80,
    fontFamily: appFonts.headerTextBold,
  },
  agendaContent: {
    flex: 1,
    marginLeft: 12,
  },
  agendaActivity: {
    fontSize: 15,
    color: appColors.grey1,
    fontFamily: appFonts.headerTextMedium,
  },
  agendaSpeaker: {
    fontSize: 13,
    color: appColors.grey2,
    marginTop: 2,
    fontFamily: appFonts.headerTextRegular,
  },
  actionButtons: {
    marginBottom: 20,
  },
  calendarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appColors.AppLightGray,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  calendarButtonText: {
    fontSize: 16,
    color: appColors.AppBlue,
    marginLeft: 8,
    fontFamily: appFonts.headerTextMedium,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: appColors.CardBackground,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  registerButton: {
    borderRadius: 25,
    paddingVertical: 15,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: appColors.CardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  modalCloseButton: {
    padding: 4,
  },
  eventSummary: {
    backgroundColor: appColors.AppLightGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  eventSummaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 4,
  },
  eventSummaryDate: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
  },
  paymentMethodsSection: {
    marginBottom: 30,
  },
  paymentMethodOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: appColors.grey5,
    marginBottom: 12,
  },
  selectedPaymentMethod: {
    borderColor: appColors.AppBlue,
    backgroundColor: appColors.AppBlue + '10',
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodDetails: {
    marginLeft: 12,
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  paymentMethodBalance: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginTop: 2,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: appColors.grey4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: appColors.AppBlue,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: appColors.AppBlue,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  processingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  processingText: {
    marginTop: 12,
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: appColors.grey4,
    borderRadius: 25,
    paddingVertical: 14,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: appColors.grey2,
    fontWeight: '600',
    fontFamily: appFonts.headerTextBold,
  },
  payButton: {
    flex: 2,
    backgroundColor: appColors.AppBlue,
    borderRadius: 25,
    paddingVertical: 14,
    marginLeft: 8,
    alignItems: 'center',
  },
  payButtonText: {
    fontSize: 16,
    color: appColors.CardBackground,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  // Success Modal styles
  successCheckCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 6,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    marginBottom: 20,
    textAlign: 'center',
  },
  successButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 28,
    marginTop: 4,
  },
  successButtonText: {
    fontSize: 16,
    color: appColors.CardBackground,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
    textAlign: 'center',
  },
  // Mobile Money styles
  mmSection: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: appColors.AppLightGray,
  },
  mmLabel: {
    fontSize: 14,
    color: appColors.grey1,
    marginBottom: 8,
    fontFamily: appFonts.headerTextMedium,
  },
  mmInput: {
    backgroundColor: appColors.CardBackground,
    borderWidth: 1,
    borderColor: appColors.grey5,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: appColors.grey1,
    fontFamily: appFonts.headerTextRegular,
  },
  mmHelp: {
    marginTop: 8,
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
  },
  mmRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mmLink: {
    color: appColors.AppBlue,
    fontWeight: '600',
    fontFamily: appFonts.headerTextBold,
  },
  mmChangeLink: {
    marginTop: 10,
    color: appColors.AppBlue,
    textDecorationLine: 'underline',
    fontFamily: appFonts.headerTextRegular,
  },
  disabledOption: {
    opacity: 0.5,
  },
});

export default EventDetailScreen;
