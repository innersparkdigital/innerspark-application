/**
 * Add Client Note Screen - Therapist creates therapy notes for clients
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/themed';
import { appColors, appFonts } from '../../../global/Styles';
import ISGenericHeader from '../../../components/ISGenericHeader';
import ISStatusBar from '../../../components/ISStatusBar';

const THAddClientNoteScreen = ({ navigation, route }: any) => {
  const { client } = route.params;
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteType, setNoteType] = useState<'progress' | 'session' | 'observation' | 'treatment'>('session');

  const noteTypes = [
    { id: 'session', label: 'Session Note', icon: 'event-note', color: appColors.AppBlue },
    { id: 'progress', label: 'Progress Update', icon: 'trending-up', color: appColors.AppGreen },
    { id: 'observation', label: 'Observation', icon: 'visibility', color: '#FF9800' },
    { id: 'treatment', label: 'Treatment Plan', icon: 'medical-services', color: '#9C27B0' },
  ];

  const handleSave = () => {
    if (!noteTitle.trim() || !noteContent.trim()) {
      Alert.alert('Missing Information', 'Please enter both title and content for the note.');
      return;
    }

    // TODO: Save note to backend
    Alert.alert(
      'Note Saved',
      'Your note has been saved successfully.',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ISStatusBar />
      <ISGenericHeader title="Add Client Note" navigation={navigation} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Client Info Card */}
        <View style={styles.clientCard}>
          <Text style={styles.clientAvatar}>{client?.avatar || '👤'}</Text>
          <View style={styles.clientInfo}>
            <Text style={styles.clientName}>{client?.name || 'Client'}</Text>
            <Text style={styles.clientLabel}>Creating note for this client</Text>
          </View>
        </View>

        {/* Note Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Note Type</Text>
          <View style={styles.noteTypesGrid}>
            {noteTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.noteTypeCard,
                  noteType === type.id && styles.noteTypeCardActive,
                  { borderColor: noteType === type.id ? type.color : 'transparent' },
                ]}
                onPress={() => setNoteType(type.id as any)}
                activeOpacity={0.7}
              >
                <Icon
                  type="material"
                  name={type.icon}
                  size={24}
                  color={noteType === type.id ? type.color : appColors.grey3}
                />
                <Text
                  style={[
                    styles.noteTypeLabel,
                    noteType === type.id && { color: type.color },
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Note Title */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Title</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="e.g., Session Summary, Progress Update"
            placeholderTextColor={appColors.grey3}
            value={noteTitle}
            onChangeText={setNoteTitle}
            maxLength={100}
          />
          <Text style={styles.charCount}>{noteTitle.length}/100</Text>
        </View>

        {/* Note Content */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Note Content</Text>
          <TextInput
            style={styles.contentInput}
            placeholder="Write your therapy note here... Include observations, progress, treatment plans, or any relevant information."
            placeholderTextColor={appColors.grey3}
            value={noteContent}
            onChangeText={setNoteContent}
            multiline
            numberOfLines={12}
            textAlignVertical="top"
            maxLength={2000}
          />
          <Text style={styles.charCount}>{noteContent.length}/2000</Text>
        </View>

        {/* Privacy Notice */}
        <View style={styles.privacyCard}>
          <Icon type="material" name="lock" size={20} color={appColors.AppBlue} />
          <Text style={styles.privacyText}>
            This note is confidential and will only be visible to authorized therapists.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.saveButton,
              (!noteTitle.trim() || !noteContent.trim()) && styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={!noteTitle.trim() || !noteContent.trim()}
            activeOpacity={0.8}
          >
            <Icon type="material" name="check" size={20} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>Save Note</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.AppLightGray,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  clientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  clientAvatar: {
    fontSize: 40,
    marginRight: 12,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 4,
  },
  clientLabel: {
    fontSize: 13,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextMedium,
    marginBottom: 12,
  },
  noteTypesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  noteTypeCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  noteTypeCardActive: {
    backgroundColor: appColors.AppBlue + '10',
  },
  noteTypeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextMedium,
    marginTop: 8,
    textAlign: 'center',
  },
  titleInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextRegular,
    borderWidth: 1,
    borderColor: appColors.grey6,
  },
  contentInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextRegular,
    minHeight: 200,
    borderWidth: 1,
    borderColor: appColors.grey6,
  },
  charCount: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    textAlign: 'right',
    marginTop: 8,
  },
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.AppBlue + '10',
    padding: 12,
    borderRadius: 12,
    gap: 12,
    marginBottom: 24,
  },
  privacyText: {
    flex: 1,
    fontSize: 13,
    color: appColors.AppBlue,
    fontFamily: appFonts.bodyTextRegular,
    lineHeight: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: appColors.grey6,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextMedium,
  },
  saveButton: {
    flex: 1,
    backgroundColor: appColors.AppBlue,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonDisabled: {
    backgroundColor: appColors.grey5,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: appFonts.bodyTextMedium,
  },
});

export default THAddClientNoteScreen;
