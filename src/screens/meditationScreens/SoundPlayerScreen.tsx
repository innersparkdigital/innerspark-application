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
import { appColors, appFonts } from '../../global/Styles';
import ISGenericHeader from '../../components/ISGenericHeader';
import ISStatusBar from '../../components/ISStatusBar';
import { NavigationProp, RouteProp } from '@react-navigation/native';

const { width } = Dimensions.get('window');

interface SoundPlayerScreenProps {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
}

const SoundPlayerScreen: React.FC<SoundPlayerScreenProps> = ({ navigation, route }) => {
  const { sound } = route.params as any;
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(parseInt(sound.duration) * 60); // Convert to seconds
  const [volume, setVolume] = useState(0.7);
  const [isLooping, setIsLooping] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  // Animation for the pulsing play button
  const pulseAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    if (isPlaying) {
      // Start pulsing animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Simulate playback progress
      const interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            if (isLooping) {
              return 0;
            } else {
              setIsPlaying(false);
              return duration;
            }
          }
          return prev + 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    } else {
      pulseAnim.setValue(1);
    }
  }, [isPlaying, duration, isLooping]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // TODO: Implement actual audio playback
  };

  const handleRewind = () => {
    setCurrentTime(Math.max(0, currentTime - 15));
  };

  const handleForward = () => {
    setCurrentTime(Math.min(duration, currentTime + 15));
  };

  const handleSliderChange = (value: number) => {
    setCurrentTime(value);
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
          <Icon name={sound.icon} type="material" color={sound.color} size={80} />
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
              size={28}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={handleRewind}>
            <Icon name="replay-15" type="material" color={appColors.grey2} size={32} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.playButton, { backgroundColor: sound.color }]}
            onPress={handlePlayPause}
          >
            <Icon
              name={isPlaying ? 'pause' : 'play-arrow'}
              type="material"
              color="#FFFFFF"
              size={48}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={handleForward}>
            <Icon name="forward-15" type="material" color={appColors.grey2} size={32} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <Icon
              name={isFavorite ? 'favorite' : 'favorite-border'}
              type="material"
              color={isFavorite ? '#E91E63' : appColors.grey3}
              size={28}
            />
          </TouchableOpacity>
        </View>

        {/* Volume Control */}
        <View style={styles.volumeContainer}>
          <Icon name="volume-down" type="material" color={appColors.grey3} size={24} />
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
          <Icon name="volume-up" type="material" color={appColors.grey3} size={24} />
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
            <Icon name="info-outline" type="material" color={appColors.AppBlue} size={20} />
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
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  soundIconContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 40,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  soundTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 8,
    textAlign: 'center',
  },
  soundCategory: {
    fontSize: 16,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextMedium,
    marginBottom: 12,
  },
  soundDescription: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    textAlign: 'center',
    lineHeight: 20,
  },
  progressContainer: {
    marginBottom: 40,
  },
  sliderThumb: {
    width: 16,
    height: 16,
    backgroundColor: appColors.AppBlue,
  },
  sliderTrack: {
    height: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeText: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    gap: 20,
  },
  controlButton: {
    padding: 8,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    gap: 12,
  },
  volumeSlider: {
    flex: 1,
  },
  volumeThumb: {
    width: 12,
    height: 12,
    backgroundColor: appColors.AppBlue,
  },
  volumeTrack: {
    height: 3,
  },
  infoCard: {
    backgroundColor: appColors.AppLightGray,
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    lineHeight: 20,
  },
  speedContainer: {
    marginBottom: 24,
  },
  speedLabel: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextMedium,
    marginBottom: 12,
    textAlign: 'center',
  },
  speedButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  speedButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: appColors.AppLightGray,
    borderWidth: 1,
    borderColor: appColors.grey5,
  },
  speedButtonActive: {
    backgroundColor: appColors.AppBlue,
    borderColor: appColors.AppBlue,
  },
  speedButtonText: {
    fontSize: 13,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextMedium,
  },
  speedButtonTextActive: {
    color: '#FFFFFF',
  },
});

export default SoundPlayerScreen;
