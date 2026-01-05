// ============================================================================
// COMPONENTE DE BADGE DE VERSIÓN - TIEMPOJUSTO
// ============================================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, APP_VERSION } from '../../shared/constants';

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const VersionBadge: React.FC = () => {
  const version = APP_VERSION;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>v{version}</Text>
    </View>
  );
};

// ============================================================================
// ESTILOS
// ============================================================================

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.SURFACE,
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.XS,
    borderRadius: BORDER_RADIUS.MD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    zIndex: 9999,
  },
  text: {
    fontSize: FONT_SIZES.XS,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '500',
  },
});

