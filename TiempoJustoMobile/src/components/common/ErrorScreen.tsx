// ============================================================================
// COMPONENTE DE PANTALLA DE ERROR - TIEMPOJUSTO
// ============================================================================

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../shared/constants';
import { Button } from '../ui/Button';

// ============================================================================
// TIPOS DE PROPS
// ============================================================================

interface ErrorScreenProps {
  error: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const ErrorScreen: React.FC<ErrorScreenProps> = ({
  error,
  onRetry,
  onDismiss
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>⚠️</Text>
        </View>
        
        <Text style={styles.title}>Algo salió mal</Text>
        <Text style={styles.message}>{error}</Text>
        
        <View style={styles.actions}>
          {onRetry && (
            <Button
              title="Reintentar"
              onPress={onRetry}
              variant="primary"
              style={styles.button}
            />
          )}
          
          {onDismiss && (
            <Button
              title="Cerrar"
              onPress={onDismiss}
              variant="outline"
              style={styles.button}
            />
          )}
        </View>
      </View>
    </View>
  );
};

// ============================================================================
// ESTILOS
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.LG,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 300,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.SURFACE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.LG,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: FONT_SIZES.XL,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.MD,
    textAlign: 'center',
  },
  message: {
    fontSize: FONT_SIZES.MD,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.XL,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.MD,
  },
  button: {
    minWidth: 120,
  },
});
