import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { adminAPI } from '../api/api';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme/theme';
import Icon from 'react-native-vector-icons/Ionicons';

const ManageUsers = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = (id, role) => {
    if (role === 'admin') {
      Alert.alert('Error', 'Cannot delete an admin user');
      return;
    }

    Alert.alert('Delete User', 'Are you sure you want to delete this user?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            await adminAPI.removeUser(id);
            fetchUsers();
          } catch (error) {
            Alert.alert('Error', 'Failed to delete user');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.secondary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Users</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <View style={styles.userIcon}>
              <Icon name="person" size={30} color={COLORS.primary} />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userEmail}>{item.email}</Text>
              <View style={[styles.roleBadge, { backgroundColor: item.role === 'admin' ? '#FFEBEE' : '#E8F5E9' }]}>
                <Text style={[styles.roleText, { color: item.role === 'admin' ? COLORS.error : '#4CAF50' }]}>
                  {item.role.toUpperCase()}
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.deleteBtn} 
              onPress={() => handleDeleteUser(item._id, item.role)}
              disabled={item.role === 'admin'}
            >
              <Icon name="trash-outline" size={20} color={item.role === 'admin' ? COLORS.darkGrey : COLORS.error} />
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No users found</Text>}
      />
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
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.l,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
  },
  list: {
    padding: SPACING.m,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.grey,
    padding: SPACING.m,
    borderRadius: 15,
    marginBottom: 10,
  },
  userIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.primary,
    fontSize: 16,
  },
  userEmail: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 5,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  roleText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  deleteBtn: {
    padding: 10,
  },
  empty: {
    textAlign: 'center',
    marginTop: 50,
    color: COLORS.darkGrey,
  },
});

export default ManageUsers;
