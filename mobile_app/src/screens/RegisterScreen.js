import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { authAPI, BASE_URL } from '../api/api';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme/theme';
import Icon from 'react-native-vector-icons/Feather';
import CustomButton from '../components/CustomButton';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await authAPI.register({ name, email, password });
      Alert.alert('Success', 'Registration successful! Please login.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error) {
      console.log('Registration Error Detail:', error);
      let errorMsg = 'Something went wrong. Please try again.';
      
      if (!error.response) {
        errorMsg = `Server unreachable at ${authAPI.register ? 'configured backend' : 'backend'}. Please check your internet connection or try again later.\n\nTarget: ${BASE_URL}`;
      } else if (error.response.data?.message) {
        errorMsg = error.response.data.message;
      }
      
      Alert.alert('Registration Failed', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color={COLORS.text} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Image 
              source={require('../assets/images/logo.png')} 
              style={styles.logoImage} 
              resizeMode="contain" 
            />
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Fill in your details to start shopping</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <Icon name="user" size={18} color={COLORS.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  placeholderTextColor={COLORS.textSecondary}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <Icon name="mail" size={18} color={COLORS.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={COLORS.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Icon name="lock" size={18} color={COLORS.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Create a password"
                  placeholderTextColor={COLORS.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.inputWrapper}>
                <Icon name="lock" size={18} color={COLORS.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm your password"
                  placeholderTextColor={COLORS.textSecondary}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </View>
            </View>

            <CustomButton 
              title="Sign Up" 
              onPress={handleRegister} 
              loading={loading}
              style={styles.registerBtn}
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.link}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  inner: {
    flex: 1,
  },
  scroll: {
    padding: SPACING.l,
    flexGrow: 1,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  logoImage: {
    width: 64,
    height: 64,
    marginBottom: SPACING.s,
  },
  title: {
    ...TYPOGRAPHY.h1,
    fontSize: 28,
    marginBottom: 8,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    ...TYPOGRAPHY.bodyMedium,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    ...TYPOGRAPHY.body,
    fontSize: 14,
    color: COLORS.text,
  },
  registerBtn: {
    marginTop: 24,
    marginBottom: 12,
    height: 56,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  footerText: {
    ...TYPOGRAPHY.body,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  link: {
    ...TYPOGRAPHY.bodyMedium,
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '700',
  },
});

export default RegisterScreen;
