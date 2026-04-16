import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from '@rneui/base';
import { appColors, appFonts } from '../../global/Styles';
import { scale, moderateScale } from '../../global/Scaling';

interface WalletSelectionCardProps {
  balance: number;
  isSelected: boolean;
  onPress: () => void;
}

const WalletSelectionCard: React.FC<WalletSelectionCardProps> = ({
  balance,
  isSelected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        isSelected && styles.selectedCard
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon 
            name="account-balance-wallet" 
            type="material" 
            color={appColors.AppBlue} 
            size={moderateScale(28)} 
          />
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.title}>Wellness Vault</Text>
          <Text style={styles.subtitle}>Pay using your internal wallet balance</Text>
          
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Available Balance: </Text>
            <Text style={styles.balanceValue}>UGX {balance.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.selectionIndicator}>
          <Icon 
            name={isSelected ? "radio-button-checked" : "radio-button-unchecked"} 
            type="material" 
            color={isSelected ? appColors.AppBlue : appColors.grey3} 
            size={moderateScale(24)} 
          />
        </View>
      </View>
      
      {isSelected && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>RECOMMENDED</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(15),
    padding: scale(18),
    marginBottom: scale(15),
    borderWidth: 1.5,
    borderColor: 'transparent',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(2) },
    shadowOpacity: 0.08,
    shadowRadius: scale(5),
    position: 'relative',
    overflow: 'hidden',
  },
  selectedCard: {
    borderColor: appColors.AppBlue,
    backgroundColor: '#F8FAFF', // Very light blue tint
    elevation: 4,
    shadowOpacity: 0.12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(25),
    backgroundColor: '#EBF2FF', // Clean light blue
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(15),
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  subtitle: {
    fontSize: moderateScale(13),
    color: appColors.grey3,
    marginTop: scale(2),
    fontFamily: appFonts.headerTextRegular,
    lineHeight: moderateScale(18),
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scale(8),
  },
  balanceLabel: {
    fontSize: moderateScale(12),
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
  },
  balanceValue: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
  },
  selectionIndicator: {
    marginLeft: scale(10),
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: appColors.AppBlue,
    paddingHorizontal: scale(12),
    paddingVertical: scale(4),
    borderBottomLeftRadius: scale(12),
  },
  badgeText: {
    fontSize: moderateScale(10),
    fontWeight: 'bold',
    color: appColors.CardBackground,
    fontFamily: appFonts.headerTextBold,
    letterSpacing: 0.5,
  },
});

export default WalletSelectionCard;
