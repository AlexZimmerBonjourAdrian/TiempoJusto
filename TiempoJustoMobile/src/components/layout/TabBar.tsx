// ============================================================================
// COMPONENTE DE BARRA DE PESTAÑAS - TIEMPOJUSTO
// ============================================================================

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../shared/constants';

// ============================================================================
// TIPOS
// ============================================================================

type TabType = 'tasks' | 'projects' | 'pomodoro' | 'analytics';

interface TabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  style?: ViewStyle;
}

interface TabConfig {
  id: TabType;
  label: string;
  icon: string;
  legend: string;
}

// ============================================================================
// CONFIGURACIÓN DE PESTAÑAS
// ============================================================================

const tabs: TabConfig[] = [
  {
    id: 'tasks',
    label: 'Tareas',
    icon: '📋',
    legend: 'Gestiona tus tareas'
  },
  {
    id: 'projects',
    label: 'Proyectos',
    icon: '📁',
    legend: 'Organiza proyectos'
  },
  {
    id: 'pomodoro',
    label: 'Pomodoro',
    icon: '⏰',
    legend: 'Enfócate y descansa'
  },
  {
    id: 'analytics',
    label: 'Analíticas',
    icon: '📊',
    legend: 'Ve tu progreso'
  }
];

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const TabBar: React.FC<TabBarProps> = ({
  activeTab,
  onTabChange,
  style
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.tabs}>
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            tab={tab}
            isActive={activeTab === tab.id}
            onPress={() => onTabChange(tab.id)}
          />
        ))}
      </View>
    </View>
  );
};

// ============================================================================
// COMPONENTE DE BOTÓN DE PESTAÑA
// ============================================================================

interface TabButtonProps {
  tab: TabConfig;
  isActive: boolean;
  onPress: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({
  tab,
  isActive,
  onPress
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.tabButton,
        isActive && styles.tabButtonActive
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.tabIcon,
        isActive && styles.tabIconActive
      ]}>
        {tab.icon}
      </Text>
      <Text style={[
        styles.tabLabel,
        isActive && styles.tabLabelActive
      ]}>
        {tab.label}
      </Text>
    </TouchableOpacity>
  );
};

// ============================================================================
// ESTILOS
// ============================================================================

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.SURFACE,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.SM,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.XS,
    borderRadius: BORDER_RADIUS.MD,
    marginHorizontal: 2,
  },
  tabButtonActive: {
    backgroundColor: COLORS.PRIMARY,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  tabIconActive: {
    // El color se mantiene igual para los emojis
  },
  tabLabel: {
    fontSize: FONT_SIZES.XS,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
