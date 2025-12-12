import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/base';
import { Skeleton } from '@rneui/themed';
import { useToast } from 'native-base';
import { appColors, appFonts } from '../global/Styles';
import ISGenericHeader from '../components/ISGenericHeader';
import ISStatusBar from '../components/ISStatusBar';
import { NavigationProp } from '@react-navigation/native';
import { getMeditationArticles, getMeditationSounds } from '../api/client/meditations';
import { getImageSource, FALLBACK_IMAGES } from '../utils/imageHelpers';
import { mockMeditationQuotes } from '../global/MockData';

const { width, height } = Dimensions.get('window');

interface MeditationsScreenProps {
  navigation: NavigationProp<any>;
}

interface Article {
  id: string;
  title: string;
  excerpt: string;
  readTime: string;
  category: string;
  image: any;
  content: string;
}

interface Sound {
  id: string;
  title: string;
  duration: string;
  category: string;
  icon: string;
  color: string;
  description: string;
}

interface Quote {
  id: string;
  text: string;
  author: string;
}

const MeditationsScreen: React.FC<MeditationsScreenProps> = ({ navigation }) => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'articles' | 'sounds' | 'quotes'>('articles');
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [sounds, setSounds] = useState<Sound[]>([]);
  const quotes: Quote[] = mockMeditationQuotes; // Keep quotes as mock for now
  const quoteFlatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const loadData = async () => {
    if (activeTab === 'quotes') return; // Quotes use mock data
    
    setIsLoading(true);
    try {
      if (activeTab === 'articles') {
        await loadArticles();
      } else if (activeTab === 'sounds') {
        await loadSounds();
      }
    } catch (error: any) {
      console.error('❌ Error loading meditation data:', error);
      toast.show({
        description: error.response?.data?.message || 'Failed to load data. Please try again.',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadArticles = async () => {
    console.log('📞 Calling getMeditationArticles API...');
    const response = await getMeditationArticles(1, 20);
    console.log('✅ Articles API Response:', JSON.stringify(response, null, 2));
    
    const apiArticles = response.data?.articles || [];
    const mappedArticles: Article[] = apiArticles.map((article: any) => ({
      id: article.id?.toString() || article._id?.toString(),
      title: article.title,
      excerpt: article.excerpt || article.description || '',
      readTime: article.readTime || article.read_time || '5 min read',
      category: article.category || 'General',
      image: getImageSource(article.image || article.coverImage, FALLBACK_IMAGES.event),
      content: article.content || '',
    }));
    
    setArticles(mappedArticles);
    console.log('✅ Mapped Articles:', mappedArticles.length);
  };

  const loadSounds = async () => {
    console.log('📞 Calling getMeditationSounds API...');
    const response = await getMeditationSounds(1, 20);
    console.log('✅ Sounds API Response:', JSON.stringify(response, null, 2));
    
    const apiSounds = response.data?.sounds || [];
    const mappedSounds: Sound[] = apiSounds.map((sound: any) => ({
      id: sound.id?.toString() || sound._id?.toString(),
      title: sound.title,
      duration: sound.duration || '30 min',
      category: sound.category || 'General',
      icon: sound.icon || 'music-note',
      color: sound.color || '#2196F3',
      description: sound.description || '',
    }));
    
    setSounds(mappedSounds);
    console.log('✅ Mapped Sounds:', mappedSounds.length);
  };


  const ArticleSkeleton = () => (
    <View style={styles.articleCard}>
      <Skeleton animation="pulse" width="100%" height={180} />
      <View style={styles.articleContent}>
        <Skeleton animation="pulse" width="30%" height={20} style={{ marginBottom: 8 }} />
        <Skeleton animation="pulse" width="90%" height={24} style={{ marginBottom: 8 }} />
        <Skeleton animation="pulse" width="100%" height={16} />
        <Skeleton animation="pulse" width="80%" height={16} style={{ marginTop: 4 }} />
      </View>
    </View>
  );

  const SoundSkeleton = () => (
    <View style={styles.soundCard}>
      <Skeleton animation="pulse" width={64} height={64} style={{ borderRadius: 32, marginBottom: 12 }} />
      <Skeleton animation="pulse" width="80%" height={18} style={{ marginBottom: 4 }} />
      <Skeleton animation="pulse" width="50%" height={14} />
    </View>
  );

  const EmptyState = ({ type }: { type: 'articles' | 'sounds' }) => (
    <View style={styles.emptyContainer}>
      <Icon 
        name={type === 'articles' ? 'article' : 'headphones'} 
        type="material" 
        color={appColors.AppGray} 
        size={80} 
      />
      <Text style={styles.emptyTitle}>
        {type === 'articles' ? 'No Articles Yet' : 'No Sounds Available'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {type === 'articles' 
          ? 'Check back later for meditation articles and guides.' 
          : 'Check back later for calming sounds and music.'}
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={loadData}>
        <Text style={styles.retryButtonText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );

  const renderArticles = () => {
    if (isLoading) {
      return (
        <View style={styles.contentContainer}>
          <ArticleSkeleton />
          <ArticleSkeleton />
          <ArticleSkeleton />
        </View>
      );
    }

    if (articles.length === 0) {
      return <EmptyState type="articles" />;
    }

    return (
    <View style={styles.contentContainer}>
      {articles.map((article) => (
        <TouchableOpacity
          key={article.id}
          style={styles.articleCard}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('ArticleDetailScreen', { article })}
        >
          <Image source={article.image} style={styles.articleImage} />
          <View style={styles.articleContent}>
            <View style={styles.articleHeader}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{article.category}</Text>
              </View>
              <Text style={styles.readTime}>{article.readTime}</Text>
            </View>
            <Text style={styles.articleTitle}>{article.title}</Text>
            <Text style={styles.articleExcerpt} numberOfLines={2}>
              {article.excerpt}
            </Text>
            <View style={styles.articleFooter}>
              <Text style={styles.readMoreText}>Read More</Text>
              <Icon name="arrow-forward" type="material" color={appColors.AppBlue} size={16} />
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
    );
  };

  const renderSounds = () => {
    if (isLoading) {
      return (
        <View style={styles.contentContainer}>
          <View style={styles.soundsGrid}>
            <SoundSkeleton />
            <SoundSkeleton />
            <SoundSkeleton />
            <SoundSkeleton />
          </View>
        </View>
      );
    }

    if (sounds.length === 0) {
      return <EmptyState type="sounds" />;
    }

    return (
    <View style={styles.contentContainer}>
      <View style={styles.soundsGrid}>
        {sounds.map((sound) => (
          <TouchableOpacity
            key={sound.id}
            style={styles.soundCard}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('SoundPlayerScreen', { sound })}
          >
            <View style={[styles.soundIconContainer, { backgroundColor: sound.color + '20' }]}>
              <Icon name={sound.icon} type="material" color={sound.color} size={32} />
            </View>
            <Text style={styles.soundTitle} numberOfLines={1}>
              {sound.title}
            </Text>
            <Text style={styles.soundCategory}>{sound.category}</Text>
            <View style={styles.soundFooter}>
              <Icon name="schedule" type="material" color={appColors.grey3} size={14} />
              <Text style={styles.soundDuration}>{sound.duration}</Text>
            </View>
            <View style={styles.playButton}>
              <Icon name="play-arrow" type="material" color="#FFFFFF" size={20} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleShareQuote = async (quote: Quote) => {
    try {
      const { Share } = await import('react-native');
      await Share.share({
        message: `"${quote.text}"\n\n— ${quote.author}\n\nShared from Innerspark Meditations`,
      });
    } catch (error) {
      console.log('Error sharing quote:', error);
    }
  };

  const renderQuoteCard = ({ item, index }: { item: Quote; index: number }) => (
    <View style={styles.quoteFullCard}>
      <View style={styles.quoteCardContent}>
        <Icon
          name="format-quote"
          type="material"
          color={appColors.AppBlue}
          size={80}
          style={styles.quoteIconLarge}
        />
        <Text style={styles.quoteTextLarge}>{item.text}</Text>
        <Text style={styles.quoteAuthorLarge}>— {item.author}</Text>
        
        {/* Share Button */}
        <TouchableOpacity
          style={styles.shareQuoteButton}
          onPress={() => handleShareQuote(item)}
        >
          <Icon name="share" type="material" color={appColors.AppBlue} size={20} />
          <Text style={styles.shareQuoteText}>Share Quote</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderQuotes = () => (
    <View style={styles.quotesContainer}>
      <FlatList
        ref={quoteFlatListRef}
        data={quotes}
        renderItem={renderQuoteCard}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentQuoteIndex(index);
        }}
      />
      
      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        {quotes.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              quoteFlatListRef.current?.scrollToIndex({ index, animated: true });
              setCurrentQuoteIndex(index);
            }}
          >
            <View
              style={[
                styles.paginationDot,
                index === currentQuoteIndex && styles.paginationDotActive,
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ISStatusBar backgroundColor={appColors.AppBlue} />
      
      <ISGenericHeader
        title="Meditations"
        navigation={navigation}
        hasRightIcon={false}
      />

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'articles' && styles.activeTab]}
          onPress={() => setActiveTab('articles')}
        >
          <Icon
            name="article"
            type="material"
            color={activeTab === 'articles' ? appColors.AppBlue : appColors.grey3}
            size={20}
          />
          <Text style={[styles.tabText, activeTab === 'articles' && styles.activeTabText]}>
            Articles
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'sounds' && styles.activeTab]}
          onPress={() => setActiveTab('sounds')}
        >
          <Icon
            name="headphones"
            type="material"
            color={activeTab === 'sounds' ? appColors.AppBlue : appColors.grey3}
            size={20}
          />
          <Text style={[styles.tabText, activeTab === 'sounds' && styles.activeTabText]}>
            Sounds
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'quotes' && styles.activeTab]}
          onPress={() => setActiveTab('quotes')}
        >
          <Icon
            name="format-quote"
            type="material"
            color={activeTab === 'quotes' ? appColors.AppBlue : appColors.grey3}
            size={20}
          />
          <Text style={[styles.tabText, activeTab === 'quotes' && styles.activeTabText]}>
            Quotes
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === 'quotes' ? (
        renderQuotes()
      ) : (
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[appColors.AppBlue]}
              tintColor={appColors.AppBlue}
            />
          }
        >
          {activeTab === 'articles' && renderArticles()}
          {activeTab === 'sounds' && renderSounds()}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.AppLightGray,
  },
  scrollView: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: appColors.CardBackground,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: appColors.grey6,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: appColors.AppBlue + '15',
  },
  tabText: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextMedium,
    marginLeft: 6,
  },
  activeTabText: {
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
  },
  contentContainer: {
    padding: 16,
  },
  // Article Styles
  articleCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  articleImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  articleContent: {
    padding: 16,
  },
  articleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: appColors.AppBlue + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextMedium,
  },
  readTime: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 8,
  },
  articleExcerpt: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    lineHeight: 20,
    marginBottom: 12,
  },
  articleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMoreText: {
    fontSize: 14,
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextMedium,
    marginRight: 4,
  },
  // Sound Styles
  soundsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  soundCard: {
    width: (width - 48) / 2,
    backgroundColor: appColors.CardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
  },
  soundIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  soundTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 4,
  },
  soundCategory: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginBottom: 8,
  },
  soundFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  soundDuration: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginLeft: 4,
  },
  playButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: appColors.AppBlue,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  // Quote Styles (Old - kept for reference)
  quoteCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: appColors.AppBlue,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quoteIcon: {
    marginBottom: 12,
    opacity: 0.3,
  },
  quoteText: {
    fontSize: 16,
    color: appColors.grey1,
    fontFamily: appFonts.headerTextRegular,
    lineHeight: 24,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  quoteAuthor: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextMedium,
    textAlign: 'right',
  },
  // New Swipeable Quote Styles
  quotesContainer: {
    flex: 1,
  },
  quoteFullCard: {
    width: width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 80,
  },
  quoteCardContent: {
    backgroundColor: appColors.CardBackground,
    borderRadius: 24,
    padding: 40,
    width: '100%',
    minHeight: height * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    borderLeftWidth: 6,
    borderLeftColor: appColors.AppBlue,
  },
  quoteIconLarge: {
    marginBottom: 24,
    opacity: 0.2,
  },
  quoteTextLarge: {
    fontSize: 22,
    color: appColors.grey1,
    fontFamily: appFonts.headerTextRegular,
    lineHeight: 34,
    marginBottom: 24,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  quoteAuthorLarge: {
    fontSize: 18,
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
    textAlign: 'center',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: appColors.grey5,
  },
  paginationDotActive: {
    width: 24,
    backgroundColor: appColors.AppBlue,
  },
  shareQuoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: appColors.AppBlue + '15',
    borderRadius: 24,
    gap: 8,
  },
  shareQuoteText: {
    fontSize: 14,
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextMedium,
  },
  bottomSpacing: {
    height: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.grey1,
    marginTop: 16,
    fontFamily: appFonts.headerTextBold,
  },
  emptySubtitle: {
    fontSize: 14,
    color: appColors.grey2,
    textAlign: 'center',
    marginTop: 8,
    fontFamily: appFonts.headerTextRegular,
  },
  retryButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 16,
  },
  retryButtonText: {
    color: appColors.CardBackground,
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
});

export default MeditationsScreen;
