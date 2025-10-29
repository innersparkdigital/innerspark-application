/**
 * Theme Context - Provides theme colors throughout the app
 * Supports light, dark, and auto (system) themes
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { useSelector } from 'react-redux';
import { selectTheme, selectUseSystemTheme } from '../features/settings/userSettingsSlice';

// Light theme colors
export const lightColors = {
  // Base colors
  background: '#F6F6F6',
  surface: '#FFFFFF',
  surfaceVariant: '#F2F2F2',
  
  // Text colors
  text: '#43484d',
  textSecondary: '#5e6977',
  textTertiary: '#86939e',
  textDisabled: '#bdc6cf',
  
  // Brand colors
  primary: '#5170FF',
  primaryLight: '#F1F9F9',
  primaryDark: '#5170FF',
  
  // Accent colors
  accent: '#EE7810',
  success: '#64D64E',
  warning: '#FFC12F',
  error: '#F44336',
  info: '#2196F3',
  
  // UI elements
  border: '#e1e8ee',
  divider: '#F2F2F2',
  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // Card colors
  card: '#FFFFFF',
  cardHover: '#F6F6F6',
  
  // Status bar
  statusBar: '#5170FF',
  statusBarContent: 'light-content' as 'light-content' | 'dark-content',
};

// Dark theme colors
export const darkColors = {
  // Base colors
  background: '#121212',
  surface: '#1E1E1E',
  surfaceVariant: '#2C2C2C',
  
  // Text colors
  text: '#E1E1E1',
  textSecondary: '#B0B0B0',
  textTertiary: '#808080',
  textDisabled: '#606060',
  
  // Brand colors
  primary: '#6B8AFF',
  primaryLight: '#1A2332',
  primaryDark: '#4A6AE8',
  
  // Accent colors
  accent: '#FF9A3D',
  success: '#7FE86A',
  warning: '#FFD54F',
  error: '#EF5350',
  info: '#42A5F5',
  
  // UI elements
  border: '#3A3A3A',
  divider: '#2C2C2C',
  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.7)',
  
  // Card colors
  card: '#1E1E1E',
  cardHover: '#2C2C2C',
  
  // Status bar
  statusBar: '#1E1E1E',
  statusBarContent: 'light-content' as 'light-content' | 'dark-content',
};

export type ThemeColors = typeof lightColors;

interface ThemeContextType {
  colors: ThemeColors;
  isDark: boolean;
  theme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType>({
  colors: lightColors,
  isDark: false,
  theme: 'light',
});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const reduxTheme = useSelector(selectTheme);
  const useSystemTheme = useSelector(selectUseSystemTheme);
  
  const [systemColorScheme, setSystemColorScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme()
  );

  // Listen to system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme);
    });
    return () => subscription.remove();
  }, []);

  // Determine active theme
  const getActiveTheme = (): 'light' | 'dark' => {
    if (useSystemTheme || reduxTheme === 'auto') {
      return systemColorScheme === 'dark' ? 'dark' : 'light';
    }
    return reduxTheme as 'light' | 'dark';
  };

  const activeTheme = getActiveTheme();
  const colors = activeTheme === 'dark' ? darkColors : lightColors;
  const isDark = activeTheme === 'dark';

  const value: ThemeContextType = {
    colors,
    isDark,
    theme: activeTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
