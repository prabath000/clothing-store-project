import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme/theme';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.m * 3) / 2;

const ProductCard = ({ product, onPress, isWishlisted, onWishlistPress }) => {
  if (!product) return null;
  // Use first image if available, else placeholder
  const imageUrl = product.images?.[0] 
    ? { uri: product.images[0].startsWith('http') ? product.images[0] : `http://10.0.2.2:5000${product.images[0]}` } 
    : { uri: 'https://via.placeholder.com/300' };


  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        <Image source={imageUrl} style={styles.image} resizeMode="cover" />
        <TouchableOpacity 
          style={styles.wishlistBtn} 
          onPress={onWishlistPress}
          activeOpacity={0.7}
        >
          <Icon 
            name={isWishlisted ? "heart" : "heart-outline"} 
            size={18} 
            color={isWishlisted ? COLORS.error : COLORS.text} 
          />
        </TouchableOpacity>

      </View>
      
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.category}>{product.category}</Text>
        <View style={styles.footer}>
          <Text style={styles.price}>Rs.{product.price.toFixed(2)}</Text>
          <View style={styles.rating}>
            <Icon name="star" size={12} color="#FFB800" />
            <Text style={styles.ratingText}>{product.averageRating || '4.5'}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: SPACING.l,
    width: CARD_WIDTH,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 220, // Taller image for a more premium look
    backgroundColor: COLORS.secondary,
    borderRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  wishlistBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  info: {
    paddingVertical: SPACING.s,
    paddingHorizontal: 4, // More edge-to-edge feel
  },
  name: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '600',
  },
  category: {
    ...TYPOGRAPHY.caption,
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  price: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 16,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    ...TYPOGRAPHY.caption,
    marginLeft: 3,
    fontWeight: '600',
    color: COLORS.text,
    fontSize: 12,
  },
});

export default ProductCard;

