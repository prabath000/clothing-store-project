import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { wishlistAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme/theme';
import Icon from 'react-native-vector-icons/Ionicons';

const WishlistScreen = ({ navigation }) => {
  const { userInfo } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    if (!userInfo) return;
    try {
      setLoading(true);
      const response = await wishlistAPI.get(userInfo._id);
      setWishlist(response.data);
    } catch (error) {
      console.log('Wishlist fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchWishlist();
    }, [userInfo])
  );

  const removeFromWishlist = async (id) => {
    try {
      await wishlistAPI.remove(id);
      fetchWishlist();
    } catch (error) {
      Alert.alert('Error', 'Failed to remove from wishlist');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.secondary} />
      </View>
    );
  }

  if (wishlist.length === 0) {
    return (
      <View style={styles.center}>
        <Icon name="heart-dislike-outline" size={80} color={COLORS.accent} />
        <Text style={styles.emptyText}>Your wishlist is empty</Text>
        <TouchableOpacity 
          style={styles.shopBtn} 
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.shopBtnText}>Browse Products</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={wishlist}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('ProductDetails', { id: item.product._id })}
          >
            <Image 
              source={{ uri: `http://10.0.2.2:5000${item.product.images?.[0]}` }} 
              style={styles.image} 
            />
            <View style={styles.info}>
              <Text style={styles.name} numberOfLines={1}>{item.product.name}</Text>
              <Text style={styles.price}>${item.product.price}</Text>
              <View style={styles.ratingRow}>
                <Icon name="star" size={14} color="#FFD700" />
                <Text style={styles.ratingText}>{item.product.averageRating || '0.0'}</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.removeBtn}
              onPress={() => removeFromWishlist(item._id)}
            >
              <Icon name="close-circle" size={24} color={COLORS.error} />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
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
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: SPACING.s,
    marginBottom: SPACING.m,
    alignItems: 'center',
    elevation: 3,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },
  info: {
    flex: 1,
    marginLeft: SPACING.m,
  },
  name: {
    ...TYPOGRAPHY.body,
    fontWeight: 'bold',
  },
  price: {
    ...TYPOGRAPHY.body,
    color: COLORS.secondary,
    fontWeight: 'bold',
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    ...TYPOGRAPHY.caption,
    marginLeft: 3,
  },
  removeBtn: {
    padding: 10,
  },
  emptyText: {
    ...TYPOGRAPHY.h3,
    color: COLORS.darkGrey,
    marginTop: SPACING.m,
  },
  shopBtn: {
    marginTop: SPACING.l,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.m,
    borderRadius: 10,
  },
  shopBtnText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

export default WishlistScreen;
