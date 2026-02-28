import React from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, Text, StyleSheet } from 'react-native';
import { Icon } from '@rneui/base';
import { appColors, appFonts } from '../../global/Styles';
import { scale, moderateScale } from '../../global/Scaling';

export type EventFilterBarProps = {
  searchQuery: string;
  onChangeSearch: (q: string) => void;
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (c: string) => void;
  showCategories?: boolean;
};

const EventFilterBar: React.FC<EventFilterBarProps> = ({
  searchQuery,
  onChangeSearch,
  categories,
  selectedCategory,
  onSelectCategory,
  showCategories = true,
}) => {
  return (
    <View>
      <View style={styles.searchContainer}>
        <Icon name="search" type="material" color={appColors.AppGray} size={scale(20)} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search events..."
          value={searchQuery}
          onChangeText={onChangeSearch}
          placeholderTextColor={appColors.AppGray}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => onChangeSearch('')}>
            <Icon name="close" type="material" color={appColors.AppGray} size={scale(20)} />
          </TouchableOpacity>
        )}
      </View>

      {showCategories && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[styles.categoryChip, selectedCategory === category && styles.selectedCategoryChip]}
              onPress={() => onSelectCategory(category)}
            >
              <Text style={[styles.categoryChipText, selectedCategory === category && styles.selectedCategoryText]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(25),
    paddingHorizontal: scale(15),
    marginBottom: scale(15),
    elevation: scale(2),
  },
  searchInput: {
    flex: 1,
    paddingVertical: scale(12),
    paddingHorizontal: scale(10),
    fontSize: moderateScale(16),
    color: appColors.grey1,
    fontFamily: appFonts.headerTextRegular,
  },
  categoryContainer: { marginBottom: scale(20) },
  categoryChip: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(20),
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
    marginRight: scale(10),
    elevation: scale(1),
    height: scale(36),
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCategoryChip: { backgroundColor: appColors.AppBlue },
  categoryChipText: { fontSize: moderateScale(14), color: appColors.grey1, fontFamily: appFonts.headerTextMedium, textAlign: 'center' },
  selectedCategoryText: { color: appColors.CardBackground, fontFamily: appFonts.headerTextMedium },
});

export default EventFilterBar;
