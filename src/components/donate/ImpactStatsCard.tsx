/**
 * Impact Stats Card Component
 * Displays community donation impact statistics
 * 
 * NOTE: This component currently uses mock data.
 * Should be integrated with real API when donation/impact endpoints are available.
 * See: DOCS/DONATION_SCREEN_API_ANALYSIS.md
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { appColors, appFonts } from '../../global/Styles';

interface ImpactStats {
  membersHelped: number;
  sessionsSubsidized: number;
  fundBalance: string;
  thisMonth: number;
}

interface ImpactStatsCardProps {
  stats: ImpactStats;
  containerStyle?: any;
}

const ImpactStatsCard: React.FC<ImpactStatsCardProps> = ({ stats, containerStyle }) => {
  return (
    <View style={[styles.impactSection, containerStyle]}>
      <Text style={styles.sectionTitle}>Our Impact</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.membersHelped}</Text>
          <Text style={styles.statLabel}>Members Helped</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.sessionsSubsidized}</Text>
          <Text style={styles.statLabel}>Sessions Subsidized</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.thisMonth}</Text>
          <Text style={styles.statLabel}>This Month</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.fundBalance}</Text>
          <Text style={styles.statLabel}>Active Fund</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  impactSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    marginBottom: 15,
    fontFamily: appFonts.headerTextBold,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 12,
    padding: 15,
    width: '48%',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    marginBottom: 5,
    fontFamily: appFonts.headerTextBold,
  },
  statLabel: {
    fontSize: 12,
    color: appColors.grey2,
    textAlign: 'center',
    fontFamily: appFonts.headerTextRegular,
  },
});

export default ImpactStatsCard;
