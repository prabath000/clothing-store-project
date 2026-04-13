import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme/theme';
import Icon from 'react-native-vector-icons/Ionicons';

const ProfileScreen = ({ navigation }) => {
  const { userInfo, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout, style: 'destructive' },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Icon name="person-circle" size={100} color={COLORS.secondary} />
        </View>
        <Text style={styles.name}>{userInfo?.name || 'User'}</Text>
        <Text style={styles.email}>{userInfo?.email || ''}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{userInfo?.role?.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('OrderHistory', { userId: userInfo?._id })}
        >
          <View style={styles.menuIcon}>
            <Icon name="receipt-outline" size={24} color={COLORS.primary} />
          </View>
          <Text style={styles.menuText}>My Orders</Text>
          <Icon name="chevron-forward" size={20} color={COLORS.darkGrey} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('Wishlist')}
        >
          <View style={styles.menuIcon}>
            <Icon name="heart-outline" size={24} color={COLORS.primary} />
          </View>
          <Text style={styles.menuText}>Wishlist</Text>
          <Icon name="chevron-forward" size={20} color={COLORS.darkGrey} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIcon}>
            <Icon name="settings-outline" size={24} color={COLORS.primary} />
          </View>
          <Text style={styles.menuText}>Account Settings</Text>
          <Icon name="chevron-forward" size={20} color={COLORS.darkGrey} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.menuItem, styles.logoutBtn]} 
          onPress={handleLogout}
        >
          <View style={[styles.menuIcon, { backgroundColor: '#FFEBEE' }]}>
            <Icon name="log-out-outline" size={24} color={COLORS.error} />
          </View>
          <Text style={[styles.menuText, { color: COLORS.error }]}>Log Out</Text>
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
  header: {
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  avatarContainer: {
    marginBottom: SPACING.s,
  },
  name: {
    ...TYPOGRAPHY.h2,
    color: COLORS.white,
  },
  email: {
    ...TYPOGRAPHY.body,
    color: COLORS.accent,
    marginTop: 5,
  },
  roleBadge: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 10,
  },
  roleText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  menu: {
    padding: SPACING.l,
    marginTop: SPACING.l,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey,
  },
  menuIcon: {
    width: 45,
    height: 45,
    backgroundColor: COLORS.grey,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.primary,
  },
  logoutBtn: {
    marginTop: SPACING.xl,
    borderBottomWidth: 0,
  },
});

export default ProfileScreen;
