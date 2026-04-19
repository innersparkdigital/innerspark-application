import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button, BottomSheet, Skeleton } from '@rneui/themed';
import { launchImageLibrary } from 'react-native-image-picker';
import { useSelector, useDispatch } from 'react-redux';
import { useToast } from 'native-base';
import ISAlert, { useISAlert } from '../../components/alerts/ISAlert';
import { signout } from '../../features/user/userSlice';
import { appColors, appFonts, parameters } from '../../global/Styles';
import { moderateScale } from '../../global/Scaling';
import { removeItemLS, retrieveItemLS } from '../../global/StorageActions';
import ISGenericHeader from '../../components/ISGenericHeader';
import ISStatusBar from '../../components/ISStatusBar';
import TherapistProfilePreviewCard from '../../components/modals/TherapistProfilePreviewCard';
import { updateAvatar } from '../../api/therapist/utilities';
import { getTherapistProfile as getTherapistProfileAPI, getDashboardStats as getDashboardStatsAPI } from '../../api/therapist/dashboard';
import { updateTherapistProfile as updateTherapistProfileRedux, updateDashboardStats as updateDashboardStatsRedux } from '../../features/therapist/dashboardSlice';
import { resolveTherapistImage } from '../../utils/imageHelpers';

const THAccountScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const userDetails = useSelector((state: any) => state.userData.userDetails);
  const analyticsOverview = useSelector((state: any) => state.therapistAnalytics.overview);
  const therapistProfile = useSelector((state: any) => state.therapistDashboard.profile);
  const dashboardStats = useSelector((state: any) => state.therapistDashboard.stats);
  const dashboardLoading = useSelector((state: any) => state.therapistDashboard.loading);
  const analyticsLoading = useSelector((state: any) => state.therapistAnalytics.loading);
  const toast = useToast();
  const alert = useISAlert();
  const isLoading = dashboardLoading || analyticsLoading;
  const [isProfilePreviewVisible, setIsProfilePreviewVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [avatarLoadError, setAvatarLoadError] = useState(false);

  const loadProfileData = async () => {
    const therapistId = userDetails?.userId;
    if (!therapistId) return;

    try {
      const [profileRes, statsRes] = await Promise.all([
        getTherapistProfileAPI(therapistId),
        getDashboardStatsAPI(therapistId)
      ]);

      if (profileRes?.success) {
        dispatch(updateTherapistProfileRedux(profileRes.data));
      }
      if (statsRes?.success) {
        dispatch(updateDashboardStatsRedux(statsRes.data));
      }
    } catch (error) {
      console.error('[THAccountScreen] Failed to refresh profile data:', error);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadProfileData();
    setIsRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadProfileData();
    }, [userDetails?.userId])
  );

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

  /** Decode HTML entities for specialization text */
  const decodeHtmlEntities = (text: string): string => {
    if (!text) return '';
    return text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  };
 
  const handleAvatarEdit = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: false,
      });
 
      if (result.didCancel) return;
      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const file = {
          uri: asset.uri,
          name: asset.fileName || 'avatar.jpg',
          type: asset.type || 'image/jpeg',
        };
 
        setIsUploading(true);
        const therapistId = userDetails?.userId;
        
        // 1. Upload file using the specialized avatar endpoint
        // This endpoint both uploads the file and updates the user's profile record
        const uploadResponse = await updateAvatar(therapistId, file);
        
        if (uploadResponse?.success) {
          // 2. Refresh profile in Redux to reflect the new image
          const profileResponse = await getTherapistProfileAPI(therapistId);
          if (profileResponse?.success) {
            dispatch(updateTherapistProfileRedux(profileResponse.data));
            toast.show({
              description: 'Avatar updated successfully!',
              duration: 3000,
            });
          }
        } else {
          throw new Error('File upload failed');
        }
      }
    } catch (error: any) {
      console.error('Avatar Upload Error:', error);
      alert.show({
        type: 'error',
        title: 'Upload Failed',
        message: error.message || 'There was an issue uploading your avatar. Please try again.',
        confirmText: 'OK',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const rawProfileImage = therapistProfile?.profileImage || userDetails?.avatar || userDetails?.profilePicture;
  const profileImage = resolveTherapistImage(rawProfileImage, 0);

  const menuSections = [
    {
      title: 'Professional',
      items: [
        // { icon: 'schedule', label: 'Availability & Hours', screen: 'THAvailabilityScreen', color: appColors.AppGreen },
        { icon: 'event-seat', label: 'Availability Slots', screen: 'THAvailabilitySlotsScreen', color: appColors.AppBlue },
        { icon: 'attach-money', label: 'Pricing & Payments', screen: 'THPricingScreen', color: '#4CAF50' },
        { icon: 'assessment', label: 'Performance Analytics', screen: 'THAnalyticsScreen', color: '#FF9800' },
        { icon: 'star', label: 'Reviews & Ratings', screen: 'THReviewsScreen', color: '#FFD700' },
      ],
    },
    {
      title: 'Support',
      items: [
        // { icon: 'feedback', label: 'Send Feedback', screen: 'SendFeedbackScreen', color: '#00BCD4' },
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

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[appColors.AppBlue]}
            tintColor={appColors.AppBlue}
          />
        }
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            {isLoading || isUploading ? (
              <Skeleton animation="pulse" width={70} height={70} style={{ borderRadius: 35 }} />
            ) : profileImage ? (
              <Image
                key={avatarLoadError ? 'fallback' : 'primary'}
                source={{ uri: avatarLoadError ? resolveTherapistImage(rawProfileImage, 1) : profileImage }}
                style={styles.avatarImage}
                onError={() => {
                  if (!avatarLoadError) {
                    setAvatarLoadError(true);
                  }
                }}
              />
            ) : (
              <Text style={styles.avatarText}>
                {userDetails?.firstName?.[0] || ''}{userDetails?.lastName?.[0] || ''}
              </Text>
            )}
            <TouchableOpacity 
              style={styles.avatarEditButton}
              onPress={handleAvatarEdit}
              disabled={isUploading}
              activeOpacity={0.8}
            >
              {isUploading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Icon 
                  type="material" 
                  name="photo-camera" 
                  size={14} 
                  color="#FFFFFF" 
                />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.profileInfo}>
            {isLoading ? (
              <>
                <Skeleton animation="pulse" width={150} height={24} style={{ borderRadius: 6, marginBottom: 8 }} />
                <Skeleton animation="pulse" width={120} height={14} style={{ borderRadius: 4, marginBottom: 12 }} />
                <Skeleton animation="pulse" width={100} height={20} style={{ borderRadius: 10 }} />
              </>
            ) : (
              <>
                <Text style={styles.profileName}>
                  {userDetails?.firstName} {userDetails?.lastName}
                </Text>
                <Text style={styles.profileEmail}>{userDetails?.email}</Text>
                <View style={styles.badgeContainer}>
                  <View style={styles.badge}>
                    <Icon type="material" name="verified" size={14} color={appColors.AppGreen} />
                    <Text style={styles.badgeText}>
                      {decodeHtmlEntities(therapistProfile?.specialization || 'Verified Therapist')}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>
          {/* Preview Profile Eye Icon */}
          <TouchableOpacity
            style={styles.previewIconButton}
            onPress={() => setIsProfilePreviewVisible(true)}
            activeOpacity={0.7}
          >
            <Icon type="material" name="visibility" size={20} color={appColors.AppBlue} />
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {isLoading ? (
            <>
              <View style={styles.statBox}>
                <Skeleton animation="pulse" width={40} height={28} style={{ borderRadius: 6, marginBottom: 4 }} />
                <Skeleton animation="pulse" width={50} height={10} style={{ borderRadius: 4 }} />
              </View>
              <View style={styles.statBox}>
                <Skeleton animation="pulse" width={40} height={28} style={{ borderRadius: 6, marginBottom: 4 }} />
                <Skeleton animation="pulse" width={50} height={10} style={{ borderRadius: 4 }} />
              </View>
              <View style={styles.statBox}>
                <Skeleton animation="pulse" width={40} height={28} style={{ borderRadius: 6, marginBottom: 4 }} />
                <Skeleton animation="pulse" width={50} height={10} style={{ borderRadius: 4 }} />
              </View>
            </>
          ) : (
            <>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{therapistProfile?.totalSessions || 0}</Text>
                <Text style={styles.statLabel}>Sessions</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{therapistProfile?.rating ? Number(therapistProfile.rating).toFixed(1) : '0.0'}</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{dashboardStats?.totalClients || 0}</Text>
                <Text style={styles.statLabel}>Clients</Text>
              </View>
            </>
          )}
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


        {/* Test Button */}
        {/* <TouchableOpacity
          style={{ ...parameters.appButtonXLBlue, marginVertical: 10, marginHorizontal: 20 }}
          onPress={() => navigation.navigate('DevTestScreen')}
          activeOpacity={0.8}
        >
          <Text style={parameters.appButtonXLTitleBlue}>Test</Text>
        </TouchableOpacity> */}

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

      {/* Therapist Profile Preview Modal */}
      <TherapistProfilePreviewCard
        visible={isProfilePreviewVisible}
        onDismiss={() => setIsProfilePreviewVisible(false)}
        profile={therapistProfile}
        userDetails={userDetails}
      />
      <View style={styles.bottomSpacing} />
      <ISAlert ref={alert.ref} />
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
  previewIconButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: appColors.AppBlue + '12',
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: moderateScale(28),
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: appFonts.headerTextBold,
  },
  avatarImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: appColors.AppBlue,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: moderateScale(20),
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
    fontSize: moderateScale(24),
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
