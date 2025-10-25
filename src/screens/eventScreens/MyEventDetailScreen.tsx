/**
 * My Event Detail Screen - Registrant-focused details
 */
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar, ScrollView, Linking, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/base';
import { appColors, appFonts } from '../../global/Styles';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { useToast } from 'native-base';

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

interface MyEventDetailScreenProps {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
}

const MyEventDetailScreen: React.FC<MyEventDetailScreenProps> = ({ navigation, route }) => {
  const toast = useToast();
  const [refreshing, setRefreshing] = useState(false);
  const event: Event = (route.params as any)?.event;
  const registrationId: string | undefined = (route.params as any)?.registrationId;

  // Compute join window and countdown
  const { joinable, countdownText } = useMemo(() => {
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
  }, [event?.date, event?.time]);

  const handleJoin = async () => {
    // Placeholder: open a sample link or handle deep link
    const link = 'https://example.com/join/event';
    try { await Linking.openURL(link); } catch {}
  };

  const handleAddToCalendar = () => {
    // Placeholder implementation
    toast.show({ description: 'Added to calendar (placeholder)', duration: 2000 });
  };

  // No share until backend/content contract is defined

  const onRefresh = async () => {
    setRefreshing(true);
    // Mock: simulate reload, recompute any time-based UI
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 800));
    setRefreshing(false);
    // Optionally toast
    toast.show({ description: 'Event details refreshed', duration: 1500 });
  };

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
              <Text style={[styles.value, { color: '#4CAF50' }]}>Registered</Text>
            </View>
            {registrationId && (
              <View style={styles.rowBetween}>
                <Text style={styles.label}>Registration ID</Text>
                <Text style={styles.value}>{registrationId}</Text>
              </View>
            )}
            {event.price > 0 && (
              <View style={styles.rowBetween}>
                <Text style={styles.label}>Payment</Text>
                <Text style={styles.value}>Completed</Text>
              </View>
            )}
          </View>

        {/* Join / Access Info */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Access</Text>
            {event.isOnline ? (
              <>
                <Text style={styles.help}>
                  {joinable ? 'Click join to enter the event.' : (countdownText || 'The Join link will be available near start time.')}
                </Text>
                <TouchableOpacity style={[styles.primaryBtn, !joinable && { opacity: 0.5 }]} onPress={handleJoin} disabled={!joinable}>
                  <Text style={styles.primaryBtnText}>{joinable ? 'Join Now' : 'Join (disabled)'}</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.help}>This is an in-person event. See the location details above.</Text>
              </>
            )}
          </View>

        {/* Ticket / QR */}
          {/* Ticket/QR removed until feature is available */}

        {/* Actions */}
          <View style={[styles.rowBetween, { marginTop: 10 }] }>
            <TouchableOpacity style={styles.secondaryBtn} onPress={handleAddToCalendar}>
              <Icon name="event" type="material" color={appColors.AppBlue} size={18} />
              <Text style={styles.secondaryBtnText}>Add to Calendar</Text>
            </TouchableOpacity>
            {/* Share removed until feature is available */}
          </View>

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
});

export default MyEventDetailScreen;
