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
import { Icon } from '@rneui/themed';
import { appColors, appFonts } from '../../global/Styles';
import ISGenericHeader from '../../components/ISGenericHeader';
import ISStatusBar from '../../components/ISStatusBar';

// Mock data - replace with actual API calls
const mockRequests = [
  {
    id: 1,
    clientName: 'John Doe',
    requestType: 'Chat Session',
    description: 'Seeking support for anxiety management',
    timestamp: '2 hours ago',
    urgency: 'medium',
    avatar: null,
  },
  {
    id: 2,
    clientName: 'Jane Smith',
    requestType: 'Support Group',
    description: 'Would like to join depression support group',
    timestamp: '5 hours ago',
    urgency: 'low',
    avatar: null,
  },
  {
    id: 3,
    clientName: 'Mike Johnson',
    requestType: 'Chat Session',
    description: 'Urgent: Experiencing panic attacks',
    timestamp: '30 minutes ago',
    urgency: 'high',
    avatar: null,
  },
];

const THRequestsScreen = ({ navigation }: any) => {
  const [requests, setRequests] = useState(mockRequests);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return '#F44336';
      case 'medium':
        return '#FF9800';
      case 'low':
        return appColors.AppGreen;
      default:
        return appColors.grey3;
    }
  };

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'Urgent';
      case 'medium':
        return 'Medium';
      case 'low':
        return 'Low';
      default:
        return 'Normal';
    }
  };

  const handleAcceptRequest = (requestId: number) => {
    Alert.alert(
      'Accept Request',
      'Are you sure you want to accept this client request?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Accept',
          onPress: () => {
            // TODO: API call to accept request
            setRequests(requests.filter((r) => r.id !== requestId));
            Alert.alert('Success', 'Request accepted! You can now chat with the client.');
          },
        },
      ]
    );
  };

  const handleDeclineRequest = (requestId: number) => {
    Alert.alert(
      'Decline Request',
      'Are you sure you want to decline this request?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: () => {
            // TODO: API call to decline request
            setRequests(requests.filter((r) => r.id !== requestId));
          },
        },
      ]
    );
  };

  const RequestCard = ({ request }: any) => (
    <View style={styles.requestCard}>
      {/* Urgency Badge */}
      <View
        style={[
          styles.urgencyBadge,
          { backgroundColor: getUrgencyColor(request.urgency) + '15' },
        ]}
      >
        <Text
          style={[
            styles.urgencyText,
            { color: getUrgencyColor(request.urgency) },
          ]}
        >
          {getUrgencyLabel(request.urgency)}
        </Text>
      </View>

      {/* Client Info */}
      <View style={styles.clientInfo}>
        <View style={styles.avatarContainer}>
          <Icon
            type="material"
            name="person"
            color={appColors.CardBackground}
            size={32}
          />
        </View>
        <View style={styles.clientDetails}>
          <Text style={styles.clientName}>{request.clientName}</Text>
          <Text style={styles.requestType}>{request.requestType}</Text>
        </View>
      </View>

      {/* Request Description */}
      <Text style={styles.description}>{request.description}</Text>

      {/* Timestamp */}
      <View style={styles.timestampContainer}>
        <Icon
          type="material"
          name="access-time"
          color={appColors.grey3}
          size={16}
        />
        <Text style={styles.timestamp}>{request.timestamp}</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.declineButton]}
          onPress={() => handleDeclineRequest(request.id)}
          activeOpacity={0.7}
        >
          <Icon
            type="material"
            name="close"
            color="#F44336"
            size={20}
          />
          <Text style={styles.declineButtonText}>Decline</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.acceptButton]}
          onPress={() => handleAcceptRequest(request.id)}
          activeOpacity={0.7}
        >
          <Icon
            type="material"
            name="check"
            color={appColors.CardBackground}
            size={20}
          />
          <Text style={styles.acceptButtonText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ISStatusBar />
      
      <ISGenericHeader
        title="Client Requests"
        navigation={navigation}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Icon
            type="material"
            name="info"
            color={appColors.AppBlue}
            size={24}
            containerStyle={styles.infoIcon}
          />
          <Text style={styles.infoText}>
            These are clients requesting chat sessions or support group access.
            Accept requests to start helping them.
          </Text>
        </View>

        {/* Requests List */}
        {requests.length > 0 ? (
          requests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Icon
              type="material"
              name="inbox"
              color={appColors.grey4}
              size={80}
            />
            <Text style={styles.emptyStateTitle}>No Pending Requests</Text>
            <Text style={styles.emptyStateText}>
              You're all caught up! New client requests will appear here.
            </Text>
          </View>
        )}
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
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: appColors.AppBlue + '10',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: appColors.AppBlue,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
    lineHeight: 20,
  },
  requestCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  urgencyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 15,
  },
  urgencyText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: appFonts.headerTextSemiBold,
  },
  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: appColors.AppBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  clientDetails: {
    flex: 1,
  },
  clientName: {
    fontSize: 18,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextSemiBold,
    marginBottom: 4,
  },
  requestType: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
  },
  description: {
    fontSize: 15,
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
    lineHeight: 22,
    marginBottom: 12,
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  timestamp: {
    fontSize: 13,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    marginLeft: 6,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  declineButton: {
    backgroundColor: '#F4433615',
    borderWidth: 1,
    borderColor: '#F44336',
  },
  acceptButton: {
    backgroundColor: appColors.AppGreen,
  },
  declineButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F44336',
    fontFamily: appFonts.headerTextSemiBold,
  },
  acceptButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextSemiBold,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.grey2,
    fontFamily: appFonts.headerTextBold,
    marginTop: 20,
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 15,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 22,
  },
});

export default THRequestsScreen;
