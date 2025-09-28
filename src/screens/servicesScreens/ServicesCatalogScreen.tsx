/**
 * Services Catalog Screen - Browse available services and subscriptions
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Skeleton } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';
import LHGenericHeader from '../../components/LHGenericHeader';

interface Service {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  currency: string;
  tags: string[];
  category: 'therapy' | 'wellness' | 'premium' | 'group';
  image: any;
  isPopular: boolean;
  features: string[];
}

interface ServicesCatalogScreenProps {
  navigation: any;
}

const ServicesCatalogScreen: React.FC<ServicesCatalogScreenProps> = ({ navigation }) => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'catalog' | 'plans' | 'billing'>('catalog');
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock services data
  const mockServices: Service[] = [
    {
      id: '1',
      name: 'Individual Therapy Sessions',
      description: 'One-on-one therapy sessions with licensed therapists',
      duration: '50 minutes',
      price: 55000,
      currency: 'UGX',
      tags: ['Individual', 'Therapy', 'Mental Health'],
      category: 'therapy',
      image: require('../../assets/images/dummy-people/d-person1.png'),
      isPopular: true,
      features: ['Licensed therapists', 'Flexible scheduling', 'Progress tracking', 'Confidential'],
    },
    {
      id: '2',
      name: 'Wellness Premium Plan',
      description: 'Comprehensive mental health support with unlimited access',
      duration: 'Monthly',
      price: 150000,
      currency: 'UGX',
      tags: ['Premium', 'Unlimited', 'Support'],
      category: 'premium',
      image: require('../../assets/images/dummy-people/d-person2.png'),
      isPopular: false,
      features: ['Unlimited sessions', '24/7 crisis support', 'Group sessions', 'Wellness resources'],
    },
    {
      id: '3',
      name: 'Group Therapy Sessions',
      description: 'Supportive group therapy for shared experiences',
      duration: '90 minutes',
      price: 25000,
      currency: 'UGX',
      tags: ['Group', 'Support', 'Community'],
      category: 'group',
      image: require('../../assets/images/dummy-people/d-person3.png'),
      isPopular: false,
      features: ['Small groups (6-8 people)', 'Experienced facilitators', 'Peer support', 'Weekly sessions'],
    },
    {
      id: '4',
      name: 'Mindfulness & Meditation',
      description: 'Guided meditation and mindfulness training programs',
      duration: '30 minutes',
      price: 20000,
      currency: 'UGX',
      tags: ['Mindfulness', 'Meditation', 'Wellness'],
      category: 'wellness',
      image: require('../../assets/images/dummy-people/d-person4.png'),
      isPopular: true,
      features: ['Guided sessions', 'Progress tracking', 'Variety of techniques', 'Self-paced learning'],
    },
    {
      id: '5',
      name: 'Crisis Support Package',
      description: 'Immediate support for mental health emergencies',
      duration: 'On-demand',
      price: 75000,
      currency: 'UGX',
      tags: ['Crisis', 'Emergency', 'Immediate'],
      category: 'therapy',
      image: require('../../assets/images/dummy-people/d-person1.png'),
      isPopular: false,
      features: ['24/7 availability', 'Immediate response', 'Crisis intervention', 'Follow-up care'],
    },
    {
      id: '6',
      name: 'Family Counseling',
      description: 'Family therapy sessions to improve relationships',
      duration: '75 minutes',
      price: 85000,
      currency: 'UGX',
      tags: ['Family', 'Relationships', 'Counseling'],
      category: 'therapy',
      image: require('../../assets/images/dummy-people/d-person2.png'),
      isPopular: false,
      features: ['Family-focused approach', 'Relationship building', 'Communication skills', 'Conflict resolution'],
    },
  ];

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setServices(mockServices);
    } catch (error) {
      toast.show({
        description: 'Failed to load services',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadServices();
    setIsRefreshing(false);
  };

  const handleServicePress = (service: Service) => {
    // Navigate to service detail or subscription flow
    toast.show({
      description: `Selected ${service.name}`,
      duration: 2000,
    });
  };

  const handleSubscribe = (service: Service) => {
    toast.show({
      description: `Subscribing to ${service.name}...`,
      duration: 2000,
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'therapy':
        return '#4CAF50';
      case 'wellness':
        return '#2196F3';
      case 'premium':
        return '#FF9800';
      case 'group':
        return '#9C27B0';
      default:
        return appColors.grey3;
    }
  };

  const ServiceCard: React.FC<{ service: Service }> = ({ service }) => (
    <TouchableOpacity
      style={styles.serviceCard}
      onPress={() => handleServicePress(service)}
      activeOpacity={0.7}
    >
      {service.isPopular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>Popular</Text>
        </View>
      )}
      
      <Image source={service.image} style={styles.serviceImage} />
      
      <View style={styles.serviceContent}>
        <View style={styles.serviceHeader}>
          <Text style={styles.serviceName} numberOfLines={2}>{service.name}</Text>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(service.category) }]}>
            <Text style={styles.categoryText}>{service.category.toUpperCase()}</Text>
          </View>
        </View>
        
        <Text style={styles.serviceDescription} numberOfLines={2}>
          {service.description}
        </Text>
        
        <View style={styles.serviceMeta}>
          <View style={styles.durationContainer}>
            <Icon name="schedule" type="material" color={appColors.grey3} size={16} />
            <Text style={styles.durationText}>{service.duration}</Text>
          </View>
          
          <Text style={styles.priceText}>
            {service.currency} {service.price.toLocaleString()}
          </Text>
        </View>
        
        <View style={styles.tagsContainer}>
          {service.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.serviceActions}>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => handleServicePress(service)}
          >
            <Text style={styles.viewButtonText}>View Details</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.subscribeButton}
            onPress={() => handleSubscribe(service)}
          >
            <Text style={styles.subscribeButtonText}>Subscribe</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const ServiceSkeleton: React.FC = () => (
    <View style={styles.serviceCard}>
      <Skeleton animation="pulse" width="100%" height={120} style={styles.skeletonImage} />
      <View style={styles.serviceContent}>
        <Skeleton animation="pulse" width="80%" height={20} style={{ marginBottom: 8 }} />
        <Skeleton animation="pulse" width="100%" height={16} />
        <Skeleton animation="pulse" width="60%" height={16} style={{ marginTop: 4 }} />
        <View style={styles.skeletonActions}>
          <Skeleton animation="pulse" width={80} height={32} />
          <Skeleton animation="pulse" width={100} height={32} />
        </View>
      </View>
    </View>
  );

  const EmptyState: React.FC = () => (
    <View style={styles.emptyContainer}>
      <Icon name="shopping-cart" type="material" color={appColors.grey3} size={80} />
      <Text style={styles.emptyTitle}>No Services Available</Text>
      <Text style={styles.emptySubtitle}>
        Check back later for new services and offerings
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={loadServices}>
        <Text style={styles.retryButtonText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'catalog':
        return (
          <FlatList
            data={isLoading ? Array(4).fill({}) : services}
            keyExtractor={(item, index) => isLoading ? index.toString() : item.id}
            renderItem={({ item }) => 
              isLoading ? <ServiceSkeleton /> : <ServiceCard service={item} />
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
        );
      case 'plans':
        return (
          <View style={styles.tabContent}>
            <TouchableOpacity
              style={styles.navigationCard}
              onPress={() => navigation.navigate('PlansSubscriptionsScreen')}
            >
              <Icon name="subscriptions" type="material" color={appColors.AppBlue} size={32} />
              <View style={styles.navigationCardContent}>
                <Text style={styles.navigationCardTitle}>Plans & Subscriptions</Text>
                <Text style={styles.navigationCardSubtitle}>
                  Manage your subscription plans and billing
                </Text>
              </View>
              <Icon name="chevron-right" type="material" color={appColors.grey3} size={24} />
            </TouchableOpacity>
          </View>
        );
      case 'billing':
        return (
          <View style={styles.tabContent}>
            <TouchableOpacity
              style={styles.navigationCard}
              onPress={() => navigation.navigate('BillingHistoryScreen')}
            >
              <Icon name="receipt" type="material" color={appColors.AppBlue} size={32} />
              <View style={styles.navigationCardContent}>
                <Text style={styles.navigationCardTitle}>Billing History</Text>
                <Text style={styles.navigationCardSubtitle}>
                  View invoices and payment history
                </Text>
              </View>
              <Icon name="chevron-right" type="material" color={appColors.grey3} size={24} />
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LHGenericHeader
        title="Services & Plans"
        subtitle="Mental health services and subscription plans"
      />

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'catalog' && styles.activeTab]}
          onPress={() => setActiveTab('catalog')}
        >
          <Icon 
            name="shopping-cart" 
            type="material" 
            color={activeTab === 'catalog' ? appColors.AppBlue : appColors.grey3} 
            size={20} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'catalog' && styles.activeTabText
          ]}>
            Catalog
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tab, activeTab === 'plans' && styles.activeTab]}
          onPress={() => setActiveTab('plans')}
        >
          <Icon 
            name="subscriptions" 
            type="material" 
            color={activeTab === 'plans' ? appColors.AppBlue : appColors.grey3} 
            size={20} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'plans' && styles.activeTabText
          ]}>
            Plans
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tab, activeTab === 'billing' && styles.activeTab]}
          onPress={() => setActiveTab('billing')}
        >
          <Icon 
            name="receipt" 
            type="material" 
            color={activeTab === 'billing' ? appColors.AppBlue : appColors.grey3} 
            size={20} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'billing' && styles.activeTabText
          ]}>
            Billing
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View style={styles.content}>
        {renderTabContent()}
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
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: appColors.CardBackground,
    paddingHorizontal: 20,
    paddingVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: appColors.AppBlue + '15',
  },
  tabText: {
    fontSize: 14,
    color: appColors.grey3,
    marginLeft: 6,
    fontFamily: appFonts.headerTextRegular,
  },
  activeTabText: {
    color: appColors.AppBlue,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  tabContent: {
    flex: 1,
    padding: 20,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  serviceCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  popularBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FF9800',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 1,
  },
  popularText: {
    fontSize: 12,
    color: appColors.CardBackground,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  serviceImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  serviceContent: {
    padding: 16,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  serviceName: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginRight: 12,
  },
  categoryBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  categoryText: {
    fontSize: 10,
    color: appColors.CardBackground,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  serviceDescription: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    marginBottom: 12,
    lineHeight: 20,
  },
  serviceMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginLeft: 4,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    backgroundColor: appColors.grey6,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
  },
  serviceActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: appColors.AppBlue,
    borderRadius: 8,
    paddingVertical: 12,
    marginRight: 8,
    alignItems: 'center',
  },
  viewButtonText: {
    fontSize: 14,
    color: appColors.AppBlue,
    fontWeight: '600',
    fontFamily: appFonts.headerTextBold,
  },
  subscribeButton: {
    flex: 1,
    backgroundColor: appColors.AppBlue,
    borderRadius: 8,
    paddingVertical: 12,
    marginLeft: 8,
    alignItems: 'center',
  },
  subscribeButtonText: {
    fontSize: 14,
    color: appColors.CardBackground,
    fontWeight: '600',
    fontFamily: appFonts.headerTextBold,
  },
  navigationCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginBottom: 16,
  },
  navigationCardContent: {
    flex: 1,
    marginLeft: 16,
  },
  navigationCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 4,
  },
  navigationCardSubtitle: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
  },
  skeletonImage: {
    borderRadius: 0,
  },
  skeletonActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.grey2,
    fontFamily: appFonts.headerTextBold,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  retryButtonText: {
    fontSize: 14,
    color: appColors.CardBackground,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
});

export default ServicesCatalogScreen;
