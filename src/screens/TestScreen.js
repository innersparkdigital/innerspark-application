/**
 * Test Screen
 * @format
 */
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {  
    StyleSheet, 
    Text, 
    View,
    Image,
    TouchableOpacity, 
    TextInput, 
    FlatList, 
    SafeAreaView,
    ImageBackground,
    ScrollView 
  
} from "react-native";
import { appColors, parameters } from "../global/Styles";
import { appImages } from "../global/Data";
import { Icon, Button } from "@rneui/themed";
import LHGenericHeader from "../components/LHGenericHeader";



export default function TestScreen({navigation}) {


      const steps = [
        {
          title: 'Booking Confirmed',
          time: '10:00AM',
          date: 'Aug 08, 2024',
          completed: true,
          icon: 'check-circle',
          iconType: 'material-community'
        },
        {
          title: 'Order Pick Up',
          time: '12:00PM',
          date: 'Aug 08, 2024',
          completed: true,
          icon: 'arrow-down-circle',
          iconType: 'material-community'
        },
        {
          title: 'Cleaning In Progress',
          time: '15:00PM',
          date: 'Aug 08, 2024',
          completed: false,
          icon: 'refresh',
          iconType: 'material-community'
        },
        {
          title: 'Ready For Drop Off',
          time: '10:00AM',
          date: 'Aug 08, 2024',
          completed: false,
          icon: 'arrow-down-circle',
          iconType: 'material-community'
        },
        {
          title: 'Order Shipped',
          time: '10:00AM',
          date: 'Aug 08, 2024',
          completed: false,
          icon: 'truck',
          iconType: 'material-community'
        },
        {
          title: 'Order Delivered',
          time: '10:00AM',
          date: 'Aug 08, 2024',
          completed: false,
          icon: 'check-circle',
          iconType: 'material-community'
        }
      ];

  return (
    <SafeAreaView style={styles.container}>
       <ImageBackground source={appImages.laundryBg} style={{ flex: 1, }}>


        
          <ScrollView style={styles.scrollView}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Icon name="chevron-left" type="material-community" color="#0066cc" size={32} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Track Order</Text>
            </View>

            {/* Store Info */}
            <View style={styles.storeInfo}>
              <Text style={styles.storeName}>Fast Boots & Dry Cleaning</Text>
              <Text style={styles.storeAddress}>7th Floor, Shop 8. Rumee Building.</Text>
            </View>

            {/* Timeline */}
            <View style={styles.timeline}>
              {steps.map((step, index) => (
                <View key={index} style={styles.timelineItem}>
                  {/* Connector Line */}
                  {index !== 0 && (
                    <View
                      style={[
                        styles.connector,
                        {
                          backgroundColor: step.completed ? '#0066cc' : '#E0E0E0'
                        }
                      ]}
                    />
                  )}

                  {/* Step Circle */}
                  <View
                    style={[
                      styles.circle,
                      {
                        backgroundColor: step.completed ? '#0066cc' : '#FFFFFF',
                        borderColor: step.completed ? '#0066cc' : '#E0E0E0'
                      }
                    ]}
                  >
                    <Icon
                      name={step.icon}
                      type={step.iconType}
                      color={step.completed ? '#FFFFFF' : '#E0E0E0'}
                      size={16}
                    />
                  </View>

                  {/* Step Content */}
                  <View style={styles.stepContent}>
                    <Text
                      style={[
                        styles.stepTitle,
                        { color: step.completed ? '#0066cc' : '#A0A0A0' }
                      ]}
                    >
                      {step.title}
                    </Text>
                    <Text style={styles.stepTime}>
                      Pick Up Date & Time | {step.date} | {step.time}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* E-Receipt Button */}
            <TouchableOpacity style={styles.receiptButton}>
              <Text style={styles.receiptButtonText}>VIEW E-RECEIPT</Text>
            </TouchableOpacity>
          </ScrollView>
      

      

        </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: appColors.CardBackground,
  },

  scrollView: {
    flex: 1,
    padding: 16
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24
  },
  backButton: {
    padding: 4
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0066cc',
    marginLeft: 8
  },
  storeInfo: {
    marginBottom: 32
  },
  storeName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0066cc',
    marginBottom: 8
  },
  storeAddress: {
    fontSize: 16,
    color: '#666666'
  },
  timeline: {
    flex: 1,
    marginLeft: 16
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 24,
    position: 'relative'
  },
  connector: {
    position: 'absolute',
    left: 12,
    top: -24,
    width: 2,
    height: 48,
    backgroundColor: '#E0E0E0'
  },
  circle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16
  },
  stepContent: {
    flex: 1
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4
  },
  stepTime: {
    fontSize: 14,
    color: '#666666'
  },
  receiptButton: {
    backgroundColor: '#0066cc',
    borderRadius: 25,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16
  },
  receiptButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  }

  
});








