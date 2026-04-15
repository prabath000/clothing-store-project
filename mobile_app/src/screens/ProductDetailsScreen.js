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
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { productAPI, cartAPI, wishlistAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme/theme';
import Icon from 'react-native-vector-icons/Feather';
import CustomButton from '../components/CustomButton';

const { width, height } = Dimensions.get('window');

const SIZES = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
const COLORS_LIST = [
  { name: 'Brown', hex: '#8B4513' },
  { name: 'Black', hex: '#000000' },
  { name: 'Grey', hex: '#808080' },
  { name: 'Beige', hex: '#F5F5DC' },
];

const ProductDetailsScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const { userInfo } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistItemId, setWishlistItemId] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Brown');

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [prodRes, wishRes] = await Promise.all([
        productAPI.getById(id),
        userInfo ? wishlistAPI.get(userInfo._id) : Promise.resolve({ data: [] })
      ]);
      setProduct(prodRes.data);
      
      if (userInfo) {
        const wishItem = wishRes.data.find(item => item.product && item.product._id === id);
        if (wishItem) {
          setInWishlist(true);
          setWishlistItemId(wishItem._id);
        } else {
          setInWishlist(false);
          setWishlistItemId(null);
        }
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
      await cartAPI.add({ productId: id, quantity: 1, size: selectedSize, color: selectedColor });
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
      if (inWishlist && wishlistItemId) {
        // Toggle Remove
        await wishlistAPI.remove(wishlistItemId);
        setInWishlist(false);
        setWishlistItemId(null);
        Alert.alert('Success', 'Removed from wishlist');
      } else {
        // Toggle Add
        const res = await wishlistAPI.add({ productId: id });
        setInWishlist(true);
        setWishlistItemId(res.data._id);
        Alert.alert('Success', 'Added to wishlist');
      }
    } catch (error) {
      console.log('Wishlist toggle error:', error);
      const msg = error.response?.data?.message || error.message || 'Unknown error';
      Alert.alert('Wishlist Error', msg);
    }
  };



  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const imageUrl = product.images?.[0] 
    ? { uri: product.images[0].startsWith('http') ? product.images[0] : `http://10.0.2.2:5000${product.images[0]}` } 
    : { uri: 'https://via.placeholder.com/600' }; // Keeping placeholder as is

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      
      {/* Custom Header over Image */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <TouchableOpacity style={styles.iconBtn} onPress={toggleWishlist}>
          <Icon name="heart" size={22} color={inWishlist ? COLORS.error : COLORS.text} fill={inWishlist ? COLORS.error : 'transparent'} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Image Carousel Mock */}
        <View style={styles.imageContainer}>
          <Image source={imageUrl} style={styles.image} resizeMode="cover" />
          <View style={styles.indicators}>
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{product.name}</Text>
              <Text style={styles.categoryLabel}>{product.category || 'Apparel'}</Text>
            </View>
            <View style={styles.ratingBox}>
              <Icon name="star" size={16} color="#FFB800" fill="#FFB800" />
              <Text style={styles.ratingText}>{product.averageRating || '4.5'}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Product Details</Text>
          <Text style={styles.description}>
            {product.description || "This is a premium product. It has extra facilities. If you buy this you will get more offer via our payment methods. So don't miss out."}
            <Text style={styles.readMore}> Read More</Text>
          </Text>

          {/* Size Selection */}
          <Text style={styles.sectionTitle}>Select Size</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsScroll}>
            {SIZES.map(size => (
              <TouchableOpacity 
                key={size} 
                onPress={() => setSelectedSize(size)}
                style={[styles.sizeOption, selectedSize === size && styles.activeSizeOption]}
              >
                <Text style={[styles.sizeText, selectedSize === size && styles.activeSizeText]}>{size}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Color Selection */}
          <Text style={styles.sectionTitle}>Select Color : <Text style={styles.selectedColorText}>{selectedColor}</Text></Text>
          <View style={styles.colorRow}>
            {COLORS_LIST.map(color => (
              <TouchableOpacity 
                key={color.name} 
                onPress={() => setSelectedColor(color.name)}
                style={[styles.colorOuter, selectedColor === color.name && { borderColor: COLORS.primary }]}
              >
                <View style={[styles.colorInner, { backgroundColor: color.hex }]} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Footer sticky bar */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.totalLabel}>Total Price</Text>
          <Text style={styles.totalPrice}>Rs.{product.price.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.addCartBtn} onPress={handleAddToCart} disabled={addingToCart}>
          {addingToCart ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <>
              <Icon name="shopping-bag" size={20} color={COLORS.white} />
              <Text style={styles.addCartText}>Add to Cart</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.l,
    paddingTop: StatusBar.currentHeight + 10,
    paddingBottom: 15,
    backgroundColor: COLORS.white,
    zIndex: 10,
  },
  headerTitle: {
    ...TYPOGRAPHY.h3,
    fontSize: 18,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: width,
    height: height * 0.45,
    backgroundColor: COLORS.secondary,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  indicators: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.15)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    width: 18,
  },
  detailsContainer: {
    padding: SPACING.l,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.m,
  },
  name: {
    ...TYPOGRAPHY.h2,
    fontSize: 24,
  },
  categoryLabel: {
    ...TYPOGRAPHY.caption,
    marginTop: 4,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  ratingText: {
    ...TYPOGRAPHY.bodyMedium,
    marginLeft: 6,
    fontWeight: '700',
    fontSize: 14,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    fontSize: 16,
    marginTop: SPACING.xl,
    marginBottom: SPACING.s,
  },
  description: {
    ...TYPOGRAPHY.body,
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  readMore: {
    color: COLORS.accent,
    fontWeight: '700',
  },
  optionsScroll: {
    marginTop: SPACING.s,
  },
  sizeOption: {
    width: 50,
    height: 50,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.grey,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.m,
  },
  activeSizeOption: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  sizeText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.text,
    fontSize: 15,
  },
  activeSizeText: {
    color: COLORS.white,
  },
  selectedColorText: {
    color: COLORS.textSecondary,
    fontWeight: '400',
  },
  colorRow: {
    flexDirection: 'row',
    marginTop: SPACING.s,
    marginBottom: 60,
  },
  colorOuter: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.m,
  },
  colorInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  footer: {
    flexDirection: 'row',
    padding: SPACING.l,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingBottom: 30,
  },
  totalLabel: {
    ...TYPOGRAPHY.caption,
    fontSize: 12,
  },
  totalPrice: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    fontSize: 24,
  },
  addCartBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    paddingHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  addCartText: {
    color: COLORS.white,
    fontWeight: '700',
    marginLeft: 12,
    fontSize: 16,
  },
});

export default ProductDetailsScreen;
