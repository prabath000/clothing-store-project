import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  Image,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { productAPI, wishlistAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

import ProductCard from '../components/ProductCard';
import CategoryChip from '../components/CategoryChip';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme/theme';
import Icon from 'react-native-vector-icons/Feather';

const CATEGORIES = [
  { id: '1', label: 'All', icon: 'grid' },
  { id: '2', label: 'Shirts', icon: 'tag' },
  { id: '3', label: 'Pants', icon: 'activity' }, 
  { id: '4', label: 'Jackets', icon: 'layers' },
  { id: '5', label: 'Skinny', icon: 'feather' },
  { id: '6', label: 'Shorts', icon: 'scissors' },
  { id: '7', label: 'Others', icon: 'more-horizontal' },
];


const HomeScreen = ({ navigation }) => {
  const { userInfo } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]); // Stores objects like { product_id: wish_item_id }
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');


  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll();
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchWishlist = async () => {
    if (!userInfo) return;
    try {
      const response = await wishlistAPI.get(userInfo._id);
      // Map product IDs to their wishlist item IDs for easy lookup/deletion
      const wishMap = {};
      response.data.forEach(item => {
        if (item.product) {
          wishMap[item.product._id] = item._id;
        }
      });
      setWishlist(wishMap);
    } catch (error) {
      console.log('Home wishlist fetch error:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchWishlist();
  }, [userInfo]);

  // Sync wishlist when returning to this screen
  useFocusEffect(
    useCallback(() => {
      fetchWishlist();
    }, [userInfo])
  );

  const handleToggleWishlist = async (productId) => {
    if (!userInfo) {
      navigation.navigate('Auth');
      return;
    }

    const wishItemId = wishlist[productId];
    try {
      if (wishItemId) {
        // Remove
        await wishlistAPI.remove(wishItemId);
        const newWishlist = { ...wishlist };
        delete newWishlist[productId];
        setWishlist(newWishlist);
      } else {
        // Add
        const res = await wishlistAPI.add({ productId });
        setWishlist({ ...wishlist, [productId]: res.data._id });
      }
    } catch (error) {
      console.log('Wishlist toggle error:', error);
    }
  };


  const handleSearch = (text) => {
    setSearch(text);
    filterProducts(text, activeCategory);
  };

  const handleCategoryPress = (category) => {
    setActiveCategory(category);
    filterProducts(search, category);
  };

  const filterProducts = (searchText, category) => {
    let filtered = products;
    
    if (searchText) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.category.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (category !== 'All') {
      filtered = filtered.filter((item) => item.category === category);
    }

    setFilteredProducts(filtered);
  };

  const renderHeader = () => (
    <View style={styles.headerContent}>
      {/* Location and Notification */}
      <View style={styles.topRow}>
        <View style={styles.headerLeft}>
          <Image 
            source={require('../assets/images/logo.png')} 
            style={styles.headerLogo} 
            resizeMode="contain"
          />
          <View style={styles.locationWrapper}>
            <Text style={styles.locationLabel}>Location</Text>
            <View style={styles.locationContainer}>
              <Icon name="map-pin" size={14} color={COLORS.accent} />
              <Text style={styles.locationText}>Colombo, Sri Lanka</Text>
              <Icon name="chevron-down" size={14} color={COLORS.textSecondary} />
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <Icon name="bell" size={20} color={COLORS.text} />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Icon name="search" size={18} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor={COLORS.textSecondary}
            value={search}
            onChangeText={handleSearch}
          />
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <Icon name="sliders" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Hero Banner */}
      <TouchableOpacity style={styles.heroBanner}>
        <View style={styles.heroTextContainer}>
          <Text style={styles.heroTitle}>New Collection</Text>
          <Text style={styles.heroSubtitle}>Premium styles at exclusive prices.</Text>
          <TouchableOpacity style={styles.shopNowBtn}>
            <Text style={styles.shopNowText}>Shop Now</Text>
          </TouchableOpacity>
        </View>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop' }} 
          style={styles.heroImage} 
        />
      </TouchableOpacity>

      {/* Categories */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
        {CATEGORIES.map((cat) => (
          <CategoryChip
            key={cat.id}
            label={cat.label}
            icon={cat.icon}
            active={activeCategory === cat.label}
            onPress={() => handleCategoryPress(cat.label)}
          />
        ))}
      </ScrollView>

      {/* Flash Sale Section */}
      <View style={styles.sectionHeader}>
        <View style={styles.flashHeader}>
          <Text style={styles.sectionTitle}>Flash Sale</Text>
          <View style={styles.timerContainer}>
            <Icon name="clock" size={14} color={COLORS.error} />
            <Text style={[styles.timerText, { color: COLORS.error }]}>02:12:56</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <FlatList
        ListHeaderComponent={renderHeader}
        data={filteredProducts}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('ProductDetails', { id: item._id })}
            isWishlisted={!!wishlist[item._id]}
            onWishlistPress={() => handleToggleWishlist(item._id)}
          />

        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchProducts} colors={[COLORS.primary]} />
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyCenter}>
              <Text style={styles.emptyText}>No products found</Text>
            </View>
          )
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
  headerContent: {
    padding: SPACING.l,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  locationLabel: {
    ...TYPOGRAPHY.caption,
    fontSize: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    ...TYPOGRAPHY.bodyMedium,
    marginHorizontal: 6,
    fontSize: 14,
  },
  notificationBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  notificationDot: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.error,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    paddingHorizontal: SPACING.m,
    height: 52,
  },
  searchInput: {
    flex: 1,
    marginLeft: SPACING.s,
    ...TYPOGRAPHY.body,
    fontSize: 14,
    color: COLORS.text,
  },
  filterBtn: {
    marginLeft: 12,
    backgroundColor: COLORS.primary,
    width: 52,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroBanner: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    height: 180,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: SPACING.xl,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  heroTextContainer: {
    flex: 1.2,
    padding: SPACING.l,
    justifyContent: 'center',
  },
  heroTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.white,
    fontSize: 22,
  },
  heroSubtitle: {
    ...TYPOGRAPHY.caption,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 8,
    lineHeight: 20,
  },
  shopNowBtn: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 18,
    alignSelf: 'flex-start',
  },
  shopNowText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  heroImage: {
    flex: 1,
    height: '100%',
    width: '100%',
    opacity: 0.9,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    fontSize: 18,
  },
  seeAllText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.accent,
    fontWeight: '600',
  },
  categoriesContainer: {
    marginBottom: SPACING.xl,
  },
  flashHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  timerText: {
    ...TYPOGRAPHY.caption,
    marginLeft: 6,
    fontWeight: '700',
    fontSize: 12,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.l,
  },
  list: {
    paddingBottom: SPACING.xl * 2,
  },
  emptyCenter: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  locationWrapper: {
    justifyContent: 'center',
  },
});

export default HomeScreen;
