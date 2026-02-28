import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Share,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/base';
import { appColors, appFonts } from '../../global/Styles';
import { scale, moderateScale } from '../../global/Scaling';
import ISGenericHeader from '../../components/ISGenericHeader';
import ISStatusBar from '../../components/ISStatusBar';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { getArticleById } from '../../api/client/meditations';
import { getRelatedArticles } from '../../utils/articleHelpers';
import { calculateReadTime } from '../../utils/textHelpers';
import { appImages } from '../../global/Data';

interface ArticleDetailScreenProps {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
}

const ArticleDetailScreen: React.FC<ArticleDetailScreenProps> = ({ navigation, route }) => {
  const { article, allArticles = [] } = route.params as any;
  const [isBookmarked, setIsBookmarked] = useState(false);

  const [isLoading, setIsLoading] = useState(!article.content || article.content.length < 50);
  const [articleContent, setArticleContent] = useState(article.content || '');
  const [articleCategory, setArticleCategory] = useState(article.category || 'General');

  // Calculate read time (fallback to utility if missing)
  const displayReadTime = article.readTime || calculateReadTime(articleContent);

  // Dynamic Views formatting
  const rawViews = article.views || 0;
  const displayViews = rawViews > 999 ? `${(rawViews / 1000).toFixed(1)}k` : rawViews.toString();

  // Get dynamic related articles
  const relatedArticles = getRelatedArticles(article, allArticles, 2);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!article.id) return;
      try {
        const response = await getArticleById(article.id);
        if (response.success && response.data) {
          setArticleContent(response.data.content || article.content);
          if (response.data.category) {
            setArticleCategory(response.data.category);
          }
        }
      } catch (error) {
        console.error('Failed to load article details', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [article.id]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${article.title}\n\n${article.excerpt}\n\nRead more in the Innerspark app!`,
        title: article.title,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // TODO: Save to bookmarks
  };

  return (
    <SafeAreaView style={styles.container}>
      <ISStatusBar backgroundColor={appColors.AppBlue} />

      <ISGenericHeader
        title="Article"
        navigation={navigation}
        hasRightIcon={false}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <Image source={article.image || appImages.isDefaultImage} style={styles.heroImage} />

        {/* Article Header */}
        <View style={styles.articleHeader}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{articleCategory}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleBookmark}>
              <Icon
                name={isBookmarked ? 'bookmark' : 'bookmark-border'}
                type="material"
                color={isBookmarked ? appColors.AppBlue : appColors.grey3}
                size={moderateScale(24)}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Icon name="share" type="material" color={appColors.grey3} size={moderateScale(24)} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Article Meta */}
        <View style={styles.articleMeta}>
          <View style={styles.metaItem}>
            <Icon name="schedule" type="material" color={appColors.grey3} size={moderateScale(16)} />
            <Text style={styles.metaText}>{displayReadTime}</Text>
          </View>
          {rawViews > 0 && (
            <View style={styles.metaItem}>
              <Icon name="visibility" type="material" color={appColors.grey3} size={moderateScale(16)} />
              <Text style={styles.metaText}>{displayViews} views</Text>
            </View>
          )}
        </View>

        {/* Article Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.articleTitle}>{article.title}</Text>
          {isLoading ? (
            <View style={{ marginVertical: scale(40), alignItems: 'center' }}>
              <ActivityIndicator size="large" color={appColors.AppBlue} />
            </View>
          ) : (
            <Text style={styles.articleContent}>{articleContent}</Text>
          )}
        </View>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <View style={styles.relatedSection}>
            <Text style={styles.sectionTitle}>Related Articles</Text>
            {relatedArticles.map((relatedArticle: any) => (
              <TouchableOpacity
                key={relatedArticle.id}
                style={styles.relatedCard}
                onPress={() => navigation.navigate('ArticleDetailScreen', { article: relatedArticle, allArticles })}
              >
                <Image
                  source={relatedArticle.image || appImages.isDefaultImage}
                  style={styles.relatedImage}
                />
                <View style={styles.relatedContent}>
                  <Text style={styles.relatedTitle} numberOfLines={2}>
                    {relatedArticle.title}
                  </Text>
                  <Text style={styles.relatedMeta}>
                    {relatedArticle.readTime || calculateReadTime(relatedArticle.content || relatedArticle.excerpt || '')} • {relatedArticle.category}
                  </Text>
                </View>
                <Icon name="chevron-right" type="material" color={appColors.grey3} size={moderateScale(20)} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.CardBackground,
  },
  scrollView: {
    flex: 1,
  },
  heroImage: {
    width: '100%',
    height: scale(250),
    resizeMode: 'cover',
  },
  articleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    paddingTop: scale(16),
  },
  categoryBadge: {
    backgroundColor: appColors.AppBlue + '15',
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderRadius: scale(16),
  },
  categoryText: {
    fontSize: moderateScale(12),
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextMedium,
  },
  headerActions: {
    flexDirection: 'row',
    gap: scale(12),
  },
  actionButton: {
    padding: scale(8),
  },
  articleMeta: {
    flexDirection: 'row',
    paddingHorizontal: scale(20),
    paddingTop: scale(12),
    gap: scale(16),
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
  },
  metaText: {
    fontSize: moderateScale(12),
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
  },
  contentContainer: {
    paddingHorizontal: scale(20),
    paddingTop: scale(20),
  },
  articleTitle: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: scale(16),
    lineHeight: moderateScale(32),
  },
  articleContent: {
    fontSize: moderateScale(16),
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    lineHeight: moderateScale(26),
  },
  relatedSection: {
    paddingHorizontal: scale(20),
    paddingTop: scale(32),
  },
  sectionTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: scale(16),
  },
  relatedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.AppLightGray,
    borderRadius: scale(12),
    padding: scale(12),
    marginBottom: scale(12),
  },
  relatedImage: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(8),
    resizeMode: 'cover',
  },
  relatedContent: {
    flex: 1,
    marginLeft: scale(12),
  },
  relatedTitle: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: scale(4),
  },
  relatedMeta: {
    fontSize: moderateScale(12),
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
  },
  bottomSpacing: {
    height: scale(40),
  },
});

export default ArticleDetailScreen;
