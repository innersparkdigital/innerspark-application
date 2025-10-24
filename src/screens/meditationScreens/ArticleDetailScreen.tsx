import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/base';
import { appColors, appFonts } from '../../global/Styles';
import ISGenericHeader from '../../components/ISGenericHeader';
import ISStatusBar from '../../components/ISStatusBar';
import { NavigationProp, RouteProp } from '@react-navigation/native';

interface ArticleDetailScreenProps {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
}

const ArticleDetailScreen: React.FC<ArticleDetailScreenProps> = ({ navigation, route }) => {
  const { article } = route.params as any;
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Full article content (in real app, this would come from API)
  const fullContent = `
# ${article.title}

## Introduction

Mindfulness and meditation have become increasingly popular in recent years, and for good reason. These ancient practices offer powerful tools for managing stress, improving focus, and enhancing overall well-being in our fast-paced modern world.

## Understanding the Basics

Meditation is not about emptying your mind or achieving a state of eternal calm. Instead, it's about training your attention and awareness, and learning to observe your thoughts and feelings without judgment.

### Key Principles

1. **Start Small**: Begin with just 5 minutes a day
2. **Be Consistent**: Practice at the same time each day
3. **Find Your Space**: Choose a quiet, comfortable location
4. **Be Patient**: Progress takes time and practice

## The Science Behind It

Research has shown that regular meditation practice can lead to:

- Reduced stress and anxiety
- Improved emotional regulation
- Enhanced focus and concentration
- Better sleep quality
- Increased self-awareness
- Greater compassion and empathy

## Getting Started

### Step 1: Find Your Position

Sit comfortably with your back straight. You can sit on a chair, cushion, or the floor. The key is to be alert but relaxed.

### Step 2: Focus on Your Breath

Close your eyes and bring your attention to your breath. Notice the sensation of air entering and leaving your body.

### Step 3: Notice When Your Mind Wanders

It's natural for your mind to wander. When you notice this happening, gently bring your attention back to your breath without judgment.

### Step 4: Be Kind to Yourself

Don't get frustrated if you find it difficult at first. Meditation is a skill that improves with practice.

## Common Challenges

### "I Can't Stop Thinking"

This is completely normal! The goal isn't to stop thinking, but to notice your thoughts and return to your breath.

### "I Don't Have Time"

Even 5 minutes can make a difference. Consider it an investment in your mental health.

### "I'm Not Doing It Right"

There's no "perfect" way to meditate. If you're showing up and trying, you're doing it right.

## Building a Sustainable Practice

1. **Set Realistic Goals**: Start with 5-10 minutes daily
2. **Use Reminders**: Set a daily alarm or notification
3. **Track Your Progress**: Use a journal or app
4. **Join a Community**: Find support from others on the same journey
5. **Be Flexible**: Adapt your practice to fit your lifestyle

## Conclusion

Remember, meditation is a personal journey. What works for one person may not work for another. Experiment with different techniques and find what resonates with you. The most important thing is to start and to be consistent.

With regular practice, you'll begin to notice subtle changes in how you respond to stress, how you relate to your thoughts, and how you experience the present moment. Give yourself the gift of this practice, and be patient with the process.

---

*This article is for informational purposes only and is not a substitute for professional medical advice.*
  `;

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
        <Image source={article.image} style={styles.heroImage} />

        {/* Article Header */}
        <View style={styles.articleHeader}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{article.category}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleBookmark}>
              <Icon
                name={isBookmarked ? 'bookmark' : 'bookmark-border'}
                type="material"
                color={isBookmarked ? appColors.AppBlue : appColors.grey3}
                size={24}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Icon name="share" type="material" color={appColors.grey3} size={24} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Article Meta */}
        <View style={styles.articleMeta}>
          <View style={styles.metaItem}>
            <Icon name="schedule" type="material" color={appColors.grey3} size={16} />
            <Text style={styles.metaText}>{article.readTime}</Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="visibility" type="material" color={appColors.grey3} size={16} />
            <Text style={styles.metaText}>1.2k views</Text>
          </View>
        </View>

        {/* Article Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.articleTitle}>{article.title}</Text>
          <Text style={styles.articleContent}>{fullContent}</Text>
        </View>

        {/* Related Articles */}
        <View style={styles.relatedSection}>
          <Text style={styles.sectionTitle}>Related Articles</Text>
          <TouchableOpacity style={styles.relatedCard}>
            <Image
              source={require('../../assets/images/dummy-people/d-person2.png')}
              style={styles.relatedImage}
            />
            <View style={styles.relatedContent}>
              <Text style={styles.relatedTitle} numberOfLines={2}>
                5 Minute Morning Meditation Routine
              </Text>
              <Text style={styles.relatedMeta}>4 min read • Mindfulness</Text>
            </View>
            <Icon name="chevron-right" type="material" color={appColors.grey3} size={20} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.relatedCard}>
            <Image
              source={require('../../assets/images/dummy-people/d-person3.png')}
              style={styles.relatedImage}
            />
            <View style={styles.relatedContent}>
              <Text style={styles.relatedTitle} numberOfLines={2}>
                Meditation for Better Sleep
              </Text>
              <Text style={styles.relatedMeta}>6 min read • Sleep</Text>
            </View>
            <Icon name="chevron-right" type="material" color={appColors.grey3} size={20} />
          </TouchableOpacity>
        </View>

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
    height: 250,
    resizeMode: 'cover',
  },
  articleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  categoryBadge: {
    backgroundColor: appColors.AppBlue + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 12,
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextMedium,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 8,
  },
  articleMeta: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  articleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 16,
    lineHeight: 32,
  },
  articleContent: {
    fontSize: 16,
    color: appColors.grey2,
    fontFamily: appFonts.headerTextRegular,
    lineHeight: 26,
  },
  relatedSection: {
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 16,
  },
  relatedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.AppLightGray,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  relatedImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  relatedContent: {
    flex: 1,
    marginLeft: 12,
  },
  relatedTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 4,
  },
  relatedMeta: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.headerTextRegular,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default ArticleDetailScreen;
