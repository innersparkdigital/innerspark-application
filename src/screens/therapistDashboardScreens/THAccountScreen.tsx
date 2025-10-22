import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button, BottomSheet } from '@rneui/themed';
import { useSelector, useDispatch } from 'react-redux';
import { signout } from '../../features/user/userSlice';
import { appColors, appFonts, parameters } from '../../global/Styles';
import { removeItemLS, retrieveItemLS } from '../../global/StorageActions';
import ISGenericHeader from '../../components/ISGenericHeader';
import ISStatusBar from '../../components/ISStatusBar';

const THAccountScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const userDetails = useSelector((state: any) => state.userData.userDetails);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  /** Signout current user */
  const signOutHandler = async () => {
    dispatch(signout());

    // remove local storage session as well if there's one
    const userToken = await retrieveItemLS('userToken');
    if (userToken) {
      removeItemLS('userToken');
    }

    // Remove all stored data if available
    const userDetailsLS = await retrieveItemLS('userDetailsLS');
    if (userDetailsLS) {
      removeItemLS('userDetailsLS');
    }
  };

  const menuSections = [
    {
      title: 'Professional',
      items: [
        { icon: 'schedule', label: 'Availability & Hours', screen: 'THAvailabilityScreen', color: appColors.AppGreen },
        { icon: 'attach-money', label: 'Pricing & Payments', screen: 'THPricingScreen', color: '#4CAF50' },
        { icon: 'assessment', label: 'Performance Analytics', screen: 'THAnalyticsScreen', color: '#FF9800' },
        { icon: 'star', label: 'Reviews & Ratings', screen: 'THReviewsScreen', color: '#FFD700' },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: 'feedback', label: 'Send Feedback', screen: 'SendFeedbackScreen', color: '#00BCD4' },
        { icon: 'info', label: 'About', screen: 'AboutAppScreen', color: appColors.grey3 },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ISStatusBar />
      
      <ISGenericHeader
        title="Account"
        navigation={navigation}
      />

      <ScrollView style={styles.content}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {userDetails?.firstName?.[0]}{userDetails?.lastName?.[0]}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              Dr. {userDetails?.firstName} {userDetails?.lastName}
            </Text>
            <Text style={styles.profileEmail}>{userDetails?.email}</Text>
            <View style={styles.badgeContainer}>
              <View style={styles.badge}>
                <Icon type="material" name="verified" size={14} color={appColors.AppGreen} />
                <Text style={styles.badgeText}>Verified Therapist</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>156</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>4.9</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>45</Text>
            <Text style={styles.statLabel}>Clients</Text>
          </View>
        </View>

        {/* Menu Sections */}
        {menuSections.map((section, index) => (
          <View key={index} style={styles.menuSection}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.menuItem,
                    itemIndex !== section.items.length - 1 && styles.menuItemBorder,
                  ]}
                  onPress={() => item.screen && navigation.navigate(item.screen)}
                >
                  <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                    <Icon type="material" name={item.icon} size={20} color={item.color} />
                  </View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Icon type="material" name="chevron-right" size={24} color={appColors.grey3} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => setIsLogoutModalVisible(true)}
          activeOpacity={0.8}
        >
          <Icon type="material" name="logout" size={20} color="#F44336" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/** Logout BottomSheet Modal */}
      <BottomSheet
        containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.5)' }}
        modalProps={{
          presentationStyle: 'overFullScreen',
          visible: isLogoutModalVisible,
        }}
        onBackdropPress={() => {
          setIsLogoutModalVisible(false);
        }}
      >
        <View style={parameters.doffeeModalContainer}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 20,
            }}
          >
            <Icon type="material" name="logout" color={appColors.AppBlue} size={50} />
            <Text
              style={{
                fontSize: 18,
                paddingVertical: 15,
                color: appColors.AppBlue,
                textAlign: 'center',
                fontFamily: appFonts.headerTextBold,
              }}
            >
              Are you sure you want to log out?
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: appColors.AppGray,
                textAlign: 'center',
                fontFamily: appFonts.bodyTextRegular,
                paddingHorizontal: 20,
              }}
            >
              You'll need to sign in again to access your account.
            </Text>
          </View>
          <View style={{ paddingVertical: 5 }}></View>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1, paddingHorizontal: 10 }}>
              <Button
                title="Cancel"
                buttonStyle={[
                  parameters.appButtonXL,
                  { backgroundColor: appColors.AppLightGray },
                ]}
                titleStyle={[
                  parameters.appButtonXLTitle,
                  { color: appColors.AppBlue },
                ]}
                onPress={() => setIsLogoutModalVisible(false)}
              />
            </View>
            <View style={{ flex: 1, paddingHorizontal: 10 }}>
              <Button
                title="Log Out"
                buttonStyle={[
                  parameters.appButtonXL,
                  { backgroundColor: '#F44336' },
                ]}
                titleStyle={parameters.appButtonXLTitle}
                onPress={() => {
                  signOutHandler();
                  setIsLogoutModalVisible(false);
                }}
              />
            </View>
          </View>
          <View style={{ paddingVertical: 25 }}></View>
        </View>
      </BottomSheet>
      {/* -- Logout BottomSheet Modal ends */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.AppLightGray,
  },
  content: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: appColors.AppBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: appFonts.headerTextBold,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.AppGreen + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    color: appColors.AppGreen,
    fontFamily: appFonts.bodyTextMedium,
    fontWeight: '600',
    marginLeft: 4,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 20,
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
  },
  statLabel: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    marginTop: 4,
  },
  menuSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey2,
    fontFamily: appFonts.headerTextBold,
    marginLeft: 16,
    marginBottom: 8,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: appColors.grey6,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextMedium,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F44336',
  },
  logoutText: {
    fontSize: 16,
    color: '#F44336',
    fontFamily: appFonts.bodyTextMedium,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default THAccountScreen;
