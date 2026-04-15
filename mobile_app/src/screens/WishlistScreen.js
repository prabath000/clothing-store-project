import React, { useEffect, useState, useCallback } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
import { wishlistAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import ProductCard from '../components/ProductCard';
import CategoryChip from '../components/CategoryChip';

const CATEGORIES = ['All', 'Jacket', 'Shirt', 'Pant', 'T-Shirt'];

const WishlistScreen = ({ navigation }) => {
  const { userInfo } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [filteredWishlist, setFilteredWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  const fetchWishlist = async (silent = false) => {
    if (!userInfo) return;
    try {
      if (!silent) setLoading(true);
      const response = await wishlistAPI.get(userInfo._id);
      setWishlist(response.data);
      setFilteredWishlist(response.data);
    } catch (error) {
      console.log('Wishlist fetch error:', error);
      const msg = error.response?.data?.message || error.message || 'Check your connection.';
      Alert.alert('Wishlist Fetch Failed', msg);
    } finally {
      setLoading(false);
    }
  };


  useFocusEffect(
    useCallback(() => {
      fetchWishlist();
    }, [userInfo])
  );

  const handleCategoryPress = (category) => {
    setActiveCategory(category);
    if (category === 'All') {
      setFilteredWishlist(wishlist);
    } else {
      const filtered = wishlist.filter(item => 
        item.product && item.product.category && item.product.category.toLowerCase() === category.toLowerCase()
      );
      setFilteredWishlist(filtered);
    }
  };

  const handleRemove = async (id) => {
    try {
      await wishlistAPI.remove(id);
      fetchWishlist();
      Alert.alert('Success', 'Removed from wishlist');
    } catch (error) {
      console.log('Remove from wishlist error:', error);
      Alert.alert('Error', 'Failed to remove item');
    }
  };


  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Wishlist</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => fetchWishlist()}>
          <Icon name="refresh" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>


      {/* Category Filter */}
      <View style={styles.categoryContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <CategoryChip
              label={item}
              active={activeCategory === item}
              onPress={() => handleCategoryPress(item)}
            />
          )}
          contentContainerStyle={styles.categoryList}
        />
      </View>

      {/* Wishlist Grid */}
      <FlatList
        data={filteredWishlist}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => {
          if (!item.product) return null;
          return (
            <View style={styles.cardContainer}>
              <ProductCard
                product={item.product}
                onPress={() => navigation.navigate('ProductDetails', { id: item.product._id })}
              />
              <TouchableOpacity 
                style={styles.removeBtn} 
                onPress={() => handleRemove(item._id)}
              >
                <Icon name="trash-outline" size={18} color={COLORS.error} />
              </TouchableOpacity>
            </View>
          );
        }}

        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyCenter}>
            <Icon name="heart-dislike-outline" size={80} color={COLORS.border} />
            <Text style={styles.emptyText}>No items in your wishlist</Text>
            <TouchableOpacity 
              style={styles.shopBtn} 
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.shopBtnText}>Browse Products</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.m,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  headerTitle: {
    ...TYPOGRAPHY.h3,
    fontSize: 18,
  },
  categoryContainer: {
    marginVertical: SPACING.m,
  },
  categoryList: {
    paddingHorizontal: SPACING.m,
  },
  list: {
    paddingBottom: SPACING.xl,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.m,
  },
  emptyCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginTop: SPACING.m,
  },
  shopBtn: {
    marginTop: SPACING.l,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.m,
    borderRadius: 30,
  },
  shopBtnText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  cardContainer: {
    width: '48%',
    marginBottom: SPACING.m,
    position: 'relative',
  },
  removeBtn: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    zIndex: 10,
  },
});


export default WishlistScreen;
