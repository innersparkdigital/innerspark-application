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
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Icon, Button } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';
import { useSelector } from 'react-redux';
import { getTherapists } from '../../api/client/therapists';
import { getImageSource, FALLBACK_IMAGES } from '../../utils/imageHelpers';

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
      Alert.alert('Message too long', 'Please keep your message under 1000 characters.');
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
      Alert.alert(
        'Failed to open conversation',
        'Please check your connection and try again.',
        [
          { text: 'OK' },
          { text: 'Retry', onPress: handleSendMessage },
        ]
      );
    }
  };

  const getAvatarInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
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
            size={50}
            rounded
          />
        ) : (
          <Avatar
            title={getAvatarInitials(item.name)}
            size={50}
            rounded
            backgroundColor={item.type === 'therapist' ? appColors.AppBlue : appColors.grey3}
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
        <Icon name="check-circle" type="material" color={appColors.AppBlue} size={24} />
      )}
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="person-search" type="material" color={appColors.grey3} size={80} />
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
          <Icon name="arrow-back" type="material" color={appColors.CardBackground} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Message</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Icon name="search" type="material" color={appColors.grey3} size={20} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search contacts..."
          placeholderTextColor={appColors.grey3}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="clear" type="material" color={appColors.grey3} size={20} />
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
              <Icon name="close" type="material" color={appColors.grey3} size={16} />
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
    paddingBottom: 15,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
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
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: appColors.grey1,
    fontFamily: appFonts.regularText,
    marginLeft: 12,
  },
  selectedContactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.CardBackground,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  selectedContactLabel: {
    fontSize: 16,
    color: appColors.grey2,
    fontFamily: appFonts.regularText,
    marginRight: 12,
  },
  selectedContactChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.AppBlue + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  selectedContactName: {
    fontSize: 14,
    color: appColors.AppBlue,
    fontFamily: appFonts.regularText,
    marginRight: 8,
  },
  contactsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey2,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.CardBackground,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedContactItem: {
    borderColor: appColors.AppBlue,
    borderWidth: 2,
  },
  contactAvatar: {
    position: 'relative',
    marginRight: 12,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: appColors.CardBackground,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.CardBackground,
  },
  contactInfo: {
    flex: 1,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    flex: 1,
  },
  therapistBadge: {
    backgroundColor: appColors.AppBlue,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  therapistBadgeText: {
    fontSize: 10,
    color: appColors.CardBackground,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
  contactEmail: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.regularText,
    marginBottom: 2,
  },
  contactSpecialty: {
    fontSize: 12,
    color: appColors.AppBlue,
    fontFamily: appFonts.regularText,
    marginBottom: 2,
  },
  lastSeen: {
    fontSize: 12,
    color: appColors.grey4,
    fontFamily: appFonts.regularText,
  },
  emptyContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey2,
    marginTop: 20,
    marginBottom: 8,
    fontFamily: appFonts.headerTextBold,
  },
  emptySubtitle: {
    fontSize: 14,
    color: appColors.grey3,
    textAlign: 'center',
    fontFamily: appFonts.regularText,
  },
  messageContainer: {
    backgroundColor: appColors.CardBackground,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  messageLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 8,
  },
  messageInputContainer: {
    borderWidth: 1,
    borderColor: appColors.grey5,
    borderRadius: 12,
    marginBottom: 12,
  },
  messageInput: {
    fontSize: 16,
    color: appColors.grey1,
    fontFamily: appFonts.regularText,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 100,
    maxHeight: 150,
  },
  characterCount: {
    fontSize: 12,
    color: appColors.grey3,
    textAlign: 'right',
    paddingHorizontal: 16,
    paddingBottom: 8,
    fontFamily: appFonts.regularText,
  },
  sendButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: 25,
    paddingVertical: 12,
  },
  sendButtonDisabled: {
    backgroundColor: appColors.grey4,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
});

export default NewMessageScreen;
