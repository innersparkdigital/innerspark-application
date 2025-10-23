/**
 * Therapist Reviews & Ratings Screen
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/themed';
import { appColors, appFonts } from '../../../global/Styles';
import ISGenericHeader from '../../../components/ISGenericHeader';
import ISStatusBar from '../../../components/ISStatusBar';

interface Review {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
  response?: string;
  helpful: number;
}

const THReviewsScreen = ({ navigation }: any) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);

  const [reviews] = useState<Review[]>([
    {
      id: '1',
      clientName: 'Sarah W.',
      rating: 5,
      comment: 'Dr. Johnson has been incredibly helpful in my journey. Her empathetic approach and practical strategies have made a real difference in my life.',
      date: 'Oct 18, 2025',
      helpful: 12,
    },
    {
      id: '2',
      clientName: 'Michael B.',
      rating: 5,
      comment: 'Professional, caring, and always makes time to listen. Highly recommend!',
      date: 'Oct 15, 2025',
      response: 'Thank you for your kind words! It\'s been a pleasure working with you.',
      helpful: 8,
    },
    {
      id: '3',
      clientName: 'Emily C.',
      rating: 4,
      comment: 'Great therapist with excellent techniques. Sometimes sessions feel a bit rushed, but overall very satisfied.',
      date: 'Oct 12, 2025',
      helpful: 5,
    },
    {
      id: '4',
      clientName: 'David M.',
      rating: 5,
      comment: 'Life-changing experience. The tools and insights I\'ve gained have helped me tremendously.',
      date: 'Oct 10, 2025',
      response: 'I\'m so glad to hear about your progress! Keep up the great work.',
      helpful: 15,
    },
    {
      id: '5',
      clientName: 'Lisa A.',
      rating: 5,
      comment: 'Compassionate and knowledgeable. Creates a safe space for healing.',
      date: 'Oct 8, 2025',
      helpful: 10,
    },
  ]);

  const ratingDistribution = [
    { stars: 5, count: 42, percentage: 84 },
    { stars: 4, count: 6, percentage: 12 },
    { stars: 3, count: 2, percentage: 4 },
    { stars: 2, count: 0, percentage: 0 },
    { stars: 1, count: 0, percentage: 0 },
  ];

  const totalReviews = ratingDistribution.reduce((sum, item) => sum + item.count, 0);
  const averageRating = 4.9;

  const filteredReviews = reviews.filter((review) => {
    const matchesFilter = selectedFilter === 'all' || review.rating === parseInt(selectedFilter);
    const matchesSearch = review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleReply = (reviewId: string) => {
    setSelectedReviewId(reviewId);
    setReplyText('');
    setShowReplyModal(true);
  };
  
  const submitReply = () => {
    if (replyText.trim()) {
      // TODO: Send reply to backend
      Alert.alert('Success', 'Your response has been posted!');
      setShowReplyModal(false);
      setReplyText('');
      setSelectedReviewId(null);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            key={star}
            type="material"
            name={star <= rating ? 'star' : 'star-border'}
            size={16}
            color="#FFD700"
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ISStatusBar />
      <ISGenericHeader title="Reviews & Ratings" navigation={navigation} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Rating Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryLeft}>
            <Text style={styles.averageRating}>{averageRating}</Text>
            <View style={styles.starsLarge}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Icon
                  key={star}
                  type="material"
                  name="star"
                  size={20}
                  color="#FFD700"
                />
              ))}
            </View>
            <Text style={styles.totalReviews}>{totalReviews} reviews</Text>
          </View>

          <View style={styles.summaryRight}>
            {ratingDistribution.map((item) => (
              <View key={item.stars} style={styles.distributionRow}>
                <Text style={styles.distributionStars}>{item.stars}</Text>
                <Icon type="material" name="star" size={14} color="#FFD700" />
                <View style={styles.distributionBarContainer}>
                  <View
                    style={[
                      styles.distributionBar,
                      { width: `${item.percentage}%` },
                    ]}
                  />
                </View>
                <Text style={styles.distributionCount}>{item.count}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon type="material" name="search" size={20} color={appColors.grey3} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search reviews..."
            placeholderTextColor={appColors.grey3}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon type="material" name="close" size={20} color={appColors.grey3} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContainer}
        >
          <TouchableOpacity
            style={[styles.filterTab, selectedFilter === 'all' && styles.filterTabActive]}
            onPress={() => setSelectedFilter('all')}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === 'all' && styles.filterTextActive,
              ]}
            >
              All ({totalReviews})
            </Text>
          </TouchableOpacity>
          {[5, 4, 3, 2, 1].map((rating) => (
            <TouchableOpacity
              key={rating}
              style={[
                styles.filterTab,
                selectedFilter === rating.toString() && styles.filterTabActive,
              ]}
              onPress={() => setSelectedFilter(rating.toString() as any)}
            >
              <Icon type="material" name="star" size={14} color={selectedFilter === rating.toString() ? '#FFFFFF' : '#FFD700'} />
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === rating.toString() && styles.filterTextActive,
                ]}
              >
                {rating} ({ratingDistribution.find((r) => r.stars === rating)?.count || 0})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Reviews List */}
        <View style={styles.reviewsList}>
          {filteredReviews.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewerInfo}>
                  <View style={styles.reviewerAvatar}>
                    <Text style={styles.reviewerInitial}>{review.clientName[0]}</Text>
                  </View>
                  <View>
                    <Text style={styles.reviewerName}>{review.clientName}</Text>
                    <Text style={styles.reviewDate}>{review.date}</Text>
                  </View>
                </View>
                {renderStars(review.rating)}
              </View>

              <Text style={styles.reviewComment}>{review.comment}</Text>

              <View style={styles.reviewFooter}>
                <TouchableOpacity style={styles.helpfulButton}>
                  <Icon type="material" name="thumb-up-outline" size={16} color={appColors.grey3} />
                  <Text style={styles.helpfulText}>Helpful ({review.helpful})</Text>
                </TouchableOpacity>
                {!review.response && (
                  <TouchableOpacity
                    style={styles.replyButton}
                    onPress={() => handleReply(review.id)}
                  >
                    <Icon type="material" name="reply" size={16} color={appColors.AppBlue} />
                    <Text style={styles.replyText}>Reply</Text>
                  </TouchableOpacity>
                )}
              </View>

              {review.response && (
                <View style={styles.responseCard}>
                  <View style={styles.responseHeader}>
                    <Icon type="material" name="reply" size={16} color={appColors.AppBlue} />
                    <Text style={styles.responseLabel}>Your Response</Text>
                  </View>
                  <Text style={styles.responseText}>{review.response}</Text>
                </View>
              )}
            </View>
          ))}

          {filteredReviews.length === 0 && (
            <View style={styles.emptyState}>
              <Icon type="material" name="rate-review" size={60} color={appColors.grey3} />
              <Text style={styles.emptyText}>No reviews found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Reply Modal */}
      <Modal
        visible={showReplyModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowReplyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.replyModalContainer}>
            {/* Icon */}
            <View style={styles.replyIconContainer}>
              <Icon
                type="material"
                name="reply"
                size={40}
                color={appColors.AppBlue}
              />
            </View>

            <Text style={styles.replyModalTitle}>Reply to Review</Text>
            <Text style={styles.replyModalSubtitle}>
              Share your response with the client
            </Text>
            
            <TextInput
              style={styles.replyInput}
              placeholder="Write your response..."
              placeholderTextColor={appColors.grey3}
              value={replyText}
              onChangeText={setReplyText}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              maxLength={500}
              autoFocus
            />
            
            <Text style={styles.replyCharCount}>
              {replyText.length}/500 characters
            </Text>
            
            <View style={styles.replyModalButtons}>
              <TouchableOpacity
                style={[styles.replyModalButton, styles.cancelButton]}
                onPress={() => {
                  setShowReplyModal(false);
                  setReplyText('');
                  setSelectedReviewId(null);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.replyModalButton,
                  styles.sendButton,
                  !replyText.trim() && styles.sendButtonDisabled
                ]}
                onPress={submitReply}
                disabled={!replyText.trim()}
              >
                <Text style={[
                  styles.sendButtonText,
                  !replyText.trim() && styles.sendButtonTextDisabled
                ]}>
                  Send Reply
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryLeft: {
    alignItems: 'center',
    paddingRight: 20,
    borderRightWidth: 1,
    borderRightColor: appColors.grey6,
  },
  averageRating: {
    fontSize: 48,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
  },
  starsLarge: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  totalReviews: {
    fontSize: 13,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
  },
  summaryRight: {
    flex: 1,
    paddingLeft: 20,
    justifyContent: 'center',
  },
  distributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  distributionStars: {
    fontSize: 13,
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
    width: 12,
  },
  distributionBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: appColors.grey6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  distributionBar: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 3,
  },
  distributionCount: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    width: 20,
    textAlign: 'right',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextRegular,
  },
  filterScroll: {
    marginBottom: 16,
  },
  filterContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  filterTabActive: {
    backgroundColor: appColors.AppBlue,
  },
  filterText: {
    fontSize: 13,
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextMedium,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  reviewsList: {
    paddingHorizontal: 16,
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: appColors.AppBlue + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewerInitial: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.AppBlue,
    fontFamily: appFonts.headerTextBold,
  },
  reviewerName: {
    fontSize: 15,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextMedium,
    marginBottom: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
    lineHeight: 20,
    marginBottom: 12,
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: appColors.grey6,
  },
  helpfulButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  helpfulText: {
    fontSize: 13,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
  },
  replyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: appColors.AppBlue + '10',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  replyText: {
    fontSize: 13,
    color: appColors.AppBlue,
    fontFamily: appFonts.bodyTextMedium,
    fontWeight: '600',
  },
  responseCard: {
    backgroundColor: appColors.AppBlue + '05',
    borderLeftWidth: 3,
    borderLeftColor: appColors.AppBlue,
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  responseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  responseLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: appColors.AppBlue,
    fontFamily: appFonts.bodyTextMedium,
  },
  responseText: {
    fontSize: 14,
    color: appColors.grey2,
    fontFamily: appFonts.bodyTextRegular,
    lineHeight: 20,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  replyModalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    width: '100%',
    maxWidth: 500,
  },
  replyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: appColors.AppBlue + '20',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  replyModalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: appColors.grey1,
    fontFamily: appFonts.headerTextBold,
    marginBottom: 8,
    textAlign: 'center',
  },
  replyModalSubtitle: {
    fontSize: 14,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    marginBottom: 20,
    textAlign: 'center',
  },
  replyInput: {
    backgroundColor: appColors.AppLightGray,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextRegular,
    minHeight: 150,
    marginBottom: 8,
  },
  replyCharCount: {
    fontSize: 12,
    color: appColors.grey3,
    fontFamily: appFonts.bodyTextRegular,
    textAlign: 'right',
    marginBottom: 20,
  },
  replyModalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  replyModalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: appColors.grey6,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.grey1,
    fontFamily: appFonts.bodyTextMedium,
  },
  sendButton: {
    backgroundColor: appColors.AppBlue,
  },
  sendButtonDisabled: {
    backgroundColor: appColors.grey5,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: appFonts.bodyTextMedium,
  },
  sendButtonTextDisabled: {
    color: appColors.grey3,
  },
});

export default THReviewsScreen;
