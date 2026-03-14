/**
 * Emergency Manager
 * Centralized utility for managing emergency contacts and crisis hotlines
 */
import store from '../app/store';
import {
  setEmergencyContacts,
  setCrisisLines,
} from '../features/emergency/emergencySlice';
import {
  getEmergencyContacts,
  getCrisisLines
} from '../api/client/emergency';
import { mockCrisisLines } from '../global/MockData';

/**
 * Load all emergency data (Contacts and Crisis Lines)
 * Pre-caches data in Redux for the Panic Button
 */
export const loadEmergencyData = async (userId: string) => {
  if (!userId) return;

  try {
    console.log('📞 [EmergencyManager] Syncing emergency data for userId:', userId);
    
    // Fetch both contacts and hotlines in parallel
    const [contactsResponse, crisisLinesResponse] = await Promise.all([
      getEmergencyContacts(userId),
      getCrisisLines(userId),
    ]);

    // 1. Process Emergency Contacts
    const contactsData = contactsResponse.data?.contacts || contactsResponse.contacts || [];
    const mappedContacts = contactsData.map((contact: any) => ({
      id: contact.id || contact.contact_id,
      name: contact.name,
      relationship: contact.relationship,
      phone: contact.phoneNumber || contact.phone_number || contact.phone,
      email: contact.email,
      isPrimary: contact.isPrimary || contact.is_primary || false,
    }));
    
    store.dispatch(setEmergencyContacts(mappedContacts));
    console.log(`✅ [EmergencyManager] Sync complete: ${mappedContacts.length} contacts`);

    // 2. Process Crisis Hotlines
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
      store.dispatch(setCrisisLines(mappedCrisisLines));
    } else {
      // Fallback to mocks if API returns nothing for hotlines
      store.dispatch(setCrisisLines(mockCrisisLines));
    }

  } catch (error: any) {
    console.error('❌ [EmergencyManager] Sync error:', error?.message);
    // On error, we preserve existing Redux state or allow it to stay empty/mocked
  }
};
