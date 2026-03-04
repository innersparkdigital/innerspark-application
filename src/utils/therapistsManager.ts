/**
 * Therapists Manager
 * Handles therapist API calls with graceful error handling
 * Returns empty arrays for 404 (endpoint not implemented yet)
 */
import store from '../app/store';
import {
  setTherapists,
  setSelectedTherapist,
  setLoading,
  setRefreshing,
  setError,
} from '../features/therapists/therapistsSlice';
import {
  getTherapists,
  getTherapistById,
  getSessionsPricing,
  getTherapistAvailability,
} from '../api/client/therapists';
import { FALLBACK_IMAGES } from './imageHelpers';

/**
 * Decode common HTML entities that the backend sends in text fields
 */
const decodeHtmlEntities = (text: string): string => {
  if (!text || typeof text !== 'string') return text;
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ');
};

/**
 * Load therapists from API
 * Returns empty array if endpoint not implemented (404)
 */
export const loadTherapists = async (filters = {}) => {
  store.dispatch(setLoading(true));

  try {
    console.log('👨‍⚕️ Loading therapists from API with filters:', filters);

    // Fetch therapists and global default pricing concurrently
    const [therapistsResult, pricingResult] = await Promise.allSettled([
      getTherapists(filters),
      getSessionsPricing()
    ]);

    const response = therapistsResult.status === 'fulfilled' ? therapistsResult.value : null;

    if (response && (response.success || response.status === 'success') && response.data) {
      // Intelligent default fallback price (Tier 2: Global pricing, Tier 3: 50k static)
      let dynamicFallbackPrice = 'UGX 50,000';
      if (pricingResult.status === 'fulfilled' && pricingResult.value?.success && pricingResult.value?.data) {
        const pr = pricingResult.value;
        const sessions = pr.data.sessionTypes || pr.data.pricing || (Array.isArray(pr.data) ? pr.data : []);
        const prices = sessions.map((s: any) => parseFloat(String(s.price).replace(/[^0-9.]/g, ''))).filter((p: number) => !isNaN(p) && p > 0);
        if (prices.length > 0) {
          dynamicFallbackPrice = `UGX ${Math.min(...prices).toLocaleString()}`;
          console.log('💰 Intelligent global fallback price captured:', dynamicFallbackPrice);
        }
      }

      const rawTherapists = Array.isArray(response.data) ? response.data : (response.data.therapists || []);

      const mappedTherapists = rawTherapists.map((t: any) => {
        // Normalize languages: API returns string like "English, French" — convert to array
        const rawLangs = t.languages;
        const langArray = Array.isArray(rawLangs)
          ? rawLangs.map((l: string) => decodeHtmlEntities(l.trim()))
          : (typeof rawLangs === 'string' && rawLangs.trim()
            ? rawLangs.split(',').map((l: string) => decodeHtmlEntities(l.trim()))
            : ['English']);

        const rawSpecialty = t.specialities || t.specialty || 'Therapist';
        const decodedSpecialty = decodeHtmlEntities(rawSpecialty);

        return {
          id: t.user_id || t.id,
          name: decodeHtmlEntities(t.name || `${t.firstName || ''} ${t.lastName || ''}`.trim() || 'Therapist'),
          specialty: decodedSpecialty,
          rating: t.rating || (t.rating_count > 0 ? t.average_rating : 5),
          location: decodeHtmlEntities(t.location || 'Online'),
          image: t.image ? { uri: t.image } : (t.avatar ? { uri: t.avatar } : FALLBACK_IMAGES.avatar),
          reviews: t.reviews ? parseInt(t.reviews) : (t.rating_count || 0),
          experience: t.experience ? (t.experience.toString().includes('year') ? t.experience : `${t.experience} years`) : '5+ years',
          price: t.price
            ? (String(t.price).includes('UGX') ? String(t.price) : `UGX ${Number(String(t.price).replace(/[^0-9.]/g, '')).toLocaleString()}`)
            : dynamicFallbackPrice,
          priceUnit: t.priceUnit || '/session',
          available: t.availability === 1 || t.available === true || t.availability === "1",
          bio: decodeHtmlEntities(t.bio || ''),
          nextAvailable: t.nextAvailable || 'Today',
          languages: langArray,
          tags: decodedSpecialty !== 'Therapist'
            ? decodedSpecialty.split(',').map((s: string) => s.trim())
            : [],
        };
      });

      console.log('📊 Therapists count:', mappedTherapists.length);
      store.dispatch(setTherapists(mappedTherapists));
    } else {
      console.log('⚠️ API response missing success or data:', response);
      store.dispatch(setTherapists([]));
    }
  } catch (error: any) {
    console.log('❌ Error loading therapists:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
    });

    // Handle 404 - endpoint not implemented yet, return empty state
    if (error?.response?.status === 404) {
      console.log('📦 GET /client/therapists endpoint returns 404, showing empty state');
      store.dispatch(setTherapists([]));
    } else {
      // Other errors - set error state with empty data
      console.log('⚠️ Non-404 error, showing empty state');
      store.dispatch(setTherapists([]));
      store.dispatch(setError(error?.message || 'Failed to load therapists'));
    }
  } finally {
    store.dispatch(setLoading(false));
  }
};

