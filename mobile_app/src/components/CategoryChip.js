import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme/theme';
import Icon from 'react-native-vector-icons/Feather';

const CategoryChip = ({ label, icon, active, onPress }) => {
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        active ? styles.activeContainer : styles.inactiveContainer
      ]} 
      onPress={onPress}
    >
      {icon && (
        <View style={[styles.iconContainer, active ? styles.activeIcon : styles.inactiveIcon]}>
          <Icon name={icon} size={20} color={active ? COLORS.white : COLORS.text} />
        </View>
      )}
      <Text style={[
        styles.text, 
        active ? styles.activeText : styles.inactiveText
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12, // Soft square for a more professional look
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
  },
  inactiveContainer: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.grey,
  },
  activeContainer: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  iconContainer: {
    marginRight: 8,
  },
  text: {
    ...TYPOGRAPHY.bodyMedium,
    fontSize: 14,
    fontWeight: '600',
  },
  inactiveText: {
    color: COLORS.textSecondary,
  },
  activeText: {
    color: COLORS.white,
  },
});

export default CategoryChip;
