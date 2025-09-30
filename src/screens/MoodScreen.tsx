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
import PanicButtonComponent from '../components/PanicButtonComponent';

const SCREEN_WIDTH = Dimensions.get('window').width;

const MoodScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  
  const userDetails = useSelector(state => state.userData.userDetails);
  const [selectedMood, setSelectedMood] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const moodOptions = [
    { id: 1, name: 'Amazing', emoji: '🤩', color: '#4CAF50', description: 'Feeling fantastic!' },
    { id: 2, name: 'Happy', emoji: '😊', color: '#8BC34A', description: 'In a great mood' },
    { id: 3, name: 'Neutral', emoji: '😐', color: '#FFC107', description: 'Just okay today' },
    { id: 4, name: 'Low', emoji: '😔', color: '#FF9800', description: 'Not feeling great' },
    { id: 5, name: 'Struggling', emoji: '😢', color: '#F44336', description: 'Having a tough time' },
  ];

  const moodHistory = [
    { date: 'Today', mood: 'Happy', emoji: '😊', color: '#8BC34A' },
    { date: 'Yesterday', mood: 'Neutral', emoji: '😐', color: '#FFC107' },
    { date: '2 days ago', mood: 'Amazing', emoji: '🤩', color: '#4CAF50' },
    { date: '3 days ago', mood: 'Happy', emoji: '😊', color: '#8BC34A' },
  ];

  const insights = [
    {
      id: 1,
      title: 'Weekly Progress',
      description: 'Your mood has improved 20% this week',
      icon: 'trending-up',
      color: '#4CAF50',
      type: 'positive'
    },
    {
      id: 2,
      title: 'Best Time',
      description: 'You feel best in the mornings',
      icon: 'wb-sunny',
      color: '#FF9800',
      type: 'info'
    },
    {
      id: 3,
      title: 'Streak',
      description: '5 days of mood tracking!',
      icon: 'local-fire-department',
      color: '#F44336',
      type: 'achievement'
    }
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
      <StatusBar backgroundColor={appColors.AppBlue} barStyle="light-content" />
      
      {/* Always-visible Panic Button */}
      <PanicButtonComponent 
        position="bottom-left" 
        size="medium" 
        quickAction="modal" 
      />
      
      {/* Custom Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Mood Tracker</Text>
            <Text style={styles.headerSubtitle}>How are you feeling today?</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Icon name="account-circle" type="material" color={appColors.CardBackground} size={32} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        {/* Current Mood Selection */}
        <View style={styles.moodSection}>
          <Text style={styles.sectionTitle}>How are you feeling right now?</Text>
          
          <View style={styles.moodGrid}>
            {moodOptions.map((mood) => (
              <TouchableOpacity
                key={mood.id}
                style={[
                  styles.moodCard,
                  selectedMood?.id === mood.id && { 
                    ...styles.selectedMoodCard,
                    borderColor: mood.color,
                    backgroundColor: mood.color + '15'
                  }
                ]}
                onPress={() => handleMoodSelect(mood)}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text style={[
                  styles.moodName,
                  selectedMood?.id === mood.id && { color: mood.color }
                ]}>
                  {mood.name}
                </Text>
                <Text style={styles.moodDescription}>{mood.description}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Save Mood Button */}
          {selectedMood && (
            <View style={styles.saveMoodContainer}>
              <Button
                title={isLoading ? "Saving..." : `Save "${selectedMood.name}" Mood`}
                buttonStyle={[
                  styles.saveMoodButton,
                  { backgroundColor: selectedMood.color }
                ]}
                titleStyle={styles.saveMoodButtonText}
                onPress={saveMood}
                disabled={isLoading}
                loading={isLoading}
              />
            </View>
          )}
        </View>

        {/* Mood Insights */}
        <View style={styles.insightsSection}>
          <Text style={styles.sectionTitle}>Your Mood Insights</Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.insightsScrollContainer}
          >
            {insights.map((insight) => (
              <View key={insight.id} style={styles.insightCard}>
                <View style={[styles.insightIconContainer, { backgroundColor: insight.color + '15' }]}>
                  <Icon
                    name={insight.icon}
                    type="material"
                    color={insight.color}
                    size={24}
                  />
                </View>
                <Text style={styles.insightTitle}>{insight.title}</Text>
                <Text style={styles.insightDescription}>{insight.description}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Mood History */}
        <View style={styles.historySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Mood History</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MoodHistoryScreen')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.historyContainer}>
            {moodHistory.map((entry, index) => (
              <View key={index} style={styles.historyItem}>
                <View style={[styles.historyMoodContainer, { backgroundColor: entry.color + '15' }]}>
                  <Text style={styles.historyEmoji}>{entry.emoji}</Text>
                </View>
                <View style={styles.historyContent}>
                  <Text style={styles.historyMood}>{entry.mood}</Text>
                  <Text style={styles.historyDate}>{entry.date}</Text>
                </View>
                <View style={[styles.historyIndicator, { backgroundColor: entry.color }]} />
              </View>
            ))}
          </View>
        </View>

        {/* Wellness Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Wellness Actions</Text>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('TodayMoodScreen')}
          >
            <View style={styles.actionIcon}>
              <Icon name="mood" type="material" color={appColors.AppBlue} size={24} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Daily Mood Check-in</Text>
              <Text style={styles.actionSubtitle}>Track your mood and earn loyalty points</Text>
            </View>
            <Icon name="chevron-right" type="material" color={appColors.grey3} size={20} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('MoodPointsScreen')}
          >
            <View style={styles.actionIcon}>
              <Icon name="stars" type="material" color="#FFD700" size={24} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Loyalty Points</Text>
              <Text style={styles.actionSubtitle}>Redeem points for therapy discounts</Text>
            </View>
            <Icon name="chevron-right" type="material" color={appColors.grey3} size={20} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('TherapistsScreen')}
          >
            <View style={styles.actionIconContainer}>
              <Icon name="psychology" type="material" color={appColors.AppBlue} size={24} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Talk to a Therapist</Text>
              <Text style={styles.actionSubtitle}>Professional support when you need it</Text>
            </View>
            <Icon name="chevron-right" type="material" color={appColors.grey3} size={20} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => notifyWithToast('Meditation feature coming soon!')}
          >
            <View style={styles.actionIconContainer}>
              <Icon name="self-improvement" type="material" color={appColors.AppBlue} size={24} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Guided Meditation</Text>
              <Text style={styles.actionSubtitle}>Calm your mind with mindfulness</Text>
            </View>
            <Icon name="chevron-right" type="material" color={appColors.grey3} size={20} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('EmergencyScreen')}
          >
            <View style={styles.actionIconContainer}>
              <Icon name="emergency" type="material" color="#E91E63" size={24} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Crisis Support</Text>
              <Text style={styles.actionSubtitle}>Immediate help and resources</Text>
            </View>
            <Icon name="chevron-right" type="material" color={appColors.grey3} size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.AppLightGray,
  },
  header: {
    backgroundColor: appColors.AppBlue,
    paddingTop: parameters.headerHeightS,
    paddingBottom: 25,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.appTextBold,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: appColors.CardBackground,
    opacity: 0.9,
    fontFamily: appFonts.appTextRegular,
  },
  profileButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  moodSection: {
    backgroundColor: appColors.CardBackground,
    margin: 20,
    borderRadius: 20,
    padding: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: 20,
    fontFamily: appFonts.appTextBold,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moodCard: {
    width: '48%',
    backgroundColor: appColors.AppLightGray,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: appColors.grey4,
    minHeight: 120,
  },
  selectedMoodCard: {
    borderWidth: 2,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  moodEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  moodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.appTextBold,
    marginBottom: 5,
  },
  moodDescription: {
    fontSize: 12,
    color: appColors.grey2,
    fontFamily: appFonts.appTextRegular,
    textAlign: 'center',
  },
  saveMoodContainer: {
    marginTop: 20,
  },
  saveMoodButton: {
    borderRadius: 15,
    paddingVertical: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  saveMoodButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.appTextBold,
  },
  insightsSection: {
    marginBottom: 25,
  },
  insightsScrollContainer: {
    paddingHorizontal: 20,
  },
  insightCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    width: 160,
    minHeight: 100,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginRight: 15,
  },
  insightIconContainer: {
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.appTextBold,
    textAlign: 'center',
    marginBottom: 5,
  },
  insightDescription: {
    fontSize: 12,
    color: appColors.grey2,
    fontFamily: appFonts.appTextRegular,
    textAlign: 'center',
    lineHeight: 16,
  },
  historySection: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  viewAllText: {
    color: appColors.AppBlue,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: appFonts.appTextMedium,
  },
  historyContainer: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 15,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: appColors.grey4,
  },
  historyMoodContainer: {
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  historyEmoji: {
    fontSize: 20,
  },
  historyContent: {
    flex: 1,
  },
  historyMood: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.appTextBold,
    marginBottom: 2,
  },
  historyDate: {
    fontSize: 13,
    color: appColors.grey2,
    fontFamily: appFonts.appTextRegular,
  },
  historyIndicator: {
    width: 4,
    height: 30,
    borderRadius: 2,
  },
  actionsSection: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  actionCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionIconContainer: {
    backgroundColor: appColors.AppLightGray,
    borderRadius: 25,
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.appTextBold,
    marginBottom: 3,
  },
  actionSubtitle: {
    fontSize: 13,
    color: appColors.grey2,
    fontFamily: appFonts.appTextRegular,
    lineHeight: 18,
  },
  bottomSpacing: {
    height: 30,
  },
});

export default MoodScreen;
