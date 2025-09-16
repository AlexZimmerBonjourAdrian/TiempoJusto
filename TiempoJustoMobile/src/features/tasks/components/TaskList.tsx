// ============================================================================
// COMPONENTE DE LISTA DE TAREAS - TIEMPOJUSTO
// ============================================================================

import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Task, TaskPriority } from '../types';
import { COLORS, SPACING, FONT_SIZES, TASK_PRIORITIES } from '../../../shared/constants';

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
        { borderLeftColor: priorityConfig?.color || COLORS.PRIMARY },
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
            { backgroundColor: priorityConfig?.color || COLORS.PRIMARY }
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
    backgroundColor: COLORS.BACKGROUND,
  },
  listContainer: {
    padding: SPACING.MD,
    flexGrow: 1,
  },
  taskItem: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: 12,
    padding: SPACING.MD,
    marginBottom: SPACING.SM,
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
    marginBottom: SPACING.XS,
  },
  taskTitle: {
    fontSize: FONT_SIZES.MD,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
    marginRight: SPACING.XS,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: COLORS.TEXT_SECONDARY,
  },
  priorityBadge: {
    paddingHorizontal: SPACING.XS,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 24,
    alignItems: 'center',
  },
  priorityText: {
    color: '#ffffff',
    fontSize: FONT_SIZES.XS,
    fontWeight: 'bold',
  },
  taskDescription: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.XS,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskStatus: {
    fontSize: FONT_SIZES.XS,
    color: COLORS.TEXT_SECONDARY,
    textTransform: 'capitalize',
  },
  taskDueDate: {
    fontSize: FONT_SIZES.XS,
    color: COLORS.TEXT_SECONDARY,
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: SPACING.SM,
  },
  completeButton: {
    backgroundColor: COLORS.SUCCESS,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.XS,
  },
  completeButtonText: {
    color: '#ffffff',
    fontSize: FONT_SIZES.MD,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: COLORS.DANGER,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: FONT_SIZES.LG,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.XL * 2,
  },
  emptyStateText: {
    fontSize: FONT_SIZES.LG,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  emptyStateSubtext: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  errorState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.XL * 2,
  },
  errorText: {
    fontSize: FONT_SIZES.LG,
    fontWeight: '600',
    color: COLORS.DANGER,
    marginBottom: SPACING.XS,
  },
  errorSubtext: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.XL * 2,
  },
  loadingText: {
    fontSize: FONT_SIZES.MD,
    color: COLORS.TEXT_SECONDARY,
  },
});
