import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { reviewAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme/theme';
import Icon from 'react-native-vector-icons/Ionicons';

const ReviewScreen = ({ route }) => {
  const { productId } = route.params;
  const { userInfo } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // States for new review
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      const response = await reviewAPI.getByProduct(productId);
      setReviews(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmitReview = async () => {
    if (!comment) {
      Alert.alert('Error', 'Please enter a comment');
      return;
    }

    if (!userInfo) {
      Alert.alert('Error', 'Please login to leave a review');
      return;
    }

    setSubmitting(true);
    try {
      await reviewAPI.add({ productId, rating, comment });
      setComment('');
      setRating(5);
      fetchReviews();
      Alert.alert('Success', 'Review added successfully!');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to add review');
    } finally {
      setSubmitting(false);
    }
  };

  const renderRatingInput = () => (
    <View style={styles.ratingInput}>
      <Text style={styles.inputTitle}>Add a Review</Text>
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((s) => (
          <TouchableOpacity key={s} onPress={() => setRating(s)}>
            <Icon 
              name={s <= rating ? "star" : "star-outline"} 
              size={32} 
              color="#FFD700" 
            />
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.input}
        placeholder="Share your thoughts about this product..."
        multiline
        value={comment}
        onChangeText={setComment}
      />
      <TouchableOpacity 
        style={styles.submitBtn} 
        onPress={handleSubmitReview}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color={COLORS.primary} />
        ) : (
          <Text style={styles.submitBtnText}>Submit Review</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.secondary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <FlatList
        data={reviews}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={userInfo ? renderRatingInput() : null}
        renderItem={({ item }) => (
          <View style={styles.reviewCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.reviewerName}>{item.name}</Text>
              <Text style={styles.reviewDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
            </View>
            <View style={styles.starsRowSmall}>
              {[...Array(5)].map((_, i) => (
                <Icon 
                  key={i} 
                  name={i < item.rating ? "star" : "star-outline"} 
                  size={14} 
                  color="#FFD700" 
                />
              ))}
            </View>
            <Text style={styles.commentText}>{item.comment}</Text>
          </View>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>No reviews yet. Be the first!</Text>
          </View>
        }
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.grey,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  list: {
    padding: SPACING.m,
  },
  ratingInput: {
    backgroundColor: COLORS.white,
    padding: SPACING.m,
    borderRadius: 15,
    marginBottom: SPACING.m,
    elevation: 3,
  },
  inputTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.s,
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: SPACING.m,
  },
  input: {
    backgroundColor: COLORS.grey,
    padding: SPACING.m,
    borderRadius: 10,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: COLORS.secondary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: SPACING.m,
  },
  submitBtnText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  reviewCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.m,
    borderRadius: 15,
    marginBottom: SPACING.m,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  reviewerName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  reviewDate: {
    color: COLORS.darkGrey,
    fontSize: 12,
  },
  starsRowSmall: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  commentText: {
    ...TYPOGRAPHY.body,
    color: COLORS.darkGrey,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    marginTop: SPACING.xl,
  },
});

export default ReviewScreen;
