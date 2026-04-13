import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { orderAPI } from '../api/api';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme/theme';
import Icon from 'react-native-vector-icons/Ionicons';

const OrderHistoryScreen = ({ route }) => {
  const { userId } = route.params;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getMyOrders(userId);
      setOrders(response.data.reverse()); // Show newest first
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
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

  if (loading && !refreshing) {
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
          <TouchableOpacity style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <View>
                <Text style={styles.orderDate}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
                <Text style={styles.orderId}>ID: #{item._id.substr(-6).toUpperCase()}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>

            <View style={styles.orderDetails}>
              <Text style={styles.itemCount}>{item.orderItems.length} Items</Text>
              <Text style={styles.orderTotal}>Total: ${item.totalPrice.toFixed(2)}</Text>
            </View>

            <View style={styles.badgeRow}>
              {item.isPaid && (
                <View style={styles.paidBadge}>
                  <Icon name="checkmark-circle" size={14} color="#4CAF50" />
                  <Text style={styles.paidText}>Paid</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.secondary]} />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>No orders found</Text>
          </View>
        }
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
  orderCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: SPACING.m,
    marginBottom: SPACING.m,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey,
    paddingBottom: 10,
    marginBottom: 10,
  },
  orderDate: {
    ...TYPOGRAPHY.body,
    fontWeight: 'bold',
  },
  orderId: {
    ...TYPOGRAPHY.caption,
    color: COLORS.darkGrey,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemCount: {
    ...TYPOGRAPHY.body,
    color: COLORS.darkGrey,
  },
  orderTotal: {
    ...TYPOGRAPHY.body,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  paidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 5,
  },
  paidText: {
    color: '#4CAF50',
    fontSize: 12,
    marginLeft: 3,
    fontWeight: 'bold',
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.darkGrey,
  },
});

export default OrderHistoryScreen;
