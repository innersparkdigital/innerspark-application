import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Badge } from '@rneui/themed';
import { useSelector } from 'react-redux';
import { appColors, appFonts } from '../../global/Styles';
import ISStatusBar from '../../components/ISStatusBar';
import { getFirstName } from '../../global/LHShortcuts';
import { appImages } from '../../global/Data';

const THDashboardScreen = ({ navigation }: any) => {
  const userDetails = useSelector((state: any) => state.userData.userDetails);
  const [unreadNotifications] = useState(3); // Mock unread count

  // Dashboard cards configuration with stats
  const dashboardCards = [
    {
      id: 1,
      title: 'Appointments',
      subtitle: 'Today',
      icon: 'calendar-today',
      color: appColors.AppBlue,
      screen: 'THAppointments',
      count: '5',
      badge: 'upcoming',
    },
    {
      id: 2,
      title: 'Client Requests',
      subtitle: 'Pending',
      icon: 'person-add',
      color: '#FF9800',
      screen: 'THRequestsScreen',
      count: '3',
      badge: 'new',
    },
    {
      id: 3,
      title: 'Support Groups',
      subtitle: 'Active',
      icon: 'people',
      color: '#9C27B0',
      screen: 'THGroups',
      count: '8',
      badge: null,
    },
    {
      id: 4,
      title: 'Messages',
      subtitle: 'Unread',
      icon: 'message',
      color: appColors.AppGreen,
      screen: 'THChats',
      count: '12',
      badge: 'new',
    },
  ];

  const DashboardCard = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate(item.screen)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: item.color + '15' }]}>
          <Icon
            type="material"
            name={item.icon}
            color={item.color}
            size={24}
          />
        </View>
        {item.badge && (
          <View style={[styles.badge, { backgroundColor: item.badge === 'new' ? '#F44336' : '#FF9800' }]}>
            <Text style={styles.badgeTextSmall}>{item.badge}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.cardCount}>{item.count}</Text>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
      </View>

      <View style={styles.cardFooter}>
        <Icon
          type="material"
          name="arrow-forward"
          color={item.color}
          size={18}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ISStatusBar />

      {/* Blue Header Section */}
      <View style={styles.header}>
        {/* Top row with logo and notification icon */}
        <View style={styles.headerTopRow}>
          <Image 
            source={appImages.logoRecWhite} 
            style={styles.logo}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('THNotificationsScreen')}
            activeOpacity={0.7}
          >
            <View style={styles.notificationIconContainer}>
              <Icon name="notifications" type="material" color={appColors.CardBackground} size={26} />
              {unreadNotifications > 0 && (
                <Badge
                  value={unreadNotifications > 99 ? '99+' : unreadNotifications}
                  status="error"
                  containerStyle={styles.badgeContainer}
                  textStyle={styles.badgeText}
                />
              )}
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Greeting Section */}
        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>
            Hello Dr. {getFirstName(userDetails?.firstName) || 'Therapist'} 👋
          </Text>
          <Text style={styles.subtitle}>Here's what's happening with your practice</Text>
        </View>

        {/* Quick Stats Row */}
        <View style={styles.quickStatsRow}>
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatNumber}>5</Text>
            <Text style={styles.quickStatLabel}>Today</Text>
          </View>
          <View style={styles.quickStatDivider} />
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatNumber}>3</Text>
            <Text style={styles.quickStatLabel}>Pending</Text>
          </View>
          <View style={styles.quickStatDivider} />
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatNumber}>45</Text>
            <Text style={styles.quickStatLabel}>Clients</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Dashboard Cards Grid */}
        <View style={styles.cardsGrid}>
          {dashboardCards.map((item) => (
            <DashboardCard key={item.id} item={item} />
          ))}
        </View>
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: appColors.AppBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 160,
    height: 40,
  },
  iconButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  notificationIconContainer: {
    position: 'relative',
  },
  badgeContainer: {
    position: 'absolute',
    top: -6,
    right: -6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  greetingSection: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 26,
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 14,
    color: appColors.CardBackground,
    fontFamily: appFonts.bodyTextRegular,
    opacity: 0.92,
    lineHeight: 20,
  },
  quickStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginTop: 4,
  },
  quickStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  quickStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 2,
  },
  quickStatLabel: {
    fontSize: 11,
    color: appColors.CardBackground,
    fontFamily: appFonts.bodyTextRegular,
    opacity: 0.85,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  quickStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  card: {
    width: '48%',
    backgroundColor: appColors.CardBackground,
    borderRadius: 18,
    padding: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    minHeight: 145,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  badgeTextSmall: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: appFonts.bodyTextBold,
    textTransform: 'uppercase',
  },
  cardContent: {
    flex: 1,
    marginBottom: 8,
  },
  cardCount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 3,
    lineHeight: 32,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextSemiBold,
    marginBottom: 1,
  },
  cardSubtitle: {
    fontSize: 10,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 6,
  },
});

export default THDashboardScreen;
