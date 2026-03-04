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
import { scale, moderateScale } from '../../global/Scaling';
import { useToast } from 'native-base';
import {
  selectTherapists,
  selectTherapistsLoading,
} from '../../features/therapists/therapistsSlice';
import { loadTherapists } from '../../utils/therapistsManager';

interface QuizAnswers {
  genderPreference: string;
  issues: string[];
  language: string;
  budget: string;
  availability: string;
}

interface Therapist {
  id: number;
  name: string;
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

  const scoreTherapist = (t: Therapist): { score: number; maxScore: number; reasons: string[] } => {
    const reasons: string[] = [];
    let score = 0;
    let maxScore = 0;
    if (!answers) return { score: t.rating, maxScore: 10, reasons: ['Default ranking by rating'] };

    // Issues overlap (fuzzy substring matching)
    maxScore += answers.issues.length * 3;
    const therapistTags = (t.tags || []).map((tag: string) => tag.toLowerCase());
    const therapistSpecialty = (t.specialty || '').toLowerCase();
    const issueMatches = answers.issues.filter(i => {
      const needle = i.toLowerCase();
      return therapistTags.some((tag: string) => tag.includes(needle) || needle.includes(tag))
        || therapistSpecialty.includes(needle);
    });
    if (issueMatches.length) { score += issueMatches.length * 3; reasons.push(`Focus: ${issueMatches.join(', ')}`); }

    // Language
    maxScore += 2;
    const therapistLangs = Array.isArray(t.languages) ? t.languages : (typeof t.languages === 'string' ? t.languages.split(',').map((s: string) => s.trim()) : []);
    if (answers.language === 'Any' || therapistLangs.some((l: string) => l.toLowerCase().includes(answers.language.toLowerCase()))) {
      score += 2; if (answers.language !== 'Any') reasons.push(`Speaks ${answers.language}`);
    }

    // Budget (parse dynamic range from quiz answer string)
    maxScore += 2;
    const priceNum = parseInt(String(t.price).replace(/[^0-9]/g, ''), 10);
    let inBudget = answers.budget === 'Any';
    if (!inBudget && !isNaN(priceNum)) {
      const nums = answers.budget.match(/\d+/g);
      if (nums && nums.length >= 2) {
        const lo = parseInt(nums[0], 10) * 1000;
        const hi = parseInt(nums[1], 10) * 1000;
        inBudget = priceNum >= lo && priceNum <= hi;
      } else if (nums && nums.length === 1 && answers.budget.includes('+')) {
        inBudget = priceNum >= parseInt(nums[0], 10) * 1000;
      }
    }
    if (inBudget) { score += 2; if (answers.budget !== 'Any') reasons.push('Within budget'); }

    // Availability
    maxScore += 1;
    if (t.available) { score += 1; reasons.push('Available now'); }

    // Experience bonus
    maxScore += 2;
    const expYears = parseInt(String(t.experience).replace(/[^0-9]/g, ''), 10);
    if (!isNaN(expYears) && expYears >= 3) { score += 2; reasons.push(`${expYears}+ years exp`); }
    else if (!isNaN(expYears) && expYears >= 1) { score += 1; }

    // Rating bonus
    maxScore += 5;
    score += Math.min(t.rating, 5);
    if (t.rating >= 4.5) reasons.push(`${t.rating}★ rated`);

    return { score, maxScore: Math.max(maxScore, 1), reasons: reasons.length ? reasons : ['Good overall match'] };
  };

  const rankedTherapists = useMemo(() => {
    const withScores = baseTherapists.map(t => {
      const { score, maxScore, reasons } = scoreTherapist(t);
      const matchPercent = Math.min(Math.round((score / maxScore) * 100), 100);
      return { t, score, matchPercent, reasons };
    });
    withScores.sort((a, b) => b.score - a.score);
    return withScores;
  }, [answers, baseTherapists]);

  const renderReasonChips = (reasons: string[]) => (
    <View style={styles.reasonsRow}>
      {reasons.slice(0, 3).map((r, idx) => (
        <View key={idx} style={styles.reasonChip}>
          <Text style={styles.reasonText}>{r}</Text>
        </View>
      ))}
    </View>
  );

