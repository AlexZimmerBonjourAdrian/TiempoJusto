// ============================================================================
// COMPONENTE PRINCIPAL DE LA APLICACIÓN - TIEMPOJUSTO
// ============================================================================

import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Components
import { Header } from './Header';
import { TabBar } from './TabBar';
import { TaskBoard } from '../../features/tasks/components/TaskBoard';
import { ProjectBoard } from '../../features/projects/components/ProjectBoard';
import { PomodoroBoard } from '../../features/pomodoro/components/PomodoroBoard';
import { AnalyticsBoard } from '../../features/analytics/components/AnalyticsBoard';

// Types
import { COLORS, SPACING } from '../../shared/constants';

// ============================================================================
// TIPOS
// ============================================================================

type TabType = 'tasks' | 'projects' | 'pomodoro' | 'analytics';

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('tasks');
  const insets = useSafeAreaInsets();

  // ============================================================================
  // RENDERIZADO DE CONTENIDO
  // ============================================================================

  const renderContent = () => {
    switch (activeTab) {
      case 'tasks':
        return <TaskBoard />;
      case 'projects':
        return <ProjectBoard />;
      case 'pomodoro':
        return <PomodoroBoard />;
      case 'analytics':
        return <AnalyticsBoard />;
      default:
        return <TaskBoard />;
    }
  };

  // ============================================================================
  // RENDERIZADO PRINCIPAL
  // ============================================================================

  return (
    <View style={styles.container}>
      <Header />
      
      <View style={styles.content}>
        {renderContent()}
      </View>
      
      <TabBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        style={{ paddingBottom: Math.max(insets.bottom + 5, 17) }}
      />
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
  content: {
    flex: 1,
    padding: SPACING.MD,
  },
});
