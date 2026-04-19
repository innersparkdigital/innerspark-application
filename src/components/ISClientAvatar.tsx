import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, AvatarProps } from '@rneui/themed';
import { getClientBioData } from '../api/therapist';
import { appColors } from '../global/Styles';
import { appImages } from '../global/Data';
import { therapistMediaUrl } from '../api/LHAPI';

interface ISClientAvatarProps extends Partial<AvatarProps> {
  clientId: string;
  initialAvatar?: string;
}

/**
 * Smart Client Avatar Component
 * Automatically attempts to fetch high-quality profile photos if the initial data is missing or invalid.
 */
const ISClientAvatar: React.FC<ISClientAvatarProps> = ({ 
  clientId, 
  initialAvatar, 
  containerStyle,
  ...props 
}) => {
  const [avatarUri, setAvatarUri] = useState<string | undefined>(
    initialAvatar?.startsWith('http') ? initialAvatar : undefined
  );
  const [loading, setLoading] = useState(false);

  const resolveAvatarUri = (uri: string | null | undefined) => {
    if (!uri || typeof uri !== 'string') return undefined;
    if (uri.startsWith('http')) return uri;
    
    const cleanBase = therapistMediaUrl.endsWith('/') ? therapistMediaUrl.slice(0, -1) : therapistMediaUrl;
    const cleanPath = uri.startsWith('/') ? uri : `/${uri}`;
    return `${cleanBase}${cleanPath}`;
  };

  useEffect(() => {
    // If we have an initial avatar, try to resolve it
    if (initialAvatar) {
      setAvatarUri(resolveAvatarUri(initialAvatar));
      if (initialAvatar.startsWith('http')) return;
    }

    // Otherwise, or if it was relative, attempt to enrich with bio data metadata
    if (clientId) {
      fetchBioData();
    }
  }, [clientId, initialAvatar]);

  const fetchBioData = async () => {
    try {
      setLoading(true);
      const res = await getClientBioData(clientId);
      if (res?.success && res.data?.profileImage) {
        setAvatarUri(resolveAvatarUri(res.data.profileImage));
      }
    } catch (error) {
      console.warn(`[ISClientAvatar] Meta fetch failed for ${clientId}:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Avatar
      {...props}
      source={avatarUri ? { uri: avatarUri } : undefined}
      icon={!avatarUri ? { name: 'person', type: 'material', color: appColors.AppBlue } : props.icon}
      containerStyle={[
        styles.container,
        !avatarUri && styles.placeholderBackground,
        containerStyle
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
  placeholderBackground: {
    backgroundColor: '#FFFFFF',
  },
});

export default ISClientAvatar;
