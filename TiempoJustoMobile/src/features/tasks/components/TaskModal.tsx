// ============================================================================
// COMPONENTE MODAL DE TAREAS - TIEMPOJUSTO
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Task, TaskPriority } from '../types';
import { useProjects } from '../../projects/hooks/useProjects';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { COLORS, SPACING, FONT_SIZES, TASK_PRIORITIES } from '../../../shared/constants';

// ============================================================================
// TIPOS
// ============================================================================

interface TaskModalProps {
  visible: boolean;
  task?: Task | null;
  onClose: () => void;
  onSave: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const TaskModal: React.FC<TaskModalProps> = ({
  visible,
  task,
  onClose,
  onSave
}) => {
  const { getOpenProjects } = useProjects();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('A');
  const [projectId, setProjectId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // ============================================================================
  // EFECTOS
  // ============================================================================

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setProjectId(task.projectId);
    } else {
      setTitle('');
      setDescription('');
      setPriority('A');
      setProjectId('');
    }
  }, [task, visible]);

  // ============================================================================
  // FUNCIONES
  // ============================================================================

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'El título de la tarea es obligatorio');
      return;
    }

    if (!projectId) {
      Alert.alert('Error', 'Debes seleccionar un proyecto para la tarea');
      return;
    }

    setIsLoading(true);
    try {
      await onSave({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        status: task?.status || 'pending',
        projectId: projectId // Ahora es obligatorio
      });
      onClose();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la tarea');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  // ============================================================================
  // RENDERIZADO
  // ============================================================================

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} disabled={isLoading}>
            <Text style={styles.cancelButton}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>
            {task ? 'Editar Tarea' : 'Nueva Tarea'}
          </Text>
          <TouchableOpacity onPress={handleSave} disabled={isLoading}>
            <Text style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}>
              {isLoading ? 'Guardando...' : 'Guardar'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Título */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Título *</Text>
            <Input
              placeholder="Escribe el título de la tarea..."
              value={title}
              onChangeText={setTitle}
              maxLength={100}
              style={styles.input}
            />
          </View>

          {/* Proyecto */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Proyecto *</Text>
            <View style={styles.projectSelector}>
              {getOpenProjects().map((project) => (
                <TouchableOpacity
                  key={project.id}
                  style={[
                    styles.projectOption,
                    projectId === project.id && styles.projectOptionSelected
                  ]}
                  onPress={() => setProjectId(project.id)}
                >
                  <View style={[styles.projectColor, { backgroundColor: project.color }]} />
                  <Text style={[
                    styles.projectName,
                    projectId === project.id && styles.projectNameSelected
                  ]}>
                    {project.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {getOpenProjects().length === 0 && (
              <Text style={styles.noProjectsText}>
                No hay proyectos abiertos. Crea un proyecto primero.
              </Text>
            )}
          </View>

          {/* Descripción */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <Input
              placeholder="Agrega una descripción (opcional)..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              maxLength={500}
              style={[styles.input, styles.textArea]}
            />
          </View>

          {/* Prioridad */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Prioridad</Text>
            <View style={styles.priorityContainer}>
              {Object.entries(TASK_PRIORITIES).map(([key, priorityConfig]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.priorityButton,
                    priority === key && styles.priorityButtonActive
                  ]}
                  onPress={() => setPriority(key as TaskPriority)}
                >
                  <Text style={[
                    styles.priorityButtonText,
                    priority === key && styles.priorityButtonTextActive
                  ]}>
                    {key}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.priorityDescription}>
              A = Muy importante, B = Importante, C = Normal, D = Baja prioridad
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
    backgroundColor: COLORS.SURFACE,
  },
  cancelButton: {
    fontSize: FONT_SIZES.MD,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '500',
  },
  title: {
    fontSize: FONT_SIZES.LG,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  saveButton: {
    fontSize: FONT_SIZES.MD,
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
  saveButtonDisabled: {
    color: COLORS.TEXT_SECONDARY,
  },
  content: {
    flex: 1,
    padding: SPACING.MD,
  },
  section: {
    marginBottom: SPACING.LG,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.MD,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
  input: {
    backgroundColor: COLORS.SURFACE,
    borderColor: COLORS.BORDER,
  },
  projectSelector: {
    gap: SPACING.SM,
  },
  projectOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.MD,
    backgroundColor: COLORS.SURFACE,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  projectOptionSelected: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: COLORS.PRIMARY + '10',
  },
  projectColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.SM,
  },
  projectName: {
    fontSize: FONT_SIZES.MD,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '500',
  },
  projectNameSelected: {
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
  noProjectsText: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT_SECONDARY,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: SPACING.MD,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.SM,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: SPACING.MD,
    marginHorizontal: 2,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.BORDER,
    backgroundColor: COLORS.SURFACE,
    alignItems: 'center',
  },
  priorityButtonActive: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: COLORS.PRIMARY,
  },
  priorityButtonText: {
    fontSize: FONT_SIZES.LG,
    fontWeight: '700',
    color: COLORS.TEXT_SECONDARY,
  },
  priorityButtonTextActive: {
    color: '#ffffff',
  },
  priorityDescription: {
    fontSize: FONT_SIZES.XS,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
