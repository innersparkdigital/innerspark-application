/**
 * Open URL Button
 * This component returns a touchable opacity button that opens a url on press
 */
import React, { useCallback } from 'react';
import { 
    Alert, 
    Linking,
    TouchableOpacity,
} from 'react-native';

// types
interface OpenURLButtonProps {
    url: string;
    children: React.ReactNode;
}

// Returns a touchable opacity button that opens a url on press
export default function OpenURLButton({ url, children }: OpenURLButtonProps) {
    const handlePress = useCallback(async () => {
  
      // Checking if the link is supported for links with custom URL scheme.
      const supported = await Linking.canOpenURL(url);
  
      if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(url);
      } else {
        Alert.alert(`Don't know how to open this URL: ${url}`);
      }
  
    }, [url]);
  
    return (
        <TouchableOpacity onPress={handlePress}>
            {children}
        </TouchableOpacity>
    )
}