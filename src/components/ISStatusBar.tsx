/**
 * Innerspark Status Bar Component
 * Reusable status bar for screens without custom headers
 * Uses useFocusEffect to ensure StatusBar updates when screen comes into focus
 */
import React from 'react';
import { StatusBar, Platform, StatusBarStyle } from 'react-native';
import { appColors } from '../global/Styles';
import { useFocusEffect } from '@react-navigation/native';

interface ISStatusBarProps {
    hasLightBackground?: boolean;
    backgroundColor?: string;
    barStyle?: StatusBarStyle;
}

export default function ISStatusBar({
    hasLightBackground = false,
    backgroundColor = undefined,
    barStyle = undefined,
}: ISStatusBarProps) {
    // Determine status bar style based on background and platform
    const getStatusBarStyle = (): StatusBarStyle => {
        // If barStyle is explicitly provided, use it
        if (barStyle) {
            return barStyle;
        }

        if (Platform.OS === 'ios') {
            // On iOS, use dark-content for light backgrounds, light-content for dark backgrounds
            return hasLightBackground ? 'dark-content' : 'light-content';
        }
        // On Android, always use light-content (white icons)
        return 'light-content';
    };

    // Determine background color
    const getBackgroundColor = (): string => {
        if (backgroundColor) {
            return backgroundColor;
        }
        return hasLightBackground ? appColors.CardBackground : appColors.AppBlue;
    };

    const statusBarStyle = getStatusBarStyle();
    const statusBarColor = getBackgroundColor();

    // Update StatusBar immediately when screen comes into focus
    // This prevents the "bleed" effect from previous screens
    useFocusEffect(
        React.useCallback(() => {
            StatusBar.setBackgroundColor(statusBarColor, true);
            StatusBar.setBarStyle(statusBarStyle, true);
        }, [statusBarColor, statusBarStyle])
    );

    return (
        <StatusBar 
            backgroundColor={statusBarColor} 
            barStyle={statusBarStyle} 
            translucent={false}
            animated={true}
        />
    );
}
