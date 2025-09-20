/**
 * Event Detail Screen - Detailed view of mental health events
 */
import React, { useState } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Avatar, Button } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';
import { NavigationProp, RouteProp } from '@react-navigation/native';

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
  route: RouteProp<{ params: { event: Event } }, 'params'>;
}

const EventDetailScreen: React.FC<EventDetailScreenProps> = ({ navigation, route }) => {
  const { event } = route.params;
  const toast = useToast();
  const [isRegistered, setIsRegistered] = useState(event.isRegistered);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegistration = async () => {
    if (!isRegistered && event.availableSeats === 0) {
      toast.show({
        description: 'Sorry, this event is sold out.',
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsRegistered(!isRegistered);
      toast.show({
        description: isRegistered 
          ? 'Successfully unregistered from event' 
          : 'Successfully registered for event!',
        duration: 3000,
      });
    } catch (error) {
      toast.show({
        description: 'Registration failed. Please try again.',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
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
        <Text style={styles.headerTitle}>Event Details</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Icon name="share" type="material" color={appColors.grey1} size={24} />
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
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.calendarButton}
              onPress={handleAddToCalendar}
            >
              <Icon name="event-available" type="material" color={appColors.AppBlue} size={20} />
              <Text style={styles.calendarButtonText}>Add to Calendar</Text>
            </TouchableOpacity>
          </View>
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
  shareButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  eventImage: {
    width: '100%',
    height: 250,
    backgroundColor: appColors.AppLightGray,
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
});

export default EventDetailScreen;
