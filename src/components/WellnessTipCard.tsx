/**
 * WellnessTipCard - Daily wellness tip with completion tracking
 * Swipeable with manual refresh
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from '@rneui/base';
import { appColors, appFonts } from '../global/Styles';

interface WellnessTipCardProps {
  tip: string;
  category?: string;
  isCompleted: boolean;
  onComplete: () => void;
  onRefresh: () => void;
}

const WellnessTipCard: React.FC<WellnessTipCardProps> = ({
  tip,
  category = 'Mindfulness',
  isCompleted,
  onComplete,
  onRefresh,
}) => {
  const getCategoryColor = (cat: string) => {
    switch(cat.toLowerCase()) {
      case 'mindfulness': return '#9C27B0';
      case 'exercise': return '#4CAF50';
      case 'social': return '#2196F3';
      case 'self-care': return '#FF9800';
      default: return '#FF9800';
    }
  };

  const categoryColor = getCategoryColor(category);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconContainer, { backgroundColor: categoryColor + '15' }]}>
            <Icon 
              name="lightbulb" 
              type="material" 
              color={categoryColor} 
              size={24} 
            />
          </View>
          <View>
            <Text style={styles.title}>Wellness Tip of the Day</Text>
            <Text style={[styles.category, { color: categoryColor }]}>{category}</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={onRefresh}
        >
          <Icon 
            name="refresh" 
            type="material" 
            color={appColors.AppBlue} 
            size={22} 
          />
        </TouchableOpacity>
      </View>

      {/* Tip Content */}
      <Text style={styles.tipText}>{tip}</Text>

      {/* Completion Checkbox */}
      <TouchableOpacity 
        style={styles.checkboxContainer}
        onPress={onComplete}
        activeOpacity={0.7}
      >
        <Icon 
          name={isCompleted ? "check-circle" : "radio-button-unchecked"} 
          type="material"
          color={isCompleted ? "#4CAF50" : appColors.grey3}
          size={22}
        />
        <Text style={[
          styles.checkboxText,
          isCompleted && styles.checkboxTextCompleted
        ]}>
          {isCompleted ? 'Completed!' : 'Mark as done'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextSemiBold,
    marginBottom: 2,
  },
  category: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: appFonts.headerTextSemiBold,
  },
  refreshButton: {
    padding: 8,
  },
  tipText: {
    fontSize: 16,
    color: appColors.grey1,
    fontFamily: appFonts.headerTextRegular,
    lineHeight: 24,
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkboxText: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    marginLeft: 10,
  },
  checkboxTextCompleted: {
    color: '#4CAF50',
    fontWeight: '600',
  },
});

export default WellnessTipCard;
