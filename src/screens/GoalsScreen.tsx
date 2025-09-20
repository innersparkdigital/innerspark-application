/**
 * Goals Screen - Mental Health Goals Management
 */
import React, { useState, useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Skeleton } from '@rneui/base';
import { appColors, appFonts } from '../global/Styles';
import { useToast } from 'native-base';
import LHGenericHeader from '../components/LHGenericHeader';
import { NavigationProp } from '@react-navigation/native';

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

interface GoalsScreenProps {
  navigation: NavigationProp<any>;
}

const GoalsScreen: React.FC<GoalsScreenProps> = ({ navigation }) => {
  const toast = useToast();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock goals data
  const mockGoals: Goal[] = [
    {
      id: 1,
      title: 'Daily Meditation Practice',
      description: 'Meditate for 10 minutes every morning to improve mindfulness and reduce stress',
      status: 'active',
      dueDate: '2024-01-20',
      createdAt: '2024-01-10',
      progress: 75,
      category: 'Mindfulness',
      priority: 'high',
    },
    {
      id: 2,
      title: 'Weekly Therapy Sessions',
      description: 'Attend scheduled therapy sessions to work on anxiety management techniques',
      status: 'active',
      dueDate: '2024-01-15',
      createdAt: '2024-01-01',
      progress: 100,
      category: 'Professional Help',
      priority: 'high',
    },
    {
      id: 3,
      title: 'Mood Tracking Consistency',
      description: 'Log mood daily for 30 days to identify patterns and triggers',
      status: 'completed',
      dueDate: '2024-01-14',
      createdAt: '2023-12-15',
      progress: 100,
      category: 'Self-Awareness',
      priority: 'medium',
    },
    {
      id: 4,
      title: 'Exercise Routine',
      description: 'Complete 30 minutes of physical activity 4 times per week',
      status: 'active',
      dueDate: '2024-01-25',
      createdAt: '2024-01-08',
      progress: 60,
      category: 'Physical Health',
      priority: 'medium',
    },
    {
      id: 5,
      title: 'Social Connection',
      description: 'Reach out to friends or family members at least twice a week',
      status: 'paused',
      dueDate: '2024-01-30',
      createdAt: '2024-01-05',
      progress: 40,
      category: 'Relationships',
      priority: 'low',
    },
    {
      id: 6,
      title: 'Sleep Hygiene Improvement',
      description: 'Establish a consistent bedtime routine and aim for 7-8 hours of sleep',
      status: 'active',
      dueDate: '2024-01-18',
      createdAt: '2024-01-12',
      progress: 85,
      category: 'Lifestyle',
      priority: 'high',
    },
  ];

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Sort by due date (due soon first)
      const sortedGoals = mockGoals.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
      setGoals(sortedGoals);
    } catch (error) {
      toast.show({
        description: 'Failed to load goals',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadGoals();
    setIsRefreshing(false);
  };

  const handleGoalPress = (goal: Goal) => {
    navigation.navigate('GoalDetailScreen', { goal });
  };

  const handleCreateGoal = () => {
    navigation.navigate('CreateGoalScreen');
  };

  const handleMarkComplete = (goalId: number) => {
    setGoals(prev => 
      prev.map(goal => 
        goal.id === goalId 
          ? { ...goal, status: 'completed', progress: 100 }
          : goal
      )
    );
    toast.show({
      description: 'Goal marked as completed!',
      duration: 2000,
    });
  };

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
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays <= 7) return `${diffDays} days left`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const GoalCard: React.FC<{ goal: Goal }> = ({ goal }) => {
    const statusColor = getStatusColor(goal.status);
    const priorityColor = getPriorityColor(goal.priority);
    const isOverdue = new Date(goal.dueDate) < new Date() && goal.status !== 'completed';
    
    return (
      <TouchableOpacity
        style={[styles.goalCard, isOverdue && styles.overdueCard]}
        onPress={() => handleGoalPress(goal)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={styles.statusRow}>
            <View style={[styles.statusChip, { backgroundColor: statusColor + '20' }]}>
              <Text style={[styles.statusText, { color: statusColor }]}>
                {goal.status.toUpperCase()}
              </Text>
            </View>
            <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
          </View>
          
          {goal.status !== 'completed' && (
            <TouchableOpacity
              style={styles.completeButton}
              onPress={(e) => {
                e.stopPropagation();
                handleMarkComplete(goal.id);
              }}
            >
              <Icon name="check" type="material" color={appColors.AppBlue} size={20} />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.goalTitle}>{goal.title}</Text>
        <Text style={styles.goalDescription} numberOfLines={2}>{goal.description}</Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${goal.progress}%`, backgroundColor: statusColor }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>{goal.progress}%</Text>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.categoryContainer}>
            <Icon name="label" type="material" color={appColors.grey2} size={16} />
            <Text style={styles.categoryText}>{goal.category}</Text>
          </View>
          
          <Text style={[
            styles.dueDateText,
            isOverdue && styles.overdueText
          ]}>
            {formatDate(goal.dueDate)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const GoalSkeleton: React.FC = () => (
    <View style={styles.goalCard}>
      <View style={styles.cardHeader}>
        <Skeleton animation="pulse" width={80} height={24} />
        <Skeleton animation="pulse" width={40} height={40} style={{ borderRadius: 20 }} />
      </View>
      <Skeleton animation="pulse" width="90%" height={20} style={{ marginVertical: 8 }} />
      <Skeleton animation="pulse" width="100%" height={16} />
      <Skeleton animation="pulse" width="70%" height={16} style={{ marginTop: 4 }} />
      <View style={[styles.cardFooter, { marginTop: 16 }]}>
        <Skeleton animation="pulse" width={100} height={16} />
        <Skeleton animation="pulse" width={80} height={16} />
      </View>
    </View>
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="flag" type="material" color={appColors.AppGray} size={80} />
      <Text style={styles.emptyTitle}>No Goals Yet</Text>
      <Text style={styles.emptySubtitle}>
        Create your first mental health goal to start your wellness journey
      </Text>
      <TouchableOpacity style={styles.createFirstGoalButton} onPress={handleCreateGoal}>
        <Text style={styles.createFirstGoalText}>Create Your First Goal</Text>
      </TouchableOpacity>
    </View>
  );

  const activeGoals = goals.filter(g => g.status === 'active').length;
  const completedGoals = goals.filter(g => g.status === 'completed').length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={appColors.StatusBarColor} barStyle="light-content" />
      
      <LHGenericHeader
        title="My Goals"
        subtitle={`${activeGoals} active, ${completedGoals} completed`}
        navigation={navigation}
        rightIcon="add"
        rightIconPressed={handleCreateGoal}
      />

      <View style={styles.content}>
        <FlatList
          data={isLoading ? Array(4).fill({}) : goals}
          keyExtractor={(item, index) => isLoading ? index.toString() : item.id?.toString()}
          renderItem={({ item }) => 
            isLoading ? <GoalSkeleton /> : <GoalCard goal={item} />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[appColors.AppBlue]}
            />
          }
          ListEmptyComponent={!isLoading ? <EmptyState /> : null}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.AppLightGray,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listContainer: {
    paddingVertical: 10,
  },
  goalCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  overdueCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusChip: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  completeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: appColors.AppLightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: 8,
    fontFamily: appFonts.headerTextBold,
  },
  goalDescription: {
    fontSize: 14,
    color: appColors.grey2,
    lineHeight: 20,
    marginBottom: 16,
    fontFamily: appFonts.headerTextRegular,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: appColors.AppLightGray,
    borderRadius: 4,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: appColors.grey2,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 12,
    color: appColors.grey2,
    marginLeft: 4,
    fontFamily: appFonts.headerTextRegular,
  },
  dueDateText: {
    fontSize: 12,
    color: appColors.AppBlue,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  overdueText: {
    color: '#F44336',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.grey1,
    marginTop: 16,
    fontFamily: appFonts.headerTextBold,
  },
  emptySubtitle: {
    fontSize: 14,
    color: appColors.grey2,
    textAlign: 'center',
    marginTop: 8,
    marginHorizontal: 40,
    fontFamily: appFonts.headerTextRegular,
  },
  createFirstGoalButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 20,
  },
  createFirstGoalText: {
    color: appColors.CardBackground,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
});

export default GoalsScreen;
