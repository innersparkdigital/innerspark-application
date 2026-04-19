/**
 * Therapist Individual Availability Slots Management Screen
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
  RefreshControl,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button } from '@rneui/themed';
import DatePicker from 'react-native-date-picker';
import { appColors, appFonts } from '../../../global/Styles';
import { moderateScale } from '../../../global/Scaling';
import ISGenericHeader from '../../../components/ISGenericHeader';
import ISStatusBar from '../../../components/ISStatusBar';
import ISAlert, { useISAlert } from '../../../components/alerts/ISAlert';
import ISConfirmationModal from '../../../components/ISConfirmationModal';
import {
  getAvailabilitySlots,
  createAvailabilitySlot,
  updateAvailabilitySlot,
  deleteAvailabilitySlot
} from '../../../api/therapist/calendar';
import { useSelector } from 'react-redux';

const THAvailabilitySlotsScreen = ({ navigation }: any) => {
  const userDetails = useSelector((state: any) => state.userData.userDetails);
  const therapistId = userDetails?.userId;
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [slots, setSlots] = useState<any[]>([]);
  const alert = useISAlert();

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSlot, setCurrentSlot] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [slotAvailability, setSlotAvailability] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState<any>(null);

  useEffect(() => {
    loadSlots();
  }, [therapistId]);

  const loadSlots = async (isRef = false) => {
    try {
      if (isRef) setRefreshing(true);
      else setLoading(true);

      const response: any = await getAvailabilitySlots(therapistId);
      if (response?.success) {
        // Sort slots by date and then time
        const sortedSlots = (response.data || []).sort((a: any, b: any) => {
          const dateComparison = a.date.localeCompare(b.date);
          if (dateComparison !== 0) return dateComparison;
          return a.time.localeCompare(b.time);
        });
        setSlots(sortedSlots);
      }
    } catch (error: any) {
      console.error('Load Slots Error:', error);
      alert.show({
        type: 'error',
        title: 'Error',
        message: error.backendMessage || error.message || 'Failed to load availability slots'
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    loadSlots(true);
  }, [therapistId]);

  const handleToggleAvailability = async (slot: any) => {
    try {
      const newStatus = slot.availability === 1 ? 0 : 1;
      
      // Optimistic update
      setSlots(prev => prev.map(s => s.id === slot.id ? { ...s, availability: newStatus } : s));

      const response: any = await updateAvailabilitySlot(slot.id, {
        therapist_id: therapistId,
        date: slot.date,
        time: slot.time,
        availability: newStatus
      });

      if (!response?.success) {
        // Revert on failure
        setSlots(prev => prev.map(s => s.id === slot.id ? { ...s, availability: slot.availability } : s));
        throw new Error(response?.message || 'Update failed');
      }
    } catch (error: any) {
      alert.show({
        type: 'error',
        title: 'Update Failed',
        message: error.backendMessage || error.message || 'Could not update slot status'
      });
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentSlot(null);
    setSelectedDate(new Date());
    setSelectedTime(new Date());
    setSlotAvailability(1);
    setShowEditModal(true);
  };

  const openEditModal = (slot: any) => {
    setIsEditing(true);
    setCurrentSlot(slot);
    
    // Parse date and time
    const [year, month, day] = slot.date.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    setSelectedDate(dateObj);

    // Parse 12h time string (e.g. "06:20 PM")
    const timeParts = slot.time.split(' ');
    const hhmm = timeParts[0].split(':').map(Number);
    const ampm = timeParts[1];
    let hours = hhmm[0];
    if (ampm === 'PM' && hours !== 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    
    const timeObj = new Date();
    timeObj.setHours(hours, hhmm[1], 0, 0);
    setSelectedTime(timeObj);

    setSlotAvailability(slot.availability);
    setShowEditModal(true);
  };

  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const strMinutes = minutes < 10 ? '0' + minutes : minutes;
    const strHours = hours < 10 ? '0' + hours : hours;
    return `${strHours}:${strMinutes} ${ampm}`;
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSaveSlot = async () => {
    try {
      setIsSubmitting(true);
      const payload = {
        therapist_id: therapistId,
        date: formatDate(selectedDate),
        time: formatTime(selectedTime),
        availability: slotAvailability
      };

      let response: any;
      if (isEditing && currentSlot) {
        response = await updateAvailabilitySlot(currentSlot.id, payload);
      } else {
        response = await createAvailabilitySlot(payload);
      }

      if (response?.success) {
        setShowEditModal(false);
        loadSlots();
        alert.show({
          type: 'success',
          title: 'Success',
          message: isEditing ? 'Slot updated successfully' : 'Slot added successfully'
        });
      }
    } catch (error: any) {
      console.error('Save Slot Error:', error);
      alert.show({
        type: 'error',
        title: error.response?.status === 409 ? 'Conflict' : 'Error',
        message: error.backendMessage || error.message || 'Failed to save slot'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = (slot: any) => {
    setSlotToDelete(slot);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!slotToDelete) return;
    try {
      const response: any = await deleteAvailabilitySlot(slotToDelete.id, therapistId);
      if (response?.success) {
        setSlots(prev => prev.filter(s => s.id !== slotToDelete.id));
        alert.show({
          type: 'success',
          title: 'Success',
          message: 'Slot deleted successfully'
        });
      }
    } catch (error: any) {
      alert.show({
        type: 'error',
        title: 'Error',
        message: error.backendMessage || error.message || 'Failed to delete slot'
      });
    } finally {
      setShowDeleteModal(false);
      setSlotToDelete(null);
    }
  };

  const renderSlotItem = ({ item }: { item: any }) => (
    <View style={styles.slotCard}>
      <View style={styles.slotInfo}>
        <View style={styles.slotDateTime}>
          <Icon type="material" name="event" size={18} color={appColors.AppBlue} />
          <Text style={styles.slotDateText}>{item.date}</Text>
          <View style={styles.dot} />
          <Icon type="material" name="access-time" size={18} color={appColors.AppGreen} />
          <Text style={styles.slotTimeText}>{item.time}</Text>
        </View>
        <Text style={[
          styles.statusBadge, 
          { color: item.availability === 1 ? appColors.AppGreen : appColors.grey3 }
        ]}>
          {item.availability === 1 ? 'Available' : 'Unavailable'}
        </Text>
      </View>
      
      <View style={styles.slotActions}>
        <Switch
          value={item.availability === 1}
          onValueChange={() => handleToggleAvailability(item)}
          trackColor={{ false: appColors.grey6, true: appColors.AppBlue + '50' }}
          thumbColor={item.availability === 1 ? appColors.AppBlue : appColors.grey4}
        />
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => openEditModal(item)}>
            <Icon type="material" name="edit" size={20} color={appColors.AppBlue} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => confirmDelete(item)}>
            <Icon type="material" name="delete" size={20} color="#F44336" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ISStatusBar />
      <ISGenericHeader 
        title="Availability Slots" 
        navigation={navigation}
        hasRightIcon={true}
        rightIconName="add"
        rightIconOnPress={openAddModal}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={appColors.AppBlue} />
          <Text style={styles.loadingText}>Loading slots...</Text>
        </View>
      ) : (
        <FlatList
          data={slots}
          renderItem={renderSlotItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[appColors.AppBlue]} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon type="material" name="event-busy" size={60} color={appColors.grey4} />
              <Text style={styles.emptyTitle}>No slots found</Text>
              <Text style={styles.emptySubtitle}>Start adding your available time slots to help clients book sessions.</Text>
            </View>
          }
        />
      )}

      {/* Add/Edit Modal */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{isEditing ? 'Edit Slot' : 'Add New Slot'}</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Icon type="material" name="close" size={24} color={appColors.grey1} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.pickerSection}>
                <Text style={styles.pickerLabel}>Date</Text>
                <DatePicker
                  date={selectedDate}
                  onDateChange={setSelectedDate}
                  mode="date"
                  minimumDate={new Date()}
                  theme="light"
                  style={styles.datePicker}
                />
              </View>

              <View style={styles.pickerSection}>
                <Text style={styles.pickerLabel}>Time</Text>
                <DatePicker
                  date={selectedTime}
                  onDateChange={setSelectedTime}
                  mode="time"
                  minuteInterval={15}
                  theme="light"
                  style={styles.datePicker}
                />
              </View>

              <View style={styles.availabilityToggle}>
                <Text style={styles.pickerLabel}>Status</Text>
                <View style={styles.toggleRow}>
                  <Text style={[styles.statusToggleText, { color: slotAvailability === 1 ? appColors.AppGreen : appColors.grey3 }]}>
                    {slotAvailability === 1 ? 'Available' : 'Unavailable'}
                  </Text>
                  <Switch
                    value={slotAvailability === 1}
                    onValueChange={(val) => setSlotAvailability(val ? 1 : 0)}
                    trackColor={{ false: appColors.grey6, true: appColors.AppGreen + '50' }}
                    thumbColor={slotAvailability === 1 ? appColors.AppGreen : appColors.grey4}
                  />
                </View>
              </View>
            </ScrollView>

            <Button
              title={isSubmitting ? "Saving..." : "Save Slot"}
              buttonStyle={styles.saveBtn}
              onPress={handleSaveSlot}
              disabled={isSubmitting}
              loading={isSubmitting}
            />
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation */}
      <ISConfirmationModal
        visible={showDeleteModal}
        title="Delete Slot"
        message="Are you sure you want to delete this availability slot?"
        confirmText="Delete"
        cancelText="Cancel"
        type="destructive"
        icon="delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />

      <ISAlert ref={alert.ref} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.AppLightGray,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  slotCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  slotInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  slotDateTime: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  slotDateText: {
    fontSize: 15,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextMedium,
    marginLeft: 6,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: appColors.grey5,
    marginHorizontal: 10,
  },
  slotTimeText: {
    fontSize: 15,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextMedium,
    marginLeft: 6,
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: appFonts.bodyTextBold,
    textTransform: 'uppercase',
  },
  slotActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: appColors.grey6,
    paddingTop: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: appColors.AppLightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    paddingTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey2,
    fontFamily: appFonts.headerTextBold,
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  pickerSection: {
    marginBottom: 20,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextMedium,
    marginBottom: 10,
  },
  datePicker: {
    height: 120,
    width: '100%',
    alignSelf: 'center',
  },
  availabilityToggle: {
    marginBottom: 24,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: appColors.AppLightGray,
    padding: 12,
    borderRadius: 12,
  },
  statusToggleText: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: appFonts.bodyTextMedium,
  },
  saveBtn: {
    backgroundColor: appColors.AppBlue,
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 10,
  },
});

export default THAvailabilitySlotsScreen;
