import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, AvatarProps } from '@rneui/themed';
import { getTherapistProfile } from '../api/therapist';
import { appColors } from '../global/Styles';
import { resolveTherapistImage } from '../utils/imageHelpers';

interface ISTherapistAvatarProps extends Partial<AvatarProps> {
  therapistId: string;
  initialAvatar?: string;
}

/**
 * Smart Therapist Avatar Component
 * Automatically attempts to fetch high-quality profile photos if the initial data is missing or a relative path.
 * Uses consistent resolution logic for therapist media uploads.
 */
const ISTherapistAvatar: React.FC<ISTherapistAvatarProps> = ({ 
  therapistId, 
  initialAvatar, 
  containerStyle,
  ...props 
}) => {
  const [rawAvatar, setRawAvatar] = useState<string | undefined>(initialAvatar);
  const [priority, setPriority] = useState(0);
  const [loading, setLoading] = useState(false);

  // Sync rawAvatar if initialAvatar changes
  useEffect(() => {
    if (initialAvatar) setRawAvatar(initialAvatar);
  }, [initialAvatar]);

  useEffect(() => {
    // If we have an ID and no raw avatar, or raw avatar is just a relative path, 
    // attempt to enrich with full profile data
    if (therapistId && (!rawAvatar || !rawAvatar.startsWith('http'))) {
      fetchProfileData();
    }
  }, [therapistId]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const res = await getTherapistProfile(therapistId);
      if (res?.success && res.data?.profileImage) {
        setRawAvatar(res.data.profileImage);
      }
    } catch (error) {
      console.warn(`❌ [ISTherapistAvatar] Profile fetch failed for ${therapistId}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const avatarUri = resolveTherapistImage(rawAvatar, priority);

  const handleImageError = () => {
    // If loading failed for priority 0 (server domain), try priority 1 (app domain)
    if (priority === 0) {
      setPriority(1);
    }
  };

  return (
    <Avatar
      {...props}
      title={avatarUri ? undefined : props.title}
      source={avatarUri ? { uri: avatarUri } : undefined}
      onImageError={handleImageError}
      icon={!avatarUri && !props.title ? { name: 'person', type: 'material', color: appColors.AppBlue } : (avatarUri ? undefined : props.icon)}
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
    // Standard avatar container
  },
  placeholderBackground: {
    backgroundColor: appColors.AppBlue,
  },
});

export default ISTherapistAvatar;
