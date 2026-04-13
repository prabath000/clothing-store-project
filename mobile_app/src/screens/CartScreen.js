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
import { cartAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme/theme';
import Icon from 'react-native-vector-icons/Ionicons';

const CartScreen = ({ navigation }) => {
  const { userInfo } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

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
    return cart.cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.secondary} />
      </View>
    );
  }

  if (!cart || cart.cartItems.length === 0) {
    return (
      <View style={styles.center}>
        <Icon name="cart-outline" size={80} color={COLORS.accent} />
        <Text style={styles.emptyText}>Your cart is empty</Text>
        <TouchableOpacity 
          style={styles.shopBtn} 
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.shopBtnText}>Start Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cart.cartItems}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image 
              source={{ uri: `http://10.0.2.2:5000${item.product.images?.[0]}` }} 
              style={styles.image} 
            />
            <View style={styles.info}>
              <Text style={styles.name} numberOfLines={1}>{item.product.name}</Text>
              <Text style={styles.price}>${item.product.price}</Text>
              
              <View style={styles.qtyContainer}>
                <TouchableOpacity onPress={() => updateQuantity(item._id, item.quantity, -1)}>
                  <Icon name="remove-circle-outline" size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => updateQuantity(item._id, item.quantity, 1)}>
                  <Icon name="add-circle-outline" size={24} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity onPress={() => removeItem(item._id)}>
              <Icon name="trash-outline" size={24} color={COLORS.error} />
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.list}
      />

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount:</Text>
          <Text style={styles.totalAmount}>${calculateTotal().toFixed(2)}</Text>
        </View>
        <TouchableOpacity 
          style={styles.checkoutBtn}
          onPress={() => navigation.navigate('Checkout', { cart: cart, total: calculateTotal() })}
        >
          <Text style={styles.checkoutText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
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
  cartItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: SPACING.m,
    marginBottom: SPACING.m,
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
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
    marginVertical: 4,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  qtyText: {
    marginHorizontal: 15,
    fontSize: 16,
    fontWeight: 'bold',
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
  footer: {
    backgroundColor: COLORS.white,
    padding: SPACING.l,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.l,
  },
  totalLabel: {
    fontSize: 18,
    color: COLORS.darkGrey,
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  checkoutBtn: {
    backgroundColor: COLORS.secondary,
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
  },
  checkoutText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default CartScreen;