  const renderItem = ({ item, index }: { item: { t: Therapist; score: number; matchPercent: number; reasons: string[] }; index: number }) => {
    const th = item.t;
    const isTopMatch = index === 0 && item.matchPercent >= 50;
    return (
      <TouchableOpacity style={[styles.card, isTopMatch && styles.topMatchCard]} onPress={() => navigation.navigate('TherapistDetailScreen', { therapist: th })}>
        {isTopMatch && (
          <View style={styles.topMatchBadge}>
            <Icon name="emoji-events" type="material" color="#FFD700" size={moderateScale(14)} />
            <Text style={styles.topMatchText}>Top Match</Text>
          </View>
        )}
        <View style={styles.cardHeader}>
          <Avatar source={th.image} size={scale(60)} rounded containerStyle={{ marginRight: scale(12) }} avatarStyle={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{th.name}</Text>
            <Text style={styles.specialty}>{th.specialty}</Text>
            <View style={styles.metaRow}>
              <Icon name="star" type="material" color="#FFD700" size={moderateScale(14)} />
              <Text style={styles.metaText}>{th.rating} ({th.reviews})</Text>
              <Icon name="place" type="material" color={appColors.grey3} size={moderateScale(14)} style={{ marginLeft: scale(10) }} />
              <Text style={styles.metaText}>{th.location}</Text>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <View style={styles.matchBadge}>
              <Text style={styles.matchPercent}>{item.matchPercent}%</Text>
              <Text style={styles.matchLabel}>match</Text>
            </View>
            <Text style={styles.price}>{th.price}</Text>
            <Text style={styles.priceUnit}>{th.priceUnit}</Text>
          </View>
        </View>
        {th.bio ? <Text style={styles.bioPreview} numberOfLines={2}>{th.bio}</Text> : null}
        {renderReasonChips(item.reasons)}
        <View style={styles.actionsRow}>
          <Button
            title={th.available ? 'Book Now' : 'View Profile'}
            onPress={() => navigation.navigate('TherapistDetailScreen', { therapist: th })}
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
      <Icon name="psychology" type="material" color={appColors.grey3} size={moderateScale(56)} />
      <Text style={styles.emptyTitle}>No suggestions yet</Text>
      <Text style={styles.emptyText}>Take the quick matching quiz to see tailored therapists.</Text>
      <Button
        title="Start Quiz"
        onPress={() => navigation.navigate('TherapistMatchingQuizScreen')}
        buttonStyle={styles.primaryBtn}
        titleStyle={styles.primaryBtnText}
      />
      <TouchableOpacity style={{ marginTop: 12 }} onPress={() => navigation.navigate('LHBottomTabs', { screen: 'TherapistsScreen' })}>
        <Text style={{ color: appColors.AppBlue, fontFamily: appFonts.bodyTextRegular }}>Browse Directory</Text>
      </TouchableOpacity>
    </View>
  );

  // Loading state
  if (isLoading && therapistsFromRedux.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" type="material" color={appColors.CardBackground} size={moderateScale(24)} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Therapist Suggestions</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.empty}>
          <Icon name="psychology" type="material" color={appColors.grey3} size={moderateScale(56)} />
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
          <Icon name="arrow-back" type="material" color={appColors.CardBackground} size={moderateScale(24)} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Therapist Suggestions</Text>
        <View style={{ width: 40 }} />
      </View>

      {!answers ? (
        <EmptyState />
      ) : rankedTherapists.length === 0 ? (
        <View style={styles.empty}>
          <Icon name="person-search" type="material" color={appColors.grey3} size={moderateScale(56)} />
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
        <>
          {answers && (
            <View style={styles.summaryBanner}>
              <Text style={styles.summaryTitle}>Based on your preferences</Text>
              <View style={styles.summaryChips}>
                {answers.issues.length > 0 && <View style={styles.summaryChip}><Text style={styles.summaryChipText}>{answers.issues.join(', ')}</Text></View>}
                {answers.language !== 'Any' && <View style={styles.summaryChip}><Text style={styles.summaryChipText}>{answers.language}</Text></View>}
                {answers.budget !== 'Any' && <View style={styles.summaryChip}><Text style={styles.summaryChipText}>{answers.budget}</Text></View>}
              </View>
              <Text style={styles.summaryCount}>Found {rankedTherapists.length} therapist{rankedTherapists.length !== 1 ? 's' : ''}</Text>
            </View>
          )}
          <FlatList
            data={rankedTherapists}
            renderItem={renderItem}
            keyExtractor={(item) => item.t.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: appColors.AppLightGray },
  header: {
    backgroundColor: appColors.AppBlue,
    paddingTop: parameters.headerHeightS,
    paddingBottom: scale(15),
    paddingHorizontal: scale(16),
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: { padding: scale(8), marginRight: scale(8) },
  headerTitle: { flex: 1, fontSize: moderateScale(18), fontWeight: 'bold', color: appColors.CardBackground, fontFamily: appFonts.headerTextBold, textAlign: 'center' },
  listContent: { padding: scale(16), paddingBottom: scale(32) },
  card: { backgroundColor: appColors.CardBackground, borderRadius: scale(16), padding: scale(16), marginBottom: scale(12), elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  cardHeader: { flexDirection: 'row', marginBottom: scale(8) },
  name: { fontSize: moderateScale(16), fontWeight: 'bold', color: appColors.grey1, fontFamily: appFonts.headerTextBold },
  specialty: { fontSize: moderateScale(14), color: appColors.grey2, marginTop: scale(2), fontFamily: appFonts.bodyTextRegular },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: scale(6) },
  metaText: { fontSize: moderateScale(12), color: appColors.grey3, marginLeft: scale(4), fontFamily: appFonts.bodyTextRegular },
  price: { fontSize: moderateScale(16), fontWeight: 'bold', color: appColors.AppBlue, fontFamily: appFonts.headerTextBold },
  priceUnit: { fontSize: moderateScale(12), color: appColors.grey2, marginBottom: scale(6), fontFamily: appFonts.bodyTextRegular },
  availabilityBadge: { paddingHorizontal: scale(8), paddingVertical: scale(4), borderRadius: scale(10), alignSelf: 'flex-start' },
  available: { backgroundColor: '#E8F5E8' },
  unavailable: { backgroundColor: '#FFE8E8' },
  availabilityText: { fontSize: moderateScale(12), fontFamily: appFonts.bodyTextMedium },
  availableText: { color: '#4CAF50' },
  unavailableText: { color: '#F44336' },
  reasonsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: scale(8) },
  reasonChip: { backgroundColor: appColors.grey6, paddingHorizontal: scale(10), paddingVertical: scale(6), borderRadius: scale(14), marginRight: scale(6), marginBottom: scale(6) },
  reasonText: { fontSize: moderateScale(12), color: appColors.grey2, fontFamily: appFonts.bodyTextRegular },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: scale(10) },
  primaryBtn: { backgroundColor: appColors.AppBlue, borderRadius: scale(10), paddingVertical: scale(10), paddingHorizontal: scale(18) },
  primaryBtnText: { color: appColors.CardBackground, fontWeight: '700', fontFamily: appFonts.buttonTextBold },
  secondaryBtn: { borderColor: appColors.AppBlue, borderWidth: 1, borderRadius: scale(10), paddingVertical: scale(10), paddingHorizontal: scale(18) },
  secondaryBtnText: { color: appColors.AppBlue, fontWeight: '700', fontFamily: appFonts.buttonTextBold },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: scale(24) },
  emptyTitle: { fontSize: moderateScale(20), fontWeight: 'bold', color: appColors.grey1, marginTop: scale(12), fontFamily: appFonts.headerTextBold },
  emptyText: { fontSize: moderateScale(14), color: appColors.grey3, marginTop: scale(4), marginBottom: scale(16), fontFamily: appFonts.bodyTextRegular, textAlign: 'center' },
  topMatchCard: { borderWidth: 2, borderColor: '#FFD700' },
  topMatchBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF8E1', paddingHorizontal: scale(10), paddingVertical: scale(4), borderRadius: scale(12), alignSelf: 'flex-start', marginBottom: scale(8) },
  topMatchText: { fontSize: moderateScale(12), fontWeight: '700', color: '#F57F17', marginLeft: scale(4), fontFamily: appFonts.bodyTextMedium },
  matchBadge: { backgroundColor: appColors.AppBlue + '15', borderRadius: scale(10), paddingHorizontal: scale(8), paddingVertical: scale(4), alignItems: 'center', marginBottom: scale(4) },
  matchPercent: { fontSize: moderateScale(16), fontWeight: 'bold', color: appColors.AppBlue, fontFamily: appFonts.headerTextBold },
  matchLabel: { fontSize: moderateScale(10), color: appColors.AppBlue, fontFamily: appFonts.bodyTextRegular },
  bioPreview: { fontSize: moderateScale(13), color: appColors.grey2, marginTop: scale(4), marginBottom: scale(4), fontFamily: appFonts.bodyTextRegular, lineHeight: moderateScale(18) },
  summaryBanner: { backgroundColor: appColors.CardBackground, marginHorizontal: scale(16), marginTop: scale(12), padding: scale(14), borderRadius: scale(12), elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
  summaryTitle: { fontSize: moderateScale(15), fontWeight: '600', color: appColors.grey1, fontFamily: appFonts.headerTextBold, marginBottom: scale(6) },
  summaryChips: { flexDirection: 'row', flexWrap: 'wrap' },
  summaryChip: { backgroundColor: appColors.AppBlue + '15', paddingHorizontal: scale(10), paddingVertical: scale(4), borderRadius: scale(12), marginRight: scale(6), marginBottom: scale(4) },
  summaryChipText: { fontSize: moderateScale(12), color: appColors.AppBlue, fontFamily: appFonts.bodyTextRegular },
  summaryCount: { fontSize: moderateScale(13), color: appColors.grey3, marginTop: scale(6), fontFamily: appFonts.bodyTextRegular },
});

export default TherapistSuggestionsScreen;
