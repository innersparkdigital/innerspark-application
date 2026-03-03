import React, { useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon, Avatar } from '@rneui/base';
import { appColors, appFonts } from '../../global/Styles';
import { scale, moderateScale } from '../../global/Scaling';
import { getEventStatusTeaser, isClientEventPassed } from '../../utils/dateHelpers';

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
  viewMode?: 'list' | 'gallery';
  onPress?: () => void;
  onAddToCalendar?: () => void;
  onViewTicket?: () => void;
};

const EventCard: React.FC<EventCardProps> = ({ event, variant = 'public', viewMode = 'list', onPress, onAddToCalendar, onViewTicket }) => {
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
    return getEventStatusTeaser(event.date, event.time);
  }, [event?.date, event?.time]);

  const isPassed = isClientEventPassed(event.date, event.time);

  const isList = viewMode === 'list';

  return (
    <TouchableOpacity style={[styles.card, isList && styles.cardList, isPassed && { opacity: 0.65 }]} onPress={onPress} activeOpacity={0.7}>
      {/* For List View, render info first then Image right. Wait, flex-direction: row-reverse automatically handles visual right-placement easily. */}
      <Image source={event.coverImage} style={[styles.image, isList && styles.imageList]} />

      <View style={[styles.content, isList && styles.contentList]}>
        <View style={styles.headerRow}>
          <View style={{ alignItems: 'flex-start' }}>
            <Text style={styles.date}>{formatDate(event.date)}</Text>
            <Text style={styles.time}>{event.time}</Text>
          </View>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{event.category}</Text>
          </View>
        </View>

        <Text style={[styles.title, isList && styles.titleList]} numberOfLines={2}>{event.title}</Text>

        {!!hint && (
          <View style={[styles.hintPill, { backgroundColor: hintColor + '20', borderColor: hintColor }]}>
            <Icon name="schedule" type="material" color={hintColor} size={scale(14)} />
            <Text style={[styles.hintText, { color: hintColor }]}>{hint}</Text>
          </View>
        )}

        {!isList && (
          <>
            <Text style={styles.description} numberOfLines={2}>{event.shortDescription}</Text>

            <View style={styles.footerRow}>
              <View style={styles.locationRow}>
                <Icon name={event.isOnline ? 'videocam' : 'location-on'} type="material" color={appColors.grey2} size={scale(16)} />
                <Text style={styles.locationText} numberOfLines={1}>{event.isOnline ? 'Online Event' : event.location}</Text>
              </View>
              {variant === 'public' ? (
                event.isRegistered ? (
                  <View style={styles.registeredBadge}>
                    <Icon name="check-circle" type="material" color="#4CAF50" size={scale(16)} />
                    <Text style={styles.registeredText}>Registered</Text>
                  </View>
                ) : (
                  <Text style={[styles.seatsText, { color: seatsStatus.color }]}>{seatsStatus.text}</Text>
                )
              ) : (
                event.isRegistered ? (
                  <View style={styles.registeredBadge}>
                    <Icon name="check-circle" type="material" color="#4CAF50" size={scale(16)} />
                    <Text style={styles.registeredText}>Registered</Text>
                  </View>
                ) : null
              )}
            </View>

            <View style={styles.metaRow}>
              <View style={styles.organizerRow}>
                <Avatar source={event.organizerImage} size={scale(24)} rounded />
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
          </>
        )}

        {isList && (
          <View style={styles.listMetaBase}>
            {event.price === 0 ? (
              <Text style={styles.free}>FREE</Text>
            ) : (
              <Text style={styles.price}>{event.currency} {event.price.toLocaleString()}</Text>
            )}

            {((variant === 'public' && event.isRegistered) || variant === 'my') && (
              <View style={[styles.registeredBadge, { borderTopWidth: 0, marginTop: 0, paddingTop: 0, marginLeft: scale(8) }]}>
                <Icon name="check-circle" type="material" color="#4CAF50" size={scale(16)} />
              </View>
            )}
          </View>
        )}

        {variant === 'my' && !isList && (
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.secondaryBtn} onPress={onViewTicket}>
              <Icon name="confirmation-number" type="material" color={appColors.AppBlue} size={scale(18)} />
              <Text style={styles.secondaryBtnText}>View Ticket</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(15),
    marginBottom: scale(20),
    elevation: scale(3),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(2) },
    shadowRadius: scale(4)
  },
  cardList: {
    flexDirection: 'row-reverse',
    alignItems: 'stretch',
    minHeight: scale(140),
  },
  image: {
    width: '100%',
    height: scale(180),
    borderTopLeftRadius: scale(15),
    borderTopRightRadius: scale(15),
    backgroundColor: appColors.AppBlueOpacity,
  },
  imageList: {
    width: '35%',
    height: 'auto',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: scale(15),
    borderBottomRightRadius: scale(15),
  },
  content: { padding: scale(16) },
  contentList: { width: '65%', padding: scale(14), justifyContent: 'space-between' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: scale(12) },
  date: { fontSize: moderateScale(14), fontWeight: 'bold', color: appColors.AppBlue, fontFamily: appFonts.headerTextBold },
  time: { fontSize: moderateScale(12), color: appColors.grey2, fontFamily: appFonts.headerTextRegular },
  categoryBadge: { backgroundColor: appColors.AppLightGray, borderRadius: scale(12), paddingHorizontal: scale(8), paddingVertical: scale(4) },
  categoryText: { fontSize: moderateScale(12), color: appColors.AppBlue, fontFamily: appFonts.headerTextMedium },
  title: { fontSize: moderateScale(18), fontWeight: 'bold', color: appColors.grey1, marginBottom: scale(8), fontFamily: appFonts.headerTextBold },
  titleList: { fontSize: moderateScale(15), marginBottom: scale(4) },
  description: { fontSize: moderateScale(14), color: appColors.grey2, lineHeight: moderateScale(20), marginBottom: scale(12), fontFamily: appFonts.headerTextRegular },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: scale(12) },
  locationRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  locationText: { fontSize: moderateScale(13), color: appColors.grey2, marginLeft: scale(6), fontFamily: appFonts.headerTextRegular },
  seatsText: { fontSize: moderateScale(12), fontWeight: 'bold', fontFamily: appFonts.headerTextBold },
  registeredBadge: { flexDirection: 'row', alignItems: 'center' },
  registeredText: { fontSize: moderateScale(12), color: '#4CAF50', marginLeft: scale(6), fontFamily: appFonts.headerTextMedium },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  organizerRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  organizerText: { fontSize: moderateScale(13), color: appColors.grey2, marginLeft: scale(8), fontFamily: appFonts.headerTextRegular },
  free: { fontSize: moderateScale(14), fontWeight: 'bold', color: '#4CAF50', fontFamily: appFonts.headerTextBold },
  price: { fontSize: moderateScale(14), fontWeight: 'bold', color: appColors.AppBlue, fontFamily: appFonts.headerTextBold },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: scale(12) },
  secondaryBtn: { backgroundColor: appColors.CardBackground, borderRadius: scale(20), paddingVertical: scale(8), paddingHorizontal: scale(12), flexDirection: 'row', alignItems: 'center', elevation: scale(1) },
  secondaryBtnText: { marginLeft: scale(6), color: appColors.AppBlue, fontSize: moderateScale(13), fontFamily: appFonts.headerTextMedium },
  hintPill: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', borderWidth: scale(1), borderRadius: scale(14), paddingVertical: scale(2), paddingHorizontal: scale(8), marginBottom: scale(6), gap: scale(4) },
  hintText: { fontSize: moderateScale(12), fontFamily: appFonts.headerTextMedium },
  listMetaBase: { flexDirection: 'row', alignItems: 'center', marginTop: scale(8) }
});

export default EventCard;
