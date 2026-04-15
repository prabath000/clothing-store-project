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
import Icon from 'react-native-vector-icons/Feather';

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
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitial}>
              {userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Icon name="edit-2" size={14} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>{userInfo?.name || 'User'}</Text>
        <Text style={styles.email}>{userInfo?.email || ''}</Text>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('OrderHistory', { userId: userInfo?._id })}
        >
          <View style={styles.menuIcon}>
            <Icon name="package" size={20} color={COLORS.text} />
          </View>
          <Text style={styles.menuText}>My Orders</Text>
          <Icon name="chevron-right" size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('Wishlist')}
        >
          <View style={styles.menuIcon}>
            <Icon name="heart" size={20} color={COLORS.text} />
          </View>
          <Text style={styles.menuText}>Wishlist</Text>
          <Icon name="chevron-right" size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIcon}>
            <Icon name="settings" size={20} color={COLORS.text} />
          </View>
          <Text style={styles.menuText}>Account Settings</Text>
          <Icon name="chevron-right" size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.menuItem, styles.logoutBtn]} 
          onPress={handleLogout}
        >
          <View style={[styles.menuIcon, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
            <Icon name="log-out" size={20} color={COLORS.error} />
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
    paddingTop: 60,
    paddingBottom: 40,
    backgroundColor: COLORS.white,
  },
  avatarContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: COLORS.white,
    // Add subtle shadow for avatar
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  avatarInitial: {
    ...TYPOGRAPHY.h1,
    fontSize: 40,
    color: COLORS.primary,
  },
  editBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    borderWidth: 3,
    borderColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    fontSize: 24,
  },
  email: {
    ...TYPOGRAPHY.body,
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  menu: {
    paddingHorizontal: SPACING.l,
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuIcon: {
    width: 44,
    height: 44,
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  logoutBtn: {
    marginTop: 20,
    borderBottomWidth: 0,
  },
});

export default ProfileScreen;
