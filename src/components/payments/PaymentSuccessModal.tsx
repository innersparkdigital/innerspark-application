import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from '@rneui/base';
import { appColors, appFonts } from '../../global/Styles';

interface PaymentSuccessModalProps {
  visible: boolean;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  onClose: () => void;
}

const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({
  visible,
  title = 'Payment Successful',
  subtitle = 'Your payment was processed successfully.',
  buttonText = 'Close',
  onClose,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { alignItems: 'center' }] }>
          <View style={styles.successCheckCircle}>
            <Icon name="check" type="material" color={appColors.CardBackground} size={36} />
          </View>
          <Text style={styles.successTitle}>{title}</Text>
          <Text style={styles.successSubtitle}>{subtitle}</Text>

          <TouchableOpacity style={styles.successButton} onPress={onClose}>
            <Text style={styles.successButtonText}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: appColors.CardBackground, borderRadius: 16, paddingVertical: 24, paddingHorizontal: 20, width: '85%' },
  successCheckCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#4CAF50', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  successTitle: { fontSize: 20, fontWeight: 'bold', color: appColors.grey1, fontFamily: appFonts.headerTextBold },
  successSubtitle: { fontSize: 14, color: appColors.grey2, marginTop: 8, marginBottom: 16, textAlign: 'center', fontFamily: appFonts.headerTextRegular },
  successButton: { backgroundColor: appColors.AppBlue, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 20, alignSelf: 'stretch', marginTop: 4 },
  successButtonText: { color: appColors.CardBackground, textAlign: 'center', fontSize: 16, fontFamily: appFonts.headerTextBold },
});

export default PaymentSuccessModal;
