/**
 * Services Screen - Main screen with tabs for subscription management
 * Tab 1: Browse Plans (subscription tiers)
 * Tab 2: My Subscription (current subscription management)
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/base';
import { appColors, parameters, appFonts } from '../global/Styles';
import SubscriptionPlansScreen from './servicesScreens/ServicesCatalogScreen';
import MySubscriptionScreen from './servicesScreens/PlansSubscriptionsScreen';
import { scale, moderateScale } from '../global/Scaling';

interface ServicesScreenProps {
  navigation: any;
  route?: any;
}

const ServicesScreen: React.FC<ServicesScreenProps> = ({ navigation, route }) => {
  const initialTab = route?.params?.initialTab || 'plans';
  const [activeTab, setActiveTab] = useState<'plans' | 'subscription'>(initialTab);

  // Listen for route param changes to switch tabs
  useEffect(() => {
    if (route?.params?.initialTab) {
      setActiveTab(route.params.initialTab);
    }
  }, [route?.params?.initialTab]);

  const handleSwitchTab = (tab: 'plans' | 'subscription') => {
    setActiveTab(tab);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'plans':
        return <SubscriptionPlansScreen navigation={navigation} />;
      case 'subscription':
        return <MySubscriptionScreen navigation={navigation} onSwitchTab={handleSwitchTab} />;
      default:
        return <SubscriptionPlansScreen navigation={navigation} />;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar backgroundColor={appColors.AppBlue} barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" type="material" color={appColors.CardBackground} size={moderateScale(24)} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Services</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate('BillingHistoryScreen')}
        >
          <Icon name="receipt" type="material" color={appColors.CardBackground} size={moderateScale(24)} />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'plans' && styles.activeTab]}
          onPress={() => setActiveTab('plans')}
        >
          <Icon
            name="card-membership"
            type="material"
            color={activeTab === 'plans' ? appColors.AppBlue : appColors.grey3}
            size={moderateScale(20)}
          />
          <Text style={[
            styles.tabText,
            activeTab === 'plans' && styles.activeTabText
          ]}>
            Browse Plans
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'subscription' && styles.activeTab]}
          onPress={() => setActiveTab('subscription')}
        >
          <Icon
            name="account-circle"
            type="material"
            color={activeTab === 'subscription' ? appColors.AppBlue : appColors.grey3}
            size={moderateScale(20)}
          />
          <Text style={[
            styles.tabText,
            activeTab === 'subscription' && styles.activeTabText
          ]}>
            My Subscription
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View style={styles.content}>
        {renderTabContent()}
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
    backgroundColor: appColors.AppBlue,
    paddingTop: parameters.headerHeightS,
    paddingBottom: scale(20),
    paddingHorizontal: scale(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(2) },
    shadowOpacity: 0.1,
    shadowRadius: scale(4),
  },
  headerTitle: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  backButton: {
    padding: scale(8),
    borderRadius: scale(20),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerButton: {
    padding: scale(8),
    borderRadius: scale(20),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: appColors.CardBackground,
    paddingHorizontal: scale(20),
    paddingVertical: scale(10),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(1) },
    shadowOpacity: 0.1,
    shadowRadius: scale(2),
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(12),
    paddingHorizontal: scale(16),
    borderRadius: scale(25),
    marginHorizontal: scale(4),
  },
  activeTab: {
    backgroundColor: appColors.AppBlue + '15',
  },
  tabText: {
    fontSize: moderateScale(14),
    color: appColors.grey3,
    marginLeft: scale(6),
    fontFamily: appFonts.headerTextRegular,
  },
  activeTabText: {
    color: appColors.AppBlue,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  content: {
    flex: 1,
  },
});

export default ServicesScreen;
