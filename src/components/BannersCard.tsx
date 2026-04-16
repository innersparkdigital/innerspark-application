import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator
} from 'react-native';
import Swiper from 'react-native-swiper';
import { appColors, appFonts } from '../global/Styles';
import { scale, moderateScale } from '../global/Scaling';
import { useThemedColors } from '../hooks/useThemedColors';
import { getBanners } from '../api/client/dashboard';
import { getUploadUrl } from '../utils/imageHelpers';
import { storeItemLS, retrieveItemLS } from '../global/StorageActions';
import { useToast } from 'native-base';

interface BannerData {
  id: string | number;
  imageUrl?: string | null;
  linkUrl?: string | null;
  title?: string | null;
  subtitle?: string | null;
  // Backward compatibility support for old code/mocks
  image?: string;
  link?: string;
}

interface BannersCardProps {
  showAdsBadge?: boolean;
  openLinks?: boolean;
  isVisible?: boolean;
}

export default function BannersCard({ showAdsBadge = false, openLinks = false, isVisible = true }: BannersCardProps) {
  const [banners, setBanners] = useState<BannerData[]>([]);
  const [loading, setLoading] = useState(true);
  const themeColors = useThemedColors();
  const toast = useToast();

  const SCREEN_WIDTH = Dimensions.get('window').width;
  const CARD_MARGIN = scale(40);
  const CARD_WIDTH = SCREEN_WIDTH - CARD_MARGIN;
  const CARD_HEIGHT = CARD_WIDTH * (9 / 16);

  useEffect(() => {
    if (isVisible) {
      loadInitialBanners();
    }
  }, [isVisible]);

  const loadInitialBanners = async () => {
    try {
      // 1. Try to load from local storage first for immediate display
      const cachedBanners = await retrieveItemLS('bannersLS');
      if (cachedBanners) {
        const parsedBanners = typeof cachedBanners === 'string' ? JSON.parse(cachedBanners) : cachedBanners;
        if (Array.isArray(parsedBanners) && parsedBanners.length > 0) {
          console.log('📦 Loaded banners from cache:', parsedBanners.length);
          setBanners(parsedBanners);
          setLoading(false); // Stop loading if we have cached data
        }
      }
    } catch (error) {
      console.log('Error loading cached banners:', error);
    } finally {
      // 2. Always refresh from API in the background
      fetchBanners();
    }
  };

  const fetchBanners = async () => {
    try {
      const response = await getBanners();
      console.log('🖼️ Banners API Raw Response:', JSON.stringify(response, null, 2));
      
      // Handle the observed API structure: { data: [...], success: true }
      if (response && response.data && Array.isArray(response.data)) {
        console.log('✅ Found banners array in response.data, count:', response.data.length);
        setBanners(response.data);
        saveBannersToStorage(response.data);
      } else if (Array.isArray(response)) {
        console.log('✅ Found banners as direct array, count:', response.length);
        setBanners(response);
        saveBannersToStorage(response);
      } else {
        console.log('⚠️ No recognizable banners array found in response');
      }
    } catch (error) {
      console.log('❌ Failed to fetch banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveBannersToStorage = async (data: BannerData[]) => {
    try {
      await storeItemLS('bannersLS', data);
    } catch (error) {
      console.log('Error saving banners to storage:', error);
    }
  };

  const handlePress = async (link?: string) => {
    if (!openLinks) return;
    if (!link) return;
    try {
      const supported = await Linking.canOpenURL(link);
      if (supported) {
        await Linking.openURL(link);
      } else {
        toast.show({
          description: "Cannot open this link",
          duration: 2000,
        });
      }
    } catch (error) {
      console.log('Error opening link:', error);
    }
  };

  // Modern fallback banner when an individual banner slide lacks an image
  // Can also be used as the last resort fallback
  const renderFallback = (title?: string | null, subtitle?: string | null) => (
    <View style={[styles.fallbackContainer, { backgroundColor: themeColors.AppBlue }]}>
      <View style={styles.fallbackContent}>
        <Text style={styles.fallbackTitle}>
          {title || "Mental Wellness Journey"}
        </Text>
        <Text style={styles.fallbackSubtitle}>
          {subtitle || "Discover new ways to improve your daily routine and find inner peace."}
        </Text>
      </View>
      <View style={[styles.fallbackDot, { backgroundColor: '#FF2D55', top: '20%', right: '10%' }]} />
      <View style={[styles.fallbackDot, { backgroundColor: '#34C759', bottom: '20%', left: '15%' }]} />
      <View style={[styles.fallbackDot, { backgroundColor: '#FF9500', top: '15%', left: '10%' }]} />
    </View>
  );

  const containerDynamicStyle = {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  };

  if (!isVisible) {
    return null;
  }

  if (loading) {
    return (
      <View style={[styles.container, containerDynamicStyle, styles.loadingContainer, { backgroundColor: themeColors.CardBackground }]}>
        <ActivityIndicator size="large" color={themeColors.AppBlue} />
      </View>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, containerDynamicStyle, { backgroundColor: themeColors.CardBackground }]}>
      <Swiper
        key={banners.length}
        style={styles.wrapper}
        height={CARD_HEIGHT}
        autoplay
        autoplayTimeout={5}
        showsPagination={true}
        dot={<View style={styles.inactiveDot} />}
        activeDot={<View style={[styles.activeDot, { backgroundColor: themeColors.AppBlue }]} />}
        paginationStyle={styles.paginationConfig}
        removeClippedSubviews={false}
      >
        {banners.map((banner) => {
          const rawImagePath = banner.imageUrl || banner.image;
          const bannerImage = rawImagePath ? getUploadUrl(rawImagePath) : null;
          const bannerLink = banner.linkUrl || banner.link;

          return (
            <TouchableOpacity
              key={banner.id}
              activeOpacity={0.9}
              style={styles.slide}
              onPress={() => handlePress(bannerLink || undefined)}
            >
              {bannerImage ? (
                <Image
                  source={{ uri: bannerImage }}
                  style={styles.bannerImage}
                  resizeMode="cover"
                />
              ) : (
                renderFallback(banner.title, banner.subtitle)
              )}

              {showAdsBadge && (
                <View style={styles.adsBadge}>
                  <Text style={styles.adsText}>Ads</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </Swiper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: moderateScale(16),
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: scale(20),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {},
  slide: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  adsBadge: {
    position: 'absolute',
    bottom: scale(10),
    right: scale(10),
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: scale(8),
    paddingVertical: scale(2),
    borderRadius: moderateScale(4),
  },
  adsText: {
    color: '#FFF',
    fontSize: moderateScale(10),
    fontFamily: appFonts.bodyTextRegular,
    fontWeight: 'bold',
  },
  paginationConfig: {
    bottom: scale(10),
  },
  inactiveDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
    marginHorizontal: scale(3),
  },
  activeDot: {
    width: scale(18),
    height: scale(6),
    borderRadius: scale(3),
    marginHorizontal: scale(3),
  },
  // Fallback Styles
  fallbackContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(20),
    overflow: 'hidden',
  },
  fallbackContent: {
    zIndex: 2,
    alignItems: 'center',
  },
  fallbackTitle: {
    color: '#FFF',
    fontSize: moderateScale(22),
    fontFamily: appFonts.headerTextBold,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: scale(8),
  },
  fallbackSubtitle: {
    color: '#FFF',
    fontSize: moderateScale(14),
    fontFamily: appFonts.bodyTextRegular,
    textAlign: 'center',
    opacity: 0.9,
  },
  fallbackDot: {
    position: 'absolute',
    width: scale(14),
    height: scale(14),
    borderRadius: scale(7),
    zIndex: 1,
    opacity: 0.8,
  },
});
