import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ImageBackground, 
  Image, 
  StatusBar,
  Dimensions
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme/theme';
import CustomButton from '../components/CustomButton';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop' }} 
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('../assets/images/logo.png')} 
                style={styles.welcomeLogo} 
                resizeMode="contain"
              />
            </View>

            <View style={styles.headerArea}>
              <View style={styles.line} />
              <Text style={styles.brandTitle}>PREMIUM COLLECTION</Text>
              <View style={styles.line} />
            </View>
            
            <View style={styles.textContainer}>
              <Text style={styles.title}>
                Elevate Your Style With Every Step
              </Text>
              <Text style={styles.subtitle}>
                Explore curated trends and premium fabrics designed for the modern individual.
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              <CustomButton 
                title="Get Started" 
                onPress={() => navigation.navigate('Login')} 
                style={styles.button}
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)', // Slightly deeper for better contrast
    justifyContent: 'flex-end',
    paddingBottom: 60,
  },
  content: {
    paddingHorizontal: 24,
  },
  headerArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  line: {
    height: 1,
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 4,
    marginHorizontal: 15,
  },
  textContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.white,
    fontSize: 40,
    lineHeight: 48,
    textAlign: 'center',
    fontWeight: '800',
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 16,
    lineHeight: 24,
  },
  buttonContainer: {
    marginTop: 0,
  },
  button: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    height: 56,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeLogo: {
    width: 100,
    height: 100,
  },
});

export default WelcomeScreen;
