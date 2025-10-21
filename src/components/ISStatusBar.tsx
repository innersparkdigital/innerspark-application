/**
 * Innerspark Status Bar Component
 * Reusable status bar for screens without custom headers
 */
import React from 'react';
import { StatusBar, Platform, StatusBarStyle } from 'react-native';
import { appColors } from '../global/Styles';

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

    return (
        <StatusBar 
            backgroundColor={getBackgroundColor()} 
            barStyle={getStatusBarStyle()} 
            translucent={false}
        />
    );
}
