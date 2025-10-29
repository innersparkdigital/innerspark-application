/**
 * useThemedColors Hook
 * Returns colors in the same structure as appColors but themed
 * This allows gradual migration from static appColors to dynamic theme
 */
import { useTheme } from '../context/ThemeContext';
import { appColors as staticAppColors } from '../global/Styles';

export const useThemedColors = () => {
  const { colors, isDark } = useTheme();

  // Return themed colors in appColors structure
  return {
    // Original static colors (for backward compatibility)
    ...staticAppColors,
    
    // Themed overrides
    grey1: colors.text,
    grey2: colors.textSecondary,
    grey3: colors.textTertiary,
    grey4: colors.textDisabled,
    grey5: colors.border,
    grey6: colors.divider,
    grey7: colors.surfaceVariant,
    
    CardBackground: colors.card,
    CardBackgroundFade: isDark ? 'rgba(30,30,30,0.5)' : 'rgba(255,255,255,0.5)',
    CardBackgroundFade2: isDark ? 'rgba(30,30,30,0.4)' : 'rgba(255,255,255,0.4)',
    CardBackgroundFade3: isDark ? 'rgba(30,30,30,0.3)' : 'rgba(255,255,255,0.3)',
    CardBackgroundFade4: isDark ? 'rgba(30,30,30,0.2)' : 'rgba(255,255,255,0.2)',
    
    AppLightGray: colors.background,
    AppGray: colors.textSecondary,
    
    // Brand colors (stay consistent)
    AppBlue: colors.primary,
    AppBlueFade: isDark ? 'rgba(107,138,255,0.4)' : 'rgba(15,123,169,0.4)',
    AppBlueOpacity: colors.primaryLight,
    AppBlueDark: colors.primaryDark,
    AppOrange: colors.accent,
    AppGreen: colors.success,
    
    // Status bar
    statusBar: colors.statusBar,
    headerText: isDark ? colors.text : 'white',
    
    // Additional theme-aware colors
    background: colors.background,
    surface: colors.surface,
    text: colors.text,
    textSecondary: colors.textSecondary,
    border: colors.border,
    shadow: colors.shadow,
    overlay: colors.overlay,
    
    // Helper to check theme
    isDark,
  };
};

export default useThemedColors;