/**
 * Refresh therapists list
 */
export const refreshTherapists = async (filters = {}) => {
  store.dispatch(setRefreshing(true));

  try {
    console.log('🔄 Refreshing therapists with filters:', filters);
    const [therapistsResult, pricingResult] = await Promise.allSettled([
      getTherapists(filters),
      getSessionsPricing()
    ]);

    const response = therapistsResult.status === 'fulfilled' ? therapistsResult.value : null;

    if (response && (response.success || response.status === 'success') && response.data) {
      let dynamicFallbackPrice = 'UGX 50,000';
      if (pricingResult.status === 'fulfilled' && pricingResult.value?.success && pricingResult.value?.data) {
        const pr = pricingResult.value;
        const sessions = pr.data.sessionTypes || pr.data.pricing || (Array.isArray(pr.data) ? pr.data : []);
        const prices = sessions.map((s: any) => parseFloat(String(s.price).replace(/[^0-9.]/g, ''))).filter((p: number) => !isNaN(p) && p > 0);
        if (prices.length > 0) dynamicFallbackPrice = `UGX ${Math.min(...prices).toLocaleString()}`;
      }

      const rawTherapists = Array.isArray(response.data) ? response.data : (response.data.therapists || []);
      const mappedTherapists = rawTherapists.map((t: any) => {
        const rawLangs = t.languages;
        const langArray = Array.isArray(rawLangs)
          ? rawLangs.map((l: string) => decodeHtmlEntities(l.trim()))
          : (typeof rawLangs === 'string' && rawLangs.trim()
            ? rawLangs.split(',').map((l: string) => decodeHtmlEntities(l.trim()))
            : ['English']);

        const rawSpecialty = t.specialities || t.specialty || 'Therapist';
        const decodedSpecialty = decodeHtmlEntities(rawSpecialty);

        return {
          id: t.user_id || t.id,
          name: decodeHtmlEntities(t.name || `${t.firstName || ''} ${t.lastName || ''}`.trim() || 'Therapist'),
          specialty: decodedSpecialty,
          rating: t.rating || (t.rating_count > 0 ? t.average_rating : 5),
          location: decodeHtmlEntities(t.location || 'Online'),
          image: t.image ? { uri: t.image } : (t.avatar ? { uri: t.avatar } : FALLBACK_IMAGES.avatar),
          reviews: t.reviews ? parseInt(t.reviews) : (t.rating_count || 0),
          experience: t.experience ? (t.experience.toString().includes('year') ? t.experience : `${t.experience} years`) : '5+ years',
          price: t.price
            ? (String(t.price).includes('UGX') ? String(t.price) : `UGX ${Number(String(t.price).replace(/[^0-9.]/g, '')).toLocaleString()}`)
            : dynamicFallbackPrice,
          priceUnit: t.priceUnit || '/session',
          available: t.availability === 1 || t.available === true || t.availability === "1",
          bio: decodeHtmlEntities(t.bio || ''),
          nextAvailable: t.nextAvailable || 'Today',
          languages: langArray,
          tags: decodedSpecialty !== 'Therapist'
            ? decodedSpecialty.split(',').map((s: string) => s.trim())
            : [],
        };
      });
      store.dispatch(setTherapists(mappedTherapists));
    } else {
      store.dispatch(setTherapists([]));
    }
  } catch (error: any) {
    console.log('Error refreshing therapists:', error);

    // Handle 404 gracefully - show empty state
    if (error?.response?.status === 404) {
      store.dispatch(setTherapists([]));
    } else {
      store.dispatch(setTherapists([]));
      store.dispatch(setError(error?.message || 'Failed to refresh therapists'));
    }
  } finally {
    store.dispatch(setRefreshing(false));
  }
};

/**
 * Load therapist details by ID
 */
