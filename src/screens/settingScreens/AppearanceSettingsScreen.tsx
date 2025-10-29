/**
 * Appearance Settings Screen - Theme and display customization
 */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Appearance,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';
import { NavigationProp } from '@react-navigation/native';
import ISGenericHeader from '../../components/ISGenericHeader';
import {
  setTheme,
  setUseSystemTheme,
  setHighContrast,
  setReducedMotion,
  setLargeText,
  selectAppearanceSettings,
} from '../../features/settings/userSettingsSlice';

interface AppearanceSettingsScreenProps {
  navigation: NavigationProp<any>;
}

const AppearanceSettingsScreen: React.FC<AppearanceSettingsScreenProps> = ({ navigation }) => {
  const toast = useToast();
  const dispatch = useDispatch();
  
  // Get settings from Redux
  const appearanceSettings = useSelector(selectAppearanceSettings);
  
  // Local state synced with Redux
  const [selectedTheme, setSelectedThemeLocal] = useState<'light' | 'dark' | 'auto'>(appearanceSettings.theme);
  const [useSystemThemeLocal, setUseSystemThemeLocal] = useState(appearanceSettings.useSystemTheme);
  const [highContrastLocal, setHighContrastLocal] = useState(appearanceSettings.highContrast);
  const [reducedMotionLocal, setReducedMotionLocal] = useState(appearanceSettings.reducedMotion);
  const [largeTextLocal, setLargeTextLocal] = useState(appearanceSettings.largeText);
  
  // Sync local state with Redux on mount
  useEffect(() => {
    setSelectedThemeLocal(appearanceSettings.theme);
    setUseSystemThemeLocal(appearanceSettings.useSystemTheme);
    setHighContrastLocal(appearanceSettings.highContrast);
    setReducedMotionLocal(appearanceSettings.reducedMotion);
    setLargeTextLocal(appearanceSettings.largeText);
  }, [appearanceSettings]);
  
  // Listen to system theme changes when auto mode is enabled
  useEffect(() => {
    if (useSystemThemeLocal) {
      const subscription = Appearance.addChangeListener(({ colorScheme }) => {
        toast.show({
          description: `System theme changed to ${colorScheme}`,
          duration: 2000,
        });
      });
      return () => subscription.remove();
    }
  }, [useSystemThemeLocal]);

  const handleThemeChange = (theme: 'light' | 'dark' | 'auto') => {
    setSelectedThemeLocal(theme);
    dispatch(setTheme(theme));
    toast.show({
      description: `${theme === 'auto' ? 'Auto' : theme === 'light' ? 'Light' : 'Dark'} theme selected`,
      duration: 2000,
    });
  };

  const handleSystemThemeToggle = (value: boolean) => {
    setUseSystemThemeLocal(value);
    dispatch(setUseSystemTheme(value));
    if (value) {
      setSelectedThemeLocal('auto');
      const systemTheme = Appearance.getColorScheme();
      toast.show({
        description: `Using system theme (${systemTheme || 'light'})`,
        duration: 2000,
      });
    }
  };
  
  const handleHighContrastToggle = (value: boolean) => {
    setHighContrastLocal(value);
    dispatch(setHighContrast(value));
    toast.show({
      description: `High contrast ${value ? 'enabled' : 'disabled'}`,
      duration: 2000,
    });
  };
  
  const handleReducedMotionToggle = (value: boolean) => {
    setReducedMotionLocal(value);
    dispatch(setReducedMotion(value));
    toast.show({
      description: `Reduced motion ${value ? 'enabled' : 'disabled'}`,
      duration: 2000,
    });
  };
  
  const handleLargeTextToggle = (value: boolean) => {
    setLargeTextLocal(value);
    dispatch(setLargeText(value));
    toast.show({
      description: `Large text ${value ? 'enabled' : 'disabled'}`,
      duration: 2000,
    });
  };

  const ThemeOption = ({ 
    theme, 
    title, 
    description, 
    icon, 
    iconColor 
  }: { 
    theme: 'light' | 'dark' | 'auto'; 
    title: string; 
    description: string; 
    icon: string; 
    iconColor: string;
  }) => (
    <TouchableOpacity
      style={[
        styles.themeCard,
        selectedTheme === theme && styles.themeCardSelected
      ]}
      onPress={() => handleThemeChange(theme)}
      disabled={useSystemThemeLocal && theme !== 'auto'}
    >
      <View style={[styles.themeIconContainer, { backgroundColor: iconColor + '15' }]}>
        <Icon
          name={icon}
          type="material"
          color={iconColor}
          size={32}
        />
      </View>
      <View style={styles.themeContent}>
        <Text style={styles.themeTitle}>{title}</Text>
        <Text style={styles.themeDescription}>{description}</Text>
      </View>
      {selectedTheme === theme && (
        <Icon
          name="check-circle"
          type="material"
          color={appColors.AppBlue}
          size={24}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ISGenericHeader
        title="Appearance"
        navigation={navigation}
              />

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Icon name="palette" type="material" color="#E91E63" size={32} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Customize Your Experience</Text>
            <Text style={styles.infoText}>
              Choose how Innerspark looks and feels. Your preferences will be saved across all devices.
            </Text>
          </View>
        </View>

        {/* Theme Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>THEME</Text>
          
          <View style={styles.themesContainer}>
            <ThemeOption
              theme="light"
              title="Light Mode"
              description="Bright and clear interface"
              icon="light-mode"
              iconColor="#FFC107"
            />
            
            <ThemeOption
              theme="dark"
              title="Dark Mode"
              description="Easy on the eyes at night"
              icon="dark-mode"
              iconColor="#424242"
            />
            
            <ThemeOption
              theme="auto"
              title="Auto"
              description="Matches system settings"
              icon="brightness-auto"
              iconColor={appColors.AppBlue}
            />
          </View>
        </View>

        {/* System Theme Toggle */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SYSTEM INTEGRATION</Text>
          <View style={styles.sectionContent}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: appColors.AppBlue + '15' }]}>
                  <Icon
                    name="settings-brightness"
                    type="material"
                    color={appColors.AppBlue}
                    size={20}
                  />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Use System Theme</Text>
                  <Text style={styles.settingSubtitle}>
                    Automatically switch based on device settings
                  </Text>
                </View>
              </View>
              <Switch
                value={useSystemThemeLocal}
                onValueChange={handleSystemThemeToggle}
                trackColor={{ false: appColors.grey5, true: appColors.AppBlue + '40' }}
                thumbColor={useSystemThemeLocal ? appColors.AppBlue : appColors.grey4}
              />
            </View>
          </View>
        </View>

        {/* Accessibility */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCESSIBILITY</Text>
          <View style={styles.sectionContent}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#9C27B0' + '15' }]}>
                  <Icon
                    name="contrast"
                    type="material"
                    color="#9C27B0"
                    size={20}
                  />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>High Contrast</Text>
                  <Text style={styles.settingSubtitle}>
                    Increase contrast for better visibility
                  </Text>
                </View>
              </View>
              <Switch
                value={highContrastLocal}
                onValueChange={handleHighContrastToggle}
                trackColor={{ false: appColors.grey5, true: appColors.AppBlue + '40' }}
                thumbColor={highContrastLocal ? appColors.AppBlue : appColors.grey4}
              />
            </View>

            <View style={styles.separator} />

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#FF9800' + '15' }]}>
                  <Icon
                    name="motion-photos-off"
                    type="material"
                    color="#FF9800"
                    size={20}
                  />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Reduce Motion</Text>
                  <Text style={styles.settingSubtitle}>
                    Minimize animations and transitions
                  </Text>
                </View>
              </View>
              <Switch
                value={reducedMotionLocal}
                onValueChange={handleReducedMotionToggle}
                trackColor={{ false: appColors.grey5, true: appColors.AppBlue + '40' }}
                thumbColor={reducedMotionLocal ? appColors.AppBlue : appColors.grey4}
              />
            </View>

            <View style={styles.separator} />

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#4CAF50' + '15' }]}>
                  <Icon
                    name="text-fields"
                    type="material"
                    color="#4CAF50"
                    size={20}
                  />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Large Text</Text>
                  <Text style={styles.settingSubtitle}>
                    Increase text size throughout the app
                  </Text>
                </View>
              </View>
              <Switch
                value={largeTextLocal}
                onValueChange={handleLargeTextToggle}
                trackColor={{ false: appColors.grey5, true: appColors.AppBlue + '40' }}
                thumbColor={largeTextLocal ? appColors.AppBlue : appColors.grey4}
              />
            </View>
          </View>
        </View>

        {/* Display Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DISPLAY</Text>
          <View style={styles.sectionContent}>
            <TouchableOpacity style={styles.displayItem}>
              <View style={styles.displayLeft}>
                <Icon name="format-color-fill" type="material" color={appColors.grey2} size={20} />
                <Text style={styles.displayText}>Accent Color</Text>
              </View>
              <View style={styles.displayRight}>
                <View style={[styles.colorPreview, { backgroundColor: appColors.AppBlue }]} />
                <Icon name="chevron-right" type="material" color={appColors.grey4} size={20} />
              </View>
            </TouchableOpacity>

            <View style={styles.separator} />

            <TouchableOpacity style={styles.displayItem}>
              <View style={styles.displayLeft}>
                <Icon name="font-download" type="material" color={appColors.grey2} size={20} />
                <Text style={styles.displayText}>Font Style</Text>
              </View>
              <View style={styles.displayRight}>
                <Text style={styles.displayValue}>System Default</Text>
                <Icon name="chevron-right" type="material" color={appColors.grey4} size={20} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Preview Card */}
        <View style={styles.previewCard}>
          <Text style={styles.previewTitle}>Preview</Text>
          <View style={styles.previewContent}>
            <View style={styles.previewHeader}>
              <Icon name="mood" type="material" color={appColors.AppBlue} size={24} />
              <Text style={styles.previewHeaderText}>How are you feeling?</Text>
            </View>
            <Text style={styles.previewText}>
              This is how your content will appear with your current settings.
            </Text>
            <View style={styles.previewButton}>
              <Text style={styles.previewButtonText}>Sample Button</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
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
  contentContainer: {
    paddingHorizontal: 20,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#E91E63' + '10',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  infoContent: {
    flex: 1,
    marginLeft: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: appColors.grey2,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  themesContainer: {
    gap: 12,
  },
  themeCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: appColors.grey6,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  themeCardSelected: {
    borderColor: appColors.AppBlue,
    backgroundColor: appColors.AppBlue + '05',
  },
  themeIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  themeContent: {
    flex: 1,
  },
  themeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 4,
  },
  themeDescription: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextMedium,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
  },
  separator: {
    height: 1,
    backgroundColor: appColors.grey6,
    marginVertical: 8,
  },
  displayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  displayLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  displayText: {
    fontSize: 16,
    color: appColors.grey1,
    fontFamily: appFonts.headerTextRegular,
    marginLeft: 12,
  },
  displayRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  displayValue: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginRight: 8,
  },
  colorPreview: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: appColors.grey5,
  },
  previewCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 16,
  },
  previewContent: {
    backgroundColor: appColors.AppLightGray,
    borderRadius: 8,
    padding: 16,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginLeft: 12,
  },
  previewText: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    lineHeight: 20,
    marginBottom: 16,
  },
  previewButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  previewButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    fontFamily: appFonts.headerTextBold,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default AppearanceSettingsScreen;
