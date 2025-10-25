/**
 * Goals Screen - Mental Health Goals Management with Status Tabs
 */
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Skeleton, Tab, TabView, Button, FAB } from '@rneui/base';
import { appColors, appFonts } from '../global/Styles';
import { useToast } from 'native-base';
import ISStatusBar from '../components/ISStatusBar';
import ISGenericHeader from '../components/ISGenericHeader';
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
  
  // Tab View State
  const [activeTabIndex, setActiveTabIndex] = useState(0);

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
                {goal.status?.toUpperCase() || 'UNKNOWN'}
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

  const EmptyState: React.FC<{ status: string }> = ({ status }) => {
    const getEmptyStateContent = () => {
      switch (status) {
        case 'active':
          return {
            icon: 'flag',
            title: 'No Active Goals',
            subtitle: 'Create your first mental health goal to start your wellness journey',
            showButton: true,
          };
        case 'completed':
          return {
            icon: 'check-circle',
            title: 'No Completed Goals',
            subtitle: 'Complete your active goals to see them here',
            showButton: false,
          };
        case 'paused':
          return {
            icon: 'pause-circle-filled',
            title: 'No Paused Goals',
            subtitle: 'Goals you pause will appear here for later resumption',
            showButton: false,
          };
        default:
          return {
            icon: 'flag',
            title: 'No Goals',
            subtitle: 'Create your first goal to get started',
            showButton: true,
          };
      }
    };

    const content = getEmptyStateContent();

    return (
      <View style={styles.emptyContainer}>
        <Icon name={content.icon} type="material" color={appColors.AppGray} size={80} />
        <Text style={styles.emptyTitle}>{content.title}</Text>
        <Text style={styles.emptySubtitle}>{content.subtitle}</Text>
        {content.showButton && (
          <TouchableOpacity style={styles.createFirstGoalButton} onPress={handleCreateGoal}>
            <Text style={styles.createFirstGoalText}>Create Your First Goal</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Filter goals by status
  const getGoalsByStatus = (status: 'active' | 'completed' | 'paused') => {
    return goals.filter(goal => goal.status === status)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  };

  // Tab components
  const GoalsList: React.FC<{ status: 'active' | 'completed' | 'paused' }> = ({ status }) => {
    const filteredGoals = getGoalsByStatus(status);
    
    return (
      <View style={styles.tabContent}>
        <FlatList
          data={isLoading ? Array(4).fill({}) : filteredGoals}
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
          ListEmptyComponent={!isLoading ? <EmptyState status={status} /> : null}
        />
      </View>
    );
  };

  const activeGoals = goals.filter(g => g.status === 'active').length;
  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const pausedGoals = goals.filter(g => g.status === 'paused').length;

  const tabData = [
    { title: `Active (${activeGoals})`, status: 'active' as const },
    { title: `Completed (${completedGoals})`, status: 'completed' as const },
    { title: `Paused (${pausedGoals})`, status: 'paused' as const },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ISStatusBar backgroundColor={appColors.AppBlue} />
      <ISGenericHeader
        title="My Goals"
        navigation={navigation}
      />

      <Tab
        value={activeTabIndex}
        onChange={setActiveTabIndex}
        indicatorStyle={styles.tabIndicator}
        variant="primary"
        scrollable={false}
      >
        <Tab.Item
          title="Active"
          titleStyle={[styles.tabTitle, activeTabIndex === 0 && styles.activeTabTitle]}
          containerStyle={[styles.tabItem, activeTabIndex === 0 && styles.activeTabItem]}
        />
        <Tab.Item
          title="Completed"
          titleStyle={[styles.tabTitle, activeTabIndex === 1 && styles.activeTabTitle]}
          containerStyle={[styles.tabItem, activeTabIndex === 1 && styles.activeTabItem]}
        />
        <Tab.Item
          title="Paused"
          titleStyle={[styles.tabTitle, activeTabIndex === 2 && styles.activeTabTitle]}
          containerStyle={[styles.tabItem, activeTabIndex === 2 && styles.activeTabItem]}
        />
      </Tab>

      <TabView value={activeTabIndex} onChange={setActiveTabIndex} animationType="spring">
        <TabView.Item style={styles.tabViewItem}>
          <GoalsList status="active" />
        </TabView.Item>
        <TabView.Item style={styles.tabViewItem}>
          <GoalsList status="completed" />
        </TabView.Item>
        <TabView.Item style={styles.tabViewItem}>
          <GoalsList status="paused" />
        </TabView.Item>
      </TabView>

      {/* Floating Action Button */}
      <FAB
        icon={{ name: 'add', color: appColors.CardBackground }}
        color={appColors.AppBlue}
        size="large"
        placement="right"
        onPress={handleCreateGoal}
        style={styles.fab}
      />
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
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
    marginHorizontal: 12,
  },
  headerSpacer: {
    width: 40,
  },
  tabIndicator: {
    backgroundColor: appColors.AppBlue,
    height: 3,
  },
  tabItem: {
    backgroundColor: appColors.CardBackground,
    paddingVertical: 12,
  },
  activeTabItem: {
    backgroundColor: appColors.CardBackground,
  },
  tabTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: appColors.grey2,
    fontFamily: appFonts.headerTextMedium,
    textTransform: 'capitalize',
  },
  activeTabTitle: {
    color: appColors.AppBlue,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  tabViewItem: {
    flex: 1,
    backgroundColor: appColors.AppLightGray,
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
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
