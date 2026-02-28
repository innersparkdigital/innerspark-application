/**
 * New Message Screen - Start a new conversation with users/therapists
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Icon, Button } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { scale, moderateScale } from '../../global/Scaling';
import { useToast } from 'native-base';
import { useSelector } from 'react-redux';
import { getTherapists } from '../../api/client/therapists';
import { getImageSource, FALLBACK_IMAGES } from '../../utils/imageHelpers';
import ISAlert, { useISAlert } from '../../components/alerts/ISAlert';

interface Contact {
  id: string;
  name: string;
  email: string;
  avatar?: any;
  type: 'therapist' | 'user';
  specialty?: string;
  isOnline: boolean;
  lastSeen?: string;
}

interface NewMessageScreenProps {
  navigation: any;
}

const NewMessageScreen: React.FC<NewMessageScreenProps> = ({ navigation }) => {
  const toast = useToast();
  const alert = useISAlert();
  const userId = useSelector((state: any) => state.userData.userDetails.userId);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messageText, setMessageText] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [searchQuery, contacts]);

  const loadContacts = async () => {
    setIsLoading(true);
    try {
      console.log('📞 Calling getTherapists API...');
      const response = await getTherapists({ search: searchQuery });
      console.log('✅ Therapists API Response:', JSON.stringify(response, null, 2));

      if (response.success && response.data?.therapists) {
        const apiTherapists = response.data.therapists;
        const mappedContacts: Contact[] = apiTherapists.map((therapist: any) => ({
          id: therapist.id?.toString() || therapist._id?.toString(),
          name: therapist.name || 'Unknown Therapist',
          email: therapist.email || '',
          avatar: getImageSource(therapist.image || therapist.avatar, FALLBACK_IMAGES.user),
          type: 'therapist' as const,
          specialty: therapist.specialty || therapist.specialization || '',
          isOnline: therapist.isOnline || therapist.is_online || false,
          lastSeen: therapist.lastSeen || therapist.last_seen,
        }));

        setContacts(mappedContacts);
        console.log('✅ Mapped Contacts:', mappedContacts.length);
      } else {
        console.log('ℹ️ No therapists found - empty state');
        setContacts([]);
      }
    } catch (error: any) {
      console.error('❌ Error loading therapists:', error);
      setContacts([]);
      toast.show({
        description: 'Failed to load therapists',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterContacts = () => {
    if (!searchQuery.trim()) {
      setFilteredContacts(contacts);
      return;
    }

    const filtered = contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contact.specialty && contact.specialty.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    setFilteredContacts(filtered);
  };

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
  };

  const handleSendMessage = async () => {
    if (!selectedContact || !messageText.trim() || isSending) return;

    if (messageText.length > 1000) {
      alert.show({
        type: 'warning',
        title: 'Message too long',
        message: 'Please keep your message under 1000 characters.',
      });
      return;
    }

    setIsSending(true);

    try {
      // TODO: Implement API call to start conversation/send first message
      // For now, just navigate to the thread screen
      setTimeout(() => {
        setIsSending(false);
        toast.show({
          description: `Opening conversation with ${selectedContact.name}`,
          duration: 2000,
        });

        navigation.replace('DMThreadScreen', {
          partnerId: selectedContact.id,
          partnerName: selectedContact.name,
          partnerAvatar: selectedContact.avatar,
          isOnline: selectedContact.isOnline,
          lastSeen: selectedContact.lastSeen,
        });
      }, 1000);
    } catch (error) {
      setIsSending(false);
      alert.show({
        type: 'error',
        title: 'Failed to open conversation',
        message: 'Please check your connection and try again.',
        confirmText: 'Retry',
        cancelText: 'OK',
        onConfirm: handleSendMessage,
      });
    }
  };

  const getAvatarInitials = (name: string) => {
    if (!name) return '??';
    return name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase();
  };

  const renderContactItem = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      style={[
        styles.contactItem,
        selectedContact?.id === item.id && styles.selectedContactItem
      ]}
      onPress={() => handleSelectContact(item)}
    >
      <View style={styles.contactAvatar}>
        {item.avatar ? (
          <Avatar
            source={item.avatar}
            size={scale(50)}
            rounded
          />
        ) : (
          <Avatar
            title={getAvatarInitials(item.name)}
            size={scale(50)}
            rounded
            containerStyle={{ backgroundColor: item.type === 'therapist' ? appColors.AppBlue : appColors.grey3 }}
            titleStyle={styles.avatarText}
          />
        )}
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </View>

      <View style={styles.contactInfo}>
        <View style={styles.contactHeader}>
          <Text style={styles.contactName}>{item.name}</Text>
          {item.type === 'therapist' && (
            <View style={styles.therapistBadge}>
              <Text style={styles.therapistBadgeText}>Therapist</Text>
            </View>
          )}
        </View>

        <Text style={styles.contactEmail}>{item.email}</Text>

        {item.specialty && (
          <Text style={styles.contactSpecialty}>{item.specialty}</Text>
        )}

        {!item.isOnline && item.lastSeen && (
          <Text style={styles.lastSeen}>Last seen {item.lastSeen}</Text>
        )}
      </View>

      {selectedContact?.id === item.id && (
        <Icon name="check-circle" type="material" color={appColors.AppBlue} size={moderateScale(24)} />
      )}
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="person-search" type="material" color={appColors.grey3} size={moderateScale(80)} />
      <Text style={styles.emptyTitle}>No contacts found</Text>
      <Text style={styles.emptySubtitle}>
        Try searching with a different name or email
      </Text>
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
        <Text style={styles.headerTitle}>New Message</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Icon name="search" type="material" color={appColors.grey3} size={moderateScale(20)} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search contacts..."
          placeholderTextColor={appColors.grey3}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="clear" type="material" color={appColors.grey3} size={moderateScale(20)} />
          </TouchableOpacity>
        )}
      </View>

      {/* Selected Contact */}
      {selectedContact && (
        <View style={styles.selectedContactContainer}>
          <Text style={styles.selectedContactLabel}>To:</Text>
          <View style={styles.selectedContactChip}>
            <Text style={styles.selectedContactName}>{selectedContact.name}</Text>
            <TouchableOpacity onPress={() => setSelectedContact(null)}>
              <Icon name="close" type="material" color={appColors.grey3} size={moderateScale(16)} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Contacts List */}
      <View style={styles.contactsContainer}>
        <Text style={styles.sectionTitle}>
          {searchQuery ? 'Search Results' : 'Available Contacts'}
        </Text>

        <FlatList
          data={filteredContacts}
          renderItem={renderContactItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={filteredContacts.length === 0 ? styles.emptyContainer : undefined}
        />
      </View>

      {/* Message Composer */}
      {selectedContact && (
        <View style={styles.messageContainer}>
          <Text style={styles.messageLabel}>Message:</Text>
          <View style={styles.messageInputContainer}>
            <TextInput
              style={styles.messageInput}
              placeholder={`Write a message to ${selectedContact.name}...`}
              placeholderTextColor={appColors.grey3}
              value={messageText}
              onChangeText={setMessageText}
              multiline
              maxLength={1000}
              textAlignVertical="top"
            />
            <Text style={styles.characterCount}>
              {messageText.length}/1000
            </Text>
          </View>

          <Button
            title={isSending ? 'Sending...' : 'Send Message'}
            buttonStyle={[
              styles.sendButton,
              (!messageText.trim() || isSending) && styles.sendButtonDisabled
            ]}
            titleStyle={styles.sendButtonText}
            onPress={handleSendMessage}
            disabled={!messageText.trim() || isSending}
            loading={isSending}
          />
        </View>
      )}
      <ISAlert ref={alert.ref} />
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
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
  },
  headerSpacer: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.CardBackground,
    marginHorizontal: scale(16),
    marginVertical: scale(12),
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    borderRadius: scale(25),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(1) },
    shadowOpacity: 0.1,
    shadowRadius: scale(2),
  },
  searchInput: {
    flex: 1,
    fontSize: moderateScale(16),
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextRegular,
    marginLeft: scale(12),
  },
  selectedContactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.CardBackground,
    marginHorizontal: scale(16),
    marginBottom: scale(12),
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    borderRadius: scale(12),
  },
  selectedContactLabel: {
    fontSize: moderateScale(16),
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
    marginRight: scale(12),
  },
  selectedContactChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.AppBlue + '20',
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderRadius: scale(20),
  },
  selectedContactName: {
    fontSize: moderateScale(14),
    color: appColors.AppBlue,
    fontFamily: appFonts.bodyTextRegular,
    marginRight: scale(8),
  },
  contactsContainer: {
    flex: 1,
    paddingHorizontal: scale(16),
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: appColors.grey2,
    fontFamily: appFonts.headerTextBold,
    marginBottom: scale(12),
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.CardBackground,
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    borderRadius: scale(12),
    marginBottom: scale(8),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(1) },
    shadowOpacity: 0.1,
    shadowRadius: scale(2),
  },
  selectedContactItem: {
    borderColor: appColors.AppBlue,
    borderWidth: scale(2),
  },
  contactAvatar: {
    position: 'relative',
    marginRight: scale(12),
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: scale(14),
    height: scale(14),
    borderRadius: scale(7),
    backgroundColor: '#4CAF50',
    borderWidth: scale(2),
    borderColor: appColors.CardBackground,
  },
  avatarText: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: appColors.CardBackground,
  },
  contactInfo: {
    flex: 1,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(4),
  },
  contactName: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    flex: 1,
  },
  therapistBadge: {
    backgroundColor: appColors.AppBlue,
    paddingHorizontal: scale(8),
    paddingVertical: scale(2),
    borderRadius: scale(10),
  },
  therapistBadgeText: {
    fontSize: moderateScale(10),
    color: appColors.CardBackground,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  contactEmail: {
    fontSize: moderateScale(14),
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    marginBottom: scale(2),
  },
  contactSpecialty: {
    fontSize: moderateScale(12),
    color: appColors.AppBlue,
    fontFamily: appFonts.bodyTextRegular,
    marginBottom: scale(2),
  },
  lastSeen: {
    fontSize: moderateScale(12),
    color: appColors.grey4,
    fontFamily: appFonts.bodyTextRegular,
  },
  emptyContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(40),
  },
  emptyTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: appColors.grey2,
    marginTop: scale(20),
    marginBottom: scale(8),
    fontFamily: appFonts.headerTextBold,
  },
  emptySubtitle: {
    fontSize: moderateScale(14),
    color: appColors.grey3,
    textAlign: 'center',
    fontFamily: appFonts.bodyTextRegular,
  },
  messageContainer: {
    backgroundColor: appColors.CardBackground,
    padding: scale(16),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(-2) },
    shadowOpacity: 0.1,
    shadowRadius: scale(4),
  },
  messageLabel: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: scale(8),
  },
  messageInputContainer: {
    borderWidth: scale(1),
    borderColor: appColors.grey5,
    borderRadius: scale(12),
    marginBottom: scale(12),
  },
  messageInput: {
    fontSize: moderateScale(16),
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextRegular,
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    minHeight: scale(100),
    maxHeight: scale(150),
  },
  characterCount: {
    fontSize: moderateScale(12),
    color: appColors.grey3,
    textAlign: 'right',
    paddingHorizontal: scale(16),
    paddingBottom: scale(8),
    fontFamily: appFonts.bodyTextRegular,
  },
  sendButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: scale(25),
    paddingVertical: scale(12),
  },
  sendButtonDisabled: {
    backgroundColor: appColors.grey4,
  },
  sendButtonText: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
});

export default NewMessageScreen;
