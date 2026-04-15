import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { adminAPI } from '../api/api';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme/theme';
import Icon from 'react-native-vector-icons/Ionicons';

const ManageReviews = ({ navigation }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const response = await adminAPI.getReviews();
      setReviews(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDeleteReview = (id) => {
    Alert.alert('Delete Review', 'Are you sure you want to remove this review?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            await adminAPI.removeReview(id);
            fetchReviews();
          } catch (error) {
            Alert.alert('Error', 'Failed to delete review');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const renderRating = (rating) => {
    return (
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon 
            key={star} 
            name={star <= rating ? "star" : "star-outline"} 
            size={14} 
            color={COLORS.secondary} 
          />
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.secondary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Reviews</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={reviews}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <View style={styles.userSection}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{item.user?.name?.charAt(0) || 'U'}</Text>
                </View>
                <View>
                  <Text style={styles.userName}>{item.user?.name || 'Unknown User'}</Text>
                  <Text style={styles.productName}>on {item.product?.name || 'Deleted Product'}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => handleDeleteReview(item._id)}>
                <Icon name="trash-outline" size={20} color={COLORS.error} />
              </TouchableOpacity>
            </View>
            
            {renderRating(item.rating)}
            
            <Text style={styles.comment}>{item.comment}</Text>
            <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
          </View>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No reviews found</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.l,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
  },
  list: {
    padding: SPACING.m,
  },
  reviewCard: {
    backgroundColor: COLORS.grey,
    padding: SPACING.m,
    borderRadius: 15,
    marginBottom: 10,
    elevation: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 14,
    color: COLORS.primary,
  },
  productName: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  comment: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontSize: 14,
    marginBottom: 8,
  },
  date: {
    fontSize: 10,
    color: COLORS.darkGrey,
    textAlign: 'right',
  },
  empty: {
    textAlign: 'center',
    marginTop: 50,
    color: COLORS.darkGrey,
  },
});

export default ManageReviews;
