import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/base';
import { Slider } from '@rneui/themed';
import Sound from 'react-native-sound';
import { appColors, appFonts } from '../../global/Styles';
import { scale, moderateScale } from '../../global/Scaling';
import ISGenericHeader from '../../components/ISGenericHeader';
import ISStatusBar from '../../components/ISStatusBar';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { getUploadUrl } from '../../utils/imageHelpers';
import { parseIconProps } from '../../utils/iconHelper';

const { width } = Dimensions.get('window');

// Enable playback in silence mode
Sound.setCategory('Playback');

interface SoundPlayerScreenProps {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
}

const SoundPlayerScreen: React.FC<SoundPlayerScreenProps> = ({ navigation, route }) => {
  const { sound } = route.params as any;
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(parseInt(sound.duration || '0') * 60); // Convert to seconds
  const [volume, setVolume] = useState(0.7);
  const [isLooping, setIsLooping] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  const soundObj = React.useRef<Sound | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isScrubbing, setIsScrubbing] = useState(false);

  // Animation for the pulsing play button
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  // Load sound natively
  useEffect(() => {
    let isMounted = true;

    const url = getUploadUrl(sound.audioUrl);
    if (!url) {
      if (isMounted) setIsLoading(false);
      return;
    }

    const newSound = new Sound(url, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Failed to load the sound', error);
        if (isMounted) setIsLoading(false);
        return;
      }

      if (isMounted) {
        soundObj.current = newSound;
        soundObj.current.setVolume(0.7);
        // Sometimes duration comes back as -1 on external fast loads
        const fetchedDuration = newSound.getDuration();
        if (fetchedDuration > 0) {
          setDuration(Math.floor(fetchedDuration));
        }
        setIsLoading(false);
      } else {
        newSound.release();
      }
    });

    return () => {
      isMounted = false;
      if (soundObj.current) {
        soundObj.current.release();
      }
    };
  }, [sound.audioUrl]);

  // Sync Progress Status
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying && soundObj.current && !isScrubbing) {
      interval = setInterval(() => {
        soundObj.current?.getCurrentTime((seconds) => {
          setCurrentTime(seconds);
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, isScrubbing]);

  useEffect(() => {
    if (soundObj.current) {
      soundObj.current.setNumberOfLoops(isLooping ? -1 : 0);
    }
  }, [isLooping]);

  useEffect(() => {
    if (soundObj.current) {
      soundObj.current.setVolume(volume);
    }
  }, [volume]);

  useEffect(() => {
    if (soundObj.current) {
      soundObj.current.setSpeed(playbackSpeed);
    }
  }, [playbackSpeed]);


  useEffect(() => {
    let loopAnim: Animated.CompositeAnimation | null = null;
    if (isPlaying) {
      loopAnim = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.1, duration: 1000, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        ])
      );
      loopAnim.start();
    } else {
      pulseAnim.setValue(1);
    }
    return () => loopAnim?.stop();
  }, [isPlaying, pulseAnim]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (!soundObj.current || isLoading) return;

    if (isPlaying) {
      soundObj.current.pause();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      soundObj.current.play((success) => {
        if (success) {
          // Playback finished cleanly
          if (!isLooping) {
            setIsPlaying(false);
            setCurrentTime(0);
          }
        } else {
          console.log('Playback failed due to audio decoding errors');
          setIsPlaying(false);
        }
      });
    }
  };

  const handleRewind = () => {
    if (!soundObj.current) return;
    const newTime = Math.max(0, currentTime - 15);
    soundObj.current.setCurrentTime(newTime);
    setCurrentTime(newTime);
  };

  const handleForward = () => {
    if (!soundObj.current) return;
    const newTime = Math.min(duration, currentTime + 15);
    soundObj.current.setCurrentTime(newTime);
    setCurrentTime(newTime);
  };

  const handleSliderChange = (value: number) => {
    setIsScrubbing(true);
    setCurrentTime(value);
  };

  const handleSliderComplete = (value: number) => {
    if (soundObj.current) {
      soundObj.current.setCurrentTime(value);
    }
    setIsScrubbing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ISStatusBar backgroundColor={appColors.AppBlue} />

      <ISGenericHeader
        title="Now Playing"
        navigation={navigation}
        hasRightIcon={false}
      />

      <View style={styles.content}>
        {/* Sound Icon */}
        <Animated.View
          style={[
            styles.soundIconContainer,
            { backgroundColor: sound.color + '20', transform: [{ scale: pulseAnim }] },
          ]}
        >
          <Icon {...parseIconProps(sound.icon)} color={sound.color || appColors.AppBlue} size={moderateScale(80)} />
        </Animated.View>

        {/* Sound Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.soundTitle}>{sound.title}</Text>
          <Text style={styles.soundCategory}>{sound.category}</Text>
          <Text style={styles.soundDescription}>{sound.description}</Text>
        </View>

        {/* Progress Slider */}
        <View style={styles.progressContainer}>
          <Slider
            value={currentTime}
            onValueChange={handleSliderChange}
            onSlidingComplete={handleSliderComplete}
            maximumValue={duration}
            minimumValue={0}
            step={1}
            thumbStyle={styles.sliderThumb}
            trackStyle={styles.sliderTrack}
            minimumTrackTintColor={appColors.AppBlue}
            maximumTrackTintColor={appColors.grey5}
          />
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
        </View>

        {/* Playback Controls */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => setIsLooping(!isLooping)}
          >
            <Icon
              name="repeat"
              type="material"
              color={isLooping ? appColors.AppBlue : appColors.grey3}
              size={moderateScale(28)}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={handleRewind}>
            <Icon name="fast-rewind" type="material" color={appColors.grey2} size={moderateScale(32)} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.playButton, { backgroundColor: sound.color || appColors.AppBlue }]}
            onPress={handlePlayPause}
          >
            <Icon
              name={isPlaying ? 'pause' : 'play-arrow'}
              type="material"
              color="#FFFFFF"
              size={moderateScale(48)}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={handleForward}>
            <Icon name="fast-forward" type="material" color={appColors.grey2} size={moderateScale(32)} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <Icon
              name={isFavorite ? 'favorite' : 'favorite-border'}
              type="material"
              color={isFavorite ? '#E91E63' : appColors.grey3}
              size={moderateScale(28)}
            />
          </TouchableOpacity>
        </View>

        {/* Volume Control */}
        <View style={styles.volumeContainer}>
          <Icon name="volume-down" type="material" color={appColors.grey3} size={moderateScale(24)} />
          <Slider
            value={volume}
            onValueChange={setVolume}
            maximumValue={1}
            minimumValue={0}
            step={0.01}
            style={styles.volumeSlider}
            thumbStyle={styles.volumeThumb}
            trackStyle={styles.volumeTrack}
            minimumTrackTintColor={appColors.AppBlue}
            maximumTrackTintColor={appColors.grey5}
          />
          <Icon name="volume-up" type="material" color={appColors.grey3} size={moderateScale(24)} />
        </View>

        {/* Playback Speed */}
        <View style={styles.speedContainer}>
          <Text style={styles.speedLabel}>Playback Speed</Text>
          <View style={styles.speedButtons}>
            {[0.5, 0.75, 1.0, 1.25, 1.5].map((speed) => (
              <TouchableOpacity
                key={speed}
                style={[
                  styles.speedButton,
                  playbackSpeed === speed && styles.speedButtonActive,
                ]}
                onPress={() => setPlaybackSpeed(speed)}
              >
                <Text
                  style={[
                    styles.speedButtonText,
                    playbackSpeed === speed && styles.speedButtonTextActive,
                  ]}
                >
                  {speed}x
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Additional Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Icon name="info-outline" type="material" color={appColors.AppBlue} size={moderateScale(20)} />
            <Text style={styles.infoText}>
              This sound is designed to help you relax and focus. Use headphones for the best
              experience.
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.CardBackground,
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(24),
    paddingTop: scale(40),
  },
  soundIconContainer: {
    width: scale(200),
    height: scale(200),
    borderRadius: scale(100),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: scale(40),
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: scale(40),
  },
  soundTitle: {
    fontSize: moderateScale(28),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: scale(8),
    textAlign: 'center',
  },
  soundCategory: {
    fontSize: moderateScale(16),
    color: appColors.grey3,
    fontFamily: appFonts.headerTextMedium,
    marginBottom: scale(12),
  },
  soundDescription: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    textAlign: 'center',
    lineHeight: moderateScale(20),
  },
  progressContainer: {
    marginBottom: scale(40),
  },
  sliderThumb: {
    width: scale(16),
    height: scale(16),
    backgroundColor: appColors.AppBlue,
  },
  sliderTrack: {
    height: scale(4),
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: scale(8),
  },
  timeText: {
    fontSize: moderateScale(12),
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scale(40),
    gap: scale(20),
  },
  controlButton: {
    padding: scale(8),
  },
  playButton: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(40),
    alignItems: 'center',
    justifyContent: 'center',
    elevation: scale(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(2) },
    shadowOpacity: 0.3,
    shadowRadius: scale(4),
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(32),
    gap: scale(12),
  },
  volumeSlider: {
    flex: 1,
  },
  volumeThumb: {
    width: scale(12),
    height: scale(12),
    backgroundColor: appColors.AppBlue,
  },
  volumeTrack: {
    height: scale(3),
  },
  infoCard: {
    backgroundColor: appColors.AppLightGray,
    borderRadius: scale(12),
    padding: scale(16),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: scale(12),
  },
  infoText: {
    flex: 1,
    fontSize: moderateScale(13),
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    lineHeight: moderateScale(20),
  },
  speedContainer: {
    marginBottom: scale(24),
  },
  speedLabel: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    fontFamily: appFonts.headerTextMedium,
    marginBottom: scale(12),
    textAlign: 'center',
  },
  speedButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: scale(8),
  },
  speedButton: {
    paddingVertical: scale(8),
    paddingHorizontal: scale(16),
    borderRadius: scale(20),
    backgroundColor: appColors.AppLightGray,
    borderWidth: scale(1),
    borderColor: appColors.grey5,
  },
  speedButtonActive: {
    backgroundColor: appColors.AppBlue,
    borderColor: appColors.AppBlue,
  },
  speedButtonText: {
    fontSize: moderateScale(13),
    color: appColors.grey2,
    fontFamily: appFonts.headerTextMedium,
  },
  speedButtonTextActive: {
    color: '#FFFFFF',
  },
});

export default SoundPlayerScreen;
