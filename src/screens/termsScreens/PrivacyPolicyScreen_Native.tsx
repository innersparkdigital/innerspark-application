/**
 * Privacy Policy Screen - Native Implementation
 * Use this version if you prefer native scrolling content over WebView
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { NavigationProp } from '@react-navigation/native';
import ISGenericHeader from '../../components/ISGenericHeader';

interface PrivacyPolicyScreenProps {
  navigation: NavigationProp<any>;
}

const PrivacyPolicyScreen: React.FC<PrivacyPolicyScreenProps> = ({ navigation }) => {
  
  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const Paragraph = ({ children }: { children: React.ReactNode }) => (
    <Text style={styles.paragraph}>{children}</Text>
  );

  const BulletPoint = ({ children }: { children: React.ReactNode }) => (
    <View style={styles.bulletContainer}>
      <Text style={styles.bullet}>•</Text>
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ISGenericHeader
        title="Privacy Policy"
        navigation={navigation}
        hasLightBackground={true}
      />

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header */}
        <View style={styles.header}>
          <Icon name="shield-checkmark" type="ionicon" color={appColors.AppBlue} size={48} />
          <Text style={styles.headerTitle}>Privacy Policy</Text>
          <Text style={styles.lastUpdated}>Last Updated: October 21, 2025</Text>
        </View>

        {/* Introduction */}
        <Section title="Introduction">
          <Paragraph>
            Welcome to Innerspark ("we," "our," or "us"). We are committed to protecting your privacy 
            and ensuring the security of your personal information. This Privacy Policy explains how we 
            collect, use, disclose, and safeguard your information when you use our mental health and 
            wellness mobile application.
          </Paragraph>
          <Paragraph>
            By using Innerspark, you agree to the collection and use of information in accordance with 
            this policy. If you do not agree with our policies and practices, please do not use our services.
          </Paragraph>
        </Section>

        {/* Information We Collect */}
        <Section title="1. Information We Collect">
          <Text style={styles.subsectionTitle}>1.1 Personal Information</Text>
          <Paragraph>
            When you create an account, we collect:
          </Paragraph>
          <BulletPoint>Name (first and last name)</BulletPoint>
          <BulletPoint>Email address</BulletPoint>
          <BulletPoint>Phone number</BulletPoint>
          <BulletPoint>Gender</BulletPoint>
          <BulletPoint>Date of birth</BulletPoint>
          <BulletPoint>Profile picture (optional)</BulletPoint>

          <Text style={styles.subsectionTitle}>1.2 Health and Wellness Data</Text>
          <Paragraph>
            To provide our mental health services, we collect:
          </Paragraph>
          <BulletPoint>Mood tracking entries and emotional states</BulletPoint>
          <BulletPoint>Journal entries and personal reflections</BulletPoint>
          <BulletPoint>Therapy session notes and progress</BulletPoint>
          <BulletPoint>Wellness goals and achievements</BulletPoint>
          <BulletPoint>Crisis support interactions</BulletPoint>
          <BulletPoint>Mental health assessment responses</BulletPoint>

          <Text style={styles.subsectionTitle}>1.3 Usage Information</Text>
          <BulletPoint>App usage patterns and features accessed</BulletPoint>
          <BulletPoint>Device information (model, OS version)</BulletPoint>
          <BulletPoint>IP address and general location data</BulletPoint>
          <BulletPoint>Crash reports and performance data</BulletPoint>
        </Section>

        {/* How We Use Your Information */}
        <Section title="2. How We Use Your Information">
          <Paragraph>
            We use your information to:
          </Paragraph>
          <BulletPoint>Provide personalized mental health support and recommendations</BulletPoint>
          <BulletPoint>Track your wellness progress and mood patterns</BulletPoint>
          <BulletPoint>Connect you with licensed therapists and support groups</BulletPoint>
          <BulletPoint>Send appointment reminders and wellness notifications</BulletPoint>
          <BulletPoint>Improve our services and develop new features</BulletPoint>
          <BulletPoint>Ensure platform security and prevent fraud</BulletPoint>
          <BulletPoint>Comply with legal obligations and protect user safety</BulletPoint>
          <BulletPoint>Provide customer support and respond to inquiries</BulletPoint>
        </Section>

        {/* Data Sharing and Disclosure */}
        <Section title="3. Data Sharing and Disclosure">
          <Text style={styles.subsectionTitle}>3.1 With Your Consent</Text>
          <Paragraph>
            We may share your information with:
          </Paragraph>
          <BulletPoint>Licensed therapists you choose to work with</BulletPoint>
          <BulletPoint>Support groups you join (limited profile information)</BulletPoint>
          <BulletPoint>Emergency contacts in crisis situations</BulletPoint>

          <Text style={styles.subsectionTitle}>3.2 Service Providers</Text>
          <Paragraph>
            We work with trusted third-party service providers who help us operate our platform, 
            including cloud hosting, analytics, and payment processing. These providers are bound 
            by confidentiality agreements.
          </Paragraph>

          <Text style={styles.subsectionTitle}>3.3 Legal Requirements</Text>
          <Paragraph>
            We may disclose your information if required by law or to:
          </Paragraph>
          <BulletPoint>Comply with legal processes or government requests</BulletPoint>
          <BulletPoint>Protect our rights, property, or safety</BulletPoint>
          <BulletPoint>Prevent harm or illegal activities</BulletPoint>
          <BulletPoint>Respond to emergencies involving imminent danger</BulletPoint>
        </Section>

        {/* Data Security */}
        <Section title="4. Data Security">
          <Paragraph>
            We implement industry-standard security measures to protect your information:
          </Paragraph>
          <BulletPoint>End-to-end encryption for sensitive health data</BulletPoint>
          <BulletPoint>Secure data transmission using SSL/TLS protocols</BulletPoint>
          <BulletPoint>Regular security audits and vulnerability assessments</BulletPoint>
          <BulletPoint>Access controls and authentication requirements</BulletPoint>
          <BulletPoint>Secure cloud storage with backup systems</BulletPoint>
          <Paragraph>
            However, no method of transmission over the internet is 100% secure. While we strive to 
            protect your information, we cannot guarantee absolute security.
          </Paragraph>
        </Section>

        {/* Your Privacy Rights */}
        <Section title="5. Your Privacy Rights">
          <Paragraph>
            You have the right to:
          </Paragraph>
          <BulletPoint>Access your personal information and health data</BulletPoint>
          <BulletPoint>Correct inaccurate or incomplete information</BulletPoint>
          <BulletPoint>Delete your account and associated data</BulletPoint>
          <BulletPoint>Export your data in a portable format</BulletPoint>
          <BulletPoint>Opt-out of marketing communications</BulletPoint>
          <BulletPoint>Restrict certain data processing activities</BulletPoint>
          <BulletPoint>Object to automated decision-making</BulletPoint>
          <Paragraph>
            To exercise these rights, contact us at privacy@innersparkafrica.com
          </Paragraph>
        </Section>

        {/* Data Retention */}
        <Section title="6. Data Retention">
          <Paragraph>
            We retain your information for as long as your account is active or as needed to provide 
            services. After account deletion, we may retain certain information for:
          </Paragraph>
          <BulletPoint>Legal compliance and record-keeping (up to 7 years)</BulletPoint>
          <BulletPoint>Dispute resolution and fraud prevention</BulletPoint>
          <BulletPoint>Anonymized analytics and research (de-identified data)</BulletPoint>
          <Paragraph>
            You can request complete data deletion by contacting our support team.
          </Paragraph>
        </Section>

        {/* Children's Privacy */}
        <Section title="7. Children's Privacy">
          <Paragraph>
            Innerspark is not intended for users under 18 years of age. We do not knowingly collect 
            information from children. If you believe a child has provided us with personal information, 
            please contact us immediately, and we will delete such information.
          </Paragraph>
        </Section>

        {/* International Data Transfers */}
        <Section title="8. International Data Transfers">
          <Paragraph>
            Your information may be transferred to and processed in countries other than your country 
            of residence. We ensure appropriate safeguards are in place to protect your data in 
            accordance with this Privacy Policy and applicable laws.
          </Paragraph>
        </Section>

        {/* Third-Party Links */}
        <Section title="9. Third-Party Links">
          <Paragraph>
            Our app may contain links to third-party websites or services. We are not responsible for 
            the privacy practices of these external sites. We encourage you to review their privacy 
            policies before providing any information.
          </Paragraph>
        </Section>

        {/* Changes to Privacy Policy */}
        <Section title="10. Changes to This Privacy Policy">
          <Paragraph>
            We may update this Privacy Policy from time to time. We will notify you of significant 
            changes via email or in-app notification. Your continued use of Innerspark after changes 
            constitutes acceptance of the updated policy.
          </Paragraph>
        </Section>

        {/* Contact Us */}
        <Section title="11. Contact Us">
          <Paragraph>
            If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
          </Paragraph>
          <View style={styles.contactBox}>
            <View style={styles.contactRow}>
              <Icon name="email" type="material" color={appColors.AppBlue} size={20} />
              <Text style={styles.contactText}>privacy@innersparkafrica.com</Text>
            </View>
            <View style={styles.contactRow}>
              <Icon name="language" type="material" color={appColors.AppBlue} size={20} />
              <Text style={styles.contactText}>www.innersparkafrica.com</Text>
            </View>
            <View style={styles.contactRow}>
              <Icon name="location-on" type="material" color={appColors.AppBlue} size={20} />
              <Text style={styles.contactText}>Innerspark Africa{'\n'}Kigali, Rwanda</Text>
            </View>
          </View>
        </Section>

        {/* Footer */}
        <View style={styles.footer}>
          <Icon name="verified-user" type="material" color={appColors.grey4} size={16} />
          <Text style={styles.footerText}>
            Your privacy and security are our top priorities
          </Text>
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
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: appColors.CardBackground,
    marginHorizontal: -20,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginTop: 16,
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
  },
  section: {
    marginBottom: 24,
    backgroundColor: appColors.CardBackground,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 12,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginTop: 12,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 15,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    lineHeight: 24,
    marginBottom: 12,
  },
  bulletContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 8,
  },
  bullet: {
    fontSize: 15,
    color: appColors.AppBlue,
    marginRight: 8,
    fontWeight: 'bold',
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    lineHeight: 22,
  },
  contactBox: {
    backgroundColor: appColors.AppBlue + '10',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    marginLeft: 12,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    marginTop: 20,
  },
  footerText: {
    fontSize: 13,
    color: appColors.grey4,
    fontFamily: appFonts.headerTextRegular,
    marginLeft: 8,
    fontStyle: 'italic',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default PrivacyPolicyScreen;
