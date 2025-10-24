/**
 * Goal Detail Screen - View and manage specific goal
 */
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import ISStatusBar from '../../components/ISStatusBar';

interface Goal {
  id: number;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'paused';
  dueDate: string;
  createdAt: string;
  progress: number;
  category: string;
  priority: 'high' | 'medium' | 'low';
}

interface GoalDetailScreenProps {
  navigation: NavigationProp<any>;
  route: RouteProp<{ params: { goal: Goal } }, 'params'>;
}

const GoalDetailScreen: React.FC<GoalDetailScreenProps> = ({ navigation, route }) => {
  const { goal } = route.params;
  const toast = useToast();
  const [currentGoal, setCurrentGoal] = useState(goal);
  const [isLoading, setIsLoading] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'paused': return '#FF9800';
      case 'active': return appColors.AppBlue;
      default: return appColors.grey2;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#F44336';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return appColors.grey2;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDaysRemaining = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return '1 day remaining';
    if (diffDays > 1) return `${diffDays} days remaining`;
    if (diffDays === -1) return '1 day overdue';
    return `${Math.abs(diffDays)} days overdue`;
  };

  const handleComplete = async () => {
    if (currentGoal.status === 'completed') {
      toast.show({
        description: 'Goal is already completed',
        duration: 2000,
      });
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentGoal(prev => ({ 
        ...prev, 
        status: 'completed', 
        progress: 100 
      }));
      
      toast.show({
        description: 'Congratulations! Goal marked as completed!',
        duration: 3000,
      });
    } catch (error) {
      toast.show({
        description: 'Failed to update goal',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    navigation.navigate('CreateGoalScreen', { goal: currentGoal, isEditing: true });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this goal? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: async () => {
            setIsLoading(true);
            try {
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              toast.show({
                description: 'Goal deleted successfully',
                duration: 2000,
              });
              
              navigation.goBack();
            } catch (error) {
              toast.show({
                description: 'Failed to delete goal',
                duration: 3000,
              });
            } finally {
              setIsLoading(false);
            }
          }
        },
      ]
    );
  };

  const handlePauseResume = async () => {
    const newStatus = currentGoal.status === 'paused' ? 'active' : 'paused';
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentGoal(prev => ({ ...prev, status: newStatus }));
      
      toast.show({
        description: `Goal ${newStatus === 'paused' ? 'paused' : 'resumed'}`,
        duration: 2000,
      });
    } catch (error) {
      toast.show({
        description: 'Failed to update goal',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const statusColor = getStatusColor(currentGoal.status);
  const priorityColor = getPriorityColor(currentGoal.priority);
  const isOverdue = new Date(currentGoal.dueDate) < new Date() && currentGoal.status !== 'completed';

  return (
    <SafeAreaView style={styles.container}>
      <ISStatusBar backgroundColor={appColors.AppBlue} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" type="material" color={appColors.CardBackground} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Goal Details</Text>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Icon name="edit" type="material" color={appColors.CardBackground} size={22} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Goal Header */}
          <View style={styles.goalHeader}>
            <View style={styles.statusRow}>
              <View style={[styles.statusChip, { backgroundColor: statusColor + '20' }]}>
                <Text style={[styles.statusText, { color: statusColor }]}>
                  {currentGoal.status.toUpperCase()}
                </Text>
              </View>
              <View style={styles.priorityContainer}>
                <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
                <Text style={[styles.priorityText, { color: priorityColor }]}>
                  {currentGoal.priority.toUpperCase()} PRIORITY
                </Text>
              </View>
            </View>

            <Text style={styles.goalTitle}>{currentGoal.title}</Text>
            
            <View style={styles.categoryContainer}>
              <Icon name="label" type="material" color={appColors.grey2} size={16} />
              <Text style={styles.categoryText}>{currentGoal.category}</Text>
            </View>
          </View>

          {/* Progress Section */}
          <View style={styles.progressSection}>
            <Text style={styles.sectionTitle}>Progress</Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${currentGoal.progress}%`, backgroundColor: statusColor }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>{currentGoal.progress}%</Text>
            </View>
            
            <View style={styles.progressStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{currentGoal.progress}%</Text>
                <Text style={styles.statLabel}>Complete</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, isOverdue && styles.overdueText]}>
                  {getDaysRemaining(currentGoal.dueDate)}
                </Text>
                <Text style={styles.statLabel}>Time Left</Text>
              </View>
            </View>
          </View>

          {/* Description Section */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{currentGoal.description}</Text>
          </View>

          {/* Timeline Section */}
          <View style={styles.timelineSection}>
            <Text style={styles.sectionTitle}>Timeline</Text>
            
            <View style={styles.timelineItem}>
              <Icon name="flag" type="material" color={appColors.AppBlue} size={20} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Goal Created</Text>
                <Text style={styles.timelineDate}>{formatDate(currentGoal.createdAt)}</Text>
              </View>
            </View>

            <View style={styles.timelineItem}>
              <Icon 
                name={isOverdue ? "warning" : "event"} 
                type="material" 
                color={isOverdue ? "#F44336" : appColors.AppBlue} 
                size={20} 
              />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Due Date</Text>
                <Text style={[styles.timelineDate, isOverdue && styles.overdueText]}>
                  {formatDate(currentGoal.dueDate)}
                </Text>
              </View>
            </View>

            {currentGoal.status === 'completed' && (
              <View style={styles.timelineItem}>
                <Icon name="check-circle" type="material" color="#4CAF50" size={20} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Completed</Text>
                  <Text style={styles.timelineDate}>Today</Text>
                </View>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            {currentGoal.status !== 'completed' && (
              <>
                <Button
                  title="Mark as Complete"
                  onPress={handleComplete}
                  loading={isLoading}
                  buttonStyle={[styles.actionButton, styles.completeButton]}
                  titleStyle={styles.actionButtonText}
                />
                
                <Button
                  title={currentGoal.status === 'paused' ? 'Resume Goal' : 'Pause Goal'}
                  onPress={handlePauseResume}
                  loading={isLoading}
                  buttonStyle={[styles.actionButton, styles.pauseButton]}
                  titleStyle={[styles.actionButtonText, styles.pauseButtonText]}
                />
              </>
            )}
            
            <Button
              title="Delete Goal"
              onPress={handleDelete}
              loading={isLoading}
              buttonStyle={[styles.actionButton, styles.deleteButton]}
              titleStyle={[styles.actionButtonText, styles.deleteButtonText]}
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
    backgroundColor: appColors.AppLightGray,
  },
  header: {
    backgroundColor: appColors.AppBlue,
    paddingTop: parameters.headerHeightS,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  editButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  goalHeader: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusChip: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  goalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: 12,
    fontFamily: appFonts.headerTextBold,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 14,
    color: appColors.grey2,
    marginLeft: 6,
    fontFamily: appFonts.headerTextRegular,
  },
  progressSection: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: 16,
    fontFamily: appFonts.headerTextBold,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressBar: {
    flex: 1,
    height: 12,
    backgroundColor: appColors.AppLightGray,
    borderRadius: 6,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
  },
  statLabel: {
    fontSize: 12,
    color: appColors.grey2,
    marginTop: 4,
    fontFamily: appFonts.headerTextRegular,
  },
  overdueText: {
    color: '#F44336',
  },
  descriptionSection: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: appColors.grey1,
    lineHeight: 24,
    fontFamily: appFonts.headerTextRegular,
  },
  timelineSection: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timelineContent: {
    marginLeft: 12,
    flex: 1,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  timelineDate: {
    fontSize: 14,
    color: appColors.grey2,
    marginTop: 2,
    fontFamily: appFonts.headerTextRegular,
  },
  actionSection: {
    gap: 12,
  },
  actionButton: {
    borderRadius: 25,
    paddingVertical: 15,
  },
  completeButton: {
    backgroundColor: '#4CAF50',
  },
  pauseButton: {
    backgroundColor: appColors.CardBackground,
    borderWidth: 2,
    borderColor: appColors.AppBlue,
  },
  deleteButton: {
    backgroundColor: appColors.CardBackground,
    borderWidth: 2,
    borderColor: '#F44336',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  pauseButtonText: {
    color: appColors.AppBlue,
  },
  deleteButtonText: {
    color: '#F44336',
  },
});

export default GoalDetailScreen;
