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
} from 'react-native';
import ISStatusBar from '../components/ISStatusBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/base';
import { appColors, parameters, appFonts } from '../global/Styles';
import { useToast } from 'native-base';
import { appContents, appLinks, faqData } from '../global/Data';
import { openThisURL } from '../global/LHShortcuts';
import { scale, moderateScale } from '../global/Scaling';

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
      id: '2',
      title: 'Contact Support',
      description: 'Get help from our support team',
      icon: 'contact-support',
      // action: () => navigation.navigate('CreateTicketScreen'),
      action: () => openThisURL(appLinks.appSupportEmail),
    },
    {
      id: '4',
      title: 'User Guide',
      description: 'Learn how to use the app effectively',
      icon: 'menu-book',
      action: () => openThisURL(appLinks.appUserGuide),
    },
    {
      id: '5',
      title: 'Privacy Policy',
      description: 'Read our privacy policy and terms',
      icon: 'privacy-tip',
      action: () => openThisURL(appLinks.appPrivacy),
    },
  ];

  const faqItems: FAQItem[] = faqData; // FAQ Data from Data.ts

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
        <Icon name={item.icon} type="material" color={appColors.AppBlue} size={moderateScale(24)} />
      </View>
      <View style={styles.helpItemContent}>
        <Text style={styles.helpItemTitle}>{item.title}</Text>
        <Text style={styles.helpItemDescription}>{item.description}</Text>
      </View>
      <Icon name="chevron-right" type="material" color={appColors.grey3} size={moderateScale(20)} />
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
          size={moderateScale(24)}
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
          <Icon name="arrow-back" type="material" color={appColors.CardBackground} size={moderateScale(24)} />
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
              <Icon name="email" type="material" color={appColors.AppBlue} size={moderateScale(20)} />
              <Text style={styles.contactText}>{appContents.supportEmail}</Text>
            </View>
            <View style={styles.contactItem}>
              <Icon name="phone" type="material" color={appColors.AppBlue} size={moderateScale(20)} />
              <Text style={styles.contactText}>{appContents.supportPhone}</Text>
            </View>
            <View style={styles.contactItem}>
              <Icon name="schedule" type="material" color={appColors.AppBlue} size={moderateScale(20)} />
              <Text style={styles.contactText}>{appContents.supportHours}</Text>
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
    backgroundColor: appColors.AppBlue,
    paddingTop: parameters.headerHeightS,
    paddingBottom: scale(15),
    paddingHorizontal: scale(16),
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(2) },
    shadowOpacity: 0.1,
    shadowRadius: scale(4),
  },
  backButton: {
    padding: scale(8),
    marginRight: scale(8),
  },
  headerTitle: {
    flex: 1,
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
    textAlign: 'center',
  },
  headerSpacer: {
    width: scale(40),
  },
  content: {
    flex: 1,
  },
  welcomeSection: {
    backgroundColor: appColors.CardBackground,
    padding: scale(24),
    margin: scale(16),
    marginBottom: scale(24),
    borderRadius: scale(12),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(1) },
    shadowOpacity: 0.1,
    shadowRadius: scale(2),
  },
  welcomeTitle: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: scale(8),
  },
  welcomeText: {
    fontSize: moderateScale(16),
    color: appColors.grey3,
    fontFamily: appFonts.regularText,
    lineHeight: moderateScale(22),
  },
  section: {
    marginHorizontal: scale(16),
    marginBottom: scale(24),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: scale(16),
  },
  helpItem: {
    backgroundColor: appColors.CardBackground,
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(16),
    borderRadius: scale(12),
    marginBottom: scale(8),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(1) },
    shadowOpacity: 0.1,
    shadowRadius: scale(2),
  },
  helpItemIcon: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    backgroundColor: appColors.AppBlue + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(16),
  },
  helpItemContent: {
    flex: 1,
  },
  helpItemTitle: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: scale(4),
  },
  helpItemDescription: {
    fontSize: moderateScale(14),
    color: appColors.grey3,
    fontFamily: appFonts.regularText,
  },
  faqItem: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(12),
    marginBottom: scale(8),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(1) },
    shadowOpacity: 0.1,
    shadowRadius: scale(2),
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(16),
  },
  faqQuestionText: {
    flex: 1,
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  faqAnswer: {
    paddingHorizontal: scale(16),
    paddingBottom: scale(16),
    borderTopWidth: 1,
    borderTopColor: appColors.grey6,
  },
  faqAnswerText: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    fontFamily: appFonts.regularText,
    lineHeight: moderateScale(20),
    paddingTop: scale(12),
  },
  contactInfo: {
    backgroundColor: appColors.CardBackground,
    padding: scale(16),
    borderRadius: scale(12),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(1) },
    shadowOpacity: 0.1,
    shadowRadius: scale(2),
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(12),
  },
  contactText: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    fontFamily: appFonts.regularText,
    marginLeft: scale(12),
  },
  bottomSpacer: {
    height: scale(32),
  },
});

export default HelpCenterScreen;
