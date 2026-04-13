import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { orderAPI, paymentAPI } from '../api/api';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme/theme';
import Icon from 'react-native-vector-icons/Ionicons';

const CheckoutScreen = ({ route, navigation }) => {
  const { cart, total } = route.params;
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');

  const handlePlaceOrder = async () => {
    if (!address || !city || !postalCode || !country) {
      Alert.alert('Error', 'Please fill in all shipping details');
      return;
    }

    setLoading(true);
    try {
      // 1. Create Order
      const orderData = {
        orderItems: cart.cartItems.map(item => ({
          name: item.product.name,
          qty: item.quantity,
          image: item.product.images[0],
          price: item.product.price,
          product: item.product._id,
        })),
        shippingAddress: { address, city, postalCode, country },
        paymentMethod: 'Credit Card',
        itemsPrice: total,
        shippingPrice: total > 500 ? 0 : 50,
        totalPrice: total + (total > 500 ? 0 : 50),
      };

      const orderRes = await orderAPI.create(orderData);
      const orderId = orderRes.data._id;

      // 2. Mock Payment
      await paymentAPI.create({
        orderId: orderId,
        paymentMethod: 'Credit Card',
        amount: orderData.totalPrice,
      });

      Alert.alert(
        'Success',
        'Order placed and payment successful!',
        [{ text: 'View Orders', onPress: () => navigation.navigate('OrderHistory', { userId: cart.user }) }]
      );
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionTitle}>Shipping Address</Text>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Street Address"
            value={address}
            onChangeText={setAddress}
          />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 10 }]}
              placeholder="City"
              value={city}
              onChangeText={setCity}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Postal Code"
              value={postalCode}
              onChangeText={setPostalCode}
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Country"
            value={country}
            onChangeText={setCountry}
          />
        </View>

        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${total.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>${total > 500 ? '0.00' : '50.00'}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${(total + (total > 500 ? 0 : 50)).toFixed(2)}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.payBtn}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.primary} />
          ) : (
            <>
              <Icon name="card-outline" size={24} color={COLORS.primary} />
              <Text style={styles.payBtnText}>Pay & Place Order</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scroll: {
    padding: SPACING.l,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.m,
    marginTop: SPACING.l,
    color: COLORS.primary,
  },
  form: {
    backgroundColor: COLORS.grey,
    padding: SPACING.m,
    borderRadius: 15,
  },
  input: {
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  row: {
    flexDirection: 'row',
  },
  summaryCard: {
    backgroundColor: COLORS.primary,
    padding: SPACING.l,
    borderRadius: 20,
    marginTop: SPACING.s,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    color: COLORS.accent,
    fontSize: 16,
  },
  summaryValue: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.darkGrey,
    paddingTop: 10,
    marginTop: 5,
  },
  totalLabel: {
    color: COLORS.secondary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  totalValue: {
    color: COLORS.secondary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  payBtn: {
    backgroundColor: COLORS.secondary,
    padding: 18,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.xl * 2,
    marginBottom: 40,
  },
  payBtnText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 10,
  },
});

export default CheckoutScreen;
