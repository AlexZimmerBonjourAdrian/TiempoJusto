// ============================================================================
// COMPONENTE DE HEADER - TIEMPOJUSTO
// ============================================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../../shared/constants';
import { dateUtils } from '../../shared/utils';

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const Header: React.FC = () => {
  const [currentTime, setCurrentTime] = React.useState(new Date());

  // Actualizar tiempo cada segundo
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>TiempoJusto</Text>
          <Text style={styles.subtitle}>Gestiona tu tiempo eficientemente</Text>
        </View>
        
        <View style={styles.timeContainer}>
          <Text style={styles.time}>
            {dateUtils.formatDate(currentTime, 'time')}
          </Text>
          <Text style={styles.date}>
            {dateUtils.formatDate(currentTime, 'short')}
          </Text>
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
    backgroundColor: COLORS.BACKGROUND,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZES.XL,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  subtitle: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
  },
  timeContainer: {
    alignItems: 'flex-end',
  },
  time: {
    fontSize: FONT_SIZES.LG,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  date: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
  },
});
