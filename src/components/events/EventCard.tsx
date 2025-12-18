import React, { useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon, Avatar } from '@rneui/base';
import { appColors, appFonts } from '../../global/Styles';

export type EventCardProps = {
  event: {
    id: number;
    title: string;
    shortDescription: string;
    date: string;
    time: string;
    coverImage: any;
    location: string;
    isOnline: boolean;
    availableSeats: number;
    price: number;
    currency: string;
    category: string;
    organizer: string;
    organizerImage: any;
    isRegistered?: boolean;
  };
  variant?: 'public' | 'my';
  onPress?: () => void;
  onAddToCalendar?: () => void;
  onViewTicket?: () => void;
};

const EventCard: React.FC<EventCardProps> = ({ event, variant = 'public', onPress, onAddToCalendar, onViewTicket }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const seatsStatus = (() => {
    if (event.availableSeats === 0) return { text: 'Sold Out', color: '#F44336' };
    if (event.availableSeats <= 10) return { text: `${event.availableSeats} seats left`, color: '#FF9800' };
    return { text: `${event.availableSeats} available`, color: '#4CAF50' };
  })();

  const { hint, hintColor } = useMemo(() => {
    if (variant !== 'my') return { hint: '', hintColor: '' };
    try {
      const start = new Date(`${event.date} ${event.time}`);
      const now = new Date();
      const diffMs = start.getTime() - now.getTime();
      const diffMin = Math.floor(diffMs / 60000);
      if (diffMin > 0 && diffMin <= 60) {
        const hrs = Math.floor(diffMin / 60);
        const mins = Math.max(0, diffMin % 60);
        return { hint: `Starts in ${hrs > 0 ? `${hrs}h ` : ''}${mins}m`, hintColor: '#FF9800' };
      }
      if (diffMin <= 0 && diffMin >= -180) {
        return { hint: 'Join now', hintColor: '#4CAF50' };
      }
      return { hint: '', hintColor: '' };
    } catch {
      return { hint: '', hintColor: '' };
    }
  }, [event?.date, event?.time, variant]);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Image source={event.coverImage} style={styles.image} />

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={{ alignItems: 'flex-start' }}>
            <Text style={styles.date}>{formatDate(event.date)}</Text>
            <Text style={styles.time}>{event.time}</Text>
          </View>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{event.category}</Text>
          </View>
        </View>

        <Text style={styles.title} numberOfLines={2}>{event.title}</Text>
        {variant === 'my' && !!hint && (
          <View style={[styles.hintPill, { backgroundColor: hintColor + '20', borderColor: hintColor }]}>
            <Icon name="schedule" type="material" color={hintColor} size={14} />
            <Text style={[styles.hintText, { color: hintColor }]}>{hint}</Text>
          </View>
        )}
        <Text style={styles.description} numberOfLines={2}>{event.shortDescription}</Text>

        <View style={styles.footerRow}>
          <View style={styles.locationRow}>
            <Icon name={event.isOnline ? 'videocam' : 'location-on'} type="material" color={appColors.grey2} size={16} />
            <Text style={styles.locationText} numberOfLines={1}>{event.isOnline ? 'Online Event' : event.location}</Text>
          </View>
          {variant === 'public' ? (
            <Text style={[styles.seatsText, { color: seatsStatus.color }]}>{seatsStatus.text}</Text>
          ) : (
            event.isRegistered ? (
              <View style={styles.registeredBadge}>
                <Icon name="check-circle" type="material" color="#4CAF50" size={16} />
                <Text style={styles.registeredText}>Registered</Text>
              </View>
            ) : null
          )}
        </View>

        <View style={styles.metaRow}>
          <View style={styles.organizerRow}>
            <Avatar source={event.organizerImage} size={24} rounded />
            <Text style={styles.organizerText}>{event.organizer}</Text>
          </View>
          <View>
            {event.price === 0 ? (
              <Text style={styles.free}>FREE</Text>
            ) : (
              <Text style={styles.price}>{event.currency} {event.price.toLocaleString()}</Text>
            )}
          </View>
        </View>

        {variant === 'my' && (
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.secondaryBtn} onPress={onViewTicket}>
              <Icon name="confirmation-number" type="material" color={appColors.AppBlue} size={18} />
              <Text style={styles.secondaryBtnText}>View Ticket</Text>
            </TouchableOpacity>
            {/* Add to Calendar hidden for now */}
            {/* <TouchableOpacity style={styles.secondaryBtn} onPress={onAddToCalendar}>
              <Icon name="event" type="material" color={appColors.AppBlue} size={18} />
              <Text style={styles.secondaryBtnText}>Add to Calendar</Text>
            </TouchableOpacity> */}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { 
    backgroundColor: appColors.CardBackground, 
    borderRadius: 15, 
    marginBottom: 20, 
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, shadowRadius: 4 
  },
  image: { 
    width: '100%', 
    height: 180, 
    borderTopLeftRadius: 15, 
    borderTopRightRadius: 15, 
    // backgroundColor: appColors.AppLightGray, 
    backgroundColor: appColors.AppBlueOpacity, 
  },
  content: { padding: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  date: { fontSize: 14, fontWeight: 'bold', color: appColors.AppBlue, fontFamily: appFonts.headerTextBold },
  time: { fontSize: 12, color: appColors.grey2, fontFamily: appFonts.headerTextRegular },
  categoryBadge: { backgroundColor: appColors.AppLightGray, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4 },
  categoryText: { fontSize: 12, color: appColors.AppBlue, fontFamily: appFonts.headerTextMedium },
  title: { fontSize: 18, fontWeight: 'bold', color: appColors.grey1, marginBottom: 8, fontFamily: appFonts.headerTextBold },
  description: { fontSize: 14, color: appColors.grey2, lineHeight: 20, marginBottom: 12, fontFamily: appFonts.headerTextRegular },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  locationRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  locationText: { fontSize: 13, color: appColors.grey2, marginLeft: 6, fontFamily: appFonts.headerTextRegular },
  seatsText: { fontSize: 12, fontWeight: 'bold', fontFamily: appFonts.headerTextBold },
  registeredBadge: { flexDirection: 'row', alignItems: 'center' },
  registeredText: { fontSize: 12, color: '#4CAF50', marginLeft: 6, fontFamily: appFonts.headerTextMedium },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  organizerRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  organizerText: { fontSize: 13, color: appColors.grey2, marginLeft: 8, fontFamily: appFonts.headerTextRegular },
  free: { fontSize: 14, fontWeight: 'bold', color: '#4CAF50', fontFamily: appFonts.headerTextBold },
  price: { fontSize: 14, fontWeight: 'bold', color: appColors.AppBlue, fontFamily: appFonts.headerTextBold },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  secondaryBtn: { backgroundColor: appColors.CardBackground, borderRadius: 20, paddingVertical: 8, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', elevation: 1 },
  secondaryBtnText: { marginLeft: 6, color: appColors.AppBlue, fontSize: 13, fontFamily: appFonts.headerTextMedium },
  hintPill: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', borderWidth: 1, borderRadius: 14, paddingVertical: 2, paddingHorizontal: 8, marginBottom: 6, gap: 4 },
  hintText: { fontSize: 12, fontFamily: appFonts.headerTextMedium },
});

export default EventCard;