export const loadTherapistDetails = async (therapistId: string, fallbackTherapist?: any) => {
  console.log('👨‍⚕️ Loading therapist details for ID:', therapistId);

  // Use Promise.allSettled so a 404 on availability/pricing never blanks the whole screen
  const [pricingResult, availabilityResult] = await Promise.allSettled([
    getSessionsPricing(),
    getTherapistAvailability(therapistId),
  ]);

  // --- Therapist details (required) ---
  let therapistData: any = null;

  // 1. Try to get details provided inside the slots endpoint (backend disorganization)
  if (availabilityResult.status === 'fulfilled' && availabilityResult.value.success && availabilityResult.value.data) {
    // In the /slots payload, data contains the therapist info directly
    therapistData = availabilityResult.value.data;
  }

  // 2. Fallback to route params if the /slots endpoint itself fails entirely
  if (!therapistData) {
    if (fallbackTherapist && fallbackTherapist.id) {
      console.log('⚠️ Failed to load base therapist details from API, using fallback data');
      therapistData = fallbackTherapist;
    } else {
      console.log('⚠️ Failed to load base therapist details');
      return { success: false, error: 'Failed to load therapist details' };
    }
  }

  // --- Pricing / session types (optional – falls back gracefully) ---
  let pricingData: any[] = [];
  if (pricingResult.status === 'fulfilled') {
    const pr = pricingResult.value;
    if (pr.success && pr.data) {
      pricingData = pr.data.sessionTypes || pr.data.pricing || (Array.isArray(pr.data) ? pr.data : []);
    }
  } else {
    console.log('⚠️ Pricing request failed (will use fallback):', (pricingResult as any).reason?.message);
  }

  // --- Availability slots (optional – shows empty list if endpoint fails) ---
  let availabilitySlots: any[] = [];
  if (availabilityResult.status === 'fulfilled') {
    const ar = availabilityResult.value;
    // Look for slots in ar.slots (per payload), ar.data.slots, or ar.data
    let raw = [];
    if (ar.slots && Array.isArray(ar.slots)) {
      raw = ar.slots;
    } else if (ar.data && ar.data.slots && Array.isArray(ar.data.slots)) {
      raw = ar.data.slots;
    } else if (ar.data && Array.isArray(ar.data)) {
      raw = ar.data;
    }

    // Defensive sorting/mapping
    availabilitySlots = raw.map((slot: any, idx: number) => ({
      id: slot.id || slot.slotId || `slot-${idx}`,
      date: slot.av_date || slot.date || slot.slot_date || '',
      time: slot.av_time || slot.time || slot.slot_time || slot.startTime || '',
      available:
        slot.availability !== undefined
          ? slot.availability === 1 || slot.availability === true
          : slot.available !== undefined
            ? slot.available
            : slot.status === 'available' || slot.is_available === true || slot.booked === false,
    }));
  } else {
    console.log('⚠️ Availability request failed (will show empty slots):', (availabilityResult as any).reason?.message);
  }

  const normalizedTherapist = {
    ...therapistData,
    id: therapistData.user_id || therapistData.id,
    name: decodeHtmlEntities(therapistData.name || `${therapistData.firstName || ''} ${therapistData.lastName || ''}`.trim() || 'Therapist'),
    specialty: decodeHtmlEntities(therapistData.specialities || therapistData.specialty || 'Therapist'),
    bio: decodeHtmlEntities(therapistData.bio || ''),
    location: decodeHtmlEntities(therapistData.location || 'Online'),
    languages: (() => {
      const raw = therapistData.languages;
      if (Array.isArray(raw)) return raw.map((l: string) => decodeHtmlEntities(l.trim()));
      if (typeof raw === 'string' && raw.trim()) return raw.split(',').map((l: string) => decodeHtmlEntities(l.trim()));
      return ['English'];
    })(),
    tags: (() => {
      const raw = therapistData.specialities || therapistData.specialty;
      if (!raw) return [];
      const decoded = decodeHtmlEntities(raw);
      if (Array.isArray(raw)) return raw.map((s: string) => decodeHtmlEntities(s));
      return decoded.split(',').map((s: string) => s.trim());
    })(),
    sessionTypes:
      pricingData.length > 0
        ? pricingData.map((s: any, idx: number) => ({
          id: s.id || `session-${idx}`,
          name: s.name || 'Session',
          price: s.price ? `${s.currency || 'UGX'} ${Number(s.price).toLocaleString()}` : 'UGX 50,000',
          duration: s.duration
            ? typeof s.duration === 'number'
              ? `${s.duration} min`
              : s.duration
            : '60 min',
        }))
        : [{ id: 'individual', name: 'Individual Session', price: therapistData.price || 'UGX 50,000', duration: '60 min' }],
    availableSlots: availabilitySlots,
  };

  console.log(
    '✅ Therapist details loaded — sessionTypes:', normalizedTherapist.sessionTypes.length,
    '- slots:', normalizedTherapist.availableSlots.length,
  );
  store.dispatch(setSelectedTherapist(normalizedTherapist));
  return { success: true, therapist: normalizedTherapist };
};



