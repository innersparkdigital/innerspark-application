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
import { scale, moderateScale } from '../global/Scaling';
import ISGenericHeader from '../components/ISGenericHeader';
import ISStatusBar from '../components/ISStatusBar';
import { NavigationProp } from '@react-navigation/native';
import { appImages } from '../global/Data';
import { getMeditationArticles, getMeditationSounds, getMeditationQuotes } from '../api/client/meditations';
import { calculateReadTime } from '../utils/textHelpers';
import { parseIconProps } from '../utils/iconHelper';

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
  audioUrl: string;
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
  const [quotes, setQuotes] = useState<Quote[]>([]);
  
  // Pagination State
  const [articlePage, setArticlePage] = useState(1);
  const [articleTotalPages, setArticleTotalPages] = useState(1);
  const [isFetchingMoreArticles, setIsFetchingMoreArticles] = useState(false);
  
  const [soundPage, setSoundPage] = useState(1);
  const [soundTotalPages, setSoundTotalPages] = useState(1);
  const [isFetchingMoreSounds, setIsFetchingMoreSounds] = useState(false);
  
  const [quotePage, setQuotePage] = useState(1);
  const [quoteTotalPages, setQuoteTotalPages] = useState(1);
  const [isFetchingMoreQuotes, setIsFetchingMoreQuotes] = useState(false);

  const quoteFlatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const loadData = async (isInitial = true) => {
    if (isInitial) {
      setIsLoading(true);
      // Reset pages on initial load/tab switch
      if (activeTab === 'articles') setArticlePage(1);
      if (activeTab === 'sounds') setSoundPage(1);
      if (activeTab === 'quotes') setQuotePage(1);
    }
    
    try {
      if (activeTab === 'articles') {
        await fetchArticles(isInitial ? 1 : articlePage + 1);
      } else if (activeTab === 'sounds') {
        await fetchSounds(isInitial ? 1 : soundPage + 1);
      } else if (activeTab === 'quotes') {
        await fetchQuotes(isInitial ? 1 : quotePage + 1);
      }
    } catch (error: any) {
      console.error('❌ Error loading meditation data:', error);
      toast.show({
        description: error.response?.data?.message || 'Failed to load data. Please try again.',
        duration: 3000,
      });
    } finally {
      if (isInitial) setIsLoading(false);
    }
  };

  const fetchArticles = async (page: number) => {
    if (page > 1) setIsFetchingMoreArticles(true);
    
    try {
      console.log(`📞 Calling getMeditationArticles API for page ${page}...`);
      const response = await getMeditationArticles(page, 10);
      console.log('✅ Articles API Response:', JSON.stringify(response.data?.pagination, null, 2));
      
      const baseUrl = response.base_url || '';
      const apiArticles = response.data?.articles || [];
      const pagination = response.data?.pagination || { currentPage: 1, totalPages: 1 };
      
      const mappedArticles: Article[] = apiArticles.map((article: any) => ({
        id: article.id?.toString() || article._id?.toString(),
        title: article.title,
        excerpt: article.excerpt || article.description || '',
        readTime: article.readTime || article.read_time || calculateReadTime(article.content || article.excerpt || ''),
        category: article.category || 'General',
        image: article.image ? { uri: `${baseUrl}/${article.image}` } : appImages.isDefaultImage,
        content: article.content || '',
      }));

      if (page === 1) {
        setArticles(mappedArticles);
      } else {
        setArticles(prev => [...prev, ...mappedArticles]);
      }
      
      setArticlePage(page);
      setArticleTotalPages(pagination.totalPages);
    } finally {
      setIsFetchingMoreArticles(false);
    }
  };

  const fetchSounds = async (page: number) => {
    if (page > 1) setIsFetchingMoreSounds(true);
    
    try {
      console.log(`📞 Calling getMeditationSounds API for page ${page}...`);
      const response = await getMeditationSounds(page, 10);
      
      const baseUrl = response.base_url || '';
      const apiSounds = response.data?.sounds || [];
      const pagination = response.data?.pagination || { currentPage: 1, totalPages: 1 };
      
      const mappedSounds: Sound[] = apiSounds.map((sound: any) => ({
        id: sound.id?.toString() || sound._id?.toString(),
        title: sound.title,
        duration: sound.duration || '30 min',
        category: sound.category || 'General',
        icon: sound.icon || 'music-note',
        color: sound.color || '#2196F3',
        description: sound.description || '',
        audioUrl: sound.audioUrl ? `${baseUrl}/${sound.audioUrl}` : '',
      }));

      if (page === 1) {
        setSounds(mappedSounds);
      } else {
        setSounds(prev => [...prev, ...mappedSounds]);
      }
      
      setSoundPage(page);
      setSoundTotalPages(pagination.totalPages);
    } finally {
      setIsFetchingMoreSounds(false);
    }
  };

  const fetchQuotes = async (page: number) => {
    if (page > 1) setIsFetchingMoreQuotes(true);
    
    try {
      console.log(`📞 Calling getMeditationQuotes API for page ${page}...`);
      const response = await getMeditationQuotes(page, 10);
      
      const apiQuotes = response.data?.quotes || [];
      const pagination = response.data?.pagination || { currentPage: 1, totalPages: 1 };
      
      const mappedQuotes: Quote[] = apiQuotes.map((quote: any) => ({
        id: quote.id?.toString() || quote._id?.toString(),
        text: quote.text,
        author: quote.author || 'Unknown',
      }));

      if (page === 1) {
        setQuotes(mappedQuotes);
      } else {
        setQuotes(prev => [...prev, ...mappedQuotes]);
      }
      
      setQuotePage(page);
      setQuoteTotalPages(pagination.totalPages);
    } finally {
      setIsFetchingMoreQuotes(false);
    }
  };


  const ArticleSkeleton = () => (
    <View style={styles.articleCard}>
      <Skeleton animation="pulse" width="100%" height={scale(180)} />
      <View style={styles.articleContent}>
        <Skeleton animation="pulse" width="30%" height={scale(20)} style={{ marginBottom: scale(8) }} />
        <Skeleton animation="pulse" width="90%" height={scale(24)} style={{ marginBottom: scale(8) }} />
        <Skeleton animation="pulse" width="100%" height={scale(16)} />
        <Skeleton animation="pulse" width="80%" height={scale(16)} style={{ marginTop: scale(4) }} />
      </View>
    </View>
  );

  const SoundSkeleton = () => (
    <View style={styles.soundCard}>
      <Skeleton animation="pulse" width={scale(64)} height={scale(64)} style={{ borderRadius: scale(32), marginBottom: scale(12) }} />
      <Skeleton animation="pulse" width="80%" height={moderateScale(18)} style={{ marginBottom: scale(4) }} />
      <Skeleton animation="pulse" width="50%" height={moderateScale(14)} />
    </View>
  );

  const EmptyState = ({ type }: { type: 'articles' | 'sounds' | 'quotes' }) => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Icon
          name={type === 'articles' ? 'article' : type === 'sounds' ? 'headphones' : 'format-quote'}
          type="material"
          color={appColors.AppBlue}
          size={moderateScale(48)}
        />
      </View>
      <Text style={styles.emptyTitle}>
        {type === 'articles' ? 'No Articles Yet' : type === 'sounds' ? 'No Sounds Available' : 'No Quotes Yet'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {type === 'articles'
          ? 'Check back later for meditation articles and guides.'
          : type === 'sounds'
            ? 'Check back later for calming sounds and music.'
            : 'Check back later for inspiring meditation quotes.'}
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={loadData}>
        <Text style={styles.retryButtonText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );

  const handleLoadMore = () => {
    if (activeTab === 'articles' && articlePage < articleTotalPages && !isFetchingMoreArticles) {
      loadData(false);
    } else if (activeTab === 'sounds' && soundPage < soundTotalPages && !isFetchingMoreSounds) {
      loadData(false);
    } else if (activeTab === 'quotes' && quotePage < quoteTotalPages && !isFetchingMoreQuotes) {
      loadData(false);
    }
  };

  const renderFooter = () => {
    const isFetchingMore = 
      (activeTab === 'articles' && isFetchingMoreArticles) || 
      (activeTab === 'sounds' && isFetchingMoreSounds) ||
      (activeTab === 'quotes' && isFetchingMoreQuotes);

    if (!isFetchingMore) return <View style={styles.bottomSpacing} />;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={appColors.AppBlue} />
      </View>
    );
  };

  const renderArticles = () => {
    if (isLoading) {
      return (
        <View style={styles.contentContainer}>
          <ArticleSkeleton />
          <ArticleSkeleton />
        </View>
      );
    }

    if (articles.length === 0) {
      return <EmptyState type="articles" />;
    }

    return (
      <FlatList
        data={articles}
        renderItem={({ item: article }) => (
          <TouchableOpacity
            key={article.id}
            style={styles.articleCard}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('ArticleDetailScreen', { article, allArticles: articles })}
          >
            <Image source={article.image || appImages.isDefaultImage} style={styles.articleImage} />
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
                <Icon name="arrow-forward" type="material" color={appColors.AppBlue} size={moderateScale(16)} />
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contentContainer}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[appColors.AppBlue]}
            tintColor={appColors.AppBlue}
          />
        }
      />
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
      <FlatList
        data={sounds}
        numColumns={2}
        columnWrapperStyle={styles.soundsGrid}
        renderItem={({ item: sound }) => (
          <TouchableOpacity
            key={sound.id}
            style={styles.soundCard}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('SoundPlayerScreen', { sound })}
          >
            <View style={[styles.soundIconContainer, { backgroundColor: sound.color + '20' }]}>
              <Icon {...parseIconProps(sound.icon)} color={sound.color || appColors.AppBlue} size={moderateScale(32)} />
            </View>
            <Text style={styles.soundTitle} numberOfLines={1}>
              {sound.title}
            </Text>
            <Text style={styles.soundCategory}>{sound.category}</Text>
            <View style={styles.soundFooter}>
              <Icon name="schedule" type="material" color={appColors.grey3} size={moderateScale(14)} />
              <Text style={styles.soundDuration}>{sound.duration}</Text>
            </View>
            <View style={styles.playButton}>
              <Icon name="play-arrow" type="material" color="#FFFFFF" size={moderateScale(20)} />
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contentContainer}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[appColors.AppBlue]}
            tintColor={appColors.AppBlue}
          />
        }
      />
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
          size={moderateScale(80)}
          style={styles.quoteIconLarge}
        />
        <Text style={styles.quoteTextLarge}>{item.text}</Text>
        <Text style={styles.quoteAuthorLarge}>— {item.author}</Text>

        {/* Share Button */}
        <TouchableOpacity
          style={styles.shareQuoteButton}
          onPress={() => handleShareQuote(item)}
        >
          <Icon name="share" type="material" color={appColors.AppBlue} size={moderateScale(20)} />
          <Text style={styles.shareQuoteText}>Share Quote</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderQuotes = () => {
    if (isLoading) {
      return (
        <View style={[styles.quotesContainer, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={appColors.AppBlue} />
        </View>
      );
    }

    if (quotes.length === 0) {
      return (
        <View style={styles.quotesContainer}>
          <EmptyState type="quotes" />
        </View>
      );
    }

    return (
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
            
            // If near end of current loaded quotes, load more
            if (index >= quotes.length - 2) {
              handleLoadMore();
            }
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
  };

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
            size={moderateScale(20)}
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
            size={moderateScale(20)}
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
            size={moderateScale(20)}
          />
          <Text style={[styles.tabText, activeTab === 'quotes' && styles.activeTabText]}>
            Quotes
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={{ flex: 1 }}>
        {activeTab === 'articles' && renderArticles()}
        {activeTab === 'sounds' && renderSounds()}
        {activeTab === 'quotes' && renderQuotes()}
      </View>
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
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    borderBottomWidth: scale(1),
    borderBottomColor: appColors.grey6,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(8),
    paddingHorizontal: scale(12),
    borderRadius: scale(8),
    marginHorizontal: scale(4),
  },
  activeTab: {
    backgroundColor: appColors.AppBlue + '15',
  },
  tabText: {
    fontSize: moderateScale(14),
    color: appColors.grey3,
    fontFamily: appFonts.headerTextMedium,
    marginLeft: scale(6),
  },
  activeTabText: {
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
  },
  contentContainer: {
    padding: scale(16),
  },
  // Article Styles
  articleCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(12),
    marginBottom: scale(16),
    overflow: 'hidden',
    elevation: scale(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(2) },
    shadowOpacity: 0.1,
    shadowRadius: scale(4),
  },
  articleImage: {
    width: '100%',
    height: scale(180),
    resizeMode: 'cover',
  },
  articleContent: {
    padding: scale(16),
  },
  articleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(8),
  },
  categoryBadge: {
    backgroundColor: appColors.AppBlue + '15',
    paddingHorizontal: scale(10),
    paddingVertical: scale(4),
    borderRadius: scale(12),
  },
  categoryText: {
    fontSize: moderateScale(12),
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextMedium,
  },
  readTime: {
    fontSize: moderateScale(12),
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
  },
  articleTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: scale(8),
  },
  articleExcerpt: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    lineHeight: moderateScale(20),
    marginBottom: scale(12),
  },
  articleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMoreText: {
    fontSize: moderateScale(14),
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextMedium,
    marginRight: scale(4),
  },
  footerLoader: {
    paddingVertical: scale(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Sound Styles
  soundsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  soundCard: {
    width: (width - scale(48)) / 2,
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(12),
    padding: scale(16),
    marginBottom: scale(16),
    elevation: scale(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(2) },
    shadowOpacity: 0.1,
    shadowRadius: scale(4),
    position: 'relative',
  },
  soundIconContainer: {
    width: scale(64),
    height: scale(64),
    borderRadius: scale(32),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scale(12),
  },
  soundTitle: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: scale(4),
  },
  soundCategory: {
    fontSize: moderateScale(12),
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginBottom: scale(8),
  },
  soundFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  soundDuration: {
    fontSize: moderateScale(12),
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
    marginLeft: scale(4),
  },
  playButton: {
    position: 'absolute',
    bottom: scale(16),
    right: scale(16),
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    backgroundColor: appColors.AppBlue,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: scale(3),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(2) },
    shadowOpacity: 0.2,
    shadowRadius: scale(3),
  },
  // Quote Styles (Old - kept for reference)
  quoteCard: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(12),
    padding: scale(20),
    marginBottom: scale(16),
    borderLeftWidth: scale(4),
    borderLeftColor: appColors.AppBlue,
    elevation: scale(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(2) },
    shadowOpacity: 0.1,
    shadowRadius: scale(4),
  },
  quoteIcon: {
    marginBottom: scale(12),
    opacity: 0.3,
  },
  quoteText: {
    fontSize: moderateScale(16),
    color: appColors.grey1,
    fontFamily: appFonts.headerTextRegular,
    lineHeight: moderateScale(24),
    marginBottom: scale(12),
    fontStyle: 'italic',
  },
  quoteAuthor: {
    fontSize: moderateScale(14),
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
    paddingHorizontal: scale(32),
    paddingBottom: scale(80),
  },
  quoteCardContent: {
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(24),
    padding: scale(40),
    width: '100%',
    minHeight: height * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: scale(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(4) },
    shadowOpacity: 0.2,
    shadowRadius: scale(8),
    borderLeftWidth: scale(6),
    borderLeftColor: appColors.AppBlue,
  },
  quoteIconLarge: {
    marginBottom: scale(24),
    opacity: 0.2,
  },
  quoteTextLarge: {
    fontSize: moderateScale(22),
    color: appColors.grey1,
    fontFamily: appFonts.headerTextRegular,
    lineHeight: moderateScale(34),
    marginBottom: scale(24),
    fontStyle: 'italic',
    textAlign: 'center',
  },
  quoteAuthorLarge: {
    fontSize: moderateScale(18),
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
    textAlign: 'center',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: scale(24),
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: scale(8),
  },
  paginationDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    backgroundColor: appColors.grey5,
  },
  paginationDotActive: {
    width: scale(24),
    backgroundColor: appColors.AppBlue,
  },
  shareQuoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scale(24),
    paddingVertical: scale(12),
    paddingHorizontal: scale(24),
    backgroundColor: appColors.AppBlue + '15',
    borderRadius: scale(24),
    gap: scale(8),
  },
  shareQuoteText: {
    fontSize: moderateScale(14),
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextMedium,
  },
  bottomSpacing: {
    height: scale(20),
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(40),
    paddingHorizontal: scale(32),
    backgroundColor: appColors.CardBackground,
    borderRadius: scale(16),
    marginTop: scale(20),
    marginHorizontal: scale(16),
    elevation: scale(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(2) },
    shadowOpacity: 0.1,
    shadowRadius: scale(4),
  },
  emptyIconContainer: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(40),
    backgroundColor: appColors.AppBlue + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scale(16),
  },
  emptyTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: appColors.grey1,
    marginTop: scale(16),
    fontFamily: appFonts.headerTextBold,
  },
  emptySubtitle: {
    fontSize: moderateScale(14),
    color: appColors.grey2,
    textAlign: 'center',
    marginTop: scale(8),
    fontFamily: appFonts.headerTextRegular,
  },
  retryButton: {
    backgroundColor: appColors.AppBlue,
    borderRadius: scale(20),
    paddingVertical: scale(10),
    paddingHorizontal: scale(20),
    marginTop: scale(16),
  },
  retryButtonText: {
    color: appColors.CardBackground,
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    fontFamily: appFonts.headerTextBold,
  },
});

export default MeditationsScreen;
