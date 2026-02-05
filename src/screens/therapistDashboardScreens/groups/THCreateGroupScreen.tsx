/**
 * Therapist Create/Edit Group Screen
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
import { Icon, Button } from '@rneui/themed';
import { appColors, appFonts, parameters } from '../../../global/Styles';
import ISGenericHeader from '../../../components/ISGenericHeader';
import ISStatusBar from '../../../components/ISStatusBar';
import { useSelector } from 'react-redux';
import { createGroup, updateGroup } from '../../../api/therapist/groups';

const THCreateGroupScreen = ({ navigation, route }: any) => {
  const userDetails = useSelector((state: any) => state.userData.userDetails);
  const { group } = route.params || {};
  const isEditing = !!group;

  const [groupName, setGroupName] = useState(group?.name || '');
  const [description, setDescription] = useState(group?.description || '');
  const [selectedIcon, setSelectedIcon] = useState(group?.icon || '🧘');
  const [maxMembers, setMaxMembers] = useState(group?.maxMembers?.toString() || '20');
  const [isPrivate, setIsPrivate] = useState(group?.isPrivate || false);
  const [requireApproval, setRequireApproval] = useState(group?.requireApproval || true);

  const icons = ['🧘', '🌱', '🧠', '🕉️', '💪', '🌟', '🤝', '💙', '🌈', '☮️', '🦋', '🌺'];

  const handleSave = async () => {
    if (!groupName.trim()) {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }

    try {
      const therapistId = userDetails?.id || '52863268761';
      const groupData = {
        therapist_id: therapistId,
        name: groupName.trim(),
        description: description.trim(),
        icon: selectedIcon,
        maxMembers: parseInt(maxMembers) || 20,
        privacy: isPrivate ? 'private' : 'public',
        requireApproval: requireApproval,
        guidelines: ["Respect confidentiality", "Be supportive", "Attend regularly"] // Default guidelines
      };

      if (isEditing && group?.id) {
        await updateGroup(group.id, groupData);
        Alert.alert('Success', 'Group updated successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        await createGroup(groupData);
        Alert.alert('Success', 'Group created successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save group. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ISStatusBar />
      <ISGenericHeader
        title={isEditing ? 'Edit Group' : 'Create Group'}
        navigation={navigation}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Icon Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Group Icon</Text>
          <View style={styles.iconGrid}>
            {icons.map((icon) => (
              <TouchableOpacity
                key={icon}
                style={[
                  styles.iconOption,
                  selectedIcon === icon && styles.iconOptionSelected,
                ]}
                onPress={() => setSelectedIcon(icon)}
              >
                <Text style={styles.iconText}>{icon}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Group Name */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Group Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Anxiety Support Circle"
            placeholderTextColor={appColors.grey3}
            value={groupName}
            onChangeText={setGroupName}
            maxLength={50}
          />
          <Text style={styles.charCount}>{groupName.length}/50</Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe the purpose and focus of this group..."
            placeholderTextColor={appColors.grey3}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            maxLength={200}
          />
          <Text style={styles.charCount}>{description.length}/200</Text>
        </View>

        {/* Max Members */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Maximum Members</Text>
          <TextInput
            style={styles.input}
            placeholder="20"
            placeholderTextColor={appColors.grey3}
            value={maxMembers}
            onChangeText={setMaxMembers}
            keyboardType="number-pad"
            maxLength={3}
          />
          <Text style={styles.helpText}>
            Recommended: 10-20 members for effective group dynamics
          </Text>
        </View>

        {/* Privacy Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Access</Text>

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setIsPrivate(!isPrivate)}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <Icon
                type="material"
                name={isPrivate ? 'lock' : 'public'}
                size={24}
                color={appColors.AppBlue}
              />
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Private Group</Text>
                <Text style={styles.settingSubtitle}>
                  {isPrivate
                    ? 'Only invited members can join'
                    : 'Anyone can discover and join'}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.toggle,
                isPrivate ? styles.toggleActive : styles.toggleInactive,
              ]}
            >
              <View
                style={[
                  styles.toggleThumb,
                  isPrivate ? styles.toggleThumbActive : styles.toggleThumbInactive,
                ]}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setRequireApproval(!requireApproval)}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <Icon
                type="material"
                name="check-circle"
                size={24}
                color={appColors.AppBlue}
              />
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Require Approval</Text>
                <Text style={styles.settingSubtitle}>
                  {requireApproval
                    ? 'You must approve new members'
                    : 'Members can join instantly'}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.toggle,
                requireApproval ? styles.toggleActive : styles.toggleInactive,
              ]}
            >
              <View
                style={[
                  styles.toggleThumb,
                  requireApproval ? styles.toggleThumbActive : styles.toggleThumbInactive,
                ]}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Guidelines Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Group Guidelines</Text>
          <View style={styles.guidelinesCard}>
            <Text style={styles.guidelineText}>✓ Respect confidentiality</Text>
            <Text style={styles.guidelineText}>✓ Be supportive and non-judgmental</Text>
            <Text style={styles.guidelineText}>✓ Attend sessions regularly</Text>
            <Text style={styles.guidelineText}>✓ Participate actively</Text>
          </View>
          <TouchableOpacity style={styles.editGuidelinesButton}>
            <Icon type="material" name="edit" size={16} color={appColors.AppBlue} />
            <Text style={styles.editGuidelinesText}>Edit Guidelines</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <Button
          title={isEditing ? 'Save Changes' : 'Create Group'}
          buttonStyle={styles.saveButton}
          titleStyle={styles.saveButtonText}
          onPress={handleSave}
        />
      </View>
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
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 12,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  iconOption: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: appColors.AppLightGray,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconOptionSelected: {
    borderColor: appColors.AppBlue,
    backgroundColor: appColors.AppBlue + '20',
  },
  iconText: {
    fontSize: 28,
  },
  input: {
    backgroundColor: appColors.AppLightGray,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextRegular,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    marginTop: 6,
    textAlign: 'right',
  },
  helpText: {
    fontSize: 13,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    marginTop: 8,
    lineHeight: 18,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: appColors.grey6,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextMedium,
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 13,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: appColors.AppBlue,
    alignItems: 'flex-end',
  },
  toggleInactive: {
    backgroundColor: appColors.grey6,
    alignItems: 'flex-start',
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
  },
  toggleThumbActive: {},
  toggleThumbInactive: {},
  guidelinesCard: {
    backgroundColor: appColors.AppLightGray,
    borderRadius: 12,
    padding: 16,
    gap: 10,
  },
  guidelineText: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
    lineHeight: 20,
  },
  editGuidelinesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 6,
  },
  editGuidelinesText: {
    fontSize: 14,
    color: appColors.AppBlue,
    fontFamily: appFonts.bodyTextMedium,
    fontWeight: '600',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  saveButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: 12,
    paddingVertical: 16,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: appFonts.headerTextBold,
  },
});

export default THCreateGroupScreen;
