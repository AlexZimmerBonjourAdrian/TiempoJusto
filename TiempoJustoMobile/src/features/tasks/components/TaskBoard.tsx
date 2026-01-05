// ============================================================================
// COMPONENTE DE TABLERO DE TAREAS - TIEMPOJUSTO
// ============================================================================

import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { useTaskUI } from '../hooks/useTaskUI';
import { TaskList } from './TaskList';
import { TaskModal } from './TaskModal';
import { Button } from '../../../components/ui/Button';
import { COLORS, SPACING, FONT_SIZES } from '../../../shared/constants';

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const TaskBoard: React.FC = () => {
  const {
    // Estado de UI
    isModalVisible,
    selectedTask,
    filter,
    filteredTasks,
    filteredStats,

    // Estado de negocio
    loading,
    error,
    statistics,

    // Acciones de UI
    openCreateModal,
    openEditModal,
    closeModal,
    handleTaskSubmit,
    handleTaskDelete,
    handleTaskComplete,
    changeFilter
  } = useTaskUI();

  // ============================================================================
  // MANEJADORES DE UI
  // ============================================================================

  const handleDeleteWithConfirmation = (taskId: string) => {
    Alert.alert(
      'Eliminar Tarea',
      '¿Estás seguro de que quieres eliminar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => handleTaskDelete(taskId)
        }
      ]
    );
  };

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
            filter === 'pending' && styles.filterButtonActive
          ]}
          onPress={() => changeFilter('pending')}
        >
          <Text style={[
            styles.filterButtonText,
            filter === 'pending' && styles.filterButtonTextActive
          ]}>
            Pendientes ({filteredStats.pending})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'all' && styles.filterButtonActive
          ]}
          onPress={() => changeFilter('all')}
        >
          <Text style={[
            styles.filterButtonText,
            filter === 'all' && styles.filterButtonTextActive
          ]}>
            Todas ({filteredStats.total})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'completed' && styles.filterButtonActive
          ]}
          onPress={() => changeFilter('completed')}
        >
          <Text style={[
            styles.filterButtonText,
            filter === 'completed' && styles.filterButtonTextActive
          ]}>
            Completadas ({filteredStats.completed})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista de tareas */}
      <View style={styles.listContainer}>
        <TaskList
          tasks={filteredTasks}
          loading={loading}
          error={error}
          onTaskPress={openEditModal}
          onTaskComplete={handleTaskComplete}
          onTaskDelete={handleDeleteWithConfirmation}
        />
      </View>

      {/* Botón de agregar tarea */}
      <View style={styles.addButtonContainer}>
        <Button
          title="Agregar Tarea"
          onPress={openCreateModal}
          variant="primary"
          fullWidth
        />
      </View>

      {/* Modal de tarea */}
      <TaskModal
        visible={isModalVisible}
        task={selectedTask}
        onClose={closeModal}
        onSave={handleTaskSubmit}
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
