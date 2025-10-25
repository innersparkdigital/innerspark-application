/**
 * MembershipLimitModal - Beautiful modal shown when user reaches group limit
 * Encourages upgrade with clear benefits and CTA
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Icon } from '@rneui/base';
import { appColors, appFonts } from '../global/Styles';
import { MembershipPlan, getPlanDisplayName, getUpgradeBenefits, getNextUpgradePlan } from '../services/MembershipService';

interface MembershipLimitModalProps {
  visible: boolean;
  currentPlan: MembershipPlan;
  currentGroupCount: number;
  maxAllowed: number;
  onUpgrade: () => void;
  onClose: () => void;
}

const MembershipLimitModal: React.FC<MembershipLimitModalProps> = ({
  visible,
  currentPlan,
  currentGroupCount,
  maxAllowed,
  onUpgrade,
  onClose,
}) => {
  const nextPlan = getNextUpgradePlan(currentPlan);
  const benefits = getUpgradeBenefits(currentPlan);
  const nextPlanName = nextPlan ? getPlanDisplayName(nextPlan) : '';

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Close Button */}
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
          >
            <Icon name="close" type="material" color={appColors.grey2} size={24} />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Icon */}
            <View style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <Icon 
                  name="lock" 
                  type="material" 
                  color={appColors.AppBlue} 
                  size={48} 
                />
              </View>
            </View>

            {/* Title */}
            <Text style={styles.title}>Group Limit Reached</Text>
            
            {/* Subtitle */}
            <Text style={styles.subtitle}>
              You've reached the maximum number of support groups for your current plan
            </Text>

            {/* Current Status */}
            <View style={styles.statusCard}>
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Current Plan</Text>
                <Text style={styles.statusValue}>{getPlanDisplayName(currentPlan)}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Groups Joined</Text>
                <Text style={styles.statusValueHighlight}>
                  {currentGroupCount}/{maxAllowed}
                </Text>
              </View>
            </View>

            {/* Upgrade Benefits */}
            {nextPlan && (
              <>
                <Text style={styles.benefitsTitle}>
                  Upgrade to {nextPlanName} and get:
                </Text>
                
                <View style={styles.benefitsList}>
                  {benefits.map((benefit, index) => (
                    <View key={index} style={styles.benefitItem}>
                      <Icon 
                        name="check-circle" 
                        type="material" 
                        color="#4CAF50" 
                        size={20} 
                      />
                      <Text style={styles.benefitText}>{benefit}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}

            {/* CTA Buttons */}
            <TouchableOpacity 
              style={styles.upgradeButton}
              onPress={onUpgrade}
              activeOpacity={0.8}
            >
              <Icon 
                name="arrow-upward" 
                type="material" 
                color={appColors.CardBackground} 
                size={20} 
              />
              <Text style={styles.upgradeButtonText}>
                Upgrade to {nextPlanName}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.laterButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.laterButtonText}>Maybe Later</Text>
            </TouchableOpacity>

            {/* Additional Info */}
            <Text style={styles.footerText}>
              You can manage your subscription anytime in Settings
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    padding: 4,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: appColors.AppBlue + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  statusCard: {
    backgroundColor: appColors.AppLightGray,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextSemiBold,
  },
  statusValueHighlight: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
  },
  divider: {
    height: 1,
    backgroundColor: appColors.grey5,
    marginVertical: 12,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextSemiBold,
    marginBottom: 16,
  },
  benefitsList: {
    marginBottom: 24,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 14,
    color: appColors.grey1,
    fontFamily: appFonts.headerTextRegular,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  upgradeButton: {
    flexDirection: 'row',
    backgroundColor: appColors.AppBlue,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    elevation: 4,
    shadowColor: appColors.AppBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  upgradeButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
    marginLeft: 8,
  },
  laterButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  laterButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: appColors.grey2,
    fontFamily: appFonts.headerTextSemiBold,
  },
  footerText: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default MembershipLimitModal;
