import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme/theme';

const CustomButton = ({ 
  title, 
  onPress, 
  variant = 'solid', 
  loading = false, 
  disabled = false, 
  style 
}) => {
  const isOutline = variant === 'outline';
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        isOutline ? styles.outlineButton : styles.solidButton,
        disabled && styles.disabled,
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? COLORS.primary : COLORS.white} />
      ) : (
        <Text style={[
          styles.text,
          isOutline ? styles.outlineText : styles.solidText
        ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12, // More professional "soft square" look
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  solidButton: {
    backgroundColor: COLORS.primary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    ...TYPOGRAPHY.bodyMedium,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  solidText: {
    color: COLORS.white,
  },
  outlineText: {
    color: COLORS.primary,
  },
});

export default CustomButton;
