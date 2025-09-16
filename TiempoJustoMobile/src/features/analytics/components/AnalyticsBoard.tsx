// ============================================================================
// COMPONENTE DE TABLERO DE ANALÍTICAS - TIEMPOJUSTO
// ============================================================================

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../../../shared/constants';

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const AnalyticsBoard: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analíticas</Text>
        <Text style={styles.subtitle}>
          Ve tu progreso y mejora tu productividad
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.placeholder}>
          📊 Panel de analíticas en desarrollo
        </Text>
        <Text style={styles.description}>
          Aquí podrás ver estadísticas detalladas de tu productividad y progreso.
        </Text>
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
  },
  header: {
    marginBottom: SPACING.LG,
  },
  title: {
    fontSize: FONT_SIZES.XXL,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  subtitle: {
    fontSize: FONT_SIZES.MD,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 4,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.LG,
  },
  placeholder: {
    fontSize: FONT_SIZES.LG,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: SPACING.MD,
  },
  description: {
    fontSize: FONT_SIZES.MD,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 24,
  },
});
