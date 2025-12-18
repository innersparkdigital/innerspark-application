/**
 * Therapist Suggestions Screen - Ranked list based on quiz answers
 */
import React, { useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Avatar, Button } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';
import {
  selectTherapists,
  selectTherapistsLoading,
} from '../../features/therapists/therapistsSlice';
import { loadTherapists } from '../../utils/therapistsManager';

interface QuizAnswers {
  genderPreference: 'Any' | 'Male' | 'Female';
  issues: string[];
  language: 'Any' | 'English' | 'Luganda' | 'French';
  budget: 'Any' | 'UGX 40k - 50k' | 'UGX 50k - 60k' | 'UGX 60k+';
  availability: 'Anytime' | 'Weekdays' | 'Weekends' | 'Evenings';
}

interface Therapist {
  id: number;
  name: string;
  gender: 'Male' | 'Female';
  specialty: string;
  rating: number;
  location: string;
  image: any;
  reviews: number;
  experience: string;
  price: string;
  priceUnit: string;
  available: boolean;
  bio: string;
  nextAvailable: string;
  languages?: string[];
  tags?: string[];
}

interface TherapistSuggestionsScreenProps {
  navigation: any;
  route: { params?: { answers?: QuizAnswers } };
}

const TherapistSuggestionsScreen: React.FC<TherapistSuggestionsScreenProps> = ({ navigation, route }) => {
  const toast = useToast();
  const answers: QuizAnswers | undefined = route?.params?.answers;
  const [refineOpen, setRefineOpen] = useState(false);

  // Get therapists from Redux (same data source as TherapistsScreen)
  const therapistsFromRedux = useSelector(selectTherapists);
  const isLoading = useSelector(selectTherapistsLoading);

  // Load therapists if not already loaded
  useEffect(() => {
    if (therapistsFromRedux.length === 0 && !isLoading) {
      loadTherapists();
    }
  }, []);

  // Use the same therapist data from API/Redux
  const baseTherapists: Therapist[] = therapistsFromRedux as Therapist[];

  const scoreTherapist = (t: Therapist): { score: number; reasons: string[] } => {
    const reasons: string[] = [];
    let score = 0;
    if (!answers) return { score: t.rating, reasons: ['Default ranking by rating'] };

    // Gender
    if (answers.genderPreference === 'Any' || answers.genderPreference === t.gender) {
      score += 2; if (answers.genderPreference !== 'Any') reasons.push(`${t.gender} as preferred`);
    }
    // Issues overlap
    const issueMatches = answers.issues.filter(i => t.tags?.includes(i));
    if (issueMatches.length) { score += issueMatches.length * 3; reasons.push(`Focus: ${issueMatches.join(', ')}`); }
    // Language
    if (answers.language === 'Any' || t.languages?.includes(answers.language)) {
      score += 2; if (answers.language !== 'Any') reasons.push(`Speaks ${answers.language}`);
    }
    // Budget
    const priceNum = parseInt(t.price.replace(/[^0-9]/g, ''), 10);
    const inBudget = (
      answers.budget === 'Any' ||
      (answers.budget === 'UGX 40k - 50k' && priceNum >= 40000 && priceNum <= 50000) ||
      (answers.budget === 'UGX 50k - 60k' && priceNum >= 50000 && priceNum <= 60000) ||
      (answers.budget === 'UGX 60k+' && priceNum >= 60000)
    );
    if (inBudget) { score += 2; if (answers.budget !== 'Any') reasons.push(`Within budget (${answers.budget})`); }
    // Availability preference (simple boost if available now or evenings)
    if (t.available) { score += 1; reasons.push('Available now'); }

    // Base by rating
    score += t.rating;

    return { score, reasons: reasons.length ? reasons : ['Good overall match'] };
  };

  const rankedTherapists = useMemo(() => {
    const withScores = baseTherapists.map(t => ({ t, ...scoreTherapist(t) }));
    withScores.sort((a,b) => b.score - a.score);
    return withScores;
  }, [answers]);

  const renderReasonChips = (reasons: string[]) => (
    <View style={styles.reasonsRow}>
      {reasons.slice(0,3).map((r, idx) => (
        <View key={idx} style={styles.reasonChip}>
          <Text style={styles.reasonText}>{r}</Text>
        </View>
      ))}
    </View>
  );

  const renderItem = ({ item }: { item: { t: Therapist; score: number; reasons: string[] } }) => {
    const th = item.t;
    return (
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('TherapistDetailScreen', { therapist: th })}>
        <View style={styles.cardHeader}>
          <Avatar source={th.image} size={60} rounded containerStyle={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{th.name}</Text>
            <Text style={styles.specialty}>{th.specialty}</Text>
            <View style={styles.metaRow}>
              <Icon name="star" type="material" color="#FFD700" size={14} />
              <Text style={styles.metaText}>{th.rating} ({th.reviews})</Text>
              <Icon name="place" type="material" color={appColors.grey3} size={14} style={{ marginLeft: 10 }} />
              <Text style={styles.metaText}>{th.location}</Text>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.price}>{th.price}</Text>
            <Text style={styles.priceUnit}>{th.priceUnit}</Text>
            <View style={[styles.availabilityBadge, th.available ? styles.available : styles.unavailable]}>
              <Text style={[styles.availabilityText, th.available ? styles.availableText : styles.unavailableText]}>
                {th.available ? 'Available' : 'Busy'}
              </Text>
            </View>
          </View>
        </View>
        {renderReasonChips(item.reasons)}
        <View style={styles.actionsRow}>
          <Button
            title={th.available ? 'Book Now' : 'View Profile'}
            onPress={() => th.available
              ? navigation.navigate('TherapistDetailScreen', { therapist: th })
              : navigation.navigate('TherapistDetailScreen', { therapist: th })}
            buttonStyle={styles.primaryBtn}
            titleStyle={styles.primaryBtnText}
          />
          <Button
            title="Refine"
            type="outline"
            onPress={() => navigation.navigate('TherapistMatchingQuizScreen', { from: 'suggestions', prevAnswers: answers })}
            buttonStyle={styles.secondaryBtn}
            titleStyle={styles.secondaryBtnText}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const EmptyState = () => (
    <View style={styles.empty}>
      <Icon name="psychology" type="material" color={appColors.grey3} size={56} />
      <Text style={styles.emptyTitle}>No suggestions yet</Text>
      <Text style={styles.emptyText}>Take the quick matching quiz to see tailored therapists.</Text>
      <Button
        title="Start Quiz"
        onPress={() => navigation.navigate('TherapistMatchingQuizScreen')}
        buttonStyle={styles.primaryBtn}
        titleStyle={styles.primaryBtnText}
      />
      <TouchableOpacity style={{ marginTop: 12 }} onPress={() => navigation.navigate('LHBottomTabs', { screen: 'TherapistsScreen' })}>
        <Text style={{ color: appColors.AppBlue, fontFamily: appFonts.regularText }}>Browse Directory</Text>
      </TouchableOpacity>
    </View>
  );

  // Loading state
  if (isLoading && therapistsFromRedux.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" type="material" color={appColors.CardBackground} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Therapist Suggestions</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.empty}>
          <Icon name="psychology" type="material" color={appColors.grey3} size={56} />
          <Text style={styles.emptyTitle}>Loading therapists...</Text>
          <Text style={styles.emptyText}>Please wait while we fetch available therapists.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" type="material" color={appColors.CardBackground} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Therapist Suggestions</Text>
        <View style={{ width: 40 }} />
      </View>

      {!answers ? (
        <EmptyState />
      ) : rankedTherapists.length === 0 ? (
        <View style={styles.empty}>
          <Icon name="person-search" type="material" color={appColors.grey3} size={56} />
          <Text style={styles.emptyTitle}>No therapists available</Text>
          <Text style={styles.emptyText}>We didn’t find a match—browse all available therapists instead.</Text>
          <Button
            title="Browse Directory"
            onPress={() => navigation.navigate('LHBottomTabs', { screen: 'TherapistsScreen' })}
            buttonStyle={styles.primaryBtn}
            titleStyle={styles.primaryBtnText}
          />
        </View>
      ) : (
        <FlatList
          data={rankedTherapists}
          renderItem={renderItem}
          keyExtractor={(item) => item.t.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: appColors.AppLightGray },
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
  backButton: { padding: 8, marginRight: 8 },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: 'bold', color: appColors.CardBackground, fontFamily: appFonts.headerTextBold, textAlign: 'center' },
  listContent: { padding: 16, paddingBottom: 32 },
  card: { backgroundColor: appColors.CardBackground, borderRadius: 16, padding: 16, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  cardHeader: { flexDirection: 'row', marginBottom: 8 },
  name: { fontSize: 16, fontWeight: 'bold', color: appColors.grey1, fontFamily: appFonts.headerTextBold },
  specialty: { fontSize: 14, color: appColors.grey2, marginTop: 2, fontFamily: appFonts.appTextRegular },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  metaText: { fontSize: 12, color: appColors.grey3, marginLeft: 4, fontFamily: appFonts.appTextRegular },
  price: { fontSize: 16, fontWeight: 'bold', color: appColors.AppBlue, fontFamily: appFonts.headerTextBold },
  priceUnit: { fontSize: 12, color: appColors.grey2, marginBottom: 6, fontFamily: appFonts.appTextRegular },
  availabilityBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, alignSelf: 'flex-start' },
  available: { backgroundColor: '#E8F5E8' },
  unavailable: { backgroundColor: '#FFE8E8' },
  availabilityText: { fontSize: 12, fontFamily: appFonts.appTextMedium },
  availableText: { color: '#4CAF50' },
  unavailableText: { color: '#F44336' },
  reasonsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
  reasonChip: { backgroundColor: appColors.grey6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14, marginRight: 6, marginBottom: 6 },
  reasonText: { fontSize: 12, color: appColors.grey2, fontFamily: appFonts.appTextRegular },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  primaryBtn: { backgroundColor: appColors.AppBlue, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 18 },
  primaryBtnText: { color: appColors.CardBackground, fontWeight: '700', fontFamily: appFonts.appTextRegular },
  secondaryBtn: { borderColor: appColors.AppBlue, borderWidth: 1, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 18 },
  secondaryBtnText: { color: appColors.AppBlue, fontWeight: '700', fontFamily: appFonts.appTextRegular },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: appColors.grey1, marginTop: 12, fontFamily: appFonts.headerTextBold },
  emptyText: { fontSize: 14, color: appColors.grey3, marginTop: 4, marginBottom: 16, fontFamily: appFonts.appTextRegular, textAlign: 'center' },
});

export default TherapistSuggestionsScreen;
