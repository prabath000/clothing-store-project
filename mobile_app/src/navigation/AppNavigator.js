import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../theme/theme';

// Screens (We will create these next)
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import HomeScreen from '../screens/HomeScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import CartScreen from '../screens/CartScreen';
import WishlistScreen from '../screens/WishlistScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';
import ReviewScreen from '../screens/ReviewScreen';
import AdminDashboard from '../screens/AdminDashboard';
import ManageProducts from '../screens/ManageProducts';
import ManageOrders from '../screens/ManageOrders';
import ManageUsers from '../screens/ManageUsers';
import ManageReviews from '../screens/ManageReviews';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// User Tabs
const UserTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Home') iconName = 'home';
        else if (route.name === 'Wishlist') iconName = 'heart';
        else if (route.name === 'Cart') iconName = 'shopping-cart';
        else if (route.name === 'Profile') iconName = 'user';
        return <Icon name={iconName} size={22} color={color} strokeWidth={focused ? 2.5 : 2} />;
      },
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: '#AAAAAA',
      tabBarStyle: {
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        height: 65,
        paddingBottom: 10,
        paddingTop: 10,
      },
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Wishlist" component={WishlistScreen} />
    <Tab.Screen name="Cart" component={CartScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

// Shared Stack for User (Details, Checkout, Reviews etc.)
const UserStack = () => (
  <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: COLORS.primary }, headerTintColor: COLORS.white }}>
    <Stack.Screen name="MainTabs" component={UserTabs} options={{ headerShown: false }} />
    <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} options={{ title: 'Product Details' }} />
    <Stack.Screen name="Checkout" component={CheckoutScreen} />
    <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} options={{ title: 'Order History' }} />
    <Stack.Screen name="Reviews" component={ReviewScreen} />
  </Stack.Navigator>
);

// Admin Stack
const AdminNavigator = () => (
  <Stack.Navigator 
    initialRouteName="AdminDashboard"
    screenOptions={{ 
      headerStyle: { backgroundColor: COLORS.primary }, 
      headerTintColor: COLORS.white 
    }}
  >
    <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ title: 'Admin Panel' }} />
    <Stack.Screen name="ManageProducts" component={ManageProducts} options={{ title: 'Manage Products' }} />
    <Stack.Screen name="ManageOrders" component={ManageOrders} options={{ title: 'Manage Orders' }} />
    <Stack.Screen name="ManageUsers" component={ManageUsers} options={{ title: 'Manage Users' }} />
    <Stack.Screen name="ManageReviews" component={ManageReviews} options={{ title: 'Manage Reviews' }} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { userToken, userInfo, isLoading } = useAuth();

  if (isLoading) return null; // Or a splash screen

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!userToken ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : userInfo?.role === 'admin' ? (
        <Stack.Screen name="Admin" component={AdminNavigator} />
      ) : (
        <Stack.Screen name="User" component={UserStack} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
