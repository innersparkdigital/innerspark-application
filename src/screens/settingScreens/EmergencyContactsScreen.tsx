/**
 * Emergency Contacts Screen - Manage emergency contacts for crisis situations
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button, Overlay } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';
import { NavigationProp } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import ISGenericHeader from '../../components/ISGenericHeader';
import { 
  getEmergencyContacts, 
  addEmergencyContact as addEmergencyContactAPI, 
  deleteEmergencyContact as deleteEmergencyContactAPI,
  getCrisisLines 
} from '../../api/client/emergency';
import { mockEmergencyContacts, mockCrisisLines } from '../../global/MockData';
import { isValidName, isValidPhoneNumber, isValidRelationship } from '../../global/LHValidators';
import {
  setEmergencyContacts as setEmergencyContactsRedux,
  addEmergencyContact as addEmergencyContactRedux,
  deleteEmergencyContact as deleteEmergencyContactRedux,
  setPrimaryContact as setPrimaryContactRedux,
  setCrisisLines as setCrisisLinesRedux,
} from '../../features/emergency/emergencySlice';

interface EmergencyContactsScreenProps {
  navigation: NavigationProp<any>;
}

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isPrimary: boolean;
}

interface CrisisLine {
  id: string;
  name: string;
  phone: string;
  description?: string;
  available24h: boolean;
  icon?: string;
  color?: string;
}

const EmergencyContactsScreen: React.FC<EmergencyContactsScreenProps> = ({ navigation }) => {
  const toast = useToast();
  const dispatch = useDispatch();
  const userId = useSelector((state: any) => state.userData.userDetails?.id);
  
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [crisisLines, setCrisisLines] = useState<CrisisLine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [newContact, setNewContact] = useState({
    name: '',
    relationship: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    loadEmergencyData();
  }, []);

  const loadEmergencyData = async () => {
    setIsLoading(true);
    try {
      console.log('📞 Calling getEmergencyContacts API...');
      console.log('User ID:', userId);

      const [contactsResponse, crisisLinesResponse] = await Promise.all([
        getEmergencyContacts(userId),
        getCrisisLines(userId),
      ]);

      console.log('✅ Emergency contacts response:', contactsResponse);
      console.log('✅ Crisis lines response:', crisisLinesResponse);

      // Handle contacts response
      const contactsData = contactsResponse.data?.contacts || contactsResponse.contacts || [];
      if (contactsData.length > 0) {
        const mappedContacts = contactsData.map((contact: any) => ({
          id: contact.id || contact.contact_id,
          name: contact.name,
          relationship: contact.relationship,
          phone: contact.phoneNumber || contact.phone_number || contact.phone,
          email: contact.email,
          isPrimary: contact.isPrimary || contact.is_primary || false,
        }));
        setContacts(mappedContacts);
        dispatch(setEmergencyContactsRedux(mappedContacts)); // ✅ Redux dispatch
      } else {
        console.log('ℹ️ No emergency contacts found - showing empty state');
        setContacts([]);
        dispatch(setEmergencyContactsRedux([])); // ✅ Redux dispatch
      }

      // Handle crisis lines response - API returns 'hotlines' not 'crisisLines'
      const crisisLinesData = crisisLinesResponse.data?.hotlines || crisisLinesResponse.hotlines || [];
      if (crisisLinesData.length > 0) {
        const mappedCrisisLines = crisisLinesData.map((line: any) => ({
          id: line.id,
          name: line.name,
          phone: line.phoneNumber || line.phone_number || line.phone,
          description: line.description,
          available24h: line.available === '24/7' || line.available24h || true,
          icon: line.icon || 'phone-in-talk',
          color: line.color || '#F44336',
        }));
        setCrisisLines(mappedCrisisLines);
        dispatch(setCrisisLinesRedux(mappedCrisisLines)); // ✅ Redux dispatch
      } else {
        console.log('⚠️ No crisis lines from API, using mock data');
        setCrisisLines(mockCrisisLines);
        dispatch(setCrisisLinesRedux(mockCrisisLines)); // ✅ Redux dispatch
      }
    } catch (error: any) {
      console.error('❌ Error loading emergency data:', error);
      
      // Fallback to empty contacts (not mock data)
      setContacts([]);
      setCrisisLines(mockCrisisLines);
      
      toast.show({
        description: 'Failed to load emergency contacts. Please try again.',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadEmergencyData();
    setIsRefreshing(false);
  };

  const handleCall = (phone: string, name: string) => {
    Alert.alert(
      'Call Emergency Contact',
      `Call ${name} at ${phone}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => {
            Linking.openURL(`tel:${phone.replace(/\s/g, '')}`);
          },
        },
      ]
    );
  };

  const handleAddContact = async () => {
    // Validate name
    if (!newContact.name.trim()) {
      toast.show({
        description: 'Name is required',
        duration: 2000,
      });
      return;
    }

    if (!isValidName(newContact.name.trim())) {
      toast.show({
        description: 'Name must be 3-20 characters, letters and spaces only',
        duration: 3000,
      });
      return;
    }

    // Validate relationship (optional but must be valid if provided)
    if (newContact.relationship.trim() && !isValidRelationship(newContact.relationship.trim())) {
      toast.show({
        description: 'Relationship must be 2-30 characters, letters, spaces, hyphens and apostrophes only',
        duration: 3000,
      });
      return;
    }

    // Validate phone number
    if (!newContact.phone.trim()) {
      toast.show({
        description: 'Phone number is required',
        duration: 2000,
      });
      return;
    }

    if (!isValidPhoneNumber(newContact.phone.trim())) {
      toast.show({
        description: 'Invalid phone number. Use format: +256XXXXXXXXX or 0XXXXXXXXX',
        duration: 3000,
      });
      return;
    }

    // Check if contact limit reached (max 3)
    if (contacts.length >= 3) {
      toast.show({
        description: 'Maximum 3 emergency contacts allowed',
        duration: 2000,
      });
      return;
    }

    setIsAdding(true);
    try {
      console.log('📞 Calling addEmergencyContact API...');
      const response = await addEmergencyContactAPI(
        userId,
        newContact.name,
        newContact.relationship || 'Other',
        newContact.phone,
        newContact.email || '',
        contacts.length === 0 // First contact is primary
      );
      console.log('✅ Add contact response:', response);

      // Map response to local format
      const addedContact: EmergencyContact = {
        id: response.data?.contact?.id || response.contact?.id || Date.now().toString(),
        name: newContact.name,
        relationship: newContact.relationship || 'Other',
        phone: newContact.phone,
        email: newContact.email,
        isPrimary: contacts.length === 0,
      };

      setContacts([...contacts, addedContact]);
      dispatch(addEmergencyContactRedux(addedContact)); // ✅ Redux dispatch
      setNewContact({ name: '', relationship: '', phone: '', email: '' });
      setShowAddModal(false);
      
      toast.show({
        description: 'Emergency contact added successfully',
        duration: 2000,
      });
    } catch (error: any) {
      console.error('❌ Error adding contact:', error);
      toast.show({
        description: error.response?.data?.error || 'Failed to add contact. Please try again.',
        duration: 3000,
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteContact = (id: string) => {
    Alert.alert(
      'Delete Contact',
      'Are you sure you want to remove this emergency contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('📞 Calling deleteEmergencyContact API...');
              await deleteEmergencyContactAPI(id, userId);
              console.log('✅ Contact deleted successfully');

              setContacts(contacts.filter(c => c.id !== id));
              dispatch(deleteEmergencyContactRedux(id)); // ✅ Redux dispatch
              toast.show({
                description: 'Contact removed',
                duration: 2000,
              });
            } catch (error: any) {
              console.error('❌ Error deleting contact:', error);
              toast.show({
                description: error.response?.data?.error || 'Failed to delete contact. Please try again.',
                duration: 3000,
              });
            }
          },
        },
      ]
    );
  };

  const handleSetPrimary = (id: string) => {
    // ⚠️ MISSING ENDPOINT: setPrimaryContact(userId, contactId)
    // Using local state update only
    console.log('⚠️ MISSING API: setPrimaryContact - using local state only');
    
    setContacts(contacts.map(c => ({
      ...c,
      isPrimary: c.id === id,
    })));
    dispatch(setPrimaryContactRedux(id)); // ✅ Redux dispatch
    toast.show({
      description: 'Primary contact updated (offline mode)',
      duration: 2000,
    });
  };

  const renderContact = (contact: EmergencyContact) => (
    <View key={contact.id} style={styles.contactCard}>
      <View style={styles.contactHeader}>
        <View style={styles.contactInfo}>
          <View style={styles.contactNameRow}>
            <Text style={styles.contactName}>{contact.name}</Text>
            {contact.isPrimary && (
              <View style={styles.primaryBadge}>
                <Text style={styles.primaryText}>Primary</Text>
              </View>
            )}
          </View>
          <Text style={styles.contactRelationship}>{contact.relationship}</Text>
          <View style={styles.phoneRow}>
            <Icon name="phone" type="material" color={appColors.grey3} size={16} />
            <Text style={styles.contactPhone}>{contact.phone}</Text>
          </View>
        </View>
      </View>

      <View style={styles.contactActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.callButton]}
          onPress={() => handleCall(contact.phone, contact.name)}
          activeOpacity={0.7}
        >
          <Icon name="phone" type="material" color="#FFF" size={18} />
          <Text style={styles.callButtonText}>Call</Text>
        </TouchableOpacity>

        {!contact.isPrimary && (
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={() => handleSetPrimary(contact.id)}
            activeOpacity={0.7}
          >
            <Icon name="star" type="material" color={appColors.AppBlue} size={18} />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteContact(contact.id)}
          activeOpacity={0.7}
        >
          <Icon name="delete" type="material" color="#F44336" size={18} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ISGenericHeader
        title="Emergency Contacts"
        navigation={navigation}
              />

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[appColors.AppBlue]}
          />
        }
      >
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Icon name="info" type="material" color={appColors.AppBlue} size={24} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Quick Access in Crisis</Text>
            <Text style={styles.infoText}>
              These contacts will be easily accessible from the emergency screen when you need immediate support.
            </Text>
          </View>
        </View>

        {/* Contacts List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>YOUR CONTACTS ({contacts.length}/3)</Text>
            {contacts.length < 3 && !isLoading && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowAddModal(true)}
                activeOpacity={0.7}
              >
                <Icon name="add" type="material" color={appColors.AppBlue} size={20} />
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            )}
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={appColors.AppBlue} />
              <Text style={styles.loadingText}>Loading contacts...</Text>
            </View>
          ) : contacts.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="person-add" type="material" color={appColors.grey4} size={64} />
              <Text style={styles.emptyTitle}>No Emergency Contacts</Text>
              <Text style={styles.emptySubtitle}>
                Add trusted contacts who can support you during difficult times
              </Text>
              <Button
                title="Add Your First Contact"
                buttonStyle={parameters.appButtonXLBlue}
                titleStyle={parameters.appButtonXLTitleBlue}
                onPress={() => setShowAddModal(true)}
                containerStyle={styles.emptyButton}
              />
            </View>
          ) : (
            <View style={styles.contactsList}>
              {contacts.map(renderContact)}
            </View>
          )}
        </View>

        {/* Crisis Hotlines */}
        {!isLoading && crisisLines.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CRISIS HOTLINES</Text>
            <View style={styles.hotlineCard}>
              {crisisLines.map((line, index) => (
                <React.Fragment key={line.id}>
                  {index > 0 && <View style={styles.separator} />}
                  <View style={styles.hotlineItem}>
                    <Icon 
                      name={line.icon || 'phone-in-talk'} 
                      type="material" 
                      color={line.color || '#F44336'} 
                      size={24} 
                    />
                    <View style={styles.hotlineInfo}>
                      <Text style={styles.hotlineName}>{line.name}</Text>
                      <Text style={styles.hotlineNumber}>{line.phone}</Text>
                      {line.description && (
                        <Text style={styles.hotlineDescription}>{line.description}</Text>
                      )}
                    </View>
                    <TouchableOpacity
                      style={styles.hotlineCallButton}
                      onPress={() => Linking.openURL(`tel:${line.phone.replace(/[^0-9+]/g, '')}`)}
                    >
                      <Icon name="phone" type="material" color="#FFF" size={18} />
                    </TouchableOpacity>
                  </View>
                </React.Fragment>
              ))}
            </View>
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Add Contact Modal */}
      <Overlay
        isVisible={showAddModal}
        onBackdropPress={() => setShowAddModal(false)}
        overlayStyle={styles.modal}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Emergency Contact</Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Icon name="close" type="material" color={appColors.grey3} size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Contact name"
                placeholderTextColor={appColors.grey4}
                value={newContact.name}
                onChangeText={(text) => setNewContact({ ...newContact, name: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Relationship</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Family, Friend, Therapist"
                placeholderTextColor={appColors.grey4}
                value={newContact.relationship}
                onChangeText={(text) => setNewContact({ ...newContact, relationship: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="+250 788 123 456"
                placeholderTextColor={appColors.grey4}
                value={newContact.phone}
                onChangeText={(text) => setNewContact({ ...newContact, phone: text })}
                keyboardType="phone-pad"
              />
            </View>

            <Button
              title={isAdding ? 'Adding...' : 'Add Contact'}
              buttonStyle={parameters.appButtonXLBlue}
              titleStyle={parameters.appButtonXLTitleBlue}
              onPress={handleAddContact}
              containerStyle={styles.modalButton}
              disabled={isAdding}
              loading={isAdding}
            />
          </View>
        </View>
      </Overlay>
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
  contentContainer: {
    paddingHorizontal: 20,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: appColors.AppBlue + '10',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    marginBottom: 20,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: appColors.grey2,
    fontFamily: appFonts.headerTextBold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.AppBlue + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
    marginLeft: 4,
  },
  contactsList: {
    gap: 12,
  },
  contactCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  contactHeader: {
    marginBottom: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  contactName: {
    fontSize: 18,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  primaryBadge: {
    backgroundColor: appColors.AppBlue,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  primaryText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFF',
    fontFamily: appFonts.headerTextBold,
  },
  contactRelationship: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginBottom: 6,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactPhone: {
    fontSize: 15,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextMedium,
    marginLeft: 6,
  },
  contactActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
  },
  callButton: {
    backgroundColor: appColors.AppBlue,
  },
  callButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFF',
    fontFamily: appFonts.headerTextBold,
    marginLeft: 6,
  },
  primaryButton: {
    backgroundColor: appColors.AppBlue + '15',
    flex: 0,
    paddingHorizontal: 12,
  },
  deleteButton: {
    backgroundColor: '#FFEBEE',
    flex: 0,
    paddingHorizontal: 12,
  },
  emptyState: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyButton: {
    width: '100%',
  },
  hotlineCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 12,
    padding: 16,
  },
  hotlineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  hotlineInfo: {
    flex: 1,
    marginLeft: 12,
  },
  hotlineName: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 2,
  },
  hotlineNumber: {
    fontSize: 15,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextMedium,
  },
  hotlineCallButton: {
    backgroundColor: '#F44336',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: appColors.grey6,
    marginVertical: 8,
  },
  modal: {
    width: '90%',
    borderRadius: 16,
    padding: 0,
  },
  modalContent: {
    backgroundColor: appColors.CardBackground,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: appColors.grey6,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  modalBody: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: appColors.grey2,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 8,
  },
  input: {
    backgroundColor: appColors.grey6,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: appColors.grey1,
    fontFamily: appFonts.headerTextRegular,
  },
  modalButton: {
    marginTop: 8,
  },
  bottomSpacing: {
    height: 20,
  },
  loadingContainer: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginTop: 12,
  },
  hotlineDescription: {
    fontSize: 13,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginTop: 2,
  },
});

export default EmergencyContactsScreen;
