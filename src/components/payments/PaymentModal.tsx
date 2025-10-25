import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator, Platform } from 'react-native';
import { Icon } from '@rneui/base';
import { appColors, appFonts } from '../../global/Styles';
import LHPhoneInput from '../../components/forms/LHPhoneInput';

export type PaymentMethodKey = 'wellnessvault' | 'mobile_money';
export type MmStep = 'phone' | 'otp' | 'processing';

export interface PaymentModalProps {
  visible: boolean;
  title?: string;
  summaryTitle: string;
  summarySubtitle?: string;
  currency: string;
  amount: number;
  availableMethods?: PaymentMethodKey[];
  selectedPaymentMethod: PaymentMethodKey;
  onSelectPaymentMethod: (method: PaymentMethodKey) => void;
  isProcessing: boolean;
  disableClose?: boolean;
  onRequestClose: () => void;
  onConfirm: () => void;
  onCancel: () => void;
  mmStep: MmStep;
  mmPhone: string;
  mmFormattedPhone?: string;
  mmOtp: string;
  mmError?: string;
  mmOtpAttempts?: number;
  mmOtpExpiry?: number | null;
  onChangeMmPhone: (v: string) => void;
  onChangeMmFormattedPhone?: (v: string) => void;
  onChangeMmCountrySupport?: (supported: boolean) => void;
  onChangeMmOtp: (v: string) => void;
  onChangeMmStep: (s: MmStep) => void;
  onResendOtp: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  visible,
  title = 'Complete Payment',
  summaryTitle,
  summarySubtitle,
  currency,
  amount,
  availableMethods = ['wellnessvault', 'mobile_money'],
  selectedPaymentMethod,
  onSelectPaymentMethod,
  isProcessing,
  disableClose,
  onRequestClose,
  onConfirm,
  onCancel,
  mmStep,
  mmPhone,
  mmOtp,
  mmError,
  mmOtpAttempts = 0,
  mmOtpExpiry,
  onChangeMmPhone,
  onChangeMmFormattedPhone,
  onChangeMmCountrySupport,
  onChangeMmOtp,
  onChangeMmStep,
  onResendOtp,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={() => {
        if (disableClose || isProcessing || (selectedPaymentMethod === 'mobile_money' && mmStep === 'processing')) return;
        onRequestClose();
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => {
                if (disableClose || isProcessing || (selectedPaymentMethod === 'mobile_money' && mmStep === 'processing')) return;
                onRequestClose();
              }}
            >
              <Icon name="close" type="material" color={appColors.grey2} size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>{summaryTitle}</Text>
            {!!summarySubtitle && <Text style={styles.summarySubtitle}>{summarySubtitle}</Text>}
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Total Amount:</Text>
              <Text style={styles.priceValue}>{currency} {amount.toLocaleString()}</Text>
            </View>
          </View>

          {isProcessing ? (
            <View style={styles.processingContainer}>
              <ActivityIndicator size="large" color={appColors.AppBlue} />
              <Text style={styles.processingText}>Processing payment...</Text>
            </View>
          ) : (
            <View>
              <Text style={styles.sectionTitle}>Payment Method</Text>

              {availableMethods.includes('wellnessvault') && (
                <TouchableOpacity
                  style={[styles.methodItem, selectedPaymentMethod === 'wellnessvault' && styles.methodSelected]}
                  onPress={() => onSelectPaymentMethod('wellnessvault')}
                  disabled={isProcessing || (selectedPaymentMethod === 'mobile_money' && mmStep !== 'phone')}
                >
                  <View style={styles.methodInfo}>
                    <Icon name="account-balance-wallet" type="material" color={appColors.AppBlue} size={24} />
                    <Text style={styles.methodName}>WellnessVault</Text>
                  </View>
                  <View style={[styles.radio, selectedPaymentMethod === 'wellnessvault' && styles.radioOn]}>
                    {selectedPaymentMethod === 'wellnessvault' && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
              )}

              {availableMethods.includes('mobile_money') && (
                <TouchableOpacity
                  style={[styles.methodItem, selectedPaymentMethod === 'mobile_money' && styles.methodSelected]}
                  onPress={() => onSelectPaymentMethod('mobile_money')}
                  disabled={isProcessing || (selectedPaymentMethod === 'mobile_money' && mmStep !== 'phone')}
                >
                  <View style={styles.methodInfo}>
                    <Icon name="phone-android" type="material" color={appColors.AppBlue} size={24} />
                    <Text style={styles.methodName}>Mobile Money</Text>
                  </View>
                  <View style={[styles.radio, selectedPaymentMethod === 'mobile_money' && styles.radioOn]}>
                    {selectedPaymentMethod === 'mobile_money' && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
              )}

              {selectedPaymentMethod === 'mobile_money' && mmStep === 'phone' && (
                <View style={styles.mmSection}>
                  <Text style={styles.mmLabel}>Mobile Money Number</Text>
                  <LHPhoneInput
                    inputValue={mmPhone}
                    inputValueSetter={onChangeMmPhone}
                    formattedValueSetter={onChangeMmFormattedPhone || (()=>{})}
                    countrySupportSetter={onChangeMmCountrySupport || (()=>{})}
                    onPickerPress={() => {}}
                  />
                  {!!mmError && <Text style={[styles.mmHelp, { color: '#F44336' }]}>{mmError}</Text>}
                  <Text style={styles.mmHelp}>Use the number linked to your mobile money account.</Text>
                </View>
              )}

              {selectedPaymentMethod === 'mobile_money' && mmStep === 'otp' && (
                <View style={styles.mmSection}>
                  <Text style={styles.mmLabel}>Enter OTP</Text>
                  <TextInput
                    style={styles.mmInput}
                    placeholder="6-digit code"
                    keyboardType="number-pad"
                    maxLength={6}
                    value={mmOtp}
                    onChangeText={onChangeMmOtp}
                    placeholderTextColor={appColors.grey3}
                  />
                  <View style={styles.mmRow}>
                    <Text style={styles.mmHelp}>We sent a code to {mmPhone || 'your number'}.</Text>
                    <TouchableOpacity onPress={onResendOtp}><Text style={styles.mmLink}>Resend</Text></TouchableOpacity>
                  </View>
                  {!!mmOtpExpiry && (
                    <Text style={[styles.mmHelp, { marginTop: 4 }]}>Code valid for approximately 2 minutes.</Text>
                  )}
                  {!!mmError && <Text style={[styles.mmHelp, { color: '#F44336' }]}>{mmError}</Text>}
                  {mmOtpAttempts > 0 && (
                    <Text style={[styles.mmHelp, { marginTop: 4 }]}>{`Attempts: ${mmOtpAttempts}/3`}</Text>
                  )}
                  <TouchableOpacity onPress={() => onChangeMmStep('phone')}>
                    <Text style={styles.mmChangeLink}>Change number</Text>
                  </TouchableOpacity>
                </View>
              )}

              {selectedPaymentMethod === 'mobile_money' && mmStep === 'processing' && (
                <View style={styles.mmSection}>
                  <View style={[styles.processingContainer, { paddingVertical: 12 }]}> 
                    <ActivityIndicator size="large" color={appColors.AppBlue} />
                    <Text style={[styles.processingText, { textAlign: 'center' }]}>Payment initiated, complete payment on your phone</Text>
                  </View>
                </View>
              )}
            </View>
          )}

          <View style={styles.actionsRow}>
            <TouchableOpacity
              disabled={isProcessing || (selectedPaymentMethod === 'mobile_money' && mmStep === 'processing')}
              style={[styles.cancelButton, (isProcessing || (selectedPaymentMethod === 'mobile_money' && mmStep === 'processing')) && { opacity: 0.6 }]}
              onPress={() => {
                if (isProcessing || (selectedPaymentMethod === 'mobile_money' && mmStep === 'processing')) return;
                onCancel();
              }}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={isProcessing}
              style={[styles.confirmButton, isProcessing && { opacity: 0.6 }]}
              onPress={onConfirm}
            >
              <Text style={styles.confirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: appColors.CardBackground, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingTop: 20, paddingHorizontal: 20, paddingBottom: 40, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: appColors.grey1, fontFamily: appFonts.headerTextBold },
  modalCloseButton: { padding: 4 },
  summary: { backgroundColor: appColors.AppLightGray, borderRadius: 12, padding: 16, marginBottom: 20 },
  summaryTitle: { fontSize: 16, fontWeight: 'bold', color: appColors.grey1, fontFamily: appFonts.headerTextBold, marginBottom: 4 },
  summarySubtitle: { fontSize: 14, color: appColors.grey3, fontFamily: appFonts.headerTextRegular, marginBottom: 12 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceLabel: { fontSize: 14, color: appColors.grey2, fontFamily: appFonts.headerTextRegular },
  priceValue: { fontSize: 18, fontWeight: 'bold', color: appColors.AppBlue, fontFamily: appFonts.headerTextBold },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: appColors.grey1, marginBottom: 12, fontFamily: appFonts.headerTextBold },
  methodItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: appColors.grey5, marginBottom: 12 },
  methodSelected: { borderColor: appColors.AppBlue, backgroundColor: appColors.AppBlue + '10' },
  methodInfo: { flexDirection: 'row', alignItems: 'center' },
  methodName: { marginLeft: 12, fontSize: 16, color: appColors.grey1, fontFamily: appFonts.headerTextMedium },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: appColors.AppBlue, alignItems: 'center', justifyContent: 'center' },
  radioOn: { borderColor: appColors.AppBlue },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: appColors.AppBlue },
  mmSection: { marginBottom: 16 },
  mmLabel: { fontSize: 14, color: appColors.grey1, fontFamily: appFonts.headerTextMedium, marginBottom: 8 },
  mmInput: { borderWidth: 1, borderColor: appColors.grey5, borderRadius: 10, paddingHorizontal: 12, paddingVertical: Platform.select({ ios: 12, android: 8 }), fontSize: 16, color: appColors.grey1 },
  mmHelp: { fontSize: 12, color: appColors.grey3, marginTop: 6, fontFamily: appFonts.headerTextRegular },
  mmRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  mmLink: { color: appColors.AppBlue, fontSize: 12, fontFamily: appFonts.headerTextMedium },
  mmChangeLink: { color: appColors.AppBlue, fontSize: 12, marginTop: 8, fontFamily: appFonts.headerTextMedium },
  processingContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 24 },
  processingText: { fontSize: 14, color: appColors.grey2, marginTop: 12, fontFamily: appFonts.headerTextRegular },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  cancelButton: { paddingVertical: 14, paddingHorizontal: 18, borderRadius: 10, backgroundColor: appColors.AppLightGray, flex: 1, marginRight: 10 },
  cancelText: { color: appColors.grey1, textAlign: 'center', fontSize: 15, fontFamily: appFonts.headerTextMedium },
  confirmButton: { paddingVertical: 14, paddingHorizontal: 18, borderRadius: 10, backgroundColor: appColors.AppBlue, flex: 1, marginLeft: 10 },
  confirmText: { color: appColors.CardBackground, textAlign: 'center', fontSize: 15, fontFamily: appFonts.headerTextBold },
});

export default PaymentModal;
