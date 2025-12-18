/**
 * My Event Detail Screen - Registrant-focused details
 */
import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar, ScrollView, Linking, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/base';
import { appColors, appFonts } from '../../global/Styles';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { useToast } from 'native-base';
import { getEventById, getMyEvents } from '../../api/client/events';
import { useSelector } from 'react-redux';
import { getImageSource, FALLBACK_IMAGES } from '../../utils/imageHelpers';

interface Event {
  id: number;
  title: string;
  shortDescription: string;
  date: string;
  time: string;
  coverImage: any;
  location: string;
  isOnline: boolean;
  totalSeats: number;
  availableSeats: number;
  price: number;
  currency: string;
  category: string;
  organizer: string;
  organizerImage: any;
  isRegistered: boolean;
}

interface Registration {
  registrationId: string;
  status: string;
  registeredAt: string;
  confirmationCode: string;
  meetingLink: string;
  paidAmount: number;
}

interface MyEventDetailScreenProps {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
}

const MyEventDetailScreen: React.FC<MyEventDetailScreenProps> = ({ navigation, route }) => {
  const toast = useToast();
  const userId = useSelector((state: any) => state.userData.userDetails.userId);
  
  const passedEvent: any = (route.params as any)?.event;
  const eventId: number = passedEvent?.id || (route.params as any)?.eventId;
  
  const [event, setEvent] = useState<Event | null>(passedEvent || null);
  
  // Initialize registration from passed event data (instant!)
  const [registration, setRegistration] = useState<Registration | null>(
    passedEvent?.registrationId ? {
      registrationId: passedEvent.registrationId,
      status: passedEvent.status,
      registeredAt: passedEvent.registeredAt,
      confirmationCode: passedEvent.confirmationCode,
      meetingLink: passedEvent.meetingLink,
      paidAmount: passedEvent.paidAmount,
    } : null
  );
  
  const [isLoading, setIsLoading] = useState(!passedEvent);
  const [refreshing, setRefreshing] = useState(false);

  // Compute join window and countdown
  const { joinable, countdownText } = useMemo(() => {
    if (!event) return { joinable: false, countdownText: '' };
    
    try {
      const start = new Date(`${event.date} ${event.time}`);
      const now = new Date();
      const diffMs = start.getTime() - now.getTime();
      const diffMin = Math.floor(diffMs / 60000);
      // Allow join from 15 minutes before start until 3 hours after
      const joinOpen = diffMin <= 15 && diffMin >= -180;
      let text = '';
      if (!joinOpen && diffMin > 15) {
        const hrs = Math.floor(diffMin / 60);
        const mins = Math.max(0, diffMin % 60);
        text = `Starts in ${hrs > 0 ? `${hrs}h ` : ''}${mins}m`;
      } else if (!joinOpen && diffMin < -180) {
        text = 'Event has ended';
      }
      return { joinable: joinOpen, countdownText: text };
    } catch {
      return { joinable: false, countdownText: '' };
    }
  }, [event]);

  useEffect(() => {
    loadEventData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadEventData = async () => {
    if (!eventId) {
      toast.show({ description: 'Event not found', duration: 3000 });
      navigation.goBack();
      return;
    }

    setIsLoading(true);
    try {
      // Load event details
      const eventResponse = await getEventById(eventId.toString());
      const eventData = eventResponse.data;
      
      const mappedEvent: Event = {
        id: eventData.id,
        title: eventData.title,
        shortDescription: eventData.shortDescription || eventData.description || '',
        date: eventData.date,
        time: eventData.time,
        coverImage: getImageSource(eventData.coverImage, FALLBACK_IMAGES.event),
        location: eventData.location || 'Location TBD',
        isOnline: eventData.isOnline || false,
        totalSeats: eventData.totalSeats || 0,
        availableSeats: eventData.availableSeats || 0,
        price: eventData.price || 0,
        currency: eventData.currency || 'UGX',
        category: eventData.category || 'General',
        organizer: eventData.organizer || 'InnerSpark',
        organizerImage: getImageSource(eventData.organizerImage, FALLBACK_IMAGES.avatar),
        isRegistered: eventData.isRegistered || false,
      };
      
      setEvent(mappedEvent);
      
      // Load registration details from myEvents
      const myEventsResponse = await getMyEvents(userId);
      const myEvents = myEventsResponse.data?.events || [];
      const myRegistration = myEvents.find((e: any) => e.id === eventId);
      
      if (myRegistration) {
        setRegistration({
          registrationId: myRegistration.registrationId,
          status: myRegistration.status,
          registeredAt: myRegistration.registeredAt,
          confirmationCode: myRegistration.confirmationCode,
          meetingLink: myRegistration.meetingLink,
          paidAmount: myRegistration.paidAmount,
        });
      }
    } catch (error: any) {
      console.error('❌ Error loading event:', error);
      toast.show({
        description: error.response?.data?.message || 'Failed to load event details',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoin = async () => {
    const link = registration?.meetingLink || event?.isOnline ? 'https://meet.innerspark.com' : '';
    if (link) {
      try { 
        await Linking.openURL(link); 
      } catch (error) {
        toast.show({ description: 'Unable to open meeting link', duration: 2000 });
      }
    }
  };

  const handleAddToCalendar = () => {
    // Placeholder implementation
    toast.show({ description: 'Added to calendar (placeholder)', duration: 2000 });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEventData();
    setRefreshing(false);
    toast.show({ description: 'Event details refreshed', duration: 1500 });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'cancelled':
        return '#F44336';
      default:
        return appColors.grey2;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Registered';
      case 'pending':
        return 'Payment Pending';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  if (isLoading || !event) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={appColors.AppBlue} barStyle="light-content" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" type="material" color={appColors.CardBackground} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Event</Text>
          <View style={styles.headerButton} />
        </View>
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
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" type="material" color={appColors.CardBackground} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Event</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[appColors.AppBlue]} />}
      >
        {/* Cover */}
        <Image source={event.coverImage} style={styles.cover} />

        {/* Title & Meta */}
        <View style={styles.content}>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.meta}>{event.date} at {event.time}</Text>
          <Text style={styles.meta}>{event.isOnline ? 'Online Event' : event.location}</Text>

        {/* Registration Info */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Registration</Text>
            <View style={styles.rowBetween}>
              <Text style={styles.label}>Status</Text>
              <Text style={[styles.value, { color: getStatusColor(registration?.status || 'confirmed') }]}>
                {getStatusText(registration?.status || 'confirmed')}
              </Text>
            </View>
            {registration?.registrationId && (
              <View style={styles.rowBetween}>
                <Text style={styles.label}>Registration ID</Text>
                <Text style={styles.value}>{registration.registrationId}</Text>
              </View>
            )}
            {registration?.confirmationCode && (
              <View style={styles.rowBetween}>
                <Text style={styles.label}>Confirmation Code</Text>
                <Text style={styles.value}>{registration.confirmationCode}</Text>
              </View>
            )}
            {event.price > 0 && (
              <View style={styles.rowBetween}>
                <Text style={styles.label}>Payment</Text>
                <Text style={styles.value}>
                  {registration?.paidAmount ? `${registration.paidAmount} ${event.currency}` : 'Completed'}
                </Text>
              </View>
            )}
            {registration?.registeredAt && (
              <View style={styles.rowBetween}>
                <Text style={styles.label}>Registered On</Text>
                <Text style={styles.value}>
                  {new Date(registration.registeredAt).toLocaleDateString()}
                </Text>
              </View>
            )}
          </View>

        {/* Join / Access Info */}
          {registration?.status !== 'cancelled' && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Access</Text>
              {event.isOnline ? (
                <>
                  <Text style={styles.help}>
                    {joinable ? 'Click join to enter the event.' : (countdownText || 'The Join link will be available near start time.')}
                  </Text>
                  <TouchableOpacity 
                    style={[styles.primaryBtn, !joinable && { opacity: 0.5 }]} 
                    onPress={handleJoin} 
                    disabled={!joinable}
                  >
                    <Text style={styles.primaryBtnText}>{joinable ? 'Join Now' : 'Join (disabled)'}</Text>
                  </TouchableOpacity>
                  {registration?.meetingLink && (
                    <Text style={[styles.help, { marginTop: 8, fontSize: 11 }]}>
                      Meeting Link: {registration.meetingLink}
                    </Text>
                  )}
                </>
              ) : (
                <>
                  <Text style={styles.help}>This is an in-person event. See the location details above.</Text>
                </>
              )}
            </View>
          )}
          
          {/* Cancelled Notice */}
          {registration?.status === 'cancelled' && (
            <View style={[styles.card, { backgroundColor: '#FFEBEE' }]}>
              <Text style={[styles.cardTitle, { color: '#F44336' }]}>Registration Cancelled</Text>
              <Text style={styles.help}>Your registration for this event has been cancelled.</Text>
            </View>
          )}

        {/* Ticket / QR */}
        {/* Ticket/QR removed until feature is available */}

        {/* Actions - hidden for now */}
        {/* Share removed until feature is available */}
        {/*  
          <View style={[styles.rowBetween, { marginTop: 10 }] }>
            <TouchableOpacity style={styles.secondaryBtn} onPress={handleAddToCalendar}>
              <Icon name="event" type="material" color={appColors.AppBlue} size={18} />
              <Text style={styles.secondaryBtnText}>Add to Calendar</Text>
            </TouchableOpacity>
          </View>
          */}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: appColors.AppLightGray },
  header: {
    backgroundColor: appColors.AppBlue,
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerButton: { padding: 8, width: 40, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: appColors.CardBackground, fontFamily: appFonts.headerTextBold },
  scroll: { flex: 1 },
  cover: { width: '100%', height: 220, backgroundColor: appColors.AppLightGray },
  content: { padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: appColors.grey1, fontFamily: appFonts.headerTextBold },
  meta: { marginTop: 4, fontSize: 14, color: appColors.grey2, fontFamily: appFonts.headerTextRegular },
  card: { backgroundColor: appColors.CardBackground, borderRadius: 12, padding: 14, marginTop: 14 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: appColors.grey1, marginBottom: 8, fontFamily: appFonts.headerTextBold },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 },
  label: { fontSize: 14, color: appColors.grey2, fontFamily: appFonts.headerTextRegular },
  value: { fontSize: 14, color: appColors.grey1, fontFamily: appFonts.headerTextMedium },
  help: { fontSize: 12, color: appColors.grey3, marginBottom: 10, fontFamily: appFonts.headerTextRegular },
  primaryBtn: { backgroundColor: appColors.AppBlue, borderRadius: 24, paddingVertical: 12, alignItems: 'center', marginTop: 4 },
  primaryBtnText: { color: appColors.CardBackground, fontSize: 16, fontWeight: 'bold', fontFamily: appFonts.headerTextBold },
  secondaryBtn: { backgroundColor: appColors.CardBackground, borderRadius: 24, paddingVertical: 10, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center' },
  secondaryBtnText: { marginLeft: 6, color: appColors.AppBlue, fontSize: 14, fontFamily: appFonts.headerTextMedium },
  qrBox: { marginTop: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: appColors.AppLightGray, borderRadius: 12, height: 140, backgroundColor: '#FAFAFA' },
  qrText: { fontSize: 16, fontWeight: 'bold', color: appColors.grey1, fontFamily: appFonts.headerTextBold },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 14, color: appColors.grey2, fontFamily: appFonts.headerTextRegular },
});

export default MyEventDetailScreen;
