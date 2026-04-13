import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { productAPI, cartAPI, wishlistAPI, reviewAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme/theme';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const ProductDetailsScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const { userInfo } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [prodRes, revRes, wishRes] = await Promise.all([
        productAPI.getById(id),
        reviewAPI.getByProduct(id),
        userInfo ? wishlistAPI.get(userInfo._id) : Promise.resolve({ data: [] })
      ]);
      setProduct(prodRes.data);
      setReviews(revRes.data);
      
      // Check if item is in wishlist
      if (userInfo) {
        setInWishlist(wishRes.data.some(item => item.product._id === id));
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!userInfo) {
      navigation.navigate('Auth');
      return;
    }

    try {
      setAddingToCart(true);
      await cartAPI.add({ productId: id, quantity: 1 });
      Alert.alert('Success', 'Product added to cart!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const toggleWishlist = async () => {
    if (!userInfo) {
      navigation.navigate('Auth');
      return;
    }

    try {
      if (inWishlist) {
        // Need ID of wishlist item to remove. For simplicity in this demo, 
        // we'll assume the API handles toggle or we fetch it again.
        Alert.alert('Info', 'Go to Wishlist to remove this item');
      } else {
        await wishlistAPI.add({ productId: id });
        setInWishlist(true);
        Alert.alert('Success', 'Added to wishlist');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update wishlist');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.secondary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Main Image */}
        <Image 
          source={{ uri: `http://10.0.2.2:5000${product.images?.[0] || ''}` }} 
          style={styles.image} 
          resizeMode="cover" 
        />

        <View style={styles.content}>
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{product.name}</Text>
              <Text style={styles.category}>{product.category}</Text>
            </View>
            <TouchableOpacity onPress={toggleWishlist}>
              <Icon 
                name={inWishlist ? "heart" : "heart-outline"} 
                size={28} 
                color={inWishlist ? COLORS.error : COLORS.primary} 
              />
            </TouchableOpacity>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>${product.price}</Text>
            <View style={styles.ratingBox}>
              <Icon name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{product.averageRating || '0.0'} ({product.numReviews} Reviews)</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.reviewsSection}>
            <View style={styles.headerRow}>
              <Text style={styles.sectionTitle}>Reviews</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Reviews', { productId: id })}>
                <Text style={styles.viewMore}>See all</Text>
              </TouchableOpacity>
            </View>
            {reviews.slice(0, 2).map((rev, index) => (
              <View key={index} style={styles.reviewItem}>
                <Text style={styles.reviewer}>{rev.user?.name || 'User'}</Text>
                <View style={styles.ratingRow}>
                  {[...Array(rev.rating)].map((_, i) => (
                    <Icon key={i} name="star" size={12} color="#FFD700" />
                  ))}
                </View>
                <Text style={styles.reviewComment}>{rev.comment}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.cartButton} 
          onPress={handleAddToCart}
          disabled={addingToCart}
        >
          {addingToCart ? (
            <ActivityIndicator color={COLORS.primary} />
          ) : (
            <>
              <Icon name="cart-outline" size={20} color={COLORS.primary} />
              <Text style={styles.cartBtnText}>Add to Cart</Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyButton}>
          <Text style={styles.buyBtnText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  image: {
    width: width,
    height: 400,
  },
  content: {
    padding: SPACING.l,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  name: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
  },
  category: {
    ...TYPOGRAPHY.caption,
    fontSize: 14,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: SPACING.m,
  },
  price: {
    ...TYPOGRAPHY.h1,
    color: COLORS.secondary,
    fontSize: 32,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.grey,
    padding: 8,
    borderRadius: 10,
  },
  ratingText: {
    ...TYPOGRAPHY.caption,
    marginLeft: 5,
    fontWeight: 'bold',
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    marginTop: SPACING.l,
    marginBottom: SPACING.s,
  },
  description: {
    ...TYPOGRAPHY.body,
    lineHeight: 24,
    color: COLORS.darkGrey,
  },
  viewMore: {
    color: COLORS.secondary,
    fontWeight: 'bold',
  },
  reviewItem: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey,
    paddingVertical: SPACING.m,
  },
  reviewer: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  reviewComment: {
    fontSize: 14,
    color: COLORS.darkGrey,
  },
  footer: {
    flexDirection: 'row',
    padding: SPACING.m,
    borderTopWidth: 1,
    borderTopColor: COLORS.grey,
    backgroundColor: COLORS.white,
  },
  cartButton: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 10,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  cartBtnText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  buyButton: {
    flex: 1.5,
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyBtnText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  reviewsSection: {
    marginTop: SPACING.xl,
    paddingBottom: 50,
  }
});

export default ProductDetailsScreen;
