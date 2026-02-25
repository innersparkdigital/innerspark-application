/**
 * Therapist Select Client Screen - Choose a client to start a conversation
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/themed';
import { useSelector } from 'react-redux';
import { appColors, appFonts } from '../../../global/Styles';
import ISGenericHeader from '../../../components/ISGenericHeader';
import ISStatusBar from '../../../components/ISStatusBar';
import { getClients } from '../../../api/therapist';

interface Client {
  id: string;
  name: string;
  avatar: string;
  lastSession: string;
  status: 'active' | 'inactive';
  hasExistingChat: boolean;
}

const THSelectClientScreen = ({ navigation }: any) => {
  const userDetails = useSelector((state: any) => state.userData.userDetails);
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const therapistId = userDetails?.id || '52863268761';
      // Fetch active clients from the clients API
      const res: any = await getClients(therapistId, { status: 'active' });

      if (res?.data?.clients) {
        const mappedClients: Client[] = res.data.clients.map((c: any) => ({
          id: c.id,
          name: c.name,
          avatar: c.avatar || '�',
          lastSession: c.lastSessionDate ? new Date(c.lastSessionDate).toLocaleDateString() : 'No previous session',
          status: c.status || 'active',
          hasExistingChat: false // In a real app we might cross-reference active chats here, but default to false to allow starting new conversation
        }));
        setClients(mappedClients);
      } else {
        setClients([]);
      }
    } catch (error: any) {
      const errorMessage = error.backendMessage || error.message || 'Failed to load clients';
      console.error('Clients API Error:', errorMessage);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectClient = (client: Client) => {
    if (client.hasExistingChat) {
      // Navigate to existing conversation
      navigation.navigate('THChatConversationScreen', {
        chat: {
          id: client.id,
          clientName: client.name,
          avatar: client.avatar,
          online: client.status === 'active',
        },
      });
    } else {
      // Start new conversation
      Alert.alert(
        'Start Conversation',
        `Start a new conversation with ${client.name}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Start',
            onPress: () => {
              navigation.navigate('THChatConversationScreen', {
                chat: {
                  id: client.id,
                  clientName: client.name,
                  avatar: client.avatar,
                  online: client.status === 'active',
                },
              });
            },
          },
        ]
      );
    }
  };

  const renderClient = ({ item }: { item: Client }) => (
    <TouchableOpacity
      style={styles.clientCard}
      onPress={() => handleSelectClient(item)}
      activeOpacity={0.7}
    >
      <View style={styles.clientLeft}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarEmoji}>{item.avatar}</Text>
          {item.status === 'active' && <View style={styles.onlineIndicator} />}
        </View>
        <View style={styles.clientInfo}>
          <Text style={styles.clientName}>{item.name}</Text>
          <Text style={styles.lastSession}>Last session: {item.lastSession}</Text>
        </View>
      </View>
      <View style={styles.clientRight}>
        {item.hasExistingChat ? (
          <View style={styles.chatBadge}>
            <Icon type="material" name="chat-bubble" size={16} color={appColors.AppBlue} />
          </View>
        ) : (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>New</Text>
          </View>
        )}
        <Icon type="material" name="chevron-right" size={24} color={appColors.grey3} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ISStatusBar />
      <ISGenericHeader title="Select Client" navigation={navigation} />

      <View style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon type="material" name="search" size={20} color={appColors.grey3} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search clients..."
            placeholderTextColor={appColors.grey3}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon type="material" name="close" size={20} color={appColors.grey3} />
            </TouchableOpacity>
          )}
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Icon type="material" name="info-outline" size={20} color={appColors.AppBlue} />
          <Text style={styles.infoText}>
            Select a client to start or continue a conversation
          </Text>
        </View>

        {/* Clients List */}
        <FlatList
          data={filteredClients}
          renderItem={renderClient}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Icon type="material" name="person-search" size={60} color={appColors.grey3} />
              <Text style={styles.emptyText}>No clients found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your search</Text>
            </View>
          }
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    margin: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextRegular,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.AppBlue + '10',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  clientCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  clientLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: appColors.AppBlue + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  avatarEmoji: {
    fontSize: 24,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: appColors.AppGreen,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 4,
  },
  lastSession: {
    fontSize: 13,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
  },
  clientRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chatBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: appColors.AppBlue + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newBadge: {
    backgroundColor: appColors.AppGreen + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  newBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: appColors.AppGreen,
    fontFamily: appFonts.bodyTextBold,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey2,
    fontFamily: appFonts.headerTextBold,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    marginTop: 8,
  },
});

export default THSelectClientScreen;
