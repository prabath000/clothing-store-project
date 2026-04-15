import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { adminAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme/theme';
import Icon from 'react-native-vector-icons/Ionicons';

const AdminDashboard = ({ navigation }) => {
  const { logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Admin stats error:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        Alert.alert('Session Expired', 'Please login again as an administrator.');
        logout();
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  const StatCard = ({ title, value, icon, color }) => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Icon name={icon} size={24} color={color} />
      </View>
      <View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.secondary} />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.welcome}>Admin Dashboard</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Icon name="log-out-outline" size={24} color={COLORS.error} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsGrid}>
        <StatCard title="Revenue" value={`Rs.${stats?.totalRevenue || 0}`} icon="cash-outline" color="#4CAF50" />
        <StatCard title="Orders" value={stats?.ordersCount || 0} icon="cart-outline" color="#2196F3" />
        <StatCard title="Products" value={stats?.productsCount || 0} icon="shirt-outline" color="#FF9800" />
        <StatCard title="Users" value={stats?.usersCount || 0} icon="people-outline" color="#9C27B0" />
      </View>

      <Text style={styles.sectionTitle}>Management</Text>
      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ManageProducts')}>
          <Icon name="shirt" size={24} color={COLORS.primary} style={styles.menuIcon} />
          <Text style={styles.menuText}>Manage Products</Text>
          <Icon name="chevron-forward" size={20} color={COLORS.darkGrey} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ManageOrders')}>
          <Icon name="list" size={24} color={COLORS.primary} style={styles.menuIcon} />
          <Text style={styles.menuText}>Manage Orders</Text>
          <Icon name="chevron-forward" size={20} color={COLORS.darkGrey} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ManageUsers')}>
          <Icon name="people" size={24} color={COLORS.primary} style={styles.menuIcon} />
          <Text style={styles.menuText}>Manage Users</Text>
          <Icon name="chevron-forward" size={20} color={COLORS.darkGrey} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ManageReviews')}>
          <Icon name="star" size={24} color={COLORS.primary} style={styles.menuIcon} />
          <Text style={styles.menuText}>Manage Reviews</Text>
          <Icon name="chevron-forward" size={20} color={COLORS.darkGrey} />
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.l,
    backgroundColor: COLORS.white,
  },
  welcome: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: SPACING.m,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: COLORS.white,
    width: '48%',
    padding: SPACING.m,
    borderRadius: 15,
    marginBottom: SPACING.m,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  statIcon: {
    width: 45,
    height: 45,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statTitle: {
    fontSize: 12,
    color: COLORS.darkGrey,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    marginLeft: SPACING.l,
    marginTop: SPACING.m,
  },
  menu: {
    padding: SPACING.l,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    elevation: 1,
  },
  menuIcon: {
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.primary,
  },
});

export default AdminDashboard;
