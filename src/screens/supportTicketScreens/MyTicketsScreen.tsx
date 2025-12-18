/**
 * My Tickets Screen - Display and manage support tickets
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import { loadTickets, refreshTickets } from '../../utils/supportTicketsManager';
import { setFilters, selectFilteredTickets, selectTicketsLoading, selectTicketsRefreshing } from '../../features/supportTickets/supportTicketsSlice';

interface SupportTicket {
  id: string;
  subject: string;
  category: 'Technical Issue' | 'Account Problem' | 'Billing' | 'Feature Request' | 'General';
  status: 'Open' | 'Pending' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  createdAt: string;
  updatedAt: string;
  lastResponse?: string;
  responseCount: number;
  isUnread: boolean;
}

interface MyTicketsScreenProps {
  navigation: any;
}

const MyTicketsScreen: React.FC<MyTicketsScreenProps> = ({ navigation }) => {
  const toast = useToast();
  const dispatch = useDispatch();
  const userId = useSelector((state: any) => state.userData.userDetails.userId);
  const filteredTickets = useSelector(selectFilteredTickets);
  const isLoading = useSelector(selectTicketsLoading);
  const isRefreshing = useSelector(selectTicketsRefreshing);
  const currentFilters = useSelector((state: any) => state.supportTickets.filters);
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Open' | 'Pending' | 'Resolved'>('All');

  // Removed mock data - now using Redux state

  useEffect(() => {
    loadTicketsData();
  }, []);

  useEffect(() => {
    // Update Redux filters when local filter changes
    const status = selectedFilter === 'All' ? 'all' : selectedFilter.toLowerCase();
    dispatch(setFilters({ status }));
  }, [selectedFilter]);

  const loadTicketsData = async () => {
    const result = await dispatch(loadTickets(userId));
    if (!result.success) {
      toast.show({
        description: 'Failed to load tickets',
        duration: 3000,
      });
    }
  };

  const handleRefresh = async () => {
    const result = await dispatch(refreshTickets(userId));
    if (!result.success) {
      toast.show({
        description: 'Failed to refresh tickets',
        duration: 3000,
      });
    } else {
      toast.show({
        description: 'Tickets refreshed',
        duration: 2000,
      });
    }
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInDays < 7) {
      return `${Math.floor(diffInDays)} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return '#4CAF50';
      case 'Pending':
        return '#FF9800';
      case 'Resolved':
        return '#9E9E9E';
      default:
        return appColors.grey3;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return '#F44336';
      case 'High':
        return '#FF5722';
      case 'Medium':
        return '#FF9800';
      case 'Low':
        return '#4CAF50';
      default:
        return appColors.grey3;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Technical Issue':
        return 'bug-report';
      case 'Account Problem':
        return 'account-circle';
      case 'Billing':
        return 'payment';
      case 'Feature Request':
        return 'lightbulb';
      case 'General':
        return 'help';
      default:
        return 'support';
    }
  };

  const renderFilterButton = (filter: 'All' | 'Open' | 'Pending' | 'Resolved') => (
    <TouchableOpacity
      key={filter}
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.filterButtonActive
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text style={[
        styles.filterButtonText,
        selectedFilter === filter && styles.filterButtonTextActive
      ]}>
        {filter}
      </Text>
    </TouchableOpacity>
  );

  const renderTicket = ({ item }: { item: SupportTicket }) => (
    <TouchableOpacity
      style={[
        styles.ticketCard,
        item.isUnread && styles.unreadTicket
      ]}
      onPress={() => navigation.navigate('TicketDetailScreen', { ticket: item })}
    >
      <View style={styles.ticketHeader}>
        <View style={styles.ticketInfo}>
          <View style={styles.ticketIdRow}>
            <Icon 
              name={getCategoryIcon(item.category)} 
              type="material" 
              color={appColors.AppBlue} 
              size={16} 
            />
            <Text style={styles.ticketId}>{item.id}</Text>
            {item.isUnread && <View style={styles.unreadBadge} />}
          </View>
          <View style={styles.statusRow}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
            <View style={[styles.priorityBadge, { borderColor: getPriorityColor(item.priority) }]}>
              <Text style={[styles.priorityText, { color: getPriorityColor(item.priority) }]}>
                {item.priority}
              </Text>
            </View>
          </View>
        </View>
        <Text style={styles.updatedTime}>{getRelativeTime(item.updatedAt)}</Text>
      </View>

      <Text style={styles.ticketSubject} numberOfLines={2}>
        {item.subject}
      </Text>

      <View style={styles.ticketFooter}>
        <Text style={styles.categoryText}>{item.category}</Text>
        <View style={styles.responseInfo}>
          <Icon name="chat" type="material" color={appColors.grey3} size={14} />
          <Text style={styles.responseCount}>{item.responseCount} responses</Text>
        </View>
      </View>

      {item.lastResponse && (
        <View style={styles.lastResponse}>
          <Text style={styles.lastResponseText} numberOfLines={2}>
            {item.lastResponse}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="support-agent" type="material" color={appColors.grey3} size={64} />
      <Text style={styles.emptyStateTitle}>No Support Tickets</Text>
      <Text style={styles.emptyStateText}>
        You haven't created any support tickets yet. Tap the + button to create your first ticket.
      </Text>
      <Button
        title="Create Ticket"
        onPress={() => navigation.navigate('CreateTicketScreen')}
        buttonStyle={styles.createTicketButton}
        titleStyle={styles.createTicketButtonText}
      />
    </View>
  );

  const renderSkeletonLoader = () => (
    <View style={styles.skeletonContainer}>
      {[1, 2, 3, 4, 5].map((item) => (
        <View key={item} style={styles.skeletonCard}>
          <View style={styles.skeletonHeader}>
            <View style={styles.skeletonLine} />
            <View style={styles.skeletonSmallLine} />
          </View>
          <View style={styles.skeletonContent}>
            <View style={styles.skeletonLongLine} />
            <View style={styles.skeletonMediumLine} />
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" type="material" color={appColors.grey1} size={24} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>My Support Tickets</Text>
        
        <View style={styles.headerSpacer} />
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        {(['All', 'Open', 'Pending', 'Resolved'] as const).map(renderFilterButton)}
      </View>

      {/* Tickets List */}
      {isLoading ? (
        renderSkeletonLoader()
      ) : (
        <FlatList
          data={filteredTickets}
          renderItem={renderTicket}
          keyExtractor={(item) => item.id}
          style={styles.ticketsList}
          contentContainerStyle={styles.ticketsContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[appColors.AppBlue]}
            />
          }
          ListEmptyComponent={!isLoading ? renderEmptyState : null}
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateTicketScreen')}
      >
        <Icon name="add" type="material" color={appColors.CardBackground} size={28} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.AppLightGray,
  },
  header: {
    backgroundColor: appColors.CardBackground,
    paddingTop: parameters.headerHeightS,
    paddingBottom: 15,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  filtersContainer: {
    backgroundColor: appColors.CardBackground,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: appColors.grey6,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: appColors.grey6,
  },
  filterButtonActive: {
    backgroundColor: appColors.AppBlue,
  },
  filterButtonText: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.regularText,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: appColors.CardBackground,
  },
  ticketsList: {
    flex: 1,
  },
  ticketsContent: {
    paddingVertical: 8,
  },
  ticketCard: {
    backgroundColor: appColors.CardBackground,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  unreadTicket: {
    borderLeftWidth: 4,
    borderLeftColor: appColors.AppBlue,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  ticketInfo: {
    flex: 1,
  },
  ticketIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ticketId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginLeft: 8,
  },
  unreadBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: appColors.AppBlue,
    marginLeft: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    color: appColors.CardBackground,
    fontFamily: appFonts.regularText,
    fontWeight: 'bold',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  priorityText: {
    fontSize: 12,
    fontFamily: appFonts.regularText,
    fontWeight: 'bold',
  },
  updatedTime: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.regularText,
  },
  ticketSubject: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 12,
    lineHeight: 22,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.regularText,
  },
  responseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  responseCount: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.regularText,
    marginLeft: 4,
  },
  lastResponse: {
    backgroundColor: appColors.grey6,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  lastResponseText: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.regularText,
    lineHeight: 18,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.grey2,
    fontFamily: appFonts.headerTextBold,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.regularText,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  createTicketButton: {
    backgroundColor: appColors.AppBlue,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createTicketButtonText: {
    fontSize: 16,
    color: appColors.CardBackground,
    fontFamily: appFonts.regularText,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: appColors.AppBlue,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  skeletonContainer: {
    paddingVertical: 8,
  },
  skeletonCard: {
    backgroundColor: appColors.CardBackground,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  skeletonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  skeletonLine: {
    height: 16,
    width: 120,
    backgroundColor: appColors.grey6,
    borderRadius: 4,
  },
  skeletonSmallLine: {
    height: 12,
    width: 60,
    backgroundColor: appColors.grey6,
    borderRadius: 4,
  },
  skeletonContent: {
    marginBottom: 8,
  },
  skeletonLongLine: {
    height: 14,
    width: '100%',
    backgroundColor: appColors.grey6,
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonMediumLine: {
    height: 14,
    width: '70%',
    backgroundColor: appColors.grey6,
    borderRadius: 4,
  },
});

export default MyTicketsScreen;
