// ============================================================================
// COMPONENTE MODAL PARA AGREGAR PROYECTOS - TIEMPOJUSTO
// ============================================================================

import React, { useState, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Modal, 
  Alert,
  ScrollView 
} from 'react-native';
import { useProjects } from '../hooks/useProjects';
import { COLORS, SPACING, FONT_SIZES, PROJECT_STATUS } from '../../../shared/constants';

// ============================================================================
// TIPOS
// ============================================================================

interface AddProjectModalProps {
  visible: boolean;
  onClose: () => void;
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const AddProjectModal: React.FC<AddProjectModalProps> = ({ visible, onClose }) => {
  const { addProject } = useProjects();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3b82f6', // Color por defecto
    estimatedHours: '',
    tags: ''
  });

  // ============================================================================
  // FUNCIONES
  // ============================================================================

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      if (!formData.name.trim()) {
        Alert.alert('Error', 'El nombre del proyecto es requerido');
        return;
      }

      const projectData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        color: formData.color,
        estimatedHours: formData.estimatedHours ? parseInt(formData.estimatedHours) : undefined,
        tags: formData.tags.trim() ? formData.tags.split(',').map(tag => tag.trim()) : []
      };

      await addProject(projectData);
      
      // Limpiar formulario
      setFormData({
        name: '',
        description: '',
        color: '#3b82f6',
        estimatedHours: '',
        tags: ''
      });
      
      onClose();
      Alert.alert('Éxito', 'Proyecto creado correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear el proyecto');
    }
  }, [formData, addProject, onClose]);

  const handleCancel = useCallback(() => {
    setFormData({
      name: '',
      description: '',
      color: '#3b82f6',
      estimatedHours: '',
      tags: ''
    });
    onClose();
  }, [onClose]);

  // ============================================================================
  // RENDERIZADO
  // ============================================================================

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleCancel}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Nuevo Proyecto</Text>
          <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Nombre del Proyecto */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre del Proyecto *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholder="Ingresa el nombre del proyecto"
              placeholderTextColor={COLORS.TEXT_SECONDARY}
              maxLength={50}
            />
          </View>

          {/* Descripción */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              placeholder="Describe brevemente el proyecto"
              placeholderTextColor={COLORS.TEXT_SECONDARY}
              multiline
              numberOfLines={3}
              maxLength={200}
            />
          </View>

          {/* Color */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Color</Text>
            <View style={styles.colorContainer}>
              {[
                '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
                '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
              ].map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    formData.color === color && styles.selectedColor
                  ]}
                  onPress={() => handleInputChange('color', color)}
                />
              ))}
            </View>
          </View>

          {/* Horas Estimadas */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Horas Estimadas</Text>
            <TextInput
              style={styles.input}
              value={formData.estimatedHours}
              onChangeText={(value) => handleInputChange('estimatedHours', value)}
              placeholder="Ej: 40"
              placeholderTextColor={COLORS.TEXT_SECONDARY}
              keyboardType="numeric"
            />
          </View>

          {/* Tags */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tags</Text>
            <TextInput
              style={styles.input}
              value={formData.tags}
              onChangeText={(value) => handleInputChange('tags', value)}
              placeholder="tag1, tag2, tag3"
              placeholderTextColor={COLORS.TEXT_SECONDARY}
            />
            <Text style={styles.helpText}>
              Separa los tags con comas
            </Text>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={handleCancel}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Crear Proyecto</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    padding: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  title: {
    fontSize: FONT_SIZES.XL,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  closeButton: {
    padding: SPACING.SM,
  },
  closeButtonText: {
    fontSize: FONT_SIZES.MD,
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: SPACING.MD,
  },
  inputGroup: {
    marginBottom: SPACING.LG,
  },
  label: {
    fontSize: FONT_SIZES.MD,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
  input: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: 8,
    padding: SPACING.MD,
    fontSize: FONT_SIZES.MD,
    color: COLORS.TEXT_PRIMARY,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.SM,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: COLORS.TEXT_PRIMARY,
  },
  helpText: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT_SECONDARY,
    marginTop: SPACING.XS,
  },
  footer: {
    flexDirection: 'row',
    padding: SPACING.MD,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
    gap: SPACING.MD,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.SURFACE,
    borderRadius: 8,
    padding: SPACING.MD,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  cancelButtonText: {
    fontSize: FONT_SIZES.MD,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  submitButton: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 8,
    padding: SPACING.MD,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: FONT_SIZES.MD,
    fontWeight: '600',
    color: '#ffffff',
  },
});
