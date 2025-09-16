// ============================================================================
// COMPONENTE DE LISTA DE TAREAS - TIEMPOJUSTO
// ============================================================================

import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Task, TaskPriority } from '../../../shared/types';
import { TASK_PRIORITIES } from '../../../shared/constants';

// ============================================================================
// TIPOS DE PROPS
// ============================================================================

interface TaskListProps {
  tasks: Task[];
  onTaskPress?: (task: Task) => void;
  onTaskComplete?: (taskId: string) => void;
  onTaskDelete?: (taskId: string) => void;
  loading?: boolean;
  error?: string | null;
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onTaskPress,
  onTaskComplete,
  onTaskDelete,
  loading = false,
  error = null
}) => {
  // ============================================================================
  // RENDERIZADO DE ITEM
  // ============================================================================

  const renderTaskItem = ({ item: task }: { item: Task }) => (
    <TaskItem
      task={task}
      onPress={() => onTaskPress?.(task)}
      onComplete={() => onTaskComplete?.(task.id)}
      onDelete={() => onTaskDelete?.(task.id)}
    />
  );

  // ============================================================================
  // RENDERIZADO DE ESTADO VACÍO
  // ============================================================================

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>No hay tareas disponibles</Text>
      <Text style={styles.emptyStateSubtext}>
        Crea tu primera tarea para comenzar
      </Text>
    </View>
  );

  // ============================================================================
  // RENDERIZADO DE ERROR
  // ============================================================================

  const renderError = () => (
    <View style={styles.errorState}>
      <Text style={styles.errorText}>Error al cargar tareas</Text>
      <Text style={styles.errorSubtext}>{error}</Text>
    </View>
  );

  // ============================================================================
  // RENDERIZADO DE CARGA
  // ============================================================================

  const renderLoading = () => (
    <View style={styles.loadingState}>
      <Text style={styles.loadingText}>Cargando tareas...</Text>
    </View>
  );

  // ============================================================================
  // RENDERIZADO PRINCIPAL
  // ============================================================================

  if (loading) {
    return renderLoading();
  }

  if (error) {
    return renderError();
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

// ============================================================================
// COMPONENTE DE ITEM DE TAREA
// ============================================================================

interface TaskItemProps {
  task: Task;
  onPress?: () => void;
  onComplete?: () => void;
  onDelete?: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onPress,
  onComplete,
  onDelete
}) => {
  const priorityConfig = TASK_PRIORITIES[task.priority];
  const isCompleted = task.status === 'completed';

  return (
    <TouchableOpacity
      style={[
        styles.taskItem,
        { borderLeftColor: priorityConfig.color },
        isCompleted && styles.completedTask
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.taskContent}>
        <View style={styles.taskHeader}>
          <Text style={[
            styles.taskTitle,
            isCompleted && styles.completedText
          ]}>
            {task.title}
          </Text>
          <View style={[
            styles.priorityBadge,
            { backgroundColor: priorityConfig.color }
          ]}>
            <Text style={styles.priorityText}>{task.priority}</Text>
          </View>
        </View>
        
        {task.description && (
          <Text style={[
            styles.taskDescription,
            isCompleted && styles.completedText
          ]}>
            {task.description}
          </Text>
        )}
        
        <View style={styles.taskFooter}>
          <Text style={styles.taskStatus}>
            {getStatusText(task.status)}
          </Text>
          
          {task.dueDate && (
            <Text style={styles.taskDueDate}>
              {formatDueDate(task.dueDate)}
            </Text>
          )}
        </View>
      </View>
      
      <View style={styles.taskActions}>
        {!isCompleted && (
          <TouchableOpacity
            style={styles.completeButton}
            onPress={onComplete}
          >
            <Text style={styles.completeButtonText}>✓</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={onDelete}
        >
          <Text style={styles.deleteButtonText}>×</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

const getStatusText = (status: string): string => {
  const statusMap = {
    pending: 'Pendiente',
    in_progress: 'En progreso',
    completed: 'Completada',
    cancelled: 'Cancelada'
  };
  return statusMap[status as keyof typeof statusMap] || status;
};

const formatDueDate = (date: Date): string => {
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Mañana';
  if (diffDays === -1) return 'Ayer';
  if (diffDays > 0) return `En ${diffDays} días`;
  return `Hace ${Math.abs(diffDays)} días`;
};

// ============================================================================
// ESTILOS
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  taskItem: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedTask: {
    opacity: 0.6,
  },
  taskContent: {
    flex: 1,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
    flex: 1,
    marginRight: 8,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#94a3b8',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 24,
    alignItems: 'center',
  },
  priorityText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  taskDescription: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 8,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskStatus: {
    fontSize: 12,
    color: '#64748b',
    textTransform: 'capitalize',
  },
  taskDueDate: {
    fontSize: 12,
    color: '#64748b',
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  completeButton: {
    backgroundColor: '#10b981',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  completeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
  errorState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ef4444',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  loadingText: {
    fontSize: 16,
    color: '#94a3b8',
  },
});
