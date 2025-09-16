// ============================================================================
// COMPONENTE DE PANTALLA DE CARGA - TIEMPOJUSTO
// ============================================================================

import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../../shared/constants';

// ============================================================================
// TIPOS DE PROPS
// ============================================================================

interface LoadingScreenProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Cargando...',
  size = 'large',
  color = COLORS.PRIMARY
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ActivityIndicator size={size} color={color} />
        <Text style={styles.message}>{message}</Text>
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
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    fontSize: FONT_SIZES.MD,
    color: COLORS.TEXT_SECONDARY,
    marginTop: SPACING.MD,
    textAlign: 'center',
  },
});
