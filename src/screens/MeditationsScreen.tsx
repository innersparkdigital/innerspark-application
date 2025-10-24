import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/base';
import { appColors, appFonts } from '../global/Styles';
import ISGenericHeader from '../components/ISGenericHeader';
import ISStatusBar from '../components/ISStatusBar';
import { NavigationProp } from '@react-navigation/native';

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
  const [activeTab, setActiveTab] = useState<'articles' | 'sounds' | 'quotes'>('articles');
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const quoteFlatListRef = useRef<FlatList>(null);

  const articles: Article[] = [
    {
      id: '1',
      title: 'The Power of Mindful Breathing',
      excerpt: 'Discover how simple breathing exercises can transform your mental state and reduce anxiety in just minutes.',
      readTime: '5 min read',
      category: 'Mindfulness',
      image: require('../assets/images/dummy-people/d-person1.png'),
      content: 'Full article content here...',
    },
    {
      id: '2',
      title: 'Starting Your Meditation Journey',
      excerpt: 'A beginner-friendly guide to establishing a daily meditation practice that fits your lifestyle.',
      readTime: '7 min read',
      category: 'Getting Started',
      image: require('../assets/images/dummy-people/d-person2.png'),
      content: 'Full article content here...',
    },
    {
      id: '3',
      title: 'Overcoming Meditation Challenges',
      excerpt: 'Common obstacles in meditation and practical strategies to overcome them for a deeper practice.',
      readTime: '6 min read',
      category: 'Tips & Tricks',
      image: require('../assets/images/dummy-people/d-person3.png'),
      content: 'Full article content here...',
    },
    {
      id: '4',
      title: 'Body Scan Meditation Explained',
      excerpt: 'Learn the technique of body scan meditation to release tension and connect with your physical self.',
      readTime: '8 min read',
      category: 'Techniques',
      image: require('../assets/images/dummy-people/d-person4.png'),
      content: 'Full article content here...',
    },
  ];

  const sounds: Sound[] = [
    {
      id: '1',
      title: 'Ocean Waves',
      duration: '30 min',
      category: 'Nature',
      icon: 'waves',
      color: '#2196F3',
      description: 'Gentle ocean waves for deep relaxation',
    },
    {
      id: '2',
      title: 'Rain & Thunder',
      duration: '45 min',
      category: 'Nature',
      icon: 'thunderstorm',
      color: '#607D8B',
      description: 'Soothing rain sounds with distant thunder',
    },
    {
      id: '3',
      title: 'Forest Sounds',
      duration: '60 min',
      category: 'Nature',
      icon: 'park',
      color: '#4CAF50',
      description: 'Birds chirping in a peaceful forest',
    },
    {
      id: '4',
      title: 'Singing Bowls',
      duration: '20 min',
      category: 'Instrumental',
      icon: 'music-note',
      color: '#9C27B0',
      description: 'Tibetan singing bowls for meditation',
    },
    {
      id: '5',
      title: 'Gentle Piano',
      duration: '40 min',
      category: 'Instrumental',
      icon: 'piano',
      color: '#FF9800',
      description: 'Soft piano melodies for relaxation',
    },
    {
      id: '6',
      title: 'White Noise',
      duration: '90 min',
      category: 'Ambient',
      icon: 'graphic-eq',
      color: '#795548',
      description: 'Pure white noise for focus and sleep',
    },
    {
      id: '7',
      title: 'Tibetan Chants',
      duration: '25 min',
      category: 'Spiritual',
      icon: 'self-improvement',
      color: '#E91E63',
      description: 'Traditional Tibetan meditation chants',
    },
    {
      id: '8',
      title: 'Binaural Beats',
      duration: '30 min',
      category: 'Focus',
      icon: 'headphones',
      color: '#00BCD4',
      description: 'Binaural beats for deep concentration',
    },
  ];

  const quotes: Quote[] = [
    {
      id: '1',
      text: 'The present moment is the only time over which we have dominion.',
      author: 'Thích Nhất Hạnh',
    },
    {
      id: '2',
      text: 'Meditation is not evasion; it is a serene encounter with reality.',
      author: 'Thích Nhất Hạnh',
    },
    {
      id: '3',
      text: 'You should sit in meditation for 20 minutes a day, unless you\'re too busy; then you should sit for an hour.',
      author: 'Old Zen Saying',
    },
    {
      id: '4',
      text: 'The thing about meditation is: You become more and more you.',
      author: 'David Lynch',
    },
    {
      id: '5',
      text: 'Meditation is the tongue of the soul and the language of our spirit.',
      author: 'Jeremy Taylor',
    },
    {
      id: '6',
      text: 'In the midst of movement and chaos, keep stillness inside of you.',
      author: 'Deepak Chopra',
    },
    {
      id: '7',
      text: 'Meditation brings wisdom; lack of meditation leaves ignorance.',
      author: 'Buddha',
    },
    {
      id: '8',
      text: 'The quieter you become, the more you can hear.',
      author: 'Ram Dass',
    },
  ];

  const renderArticles = () => (
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

  const renderSounds = () => (
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
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
});

export default MeditationsScreen;
