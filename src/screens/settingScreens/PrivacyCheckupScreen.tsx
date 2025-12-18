/**
 * Privacy Checkup Screen - Review and optimize privacy settings
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';
import { useSelector } from 'react-redux';
import { NavigationProp } from '@react-navigation/native';
import ISGenericHeader from '../../components/ISGenericHeader';
import { getPrivacySettings } from '../../api/client/settings';

interface PrivacyCheckupScreenProps {
  navigation: NavigationProp<any>;
}

interface PrivacyCheckItem {
  id: string;
  category: string;
  title: string;
  description: string;
  status: 'good' | 'warning' | 'critical';
  icon: string;
  recommendation?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
}

const PrivacyCheckupScreen: React.FC<PrivacyCheckupScreenProps> = ({ navigation }) => {
  const toast = useToast();
  const userId = useSelector((state: any) => state.userData.userDetails.userId);
  const [isScanning, setIsScanning] = useState(true);
  const [scanProgress, setScanProgress] = useState(0);
  const [checkupComplete, setCheckupComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const progressAnim = useState(new Animated.Value(0))[0];

  const [privacyChecks, setPrivacyChecks] = useState<PrivacyCheckItem[]>([
    {
      id: 'data_collection',
      category: 'Data Collection',
      title: 'Analytics & Usage Data',
      description: 'Your app usage data is being collected for analytics',
      status: 'warning',
      icon: 'analytics',
      recommendation: 'Consider disabling analytics if you prefer not to share usage data',
      action: {
        label: 'Review Settings',
        onPress: () => navigation.navigate('PrivacySettingsScreen'),
      },
    },
    {
      id: 'location_data',
      category: 'Location',
      title: 'Location Services',
      description: 'Location data is currently disabled',
      status: 'good',
      icon: 'location-off',
      recommendation: 'Good! Location data is not being collected',
    },
    {
      id: 'profile_visibility',
      category: 'Profile',
      title: 'Profile Visibility',
      description: 'Your profile is set to private',
      status: 'good',
      icon: 'visibility-off',
      recommendation: 'Your profile information is protected',
    },
    {
      id: 'data_sharing',
      category: 'Data Sharing',
      title: 'Third-Party Sharing',
      description: 'Data sharing with partners is disabled',
      status: 'good',
      icon: 'shield',
      recommendation: 'Your data is not shared with third parties',
    },
    {
      id: 'account_security',
      category: 'Security',
      title: 'Account Security',
      description: 'Two-factor authentication is not enabled',
      status: 'critical',
      icon: 'security',
      recommendation: 'Enable 2FA to better protect your account',
      action: {
        label: 'Enable 2FA',
        onPress: () => navigation.navigate('SecuritySettingsScreen'),
      },
    },
    {
      id: 'communication',
      category: 'Communication',
      title: 'Message Privacy',
      description: 'Messages from all users are allowed',
      status: 'warning',
      icon: 'chat',
      recommendation: 'Consider restricting messages to connections only',
      action: {
        label: 'Adjust Settings',
        onPress: () => navigation.navigate('PrivacySettingsScreen'),
      },
    },
  ]);

  useEffect(() => {
    const fetchPrivacyData = async () => {
      try {
        const response = await getPrivacySettings(userId);
        
        if (response.success) {
          const settings = response.data;
          
          const checks: PrivacyCheckItem[] = [
            {
              id: 'profile_visibility',
              category: 'Profile',
              title: 'Profile Visibility',
              description: `Your profile is set to ${settings.profileVisibility || 'private'}`,
              status: settings.profileVisibility === 'private' ? 'good' : 'warning',
              icon: settings.profileVisibility === 'private' ? 'visibility-off' : 'visibility',
              recommendation: settings.profileVisibility === 'private' 
                ? 'Your profile information is protected' 
                : 'Consider setting your profile to private for better privacy',
              action: settings.profileVisibility !== 'private' ? {
                label: 'Review Settings',
                onPress: () => navigation.navigate('PrivacySettingsScreen'),
              } : undefined,
            },
            {
              id: 'data_sharing',
              category: 'Data Sharing',
              title: 'Third-Party Sharing',
              description: settings.dataSharing ? 'Data sharing with partners is enabled' : 'Data sharing with partners is disabled',
              status: settings.dataSharing ? 'warning' : 'good',
              icon: 'shield',
              recommendation: settings.dataSharing 
                ? 'Consider disabling data sharing for better privacy' 
                : 'Your data is not shared with third parties',
              action: settings.dataSharing ? {
                label: 'Adjust Settings',
                onPress: () => navigation.navigate('PrivacySettingsScreen'),
              } : undefined,
            },
            {
              id: 'online_status',
              category: 'Communication',
              title: 'Online Status',
              description: settings.showOnlineStatus ? 'Your online status is visible' : 'Your online status is hidden',
              status: settings.showOnlineStatus ? 'warning' : 'good',
              icon: settings.showOnlineStatus ? 'visibility' : 'visibility-off',
              recommendation: settings.showOnlineStatus 
                ? 'Consider hiding your online status for more privacy' 
                : 'Good! Your online status is private',
            },
            {
              id: 'communication',
              category: 'Communication',
              title: 'Message Privacy',
              description: settings.allowMessages ? 'Messages from all users are allowed' : 'Messages are restricted',
              status: settings.allowMessages ? 'warning' : 'good',
              icon: 'chat',
              recommendation: settings.allowMessages 
                ? 'Consider restricting messages to connections only' 
                : 'Good! Message privacy is enabled',
              action: settings.allowMessages ? {
                label: 'Adjust Settings',
                onPress: () => navigation.navigate('PrivacySettingsScreen'),
              } : undefined,
            },
            {
              id: 'account_security',
              category: 'Security',
              title: 'Account Security',
              description: 'Two-factor authentication status',
              status: 'critical',
              icon: 'security',
              recommendation: 'Enable 2FA to better protect your account',
              action: {
                label: 'Enable 2FA',
                onPress: () => navigation.navigate('SecuritySettingsScreen'),
              },
            },
          ];
          
          setPrivacyChecks(checks);
        }
      } catch (error) {
        console.error('Error fetching privacy settings:', error);
        toast.show({
          description: 'Failed to load privacy settings',
          duration: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrivacyData();
  }, [userId]);

  useEffect(() => {
    if (isScanning && !isLoading) {
      const interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsScanning(false);
            setCheckupComplete(true);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      Animated.timing(progressAnim, {
        toValue: 100,
        duration: 2000,
        useNativeDriver: false,
      }).start();

      return () => clearInterval(interval);
    }
  }, [isScanning, isLoading]);

  const getStatusColor = (status: 'good' | 'warning' | 'critical') => {
    switch (status) {
      case 'good':
        return '#4CAF50';
      case 'warning':
        return '#FF9800';
      case 'critical':
        return '#F44336';
      default:
        return appColors.grey3;
    }
  };

  const getStatusIcon = (status: 'good' | 'warning' | 'critical') => {
    switch (status) {
      case 'good':
        return 'check-circle';
      case 'warning':
        return 'warning';
      case 'critical':
        return 'error';
      default:
        return 'info';
    }
  };

  const getStatusText = (status: 'good' | 'warning' | 'critical') => {
    switch (status) {
      case 'good':
        return 'Good';
      case 'warning':
        return 'Review Recommended';
      case 'critical':
        return 'Action Required';
      default:
        return 'Unknown';
    }
  };

  const getSummaryStats = () => {
    const good = privacyChecks.filter(item => item.status === 'good').length;
    const warning = privacyChecks.filter(item => item.status === 'warning').length;
    const critical = privacyChecks.filter(item => item.status === 'critical').length;
    return { good, warning, critical };
  };

  const stats = getSummaryStats();

  const renderScanningView = () => (
    <View style={styles.scanningContainer}>
      <View style={styles.scanningIcon}>
        <Icon name="shield-checkmark" type="ionicon" color={appColors.AppBlue} size={80} />
      </View>
      <Text style={styles.scanningTitle}>Running Privacy Checkup</Text>
      <Text style={styles.scanningSubtitle}>Analyzing your privacy settings...</Text>
      
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${scanProgress}%` }]} />
        </View>
        <Text style={styles.progressText}>{scanProgress}%</Text>
      </View>

      <View style={styles.scanningSteps}>
        <View style={styles.scanStep}>
          <Icon name="check" type="material" color={scanProgress > 20 ? '#4CAF50' : appColors.grey4} size={16} />
          <Text style={styles.scanStepText}>Checking data collection</Text>
        </View>
        <View style={styles.scanStep}>
          <Icon name="check" type="material" color={scanProgress > 40 ? '#4CAF50' : appColors.grey4} size={16} />
          <Text style={styles.scanStepText}>Reviewing profile visibility</Text>
        </View>
        <View style={styles.scanStep}>
          <Icon name="check" type="material" color={scanProgress > 60 ? '#4CAF50' : appColors.grey4} size={16} />
          <Text style={styles.scanStepText}>Analyzing data sharing</Text>
        </View>
        <View style={styles.scanStep}>
          <Icon name="check" type="material" color={scanProgress > 80 ? '#4CAF50' : appColors.grey4} size={16} />
          <Text style={styles.scanStepText}>Verifying security settings</Text>
        </View>
      </View>
    </View>
  );

  const renderCheckupResults = () => (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Icon name="verified-user" type="material" color={appColors.AppBlue} size={32} />
          <Text style={styles.summaryTitle}>Privacy Checkup Complete</Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={[styles.statCircle, { backgroundColor: '#4CAF50' + '20' }]}>
              <Text style={[styles.statNumber, { color: '#4CAF50' }]}>{stats.good}</Text>
            </View>
            <Text style={styles.statLabel}>Good</Text>
          </View>
          
          <View style={styles.statItem}>
            <View style={[styles.statCircle, { backgroundColor: '#FF9800' + '20' }]}>
              <Text style={[styles.statNumber, { color: '#FF9800' }]}>{stats.warning}</Text>
            </View>
            <Text style={styles.statLabel}>Review</Text>
          </View>
          
          <View style={styles.statItem}>
            <View style={[styles.statCircle, { backgroundColor: '#F44336' + '20' }]}>
              <Text style={[styles.statNumber, { color: '#F44336' }]}>{stats.critical}</Text>
            </View>
            <Text style={styles.statLabel}>Critical</Text>
          </View>
        </View>

        <Text style={styles.summaryDescription}>
          {stats.critical > 0
            ? `${stats.critical} critical issue${stats.critical > 1 ? 's' : ''} require${stats.critical === 1 ? 's' : ''} your attention`
            : stats.warning > 0
            ? `${stats.warning} setting${stats.warning > 1 ? 's' : ''} could be improved`
            : 'Your privacy settings look great!'}
        </Text>
      </View>

      {/* Privacy Check Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DETAILED RESULTS</Text>
        
        {privacyChecks.map((item, index) => (
          <View key={item.id} style={styles.checkItem}>
            <View style={styles.checkItemHeader}>
              <View style={[styles.checkIconContainer, { backgroundColor: getStatusColor(item.status) + '15' }]}>
                <Icon
                  name={item.icon}
                  type="material"
                  color={getStatusColor(item.status)}
                  size={24}
                />
              </View>
              <View style={styles.checkItemContent}>
                <Text style={styles.checkItemCategory}>{item.category}</Text>
                <Text style={styles.checkItemTitle}>{item.title}</Text>
                <Text style={styles.checkItemDescription}>{item.description}</Text>
              </View>
              <View style={styles.checkStatusBadge}>
                <Icon
                  name={getStatusIcon(item.status)}
                  type="material"
                  color={getStatusColor(item.status)}
                  size={20}
                />
              </View>
            </View>

            {item.recommendation && (
              <View style={[styles.recommendationBox, { borderLeftColor: getStatusColor(item.status) }]}>
                <Icon name="lightbulb" type="material" color={appColors.grey3} size={16} />
                <Text style={styles.recommendationText}>{item.recommendation}</Text>
              </View>
            )}

            {item.action && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={item.action.onPress}
                activeOpacity={0.7}
              >
                <Text style={styles.actionButtonText}>{item.action.label}</Text>
                <Icon name="chevron-right" type="material" color={appColors.AppBlue} size={18} />
              </TouchableOpacity>
            )}

            {index < privacyChecks.length - 1 && <View style={styles.checkItemSeparator} />}
          </View>
        ))}
      </View>

      {/* Quick Tips */}
      <View style={styles.tipsCard}>
        <View style={styles.tipsHeader}>
          <Icon name="tips-and-updates" type="material" color={appColors.AppBlue} size={24} />
          <Text style={styles.tipsTitle}>Privacy Tips</Text>
        </View>
        <View style={styles.tipsList}>
          <View style={styles.tipItem}>
            <Icon name="fiber-manual-record" type="material" color={appColors.AppBlue} size={8} />
            <Text style={styles.tipText}>Review your privacy settings regularly</Text>
          </View>
          <View style={styles.tipItem}>
            <Icon name="fiber-manual-record" type="material" color={appColors.AppBlue} size={8} />
            <Text style={styles.tipText}>Only share data that you're comfortable with</Text>
          </View>
          <View style={styles.tipItem}>
            <Icon name="fiber-manual-record" type="material" color={appColors.AppBlue} size={8} />
            <Text style={styles.tipText}>Enable two-factor authentication for extra security</Text>
          </View>
          <View style={styles.tipItem}>
            <Icon name="fiber-manual-record" type="material" color={appColors.AppBlue} size={8} />
            <Text style={styles.tipText}>Be cautious about location data sharing</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <Button
          title="Go to Privacy Settings"
          buttonStyle={parameters.appButtonXLBlue}
          titleStyle={parameters.appButtonXLTitleBlue}
          onPress={() => navigation.navigate('PrivacySettingsScreen')}
        />
        
        <TouchableOpacity
          style={styles.runAgainButton}
          onPress={async () => {
            setIsScanning(true);
            setCheckupComplete(false);
            setScanProgress(0);
            setIsLoading(true);
            toast.show({
              description: 'Running privacy checkup again...',
              duration: 2000,
            });
            
            try {
              const response = await getPrivacySettings(userId);
              if (response.success) {
                const settings = response.data;
                const checks: PrivacyCheckItem[] = [
                  {
                    id: 'profile_visibility',
                    category: 'Profile',
                    title: 'Profile Visibility',
                    description: `Your profile is set to ${settings.profileVisibility || 'private'}`,
                    status: settings.profileVisibility === 'private' ? 'good' : 'warning',
                    icon: settings.profileVisibility === 'private' ? 'visibility-off' : 'visibility',
                    recommendation: settings.profileVisibility === 'private' 
                      ? 'Your profile information is protected' 
                      : 'Consider setting your profile to private for better privacy',
                  },
                  {
                    id: 'data_sharing',
                    category: 'Data Sharing',
                    title: 'Third-Party Sharing',
                    description: settings.dataSharing ? 'Data sharing enabled' : 'Data sharing disabled',
                    status: settings.dataSharing ? 'warning' : 'good',
                    icon: 'shield',
                    recommendation: settings.dataSharing ? 'Consider disabling' : 'Good!',
                  },
                ];
                setPrivacyChecks(checks);
              }
            } catch (error) {
              console.error('Error re-scanning:', error);
            } finally {
              setIsLoading(false);
            }
          }}
          activeOpacity={0.7}
        >
          <Icon name="refresh" type="material" color={appColors.AppBlue} size={20} />
          <Text style={styles.runAgainText}>Run Checkup Again</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ISGenericHeader
        title="Privacy Checkup"
        navigation={navigation}
              />

      {isScanning ? renderScanningView() : renderCheckupResults()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.AppLightGray,
  },
  scrollView: {
    flex: 1,
  },
  
  // Scanning View Styles
  scanningContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  scanningIcon: {
    marginBottom: 30,
  },
  scanningTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 8,
    textAlign: 'center',
  },
  scanningSubtitle: {
    fontSize: 16,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginBottom: 40,
    textAlign: 'center',
  },
  progressBarContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  progressBarBackground: {
    width: '100%',
    height: 8,
    backgroundColor: appColors.grey6,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: appColors.AppBlue,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
  },
  scanningSteps: {
    width: '100%',
    marginTop: 20,
  },
  scanStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  scanStepText: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    marginLeft: 12,
  },

  // Results View Styles
  summaryCard: {
    backgroundColor: appColors.CardBackground,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginTop: 12,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  statLabel: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
  },
  summaryDescription: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Check Items Styles
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: appColors.grey2,
    fontFamily: appFonts.headerTextBold,
    marginHorizontal: 20,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  checkItem: {
    backgroundColor: appColors.CardBackground,
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  checkItemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkItemContent: {
    flex: 1,
  },
  checkItemCategory: {
    fontSize: 12,
    color: appColors.grey4,
    fontFamily: appFonts.headerTextRegular,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  checkItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 4,
  },
  checkItemDescription: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    lineHeight: 18,
  },
  checkStatusBadge: {
    marginLeft: 8,
  },
  recommendationBox: {
    flexDirection: 'row',
    backgroundColor: appColors.grey6,
    borderLeftWidth: 3,
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    alignItems: 'flex-start',
  },
  recommendationText: {
    flex: 1,
    fontSize: 13,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    marginLeft: 8,
    lineHeight: 18,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: appColors.AppBlue + '10',
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
    marginRight: 4,
  },
  checkItemSeparator: {
    height: 1,
    backgroundColor: appColors.grey6,
    marginTop: 16,
  },

  // Tips Card Styles
  tipsCard: {
    backgroundColor: appColors.AppBlue + '10',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 16,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginLeft: 8,
  },
  tipsList: {
    marginTop: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    marginLeft: 12,
    lineHeight: 20,
  },

  // Action Buttons
  actionButtonsContainer: {
    marginHorizontal: 20,
    marginTop: 30,
  },
  runAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginTop: 12,
  },
  runAgainText: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default PrivacyCheckupScreen;
