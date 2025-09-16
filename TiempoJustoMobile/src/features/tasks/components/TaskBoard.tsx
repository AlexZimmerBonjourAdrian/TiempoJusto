// ============================================================================
// COMPONENTE DE TABLERO DE TAREAS - TIEMPOJUSTO
// ============================================================================

import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTasks } from '../hooks/useTasks';
import { TaskList } from './TaskList';
import { Button } from '../../../components/ui/Button';
import { COLORS, SPACING, FONT_SIZES } from '../../../shared/constants';

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const TaskBoard: React.FC = () => {
  const { tasks, loading, error, statistics } = useTasks();
  const [showCompleted, setShowCompleted] = useState(false);

  // Filtrar tareas según el estado
  const filteredTasks = tasks.filter(task => {
    if (showCompleted) {
      return task.status === 'completed';
    }
    return task.status !== 'completed';
  });

  return (
    <View style={styles.container}>
      {/* Header con estadísticas */}
      <View style={styles.header}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{statistics.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{statistics.completed}</Text>
            <Text style={styles.statLabel}>Completadas</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{statistics.pending}</Text>
            <Text style={styles.statLabel}>Pendientes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: COLORS.SUCCESS }]}>
              {statistics.completionRate}%
            </Text>
            <Text style={styles.statLabel}>Éxito</Text>
          </View>
        </View>
      </View>

      {/* Filtros */}
      <View style={styles.filters}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            !showCompleted && styles.filterButtonActive
          ]}
          onPress={() => setShowCompleted(false)}
        >
          <Text style={[
            styles.filterButtonText,
            !showCompleted && styles.filterButtonTextActive
          ]}>
            Pendientes
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            showCompleted && styles.filterButtonActive
          ]}
          onPress={() => setShowCompleted(true)}
        >
          <Text style={[
            styles.filterButtonText,
            showCompleted && styles.filterButtonTextActive
          ]}>
            Completadas
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista de tareas */}
      <View style={styles.listContainer}>
        <TaskList
          tasks={filteredTasks}
          loading={loading}
          error={error}
          onTaskPress={(task) => {
            // TODO: Implementar navegación a detalles de tarea
            console.log('Task pressed:', task.id);
          }}
          onTaskComplete={(taskId) => {
            // TODO: Implementar completar tarea
            console.log('Complete task:', taskId);
          }}
          onTaskDelete={(taskId) => {
            // TODO: Implementar eliminar tarea
            console.log('Delete task:', taskId);
          }}
        />
      </View>

      {/* Botón de agregar tarea */}
      <View style={styles.addButtonContainer}>
        <Button
          title="Agregar Tarea"
          onPress={() => {
            // TODO: Implementar modal de agregar tarea
            console.log('Add task');
          }}
          variant="primary"
          fullWidth
        />
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
    backgroundColor: COLORS.SURFACE,
    borderRadius: 12,
    padding: SPACING.MD,
    marginBottom: SPACING.MD,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FONT_SIZES.XL,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  statLabel: {
    fontSize: FONT_SIZES.XS,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
  },
  filters: {
    flexDirection: 'row',
    backgroundColor: COLORS.SURFACE,
    borderRadius: 12,
    padding: 4,
    marginBottom: SPACING.MD,
  },
  filterButton: {
    flex: 1,
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.MD,
    borderRadius: 8,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: COLORS.PRIMARY,
  },
  filterButtonText: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  listContainer: {
    flex: 1,
  },
  addButtonContainer: {
    marginTop: SPACING.MD,
  },
});
