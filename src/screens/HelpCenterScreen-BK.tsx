/**
 * Help Center Screen - Main hub for support and help resources
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/base';
import { appColors, parameters, appFonts } from '../global/Styles';
import { useToast } from 'native-base';

interface HelpItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: () => void;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface HelpCenterScreenProps {
  navigation: any;
}

const HelpCenterScreen: React.FC<HelpCenterScreenProps> = ({ navigation }) => {
  const toast = useToast();
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const helpItems: HelpItem[] = [
    {
      id: '1',
      title: 'My Support Tickets',
      description: 'View and manage your support requests',
      icon: 'support-agent',
      action: () => navigation.navigate('MyTicketsScreen'),
    },
    {
      id: '2',
      title: 'Contact Support',
      description: 'Get help from our support team',
      icon: 'contact-support',
      action: () => navigation.navigate('CreateTicketScreen'),
    },
    {
      id: '3',
      title: 'Live Chat',
      description: 'Chat with a support representative',
      icon: 'chat',
      action: () => {
        toast.show({
          description: 'Live chat is currently unavailable. Please create a support ticket.',
          duration: 3000,
        });
      },
    },
    {
      id: '4',
      title: 'User Guide',
      description: 'Learn how to use the app effectively',
      icon: 'menu-book',
      action: () => {
        toast.show({
          description: 'User guide will be available soon.',
          duration: 2000,
        });
      },
    },
    {
      id: '5',
      title: 'Privacy Policy',
      description: 'Read our privacy policy and terms',
      icon: 'privacy-tip',
      action: () => {
        toast.show({
          description: 'Opening privacy policy...',
          duration: 2000,
        });
      },
    },
    {
      id: '6',
      title: 'Report a Bug',
      description: 'Report technical issues or bugs',
      icon: 'bug-report',
      action: () => navigation.navigate('CreateTicketScreen', { category: 'Technical Issue' }),
    },
  ];

  const faqItems: FAQItem[] = [
    {
      id: '1',
      question: 'How do I book a therapy session?',
      answer: 'Go to the Therapists tab, browse available therapists, select one that fits your needs, and choose an available time slot. You can pay securely through the app.',
      category: 'Booking',
    },
    {
      id: '2',
      question: 'How do I join a support group?',
      answer: 'Navigate to the Groups section from the home screen, browse available groups, and tap "Join Group" on any group that interests you. Some groups may require approval from the therapist.',
      category: 'Groups',
    },
    {
      id: '3',
      question: 'Is my data secure and private?',
      answer: 'Yes, we use industry-standard encryption to protect your data. All conversations with therapists are confidential and comply with healthcare privacy regulations.',
      category: 'Privacy',
    },
    {
      id: '4',
      question: 'How do I track my mood?',
      answer: 'Use the Mood tab to log your daily mood. You can add notes and view insights about your mood patterns over time.',
      category: 'Features',
    },
    {
      id: '5',
      question: 'What if I need emergency help?',
      answer: 'Use the Emergency tab for immediate crisis support. You\'ll find emergency contacts, coping tools, and safety planning resources.',
      category: 'Emergency',
    },
    {
      id: '6',
      question: 'How do I cancel or reschedule an appointment?',
      answer: 'Go to your appointments in the Sessions section, find the appointment you want to change, and use the cancel or reschedule options. Please note cancellation policies.',
      category: 'Booking',
    },
  ];

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  const renderHelpItem = (item: HelpItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.helpItem}
      onPress={item.action}
    >
      <View style={styles.helpItemIcon}>
        <Icon name={item.icon} type="material" color={appColors.AppBlue} size={24} />
      </View>
      <View style={styles.helpItemContent}>
        <Text style={styles.helpItemTitle}>{item.title}</Text>
        <Text style={styles.helpItemDescription}>{item.description}</Text>
      </View>
      <Icon name="chevron-right" type="material" color={appColors.grey3} size={20} />
    </TouchableOpacity>
  );

  const renderFAQItem = (item: FAQItem) => (
    <View key={item.id} style={styles.faqItem}>
      <TouchableOpacity
        style={styles.faqQuestion}
        onPress={() => toggleFAQ(item.id)}
      >
        <Text style={styles.faqQuestionText}>{item.question}</Text>
        <Icon 
          name={expandedFAQ === item.id ? "expand-less" : "expand-more"} 
          type="material" 
          color={appColors.grey3} 
          size={24} 
        />
      </TouchableOpacity>
      {expandedFAQ === item.id && (
        <View style={styles.faqAnswer}>
          <Text style={styles.faqAnswerText}>{item.answer}</Text>
        </View>
      )}
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
        
        <Text style={styles.headerTitle}>Help Center</Text>
        
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>How can we help you?</Text>
          <Text style={styles.welcomeText}>
            Find answers to common questions or get personalized support from our team.
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support Options</Text>
          {helpItems.map(renderHelpItem)}
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {faqItems.map(renderFAQItem)}
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Still Need Help?</Text>
          <View style={styles.contactInfo}>
            <View style={styles.contactItem}>
              <Icon name="email" type="material" color={appColors.AppBlue} size={20} />
              <Text style={styles.contactText}>support@innerspark.com</Text>
            </View>
            <View style={styles.contactItem}>
              <Icon name="phone" type="material" color={appColors.AppBlue} size={20} />
              <Text style={styles.contactText}>+256 (0) 700 123 456</Text>
            </View>
            <View style={styles.contactItem}>
              <Icon name="schedule" type="material" color={appColors.AppBlue} size={20} />
              <Text style={styles.contactText}>Monday - Friday, 9 AM - 6 PM</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
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
  content: {
    flex: 1,
  },
  welcomeSection: {
    backgroundColor: appColors.CardBackground,
    padding: 24,
    margin: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: appColors.grey3,
    fontFamily: appFonts.regularText,
    lineHeight: 22,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 16,
  },
  helpItem: {
    backgroundColor: appColors.CardBackground,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  helpItemIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: appColors.AppBlue + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  helpItemContent: {
    flex: 1,
  },
  helpItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 4,
  },
  helpItemDescription: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.regularText,
  },
  faqItem: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  faqQuestionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: appColors.grey6,
  },
  faqAnswerText: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.regularText,
    lineHeight: 20,
    paddingTop: 12,
  },
  contactInfo: {
    backgroundColor: appColors.CardBackground,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.regularText,
    marginLeft: 12,
  },
  bottomSpacer: {
    height: 32,
  },
});

export default HelpCenterScreen;
