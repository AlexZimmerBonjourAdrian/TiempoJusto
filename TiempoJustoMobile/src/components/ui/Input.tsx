// ============================================================================
// COMPONENTE INPUT - TIEMPOJUSTO
// ============================================================================

import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, ViewStyle, TextStyle, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '../../shared/constants';

// ============================================================================
// TIPOS DE PROPS
// ============================================================================

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  keyboardType = 'default',
  secureTextEntry = false,
  autoCapitalize = 'sentences',
  autoCorrect = true,
  style,
  inputStyle,
  labelStyle,
  errorStyle,
  leftIcon,
  rightIcon,
  onRightIconPress
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // ============================================================================
  // ESTILOS DINÁMICOS
  // ============================================================================

  const getContainerStyle = (): ViewStyle => {
    return {
      ...styles.container,
      ...(error && styles.containerError),
      ...(disabled && styles.containerDisabled),
      ...style
    };
  };

  const getInputContainerStyle = (): ViewStyle => {
    return {
      ...styles.inputContainer,
      ...(isFocused && styles.inputContainerFocused),
      ...(error && styles.inputContainerError),
      ...(disabled && styles.inputContainerDisabled)
    };
  };

  const getInputStyle = (): TextStyle => {
    return {
      ...styles.input,
      ...(multiline && styles.inputMultiline),
      ...inputStyle
    };
  };

  // ============================================================================
  // RENDERIZADO
  // ============================================================================

  return (
    <View style={getContainerStyle()}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
        </Text>
      )}
      
      <View style={getInputContainerStyle()}>
        {leftIcon && (
          <View style={styles.leftIcon}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.TEXT_SECONDARY}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          style={getInputStyle()}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        
        {rightIcon && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text style={[styles.error, errorStyle]}>
          {error}
        </Text>
      )}
      
      {maxLength && (
        <Text style={styles.characterCount}>
          {value.length}/{maxLength}
        </Text>
      )}
    </View>
  );
};

// ============================================================================
// ESTILOS
// ============================================================================

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.MD
  },
  containerError: {
    marginBottom: SPACING.SM
  },
  containerDisabled: {
    opacity: 0.6
  },
  label: {
    fontSize: FONT_SIZES.SM,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.SURFACE,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: BORDER_RADIUS.MD,
    paddingHorizontal: SPACING.MD,
    minHeight: 44
  },
  inputContainerFocused: {
    borderColor: COLORS.PRIMARY,
    borderWidth: 2
  },
  inputContainerError: {
    borderColor: COLORS.ERROR,
    borderWidth: 2
  },
  inputContainerDisabled: {
    backgroundColor: COLORS.BACKGROUND,
    borderColor: COLORS.BORDER
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZES.MD,
    color: COLORS.TEXT_PRIMARY,
    paddingVertical: SPACING.SM
  },
  inputMultiline: {
    textAlignVertical: 'top',
    minHeight: 80
  },
  leftIcon: {
    marginRight: SPACING.SM
  },
  rightIcon: {
    marginLeft: SPACING.SM,
    padding: SPACING.XS
  },
  error: {
    fontSize: FONT_SIZES.XS,
    color: COLORS.ERROR,
    marginTop: SPACING.XS
  },
  characterCount: {
    fontSize: FONT_SIZES.XS,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'right',
    marginTop: SPACING.XS
  }
});

// ============================================================================
// COMPONENTES ESPECIALIZADOS
// ============================================================================

export const SearchInput: React.FC<Omit<InputProps, 'leftIcon'>> = (props) => (
  <Input
    {...props}
    leftIcon={<Text style={{ color: COLORS.TEXT_SECONDARY }}>🔍</Text>}
    placeholder={props.placeholder || 'Buscar...'}
  />
);

export const PasswordInput: React.FC<Omit<InputProps, 'secureTextEntry'>> = (props) => {
  const [isSecure, setIsSecure] = useState(true);
  
  return (
    <Input
      {...props}
      secureTextEntry={isSecure}
      rightIcon={
        <TouchableOpacity onPress={() => setIsSecure(!isSecure)}>
          <Text style={{ color: COLORS.TEXT_SECONDARY }}>
            {isSecure ? '👁️' : '🙈'}
          </Text>
        </TouchableOpacity>
      }
    />
  );
};

export const EmailInput: React.FC<Omit<InputProps, 'keyboardType' | 'autoCapitalize'>> = (props) => (
  <Input
    {...props}
    keyboardType="email-address"
    autoCapitalize="none"
    autoCorrect={false}
  />
);

export const NumberInput: React.FC<Omit<InputProps, 'keyboardType'>> = (props) => (
  <Input
    {...props}
    keyboardType="numeric"
  />
);
