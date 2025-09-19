/**
 * Mood Screen - Track and manage your mood
 */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button } from '@rneui/base';
import { appColors, parameters, appFonts } from '../global/Styles';
import { useToast } from 'native-base';
import { appImages } from '../global/Data';
import LHGenericHeader from '../components/LHGenericHeader';

const SCREEN_WIDTH = Dimensions.get('window').width;

const MoodScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  
  const userDetails = useSelector(state => state.userData.userDetails);
  const [selectedMood, setSelectedMood] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const moodOptions = [
    { id: 1, name: 'Excellent', emoji: '😊', color: '#4CAF50' },
    { id: 2, name: 'Good', emoji: '🙂', color: '#8BC34A' },
    { id: 3, name: 'Okay', emoji: '😐', color: '#FFC107' },
    { id: 4, name: 'Not Great', emoji: '😔', color: '#FF9800' },
    { id: 5, name: 'Terrible', emoji: '😢', color: '#F44336' },
  ];

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
  };

  const saveMood = () => {
    if (!selectedMood) {
      toast.show({
        description: "Please select a mood first",
        duration: 2000,
      });
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.show({
        description: `Mood "${selectedMood.name}" saved successfully!`,
        duration: 2000,
      });
    }, 1000);
  };

  const notifyWithToast = (description) => {
    toast.show({
      description: description,
      duration: 2000,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={appColors.StatusBarColor} barStyle="light-content" />
      
      <LHGenericHeader
        title="Mood Tracker"
        subtitle="How are you feeling today?"
        navigation={navigation}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          
          {/* Mood Selection Section */}
          <View style={styles.moodSection}>
            <Text style={styles.sectionTitle}>Select Your Current Mood</Text>
            <Text style={styles.sectionSubtitle}>
              Tracking your mood helps us provide better support
            </Text>

            <View style={styles.moodGrid}>
              {moodOptions.map((mood) => (
                <TouchableOpacity
                  key={mood.id}
                  style={[
                    styles.moodCard,
                    selectedMood?.id === mood.id && styles.selectedMoodCard
                  ]}
                  onPress={() => handleMoodSelect(mood)}
                >
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                  <Text style={[
                    styles.moodName,
                    selectedMood?.id === mood.id && styles.selectedMoodName
                  ]}>
                    {mood.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Mood Insights Section */}
          <View style={styles.insightsSection}>
            <Text style={styles.sectionTitle}>Mood Insights</Text>
            <View style={styles.insightCard}>
              <Icon
                name="trending-up"
                type="material"
                color={appColors.AppBlue}
                size={30}
              />
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Weekly Trend</Text>
                <Text style={styles.insightText}>
                  Your mood has been improving this week
                </Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.actionsSection}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => navigation.navigate('TherapistsScreen')}
            >
              <Icon
                name="people"
                type="material"
                color={appColors.AppBlue}
                size={25}
              />
              <Text style={styles.actionText}>Find a Therapist</Text>
              <Icon
                name="chevron-right"
                type="material"
                color={appColors.AppGray}
                size={20}
              />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => notifyWithToast('Meditation feature coming soon!')}
            >
              <Icon
                name="self-improvement"
                type="material"
                color={appColors.AppBlue}
                size={25}
              />
              <Text style={styles.actionText}>Guided Meditation</Text>
              <Icon
                name="chevron-right"
                type="material"
                color={appColors.AppGray}
                size={20}
              />
            </TouchableOpacity>
          </View>

          {/* Save Button */}
          <View style={styles.saveSection}>
            <Button
              title={isLoading ? "Saving..." : "Save Mood"}
              buttonStyle={[
                parameters.appButtonXL,
                !selectedMood && styles.disabledButton
              ]}
              titleStyle={parameters.appButtonXLTitle}
              onPress={saveMood}
              disabled={!selectedMood || isLoading}
              loading={isLoading}
            />
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.CardBackground,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  moodSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    marginBottom: 8,
    fontFamily: appFonts.appTextBold,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: appColors.AppGray,
    marginBottom: 20,
    fontFamily: appFonts.appTextRegular,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moodCard: {
    width: (SCREEN_WIDTH - 60) / 2,
    backgroundColor: appColors.CardBackground,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: appColors.AppLightGray,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedMoodCard: {
    borderColor: appColors.AppBlue,
    backgroundColor: appColors.AppLightBlue,
  },
  moodEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  moodName: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.AppBlue,
    fontFamily: appFonts.appTextMedium,
  },
  selectedMoodName: {
    color: appColors.AppBlue,
    fontWeight: 'bold',
  },
  insightsSection: {
    marginBottom: 30,
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: appColors.CardBackground,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  insightContent: {
    marginLeft: 15,
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    marginBottom: 5,
    fontFamily: appFonts.appTextBold,
  },
  insightText: {
    fontSize: 14,
    color: appColors.AppGray,
    fontFamily: appFonts.appTextRegular,
  },
  actionsSection: {
    marginBottom: 30,
  },
  actionCard: {
    flexDirection: 'row',
    backgroundColor: appColors.CardBackground,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionText: {
    fontSize: 16,
    color: appColors.AppBlue,
    marginLeft: 15,
    flex: 1,
    fontFamily: appFonts.appTextMedium,
  },
  saveSection: {
    marginTop: 20,
    marginBottom: 40,
  },
  disabledButton: {
    backgroundColor: appColors.AppLightGray,
  },
});

export default MoodScreen;
