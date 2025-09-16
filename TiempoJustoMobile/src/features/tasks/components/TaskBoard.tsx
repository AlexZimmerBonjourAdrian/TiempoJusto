// ============================================================================
// COMPONENTE DE TABLERO DE TAREAS - TIEMPOJUSTO
// ============================================================================

import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { useTasks } from '../hooks/useTasks';
import { TaskList } from './TaskList';
import { TaskModal } from './TaskModal';
import { Button } from '../../../components/ui/Button';
import { Task } from '../types';
import { COLORS, SPACING, FONT_SIZES } from '../../../shared/constants';

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const TaskBoard: React.FC = () => {
  const { tasks, loading, error, statistics, addTask, updateTask, deleteTask } = useTasks();
  const [showCompleted, setShowCompleted] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // ============================================================================
  // FUNCIONES
  // ============================================================================

  const handleAddTask = () => {
    setEditingTask(null);
    setModalVisible(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setModalVisible(true);
  };

  const handleSaveTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, taskData);
      } else {
        await addTask(taskData);
      }
    } catch (error) {
      throw error;
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        await updateTask(taskId, {
          ...task,
          status: task.status === 'completed' ? 'pending' : 'completed'
        });
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la tarea');
    }
  };

  const handleDeleteTask = (taskId: string) => {
    Alert.alert(
      'Eliminar Tarea',
      '¿Estás seguro de que quieres eliminar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTask(taskId);
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la tarea');
            }
          }
        }
      ]
    );
  };

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
          onTaskPress={handleEditTask}
          onTaskComplete={handleCompleteTask}
          onTaskDelete={handleDeleteTask}
        />
      </View>

      {/* Botón de agregar tarea */}
      <View style={styles.addButtonContainer}>
        <Button
          title="Agregar Tarea"
          onPress={handleAddTask}
          variant="primary"
          fullWidth
        />
      </View>

      {/* Modal de tarea */}
      <TaskModal
        visible={modalVisible}
        task={editingTask}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveTask}
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
