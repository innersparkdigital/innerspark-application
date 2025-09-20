/**
 * Appointments Screen - List of all upcoming/past appointments
 */
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Avatar, Button } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';

interface Appointment {
  id: string;
  date: string;
  time: string;
  therapistName: string;
  therapistType: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  image: any;
  location?: string;
  sessionType?: string;
}

interface AppointmentsScreenProps {
  navigation: any;
}

const AppointmentsScreen: React.FC<AppointmentsScreenProps> = ({ navigation }) => {
  const toast = useToast();
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'past'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock appointments data
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      date: '09/04/2025',
      time: '2:00 PM',
      therapistName: 'Clara Odding',
      therapistType: 'Therapist',
      status: 'upcoming',
      image: require('../../assets/images/dummy-people/d-person2.png'),
      location: 'Nakawa - Kampala Uganda',
      sessionType: 'Individual Therapy',
    },
    {
      id: '2',
      date: '21/04/2025',
      time: '10:00 AM',
      therapistName: 'Steven Pauliner',
      therapistType: 'Cardiologist',
      status: 'upcoming',
      image: require('../../assets/images/dummy-people/d-person1.png'),
      location: 'Kampala Medical Center',
      sessionType: 'Consultation',
    },
    {
      id: '3',
      date: '18/06/2025',
      time: '3:30 PM',
      therapistName: 'Noemi Shinte',
      therapistType: 'Dermatologist',
      status: 'upcoming',
      image: require('../../assets/images/dummy-people/d-person3.png'),
      location: 'Skin Care Clinic',
      sessionType: 'Follow-up',
    },
    {
      id: '4',
      date: '15/03/2025',
      time: '11:00 AM',
      therapistName: 'Sarah Johnson',
      therapistType: 'Therapist',
      status: 'completed',
      image: require('../../assets/images/dummy-people/d-person1.png'),
      location: 'Mental Health Center',
      sessionType: 'Individual Therapy',
    },
    {
      id: '5',
      date: '08/03/2025',
      time: '4:00 PM',
      therapistName: 'Michael Chen',
      therapistType: 'Therapist',
      status: 'completed',
      image: require('../../assets/images/dummy-people/d-person2.png'),
      location: 'Wellness Center',
      sessionType: 'Couples Therapy',
    },
  ]);

  const filteredAppointments = appointments.filter(appointment => {
    const matchesTab = selectedTab === 'upcoming' 
      ? appointment.status === 'upcoming'
      : appointment.status === 'completed' || appointment.status === 'cancelled';
    
    const matchesSearch = appointment.therapistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appointment.therapistType.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
      toast.show({
        description: 'Appointments refreshed',
        duration: 2000,
      });
    }, 1500);
  };

  const handleModifyAppointment = (appointment: Appointment) => {
    toast.show({
      description: `Modify appointment with ${appointment.therapistName}`,
      duration: 2000,
    });
  };

  const handleBookNewAppointment = () => {
    navigation.navigate('LHBottomTabs', { screen: 'TherapistsScreen' });
  };

  const formatDate = (dateString: string) => {
    const [day, month, year] = dateString.split('/');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('en-US', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return '#4CAF50';
      case 'completed':
        return '#2196F3';
      case 'cancelled':
        return '#F44336';
      default:
        return appColors.grey2;
    }
  };

  const AppointmentCard: React.FC<{ appointment: Appointment }> = ({ appointment }) => (
    <View style={styles.appointmentCard}>
      <View style={styles.appointmentHeader}>
        <View style={styles.dateContainer}>
          <Text style={styles.appointmentDate}>{formatDate(appointment.date)}</Text>
          <Text style={styles.appointmentTime}>{appointment.time}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.modifyButton}
          onPress={() => handleModifyAppointment(appointment)}
        >
          <Icon name="edit" type="material" color={appColors.AppBlue} size={18} />
          <Text style={styles.modifyText}>Modify</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.appointmentBody}>
        <Avatar
          source={appointment.image}
          size={50}
          rounded
          containerStyle={styles.therapistAvatar}
        />
        
        <View style={styles.appointmentInfo}>
          <Text style={styles.therapistName}>
            {appointment.therapistType} - {appointment.therapistName}
          </Text>
          
          {appointment.location && (
            <View style={styles.locationContainer}>
              <Icon name="location-on" type="material" color={appColors.grey2} size={16} />
              <Text style={styles.locationText}>{appointment.location}</Text>
            </View>
          )}
          
          {appointment.sessionType && (
            <Text style={styles.sessionType}>{appointment.sessionType}</Text>
          )}
        </View>

        <View style={styles.statusContainer}>
          <View style={[
            styles.statusIndicator,
            { backgroundColor: getStatusColor(appointment.status) }
          ]}>
            <Icon 
              name={appointment.status === 'upcoming' ? 'schedule' : 'check-circle'} 
              type="material" 
              color={appColors.CardBackground} 
              size={16} 
            />
          </View>
        </View>
      </View>
    </View>
  );

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
        <Text style={styles.headerTitle}>Appointments</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        {/* Section Title */}
        <Text style={styles.sectionTitle}>My Appointments</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon
            name="search"
            type="material"
            color={appColors.grey3}
            size={20}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search appointments..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={appColors.grey3}
          />
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === 'upcoming' && styles.activeTab
            ]}
            onPress={() => setSelectedTab('upcoming')}
          >
            <Text style={[
              styles.tabText,
              selectedTab === 'upcoming' && styles.activeTabText
            ]}>
              Upcoming
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === 'past' && styles.activeTab
            ]}
            onPress={() => setSelectedTab('past')}
          >
            <Text style={[
              styles.tabText,
              selectedTab === 'past' && styles.activeTabText
            ]}>
              Past
            </Text>
          </TouchableOpacity>
        </View>

        {/* Appointments List */}
        <FlatList
          data={filteredAppointments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AppointmentCard appointment={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[appColors.AppBlue]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon
                name="event-busy"
                type="material"
                color={appColors.grey3}
                size={60}
              />
              <Text style={styles.emptyText}>
                {selectedTab === 'upcoming' ? 'No upcoming appointments' : 'No past appointments'}
              </Text>
              <Text style={styles.emptySubtext}>
                {selectedTab === 'upcoming' 
                  ? 'Book your first appointment to get started' 
                  : 'Your completed appointments will appear here'
                }
              </Text>
            </View>
          }
        />
      </View>

      {/* Book New Appointment Button */}
      <View style={styles.bookingFooter}>
        <Button
          title="Book a new appointment"
          buttonStyle={styles.bookButton}
          titleStyle={styles.bookButtonText}
          onPress={handleBookNewAppointment}
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
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.appTextBold,
  },
  headerSpacer: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: 20,
    fontFamily: appFonts.appTextBold,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.CardBackground,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: appColors.grey1,
    fontFamily: appFonts.appTextRegular,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: appColors.CardBackground,
    borderRadius: 15,
    padding: 5,
    marginBottom: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: appColors.AppBlue,
  },
  tabText: {
    fontSize: 16,
    color: appColors.grey2,
    fontFamily: appFonts.appTextMedium,
  },
  activeTabText: {
    color: appColors.CardBackground,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 20,
  },
  appointmentCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  dateContainer: {
    flex: 1,
  },
  appointmentDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.appTextBold,
    marginBottom: 2,
  },
  appointmentTime: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.appTextRegular,
  },
  modifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: appColors.AppLightGray,
  },
  modifyText: {
    fontSize: 14,
    color: appColors.AppBlue,
    marginLeft: 5,
    fontFamily: appFonts.appTextMedium,
  },
  appointmentBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  therapistAvatar: {
    marginRight: 15,
  },
  appointmentInfo: {
    flex: 1,
  },
  therapistName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: 5,
    fontFamily: appFonts.appTextBold,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  locationText: {
    fontSize: 13,
    color: appColors.grey2,
    marginLeft: 5,
    fontFamily: appFonts.appTextRegular,
  },
  sessionType: {
    fontSize: 13,
    color: appColors.AppBlue,
    fontFamily: appFonts.appTextMedium,
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey2,
    marginTop: 20,
    marginBottom: 10,
    fontFamily: appFonts.appTextBold,
  },
  emptySubtext: {
    fontSize: 14,
    color: appColors.grey3,
    textAlign: 'center',
    fontFamily: appFonts.appTextRegular,
  },
  bookingFooter: {
    backgroundColor: appColors.CardBackground,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bookButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: 15,
    paddingVertical: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.appTextBold,
  },
});

export default AppointmentsScreen;
