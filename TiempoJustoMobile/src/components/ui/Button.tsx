// ============================================================================
// COMPONENTE BUTTON - TIEMPOJUSTO
// ============================================================================

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '../../shared/constants';

// ============================================================================
// TIPOS DE PROPS
// ============================================================================

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  style,
  textStyle
}) => {
  // ============================================================================
  // ESTILOS DINÁMICOS
  // ============================================================================

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: BORDER_RADIUS.MD,
      ...getSizeStyle(),
      ...getVariantStyle(),
      ...(fullWidth && { width: '100%' }),
      ...(disabled && { opacity: 0.5 }),
      ...style
    };

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    return {
      ...getSizeTextStyle(),
      ...getVariantTextStyle(),
      ...textStyle
    };
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'small':
        return {
          paddingHorizontal: SPACING.MD,
          paddingVertical: SPACING.SM,
          minHeight: 32
        };
      case 'large':
        return {
          paddingHorizontal: SPACING.XL,
          paddingVertical: SPACING.LG,
          minHeight: 56
        };
      default: // medium
        return {
          paddingHorizontal: SPACING.LG,
          paddingVertical: SPACING.MD,
          minHeight: 44
        };
    }
  };

  const getSizeTextStyle = (): TextStyle => {
    switch (size) {
      case 'small':
        return { fontSize: FONT_SIZES.SM };
      case 'large':
        return { fontSize: FONT_SIZES.LG };
      default: // medium
        return { fontSize: FONT_SIZES.MD };
    }
  };

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: COLORS.SURFACE,
          borderWidth: 1,
          borderColor: COLORS.BORDER
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: COLORS.PRIMARY
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent'
        };
      case 'danger':
        return {
          backgroundColor: COLORS.ERROR
        };
      default: // primary
        return {
          backgroundColor: COLORS.PRIMARY
        };
    }
  };

  const getVariantTextStyle = (): TextStyle => {
    switch (variant) {
      case 'secondary':
        return { color: COLORS.TEXT_PRIMARY };
      case 'outline':
        return { color: COLORS.PRIMARY };
      case 'ghost':
        return { color: COLORS.TEXT_SECONDARY };
      case 'danger':
        return { color: '#ffffff' };
      default: // primary
        return { color: '#ffffff' };
    }
  };

  // ============================================================================
  // RENDERIZADO
  // ============================================================================

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={getVariantTextStyle().color} 
          style={styles.loader}
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

// ============================================================================
// ESTILOS
// ============================================================================

const styles = StyleSheet.create({
  loader: {
    marginRight: SPACING.SM
  }
});

// ============================================================================
// COMPONENTES ESPECIALIZADOS
// ============================================================================

export const PrimaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="primary" />
);

export const SecondaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="secondary" />
);

export const OutlineButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="outline" />
);

export const GhostButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="ghost" />
);

export const DangerButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="danger" />
);
