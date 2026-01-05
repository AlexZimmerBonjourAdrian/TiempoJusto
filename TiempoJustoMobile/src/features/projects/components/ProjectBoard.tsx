// ============================================================================
// COMPONENTE DE TABLERO DE PROYECTOS - TIEMPOJUSTO
// ============================================================================

import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useProjectUI } from '../hooks/useProjectUI';
import { AddProjectModal } from './AddProjectModal';
import { COLORS, SPACING, FONT_SIZES, PROJECT_STATUS } from '../../../shared/constants';
import { Project, ProjectStatus } from '../../../shared/types';

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const ProjectBoard: React.FC = () => {
  const {
    // Estado de UI
    isModalVisible,
    selectedProject,
    activeTab,
    filteredProjects,
    tabStats,

    // Estado de negocio
    loading,
    error,
    statistics,

    // Acciones de UI
    openCreateModal,
    closeModal,
    handleProjectSubmit,
    handleStatusChange,
    handleProjectDelete,
    changeTab
  } = useProjectUI();

  // ============================================================================
  // MANEJADORES DE UI
  // ============================================================================

  const handleDeleteWithConfirmation = (projectId: string, projectName: string) => {
    Alert.alert(
      'Eliminar Proyecto',
      `¿Estás seguro de que quieres eliminar el proyecto "${projectName}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => handleProjectDelete(projectId)
        }
      ]
    );
  };

  const getStatusColor = (status: ProjectStatus): string => {
    switch (status) {
      case 'open': return '#10b981'; // green
      case 'suspended': return '#f59e0b'; // amber
      case 'cancelled': return '#ef4444'; // red
      case 'completed': return '#3b82f6'; // blue
      default: return COLORS.TEXT_SECONDARY;
    }
  };

  const getStatusLabel = (status: ProjectStatus): string => {
    switch (status) {
      case 'open': return 'Abierto';
      case 'suspended': return 'Suspendido';
      case 'cancelled': return 'Cancelado';
      case 'completed': return 'Completado';
      default: return status;
    }
  };

  const renderProjectCard = (project: Project) => (
    <View key={project.id} style={styles.projectCard}>
      <View style={styles.projectHeader}>
        <View style={styles.projectInfo}>
          <View style={[styles.colorIndicator, { backgroundColor: project.color }]} />
          <View style={styles.projectDetails}>
            <Text style={styles.projectName}>{project.name}</Text>
            <Text style={styles.projectStatus} style={{ color: getStatusColor(project.status) }}>
              {getStatusLabel(project.status)}
            </Text>
          </View>
        </View>
        <View style={styles.projectActions}>
          {project.status === 'open' && (
            <>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#f59e0b' }]}
                onPress={() => handleStatusChange(project.id, 'suspended')}
              >
                <Text style={styles.actionButtonText}>Suspender</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#3b82f6' }]}
                onPress={() => handleStatusChange(project.id, 'completed')}
              >
                <Text style={styles.actionButtonText}>Completar</Text>
              </TouchableOpacity>
            </>
          )}
          {project.status === 'suspended' && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#10b981' }]}
              onPress={() => handleStatusChange(project.id, 'open')}
            >
              <Text style={styles.actionButtonText}>Reabrir</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#ef4444' }]}
            onPress={() => handleDeleteWithConfirmation(project.id, project.name)}
          >
            <Text style={styles.actionButtonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {project.description && (
        <Text style={styles.projectDescription}>{project.description}</Text>
      )}
      
      <View style={styles.projectFooter}>
        <Text style={styles.projectStats}>
          {project.taskIds.length} tareas • {project.progress}% completado
        </Text>
        {project.estimatedHours && (
          <Text style={styles.projectStats}>
            {project.estimatedHours}h estimadas
          </Text>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Cargando proyectos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Proyectos</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={openCreateModal}
          >
            <Text style={styles.addButtonText}>+ Nuevo</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>
          {statistics.totalProjects} proyectos • {statistics.openProjects} abiertos • {statistics.completedProjects} completados
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'open' && styles.activeTab]}
          onPress={() => changeTab('open')}
        >
          <Text style={[styles.tabText, activeTab === 'open' && styles.activeTabText]}>
            Abiertos ({tabStats.open})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'closed' && styles.activeTab]}
          onPress={() => changeTab('closed')}
        >
          <Text style={[styles.tabText, activeTab === 'closed' && styles.activeTabText]}>
            Cerrados ({tabStats.closed})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredProjects.length > 0 ? (
          filteredProjects.map(renderProjectCard)
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {activeTab === 'open' ? 'No hay proyectos abiertos' : 'No hay proyectos cerrados'}
            </Text>
            <Text style={styles.emptyStateSubtext}>
              {activeTab === 'open' ? 'Crea tu primer proyecto para comenzar' : 'Los proyectos cerrados aparecerán aquí'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Add Project Modal */}
      <AddProjectModal
        visible={isModalVisible}
        onClose={closeModal}
        onSave={handleProjectSubmit}
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
    padding: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },
  title: {
    fontSize: FONT_SIZES.XXL,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  addButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: FONT_SIZES.MD,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT_SECONDARY,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.SURFACE,
    marginHorizontal: SPACING.MD,
    marginTop: SPACING.MD,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.SM,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: COLORS.BACKGROUND,
  },
  tabText: {
    fontSize: FONT_SIZES.MD,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '500',
  },
  activeTabText: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: SPACING.MD,
  },
  projectCard: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: 12,
    padding: SPACING.MD,
    marginBottom: SPACING.MD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.SM,
  },
  projectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.SM,
  },
  projectDetails: {
    flex: 1,
  },
  projectName: {
    fontSize: FONT_SIZES.LG,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 2,
  },
  projectStatus: {
    fontSize: FONT_SIZES.SM,
    fontWeight: '500',
  },
  projectActions: {
    flexDirection: 'row',
    gap: SPACING.XS,
  },
  actionButton: {
    paddingHorizontal: SPACING.SM,
    paddingVertical: 4,
    borderRadius: 6,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: FONT_SIZES.XS,
    fontWeight: '600',
  },
  projectDescription: {
    fontSize: FONT_SIZES.MD,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.SM,
    lineHeight: 20,
  },
  projectFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectStats: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT_SECONDARY,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.XXL,
  },
  emptyStateText: {
    fontSize: FONT_SIZES.LG,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '600',
    marginBottom: SPACING.SM,
  },
  emptyStateSubtext: {
    fontSize: FONT_SIZES.MD,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingText: {
    fontSize: FONT_SIZES.LG,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginTop: SPACING.XXL,
  },
  errorText: {
    fontSize: FONT_SIZES.LG,
    color: COLORS.ERROR,
    textAlign: 'center',
    marginTop: SPACING.XXL,
  },
});
