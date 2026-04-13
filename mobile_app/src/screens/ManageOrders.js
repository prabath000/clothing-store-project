import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { adminAPI, orderAPI } from '../api/api';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme/theme';
import Icon from 'react-native-vector-icons/Ionicons';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await adminAPI.getOrders();
      setOrders(response.data.reverse());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = (id, currentStatus) => {
    Alert.alert(
      'Update Status',
      `Change order status from ${currentStatus}?`,
      [
        { text: 'Shipped', onPress: () => updateStatus(id, 'Shipped') },
        { text: 'Delivered', onPress: () => updateStatus(id, 'Delivered') },
        { text: 'Cancel Order', onPress: () => updateStatus(id, 'Cancelled'), style: 'destructive' },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const updateStatus = async (id, status) => {
    try {
      await orderAPI.updateStatus(id, { status });
      Alert.alert('Success', `Order status updated to ${status}`);
      fetchOrders();
    } catch (error) {
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing': return '#2196F3';
      case 'Shipped': return '#FF9800';
      case 'Delivered': return '#4CAF50';
      case 'Cancelled': return '#F44336';
      default: return '#757575';
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
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <View style={styles.header}>
              <View>
                <Text style={styles.orderId}>Order #{item._id.substr(-6).toUpperCase()}</Text>
                <Text style={styles.customer}>Customer: {item.user?.name || 'Unknown'}</Text>
              </View>
              <TouchableOpacity 
                style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}
                onPress={() => handleUpdateStatus(item._id, item.status)}
              >
                <Text style={styles.statusText}>{item.status} ▾</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.details}>
              <Text style={styles.infoText}>{item.orderItems.length} items  |  Total: ${item.totalPrice.toFixed(2)}</Text>
              <Text style={styles.dateText}>{new Date(item.createdAt).toLocaleString()}</Text>
            </View>

            <View style={styles.footer}>
              <View style={item.isPaid ? styles.paidTag : styles.unpaidTag}>
                <Text style={item.isPaid ? styles.paidText : styles.unpaidText}>
                  {item.isPaid ? 'PAID' : 'UNPAID'}
                </Text>
              </View>
            </View>
          </View>
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
  },
  list: {
    padding: SPACING.m,
  },
  orderCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.m,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey,
    paddingBottom: 10,
  },
  orderId: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  customer: {
    fontSize: 12,
    color: COLORS.darkGrey,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  details: {
    marginVertical: 10,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  dateText: {
    fontSize: 12,
    color: COLORS.darkGrey,
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  paidTag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  paidText: {
    color: '#4CAF50',
    fontSize: 10,
    fontWeight: 'bold',
  },
  unpaidTag: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  unpaidText: {
    color: '#F44336',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default ManageOrders;
