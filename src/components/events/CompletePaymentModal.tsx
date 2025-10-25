import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from '@rneui/base';
import { appColors, appFonts } from '../../global/Styles';

export type PaymentMethodKey = 'wellnessvault' | 'mobile_money';

interface CompletePaymentModalProps {
  visible: boolean;
  title?: string;
  eventTitle: string;
  eventDateTime: string;
  currency: string;
  amount: number;
  selectedPaymentMethod: PaymentMethodKey;
  onSelectPaymentMethod: (method: PaymentMethodKey) => void;
  onClose: () => void;
  onConfirm: () => void;
}

const CompletePaymentModal: React.FC<CompletePaymentModalProps> = ({
  visible,
  title = 'Complete Payment',
  eventTitle,
  eventDateTime,
  currency,
  amount,
  selectedPaymentMethod,
  onSelectPaymentMethod,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
              <Icon name="close" type="material" color={appColors.grey2} size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.eventSummary}>
            <Text style={styles.eventSummaryTitle}>{eventTitle}</Text>
            <Text style={styles.eventSummaryDate}>{eventDateTime}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.totalLabel}>Total Amount:</Text>
              <Text style={styles.totalAmount}>
                {currency} {amount.toLocaleString()}
              </Text>
            </View>
          </View>

          <View style={styles.paymentMethodsSection}>
            <Text style={styles.sectionTitle}>Payment Method</Text>

            <TouchableOpacity
              style={[
                styles.paymentMethodOption,
                selectedPaymentMethod === 'wellnessvault' && styles.selectedPaymentMethod,
              ]}
              onPress={() => onSelectPaymentMethod('wellnessvault')}
            >
              <View style={styles.paymentMethodInfo}>
                <Icon name="account-balance-wallet" type="material" color={appColors.AppBlue} size={24} />
                <View style={styles.paymentMethodDetails}>
                  <Text style={styles.paymentMethodName}>WellnessVault</Text>
                  <Text style={styles.paymentMethodBalance}>UGX 350,000 available</Text>
                </View>
              </View>
              <View
                style={[
                  styles.radioButton,
                  selectedPaymentMethod === 'wellnessvault' && styles.radioButtonSelected,
                ]}
              >
                {selectedPaymentMethod === 'wellnessvault' && <View style={styles.radioButtonInner} />}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentMethodOption,
                selectedPaymentMethod === 'mobile_money' && styles.selectedPaymentMethod,
              ]}
              onPress={() => onSelectPaymentMethod('mobile_money')}
            >
              <View style={styles.paymentMethodInfo}>
                <Icon name="phone-android" type="material" color={appColors.AppBlue} size={24} />
                <View style={styles.paymentMethodDetails}>
                  <Text style={styles.paymentMethodName}>Mobile Money</Text>
                  <Text style={styles.paymentMethodBalance}>MTN, Airtel Money</Text>
                </View>
              </View>
              <View
                style={[
                  styles.radioButton,
                  selectedPaymentMethod === 'mobile_money' && styles.radioButtonSelected,
                ]}
              >
                {selectedPaymentMethod === 'mobile_money' && <View style={styles.radioButtonInner} />}
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.payButton} onPress={onConfirm}>
              <Text style={styles.payButtonText}>Pay {currency} {amount.toLocaleString()}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: appColors.CardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  modalCloseButton: {
    padding: 4,
  },
  eventSummary: {
    backgroundColor: appColors.AppLightGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  eventSummaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 4,
  },
  eventSummaryDate: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
  },
  paymentMethodsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 16,
  },
  paymentMethodOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: appColors.grey5,
    marginBottom: 12,
  },
  selectedPaymentMethod: {
    borderColor: appColors.AppBlue,
    backgroundColor: appColors.AppBlue + '10',
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodDetails: {
    marginLeft: 12,
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  paymentMethodBalance: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginTop: 2,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: appColors.grey4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: appColors.AppBlue,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: appColors.AppBlue,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: appColors.grey4,
    borderRadius: 25,
    paddingVertical: 14,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: appColors.grey2,
    fontWeight: '600',
    fontFamily: appFonts.headerTextBold,
  },
  payButton: {
    flex: 2,
    backgroundColor: appColors.AppBlue,
    borderRadius: 25,
    paddingVertical: 14,
    marginLeft: 8,
    alignItems: 'center',
  },
  payButtonText: {
    fontSize: 16,
    color: appColors.CardBackground,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
});

export default CompletePaymentModal;
