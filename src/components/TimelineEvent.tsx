/**
 * TimelineEvent - Event item with timeline dot and connecting line
 * Used for displaying today's schedule in timeline format
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from '@rneui/base';
import { appColors, appFonts } from '../global/Styles';

interface TimelineEventProps {
  id: string | number;
  title: string;
  time: string;
  icon: string;
  color: string;
  isLast?: boolean;
  onPress?: () => void;
}

const TimelineEvent: React.FC<TimelineEventProps> = ({
  title,
  time,
  icon,
  color,
  isLast = false,
  onPress,
}) => {
  return (
    <View style={styles.container}>
      {/* Timeline Dot and Line */}
      <View style={styles.timelineColumn}>
        <View style={[styles.dot, { backgroundColor: color }]} />
        {!isLast && <View style={styles.line} />}
      </View>

      {/* Event Card */}
      <TouchableOpacity 
        style={styles.eventCard}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
          <Icon 
            name={icon} 
            type="material" 
            color={color} 
            size={20} 
          />
        </View>
        
        <View style={styles.eventContent}>
          <Text style={styles.eventTitle}>{title}</Text>
          <Text style={styles.eventTime}>{time}</Text>
        </View>
        
        <Icon 
          name="chevron-right" 
          type="material" 
          color={appColors.grey3} 
          size={20} 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineColumn: {
    width: 30,
    alignItems: 'center',
    marginRight: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 3,
    borderColor: appColors.CardBackground,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: appColors.grey5,
    marginTop: 4,
  },
  eventCard: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: appColors.CardBackground,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextSemiBold,
    marginBottom: 2,
  },
  eventTime: {
    fontSize: 13,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
  },
});

export default TimelineEvent;
