/**
 * MembershipLimitModal - Beautiful modal shown when user reaches group limit
 * Instructs user to leave an existing group when configured LIMIT is reached.
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
import { GLOBAL_MEMBERSHIP_LIMIT } from '../services/MembershipService';

interface MembershipLimitModalProps {
  visible: boolean;
  currentGroupCount: number;
  maxAllowed: number;
  onClose: () => void;
}

const MembershipLimitModal: React.FC<MembershipLimitModalProps> = ({
  visible,
  currentGroupCount,
  maxAllowed,
  onClose,
}) => {
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
              You have reached the maximum allowed limit of {GLOBAL_MEMBERSHIP_LIMIT} group(s). Please leave an existing group before joining a new one.
            </Text>

            {/* Current Status */}
            <View style={styles.statusCard}>
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Groups Joined</Text>
                <Text style={styles.statusValueHighlight}>
                  {currentGroupCount}/{maxAllowed}
                </Text>
              </View>
            </View>

            {/* CTA Buttons */}
            <TouchableOpacity
              style={styles.upgradeButton}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.upgradeButtonText}>
                Understood
              </Text>
            </TouchableOpacity>

            {/* Additional Info */}
            <Text style={styles.footerText}>
              Navigate to 'My Groups' to manage your active group memberships.
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
