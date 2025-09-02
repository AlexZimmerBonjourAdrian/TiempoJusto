import React, { useState, useEffect } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View, Animated, Alert } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { useProjectActions } from '../hooks/useOptimizedComponents';
import ProjectItem from './optimized/ProjectItem';

export default function ProjectBoard() {
    const [newName, setNewName] = useState('');
    const [fadeAnim] = useState(new Animated.Value(0));
    const [expandedProjects, setExpandedProjects] = useState(new Set());
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { projects, projectIdToTaskCount, projectTasks } = useAppContext();
    const { handleAddProject, handleCompleteProject, handleRemoveProject } = useProjectActions();

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, []);

    async function addProject() {
        const name = newName.trim();
        if (!name || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const project = { name };
            const res = await handleAddProject(project);
            if (res?.ok) {
                setNewName('');
            }
        } catch (error) {
            console.error('Error al crear proyecto:', error);
            Alert.alert('Error', 'No se pudo crear el proyecto. Inténtalo nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    }

    function toggleProjectExpansion(projectId) {
        setExpandedProjects(prev => {
            const newSet = new Set(prev);
            if (newSet.has(projectId)) {
                newSet.delete(projectId);
            } else {
                newSet.add(projectId);
            }
            return newSet;
        });
    }

    function confirmCompleteProject(projectId) {
        const project = projects.find(p => p.id === projectId);
        if (!project) return;

        Alert.alert(
            "Completar Proyecto",
            `¿Estás seguro de que quieres marcar "${project.name}" como completado?`,
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Completar", 
                    onPress: () => handleCompleteProject(projectId)
                }
            ]
        );
    }

    function confirmRemoveProject(projectId) {
        const project = projects.find(p => p.id === projectId);
        if (!project) return;

        const taskCount = projectIdToTaskCount[projectId] || 0;

        Alert.alert(
            "Eliminar Proyecto",
            `¿Estás seguro de que quieres eliminar "${project.name}"?${taskCount > 0 ? `\n\nSe eliminarán también ${taskCount} tareas asociadas.` : ''}`,
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Eliminar", 
                    style: "destructive",
                    onPress: () => handleRemoveProject(projectId)
                }
            ]
        );
    }

    const renderProject = ({ item }) => (
        <ProjectItem
            project={item}
            taskCount={projectIdToTaskCount[item.id] || 0}
            isExpanded={expandedProjects.has(item.id)}
            onToggleExpansion={toggleProjectExpansion}
            onComplete={confirmCompleteProject}
            onRemove={confirmRemoveProject}
        />
    );

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <View style={styles.header} />

            <View style={styles.inputSection}>
                <View style={styles.inputRow}>
                    <TextInput
                        style={[styles.nameInput, isSubmitting && styles.nameInputDisabled]}
                        placeholder="Nuevo proyecto..."
                        placeholderTextColor="rgba(255,255,255,0.5)"
                        value={newName}
                        onChangeText={setNewName}
                        onSubmitEditing={addProject}
                        editable={!isSubmitting}
                    />
                    <Pressable style={[styles.addButton, isSubmitting && styles.addButtonDisabled]} onPress={addProject} disabled={isSubmitting}>
                        <Text style={styles.addButtonText}>{isSubmitting ? '...' : '+'}</Text>
                    </Pressable>
                </View>
            </View>

            <FlatList
                data={projects}
                renderItem={renderProject}
                keyExtractor={(item) => item.id}
                style={styles.projectList}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            No hay proyectos aún. Crea tu primer proyecto para organizar mejor tus tareas.
                        </Text>
                    </View>
                }
            />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        marginBottom: 16,
    },
    title: {
        color: 'white',
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 4,
    },
    subtitle: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
    },
    inputSection: {
        marginBottom: 16,
    },
    inputRow: {
        flexDirection: 'row',
    },
    nameInput: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        color: 'white',
        fontSize: 16,
        marginRight: 8,
    },
    nameInputDisabled: {
        opacity: 0.6,
    },
    addButton: {
        backgroundColor: '#10b981',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonDisabled: {
        backgroundColor: '#6b7280',
    },
    addButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    projectList: {
        flex: 1,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    emptyText: {
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        fontSize: 14,
        lineHeight: 20,
    },
});