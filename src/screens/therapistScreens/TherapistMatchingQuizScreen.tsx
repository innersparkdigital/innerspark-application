/**
 * Therapist Matching Quiz Screen - Multi-step preferences for smart matching
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button } from '@rneui/base';
import { appColors, parameters, appFonts } from '../../global/Styles';
import { useToast } from 'native-base';

interface QuizAnswers {
  genderPreference: 'Any' | 'Male' | 'Female';
  issues: string[];
  language: 'Any' | 'English' | 'Luganda' | 'French';
  budget: 'Any' | 'UGX 40k - 50k' | 'UGX 50k - 60k' | 'UGX 60k+';
  availability: 'Anytime' | 'Weekdays' | 'Weekends' | 'Evenings';
}

interface TherapistMatchingQuizScreenProps {
  navigation: any;
  route: any;
}

const TherapistMatchingQuizScreen: React.FC<TherapistMatchingQuizScreenProps> = ({ navigation, route }) => {
  const toast = useToast();

  const [step, setStep] = useState<number>(1);
  const [saving, setSaving] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [answers, setAnswers] = useState<QuizAnswers>(() => {
    const prev = route?.params?.prevAnswers as QuizAnswers | undefined;
    return prev ?? {
      genderPreference: 'Any',
      issues: [],
      language: 'Any',
      budget: 'Any',
      availability: 'Anytime',
    };
  });

  const issueOptions = [
    'Anxiety', 'Depression', 'Relationship', 'Trauma/PTSD', 'Stress', 'Addiction', 'Adolescent', 'Grief'
  ];

  const nextStep = () => setStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const validateStep = (): boolean => {
    const e: Record<string, string> = {};
    if (step === 2 && answers.issues.length === 0) {
      e.issues = 'Please select at least one area of concern';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSaveDraft = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.show({ description: 'Draft saved locally', duration: 1500 });
    }, 800);
  };

  const handleSubmit = () => {
    if (!validateStep()) return;
    // Navigate to suggestions with answers
    navigation.navigate('TherapistSuggestionsScreen', { answers });
  };

  const toggleIssue = (issue: string) => {
    setAnswers(prev => ({
      ...prev,
      issues: prev.issues.includes(issue)
        ? prev.issues.filter(i => i !== issue)
        : [...prev.issues, issue]
    }));
  };

  const renderProgress = () => (
    <View style={styles.progressBarWrap}>
      {[1,2,3,4,5].map(i => (
        <View key={i} style={[styles.progressDot, i <= step ? styles.progressDotActive : null]} />
      ))}
    </View>
  );

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" type="material" color={appColors.grey1} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Therapist Matching Quiz</Text>
        <TouchableOpacity style={styles.headerRight} onPress={handleSaveDraft}>
          {saving ? (
            <Icon name="check" type="material" color={appColors.AppBlue} size={22} />
          ) : (
            <Text style={styles.saveDraftText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      {renderProgress()}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {step === 1 && (
          <Section title="Gender Preference">
            <View style={styles.chipRow}>
              {(['Any','Male','Female'] as const).map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.chip, answers.genderPreference === opt && styles.chipSelected]}
                  onPress={() => setAnswers(prev => ({ ...prev, genderPreference: opt }))}
                >
                  <Text style={[styles.chipText, answers.genderPreference === opt && styles.chipTextSelected]}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Section>
        )}

        {step === 2 && (
          <Section title="Areas of Concern">
            <Text style={styles.helperText}>Select one or more</Text>
            <View style={styles.chipWrap}>
              {issueOptions.map((issue) => (
                <TouchableOpacity
                  key={issue}
                  style={[styles.chip, answers.issues.includes(issue) && styles.chipSelected]}
                  onPress={() => toggleIssue(issue)}
                >
                  <Text style={[styles.chipText, answers.issues.includes(issue) && styles.chipTextSelected]}>
                    {issue}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.issues && <Text style={styles.errorText}>{errors.issues}</Text>}
          </Section>
        )}

        {step === 3 && (
          <Section title="Preferred Language">
            <View style={styles.chipRow}>
              {(['Any','English','Luganda','French'] as const).map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.chip, answers.language === opt && styles.chipSelected]}
                  onPress={() => setAnswers(prev => ({ ...prev, language: opt }))}
                >
                  <Text style={[styles.chipText, answers.language === opt && styles.chipTextSelected]}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Section>
        )}

        {step === 4 && (
          <Section title="Budget per Session">
            <View style={styles.chipWrap}>
              {(['Any','UGX 40k - 50k','UGX 50k - 60k','UGX 60k+'] as const).map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.chip, answers.budget === opt && styles.chipSelected]}
                  onPress={() => setAnswers(prev => ({ ...prev, budget: opt }))}
                >
                  <Text style={[styles.chipText, answers.budget === opt && styles.chipTextSelected]}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Section>
        )}

        {step === 5 && (
          <Section title="Availability">
            <View style={styles.chipWrap}>
              {(['Anytime','Weekdays','Weekends','Evenings'] as const).map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.chip, answers.availability === opt && styles.chipSelected]}
                  onPress={() => setAnswers(prev => ({ ...prev, availability: opt }))}
                >
                  <Text style={[styles.chipText, answers.availability === opt && styles.chipTextSelected]}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Section>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Footer Controls */}
      <View style={styles.footer}>
        <Button
          title="Back"
          type="outline"
          onPress={prevStep}
          disabled={step === 1}
          buttonStyle={styles.backBtn}
          titleStyle={styles.backBtnText}
        />
        {step < 5 ? (
          <Button
            title="Next"
            onPress={() => {
              if (validateStep()) nextStep();
            }}
            buttonStyle={styles.nextBtn}
            titleStyle={styles.nextBtnText}
          />
        ) : (
          <Button
            title="See Suggestions"
            onPress={handleSubmit}
            buttonStyle={styles.nextBtn}
            titleStyle={styles.nextBtnText}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: appColors.AppLightGray },
  header: {
    backgroundColor: appColors.CardBackground,
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
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    textAlign: 'center',
  },
  headerRight: { padding: 8, minWidth: 40, alignItems: 'flex-end' },
  saveDraftText: { color: appColors.AppBlue, fontFamily: appFonts.appTextRegular, fontSize: 14, fontWeight: '600' },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },
  section: { backgroundColor: appColors.CardBackground, padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: appColors.grey1, fontFamily: appFonts.headerTextBold, marginBottom: 8 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap' },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: { backgroundColor: appColors.grey6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 8, marginBottom: 8 },
  chipSelected: { backgroundColor: appColors.AppBlue + '20', borderWidth: 1, borderColor: appColors.AppBlue },
  chipText: { fontSize: 14, color: appColors.grey2, fontFamily: appFonts.appTextRegular },
  chipTextSelected: { color: appColors.AppBlue, fontWeight: '600' },
  helperText: { fontSize: 12, color: appColors.grey3, marginBottom: 8, fontFamily: appFonts.appTextRegular },
  errorText: { fontSize: 12, color: '#F44336', fontFamily: appFonts.appTextRegular, marginTop: 4 },
  progressBarWrap: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 10, backgroundColor: appColors.CardBackground },
  progressDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: appColors.grey6, marginHorizontal: 5 },
  progressDotActive: { backgroundColor: appColors.AppBlue },
  footer: { backgroundColor: appColors.CardBackground, padding: 16, flexDirection: 'row', justifyContent: 'space-between', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  backBtn: { borderColor: appColors.AppBlue, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 },
  backBtnText: { color: appColors.AppBlue, fontFamily: appFonts.appTextRegular, fontWeight: '600' },
  nextBtn: { backgroundColor: appColors.AppBlue, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 },
  nextBtnText: { color: appColors.CardBackground, fontFamily: appFonts.appTextRegular, fontWeight: '700' },
  bottomSpacer: { height: 100 },
});

export default TherapistMatchingQuizScreen;
