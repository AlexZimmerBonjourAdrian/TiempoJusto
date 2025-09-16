// ============================================================================
// COMPONENTE DE TABLERO DE PROYECTOS - TIEMPOJUSTO
// ============================================================================

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useProjects } from '../hooks/useProjects';
import { COLORS, SPACING, FONT_SIZES } from '../../../shared/constants';

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const ProjectBoard: React.FC = () => {
  const { projects, loading, error, statistics } = useProjects();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Proyectos</Text>
        <Text style={styles.subtitle}>
          {statistics.totalProjects} proyectos • {statistics.activeProjects} activos
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.placeholder}>
          🚧 Tablero de proyectos en desarrollo
        </Text>
        <Text style={styles.description}>
          Aquí podrás gestionar tus proyectos y ver su progreso.
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
