import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { appColors } from '../../global/Styles';
import { receiptTestData, appImages } from '../../global/Data';

const EReceiptCard = ({ data = receiptTestData }) => {

    // a qr code image generated from the receipt id will be created here

  return (
    <ScrollView style={styles.container}>
        {/*  let's style the qr code image and center it , and the container too*/}
        <View style={styles.qrCodeContainer}>
            <Image source={appImages.qrCodeImage} style={styles.qrCodeImage} />
        </View>

      {/* Store Info */}
      <View style={styles.laundromatInfo}>
        <Text style={styles.laundromatName}>{data.laundromatName}</Text>
        <Text style={styles.laundromatAddress}>{data.laundromatAddress}</Text>
      </View>

      {/* Receipt Details */}
      <View style={styles.receiptDetails}>

        {/* Customer Details */}
        {/* name and contact on the same row */}
        <View style={styles.customerDetails}>
            <View style={styles.receiptRow}>
                <Text style={styles.label}>Name: </Text>
                <Text style={styles.value}>{data.customerName}</Text>
            </View>
            <View style={styles.receiptRow}>
                <Text style={styles.label}>Contact: </Text>
                <Text style={styles.value}>{data.customerContact}</Text>
            </View>
        </View>

        {/* divider */}
        <View style={styles.divider}></View>

        <View style={styles.receiptRow}>
          <Text style={styles.label}>Receipt No:</Text>
          <Text style={styles.value}>{data.receiptNo}</Text>
        </View>
        <View style={styles.receiptRow}>
          <Text style={styles.label}>Pick Up Address:</Text>
          <Text style={styles.value}>{data.pickUpAddress}</Text>
        </View>
        <View style={styles.receiptRow}>
          <Text style={styles.label}>Pick Up Date & Time:</Text>
          <Text style={styles.value}>{data.pickUpDateTime}</Text>
        </View>
      </View>

      {/* Services */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Services</Text>
        {Object.keys(data.services).map((service, index) => (
          <View key={index} style={styles.serviceRow}>
            <Text style={styles.serviceTitle}>{service}</Text>
            <Text style={styles.servicePrice}>UGX {data.services[service]}</Text>
          </View>
        ))}
      </View>

      {/* Total */}
      <View style={styles.totalSection}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>UGX {data.total}</Text>
      </View>

      {/* Payment Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Info</Text>
        <View style={styles.receiptRow}>
          <Text style={styles.label}>Payment Method:</Text>
          <Text style={styles.value}>{data.paymentMethod}</Text>
        </View>
        <View style={styles.receiptRow}>
          <Text style={styles.label}>Amount Paid:</Text>
          <Text style={styles.value}>UGX {data.amountPaid}</Text>
        </View>
        <View style={styles.receiptRow}>
          <Text style={styles.label}>Balance:</Text>
          <Text style={styles.value}>UGX {data.balance}</Text>
        </View>
        <View style={styles.receiptRow}>
          <Text style={styles.label}>Transaction ID:</Text>
          <Text style={styles.value}>{data.transactionId}</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Received with thanks.</Text>
      </View>   

      {/* space */}
      <View style={{ height:30 }}></View>
     
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.CardBackground,
    padding: 16,
    borderRadius: 10,
  },

  qrCodeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  qrCodeImage: {
    width: 60,
    height: 60
  },

  header: {
    alignItems: 'center',
    marginBottom: 24
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: appColors.AppBlue
  },

  laundromatInfo: {
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },

  laundromatName: {
    fontSize: 20,
    fontWeight: '600',
    color: appColors.AppBlue,
    marginBottom: 4
  },

  laundromatAddress: {
    fontSize: 14,
    color: appColors.grey2
  },

  receiptDetails: {
    marginBottom: 24
  },

  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },

  customerDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },

  divider: {
    borderTopWidth: 1,
    borderColor: appColors.grey6,
    marginVertical: 5
  },

  label: {
    fontSize: 14,
    color: appColors.grey2
  },

  value: {
    fontSize: 14,
    fontWeight: '600',
    color: appColors.AppBlue
  },

  section: {
    marginBottom: 24
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.AppBlue,
    marginBottom: 12
  },

  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },

  serviceTitle: {
    fontSize: 14,
    color: appColors.grey2
  },

  servicePrice: {
    fontSize: 14,
    fontWeight: '600',
    color: appColors.AppBlue
  },

  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0'
  },

  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.AppBlue
  },

  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.AppBlue
  },

  footer: {
    alignItems: 'center'
  },

  footerText: {
    fontSize: 14,
    color: appColors.AppBlue
  }
});

export default EReceiptCard;