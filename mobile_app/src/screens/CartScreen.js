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
  SafeAreaView,
  TextInput,
  StatusBar,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { cartAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme/theme';
import Icon from 'react-native-vector-icons/Feather';
import CustomButton from '../components/CustomButton';

const CartScreen = ({ navigation }) => {
  const { userInfo } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState('');

  const fetchCart = async () => {
    if (!userInfo) return;
    try {
      setLoading(true);
      const response = await cartAPI.get(userInfo._id);
      setCart(response.data);
    } catch (error) {
      console.log('Cart fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCart();
    }, [userInfo])
  );

  const updateQuantity = async (itemId, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;

    try {
      await cartAPI.update(itemId, { quantity: newQty });
      fetchCart();
    } catch (error) {
      Alert.alert('Error', 'Failed to update quantity');
    }
  };

  const removeItem = async (itemId) => {
    try {
      await cartAPI.remove(itemId);
      fetchCart();
    } catch (error) {
      Alert.alert('Error', 'Failed to remove item');
    }
  };

  const calculateTotal = () => {
    if (!cart || !cart.cartItems) return 0;
    return cart.cartItems.reduce((acc, item) => {
      const price = item.product ? item.product.price : 0;
      return acc + (price * item.quantity);
    }, 0);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!cart || cart.cartItems.length === 0) {
    return (
      <View style={styles.center}>
        <Icon name="cart-outline" size={80} color={COLORS.border} />
        <Text style={styles.emptyText}>Your cart is empty</Text>
        <CustomButton 
          title="Browse Products" 
          onPress={() => navigation.navigate('Home')}
          style={styles.browseBtn}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
        <View style={{ width: 44 }} />
      </View>

      <Text style={styles.itemCount}>{cart.cartItems.length} Items</Text>

      <FlatList
        data={cart.cartItems}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          if (!item.product) {
            return (
              <View style={styles.cartItem}>
                <View style={[styles.image, { backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center' }]}>
                  <Icon name="alert-circle-outline" size={24} color={COLORS.darkGrey} />
                </View>
                <View style={styles.info}>
                  <View style={styles.nameRow}>
                    <Text style={styles.name} numberOfLines={1}>Product Unavailable</Text>
                    <TouchableOpacity onPress={() => removeItem(item._id)}>
                      <Icon name="trash-2" size={18} color={COLORS.error} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.itemMeta}>This item is no longer available.</Text>
                </View>
              </View>
            );
          }

          return (
            <View style={styles.cartItem}>
              <Image 
                source={{ uri: item.product.images && item.product.images.length > 0 ? (item.product.images[0].startsWith('http') ? item.product.images[0] : `http://10.0.2.2:5000${item.product.images[0]}`) : 'https://via.placeholder.com/150' }} 
                style={styles.image} 
              />
              <View style={styles.info}>
                <View style={styles.nameRow}>
                  <Text style={styles.name} numberOfLines={1}>{item.product.name}</Text>
                  <TouchableOpacity onPress={() => removeItem(item._id)}>
                    <Icon name="trash-2" size={18} color={COLORS.error} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.itemMeta}>Size: {item.size || 'M'}</Text>
                
                <View style={styles.priceRow}>
                  <View style={styles.qtyContainer}>
                    <TouchableOpacity 
                      style={styles.qtyBtn} 
                      onPress={() => updateQuantity(item._id, item.quantity, -1)}
                    >
                      <Icon name="minus" size={14} color={COLORS.text} />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                    <TouchableOpacity 
                      style={styles.qtyBtn} 
                      onPress={() => updateQuantity(item._id, item.quantity, 1)}
                    >
                      <Icon name="plus" size={14} color={COLORS.text} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.price}>Rs.{(item.product.price * item.quantity).toFixed(2)}</Text>
                </View>
              </View>
            </View>
          );
        }}
        contentContainerStyle={styles.list}
      />

      <View style={styles.footer}>
        {/* Promo Code */}
        <View style={styles.promoContainer}>
          <TextInput
            style={styles.promoInput}
            placeholder="Add your code"
            placeholderTextColor={COLORS.textSecondary}
            value={promoCode}
            onChangeText={setPromoCode}
          />
          <TouchableOpacity style={styles.promoBtn}>
            <Text style={styles.promoBtnText}>Enjoy1</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Cost</Text>
          <Text style={styles.totalAmount}>Rs.{calculateTotal().toFixed(2)}</Text>
        </View>

        <CustomButton 
          title="Checkout" 
          onPress={() => navigation.navigate('Checkout', { cart: cart, total: calculateTotal() })}
          style={styles.checkoutBtn}
        />
      </View>
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
    padding: SPACING.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.l,
    paddingVertical: 20,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerTitle: {
    ...TYPOGRAPHY.h3,
    fontSize: 18,
  },
  itemCount: {
    ...TYPOGRAPHY.h3,
    fontSize: 18,
    marginHorizontal: SPACING.l,
    marginBottom: SPACING.m,
  },
  list: {
    paddingHorizontal: SPACING.l,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: COLORS.secondary,
  },
  info: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    ...TYPOGRAPHY.bodyMedium,
    fontSize: 15,
    flex: 1,
    fontWeight: '600',
  },
  itemMeta: {
    ...TYPOGRAPHY.caption,
    fontSize: 12,
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  price: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '700',
    color: COLORS.primary,
    fontSize: 16,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    borderRadius: 8,
    padding: 4,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    marginHorizontal: 10,
    ...TYPOGRAPHY.bodyMedium,
    fontSize: 13,
    fontWeight: '700',
  },
  emptyText: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textSecondary,
    marginTop: 20,
  },
  browseBtn: {
    marginTop: 30,
    paddingHorizontal: 40,
  },
  footer: {
    backgroundColor: COLORS.white,
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
    paddingBottom: 40,
  },
  promoContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  promoInput: {
    flex: 1,
    paddingHorizontal: 16,
    ...TYPOGRAPHY.body,
    fontSize: 14,
  },
  promoBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  promoBtnText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  totalLabel: {
    ...TYPOGRAPHY.body,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  totalAmount: {
    ...TYPOGRAPHY.h2,
    fontSize: 24,
    color: COLORS.text,
  },
  checkoutBtn: {
    marginVertical: 0,
    height: 56,
  },
});

export default CartScreen;
