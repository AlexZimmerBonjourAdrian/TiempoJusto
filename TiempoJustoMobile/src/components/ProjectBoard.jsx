import React, { useMemo, useState, useEffect } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View, Animated, Alert } from 'react-native';

export default function ProjectBoard({ projects, setProjects, tasks, setTasks, onCompleteProject, onActivity }) {
    const [newName, setNewName] = useState('');
    const [fadeAnim] = useState(new Animated.Value(0));
    const [expandedProjects, setExpandedProjects] = useState(new Set());

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, []);

    const projectIdToTaskCount = useMemo(() => {
        const counts = {};
        for (const t of tasks || []) {
            if (!t.projectId) continue;
            counts[t.projectId] = (counts[t.projectId] || 0) + 1;
        }
        return counts;
    }, [tasks]);

    const projectTasks = useMemo(() => {
        const projectTasksMap = {};
        for (const task of tasks || []) {
            if (!task.projectId) continue;
            if (!projectTasksMap[task.projectId]) {
                projectTasksMap[task.projectId] = [];
            }
            projectTasksMap[task.projectId].push(task);
        }
        return projectTasksMap;
    }, [tasks]);

    function addProject() {
        const name = newName.trim();
        if (!name) return;
        const project = { id: String(Date.now()), name };
        setProjects((prev) => [...(prev || []), project]);
        setNewName('');
        onActivity && onActivity();
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
                    onPress: () => {
                        onCompleteProject && onCompleteProject(projectId);
                        onActivity && onActivity();
                    }
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
                    onPress: () => {
                        // Eliminar el proyecto
                        setProjects((prev) => prev.filter((p) => p.id !== projectId));
                        // Eliminar todas las tareas asociadas
                        setTasks((prev) => prev.filter((t) => t.projectId !== projectId));
                        onActivity && onActivity();
                    }
                }
            ]
        );
    }

    function getPriorityColor(priority) {
        switch (priority) {
            case 'A': return '#ef4444';
            case 'B': return '#f97316';
            case 'C': return '#eab308';
            case 'D': return '#6b7280';
            default: return '#6b7280';
        }
    }

    function getPriorityLabel(priority) {
        switch (priority) {
            case 'A': return 'Crítica';
            case 'B': return 'Importante';
            case 'C': return 'Normal';
            case 'D': return 'Baja';
            default: return 'Normal';
        }
    }

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Gestión de Proyectos</Text>
                <Text style={styles.headerSubtitle}>Organiza y supervisa tus proyectos</Text>
            </View>

            <View style={styles.inputSection}>
                <TextInput
                    placeholder="Nuevo proyecto"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    value={newName}
                    onChangeText={setNewName}
                    onSubmitEditing={addProject}
                    style={styles.input}
                />
                <Pressable onPress={addProject} style={styles.addButton}>
                    <Text style={styles.addButtonText}>Añadir</Text>
                </Pressable>
            </View>

            <FlatList
                data={projects || []}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={{ paddingVertical: 8 }}
                renderItem={({ item }) => {
                    const isExpanded = expandedProjects.has(item.id);
                    const projectTasksList = projectTasks[item.id] || [];
                    const taskCount = projectIdToTaskCount[item.id] || 0;

                    return (
                        <View style={styles.projectContainer}>
                            <Animated.View style={styles.card}>
                                <Pressable 
                                    onPress={() => toggleProjectExpansion(item.id)}
                                    style={styles.cardHeader}
                                >
                                    <View style={styles.cardContent}>
                                        <Text style={styles.title}>{item.name}</Text>
                                        <Text style={styles.subtitle}>{taskCount} tareas</Text>
                                        {item.status === 'completed' && (
                                            <Text style={styles.milestone}>
                                                Hito registrado • {item.completedAt ? new Date(item.completedAt).toLocaleDateString('es-ES') : ''}
                                            </Text>
                                        )}
                                    </View>
                                    <View style={styles.expandIcon}>
                                        <Text style={[styles.expandIconText, isExpanded && styles.expandIconTextExpanded]}>
                                            ▼
                                        </Text>
                                    </View>
                                </Pressable>
                                
                                <View style={styles.cardActions}>
                                    {item.status === 'completed' ? (
                                        <View style={styles.completedBadge}>
                                            <Text style={styles.completedBadgeText}>Completado</Text>
                                        </View>
                                    ) : (
                                        <Pressable 
                                            onPress={() => confirmCompleteProject(item.id)} 
                                            style={styles.completeButton}
                                        >
                                            <Text style={styles.completeButtonText}>Completar</Text>
                                        </Pressable>
                                    )}
                                    <Pressable 
                                        onPress={() => confirmRemoveProject(item.id)} 
                                        style={styles.deleteButton}
                                    >
                                        <Text style={styles.deleteButtonText}>Eliminar</Text>
                                    </Pressable>
                                </View>
                            </Animated.View>

                            {/* Tareas del proyecto */}
                            {isExpanded && projectTasksList.length > 0 && (
                                <View style={styles.tasksContainer}>
                                    <Text style={styles.tasksHeader}>Tareas del Proyecto:</Text>
                                    {projectTasksList.map((task) => (
                                        <View key={task.id} style={styles.taskItem}>
                                            <View style={styles.taskInfo}>
                                                <Text style={[styles.taskTitle, task.done && styles.taskTitleDone]}>
                                                    {task.title}
                                                </Text>
                                                <View style={styles.taskMeta}>
                                                    <Text style={[styles.taskPriority, { color: getPriorityColor(task.priority) }]}>
                                                        {task.priority} - {getPriorityLabel(task.priority)}
                                                    </Text>
                                                    {task.done && (
                                                        <Text style={styles.taskCompleted}>Completada</Text>
                                                    )}
                                                </View>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    );
                }}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Crea tu primer proyecto para organizar mejor tus tareas.</Text>
                    </View>
                }
            />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        alignItems: 'center',
    },
    header: {
        width: '100%',
        marginBottom: 16,
        paddingBottom: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: 'white',
        marginBottom: 6,
        textAlign: 'center',
    },
    headerSubtitle: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
    },
    inputSection: { 
        flexDirection: 'row', 
        gap: 8,
        width: '100%',
        marginBottom: 16,
    },
    input: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.08)',
        color: 'white',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        fontSize: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    addButton: {
        backgroundColor: '#3b82f6',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 60,
    },
    addButtonText: { 
        color: 'white', 
        fontWeight: '700',
        fontSize: 14,
    },
    projectContainer: {
        width: '100%',
        marginBottom: 8,
    },
    card: {
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    cardContent: {
        flex: 1,
    },
    title: { 
        color: 'white', 
        fontWeight: '700',
        fontSize: 16,
        marginBottom: 2,
    },
    subtitle: { 
        color: 'rgba(255,255,255,0.6)', 
        fontSize: 12,
        fontWeight: '500',
    },
    milestone: { 
        color: '#a7f3d0', 
        fontSize: 11, 
        marginTop: 4,
        fontWeight: '500',
    },
    expandIcon: {
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    expandIconText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 10,
        fontWeight: '600',
    },
    expandIconTextExpanded: {
        transform: [{ rotate: '180deg' }],
    },
    cardActions: {
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'flex-end',
    },
    completeButton: { 
        paddingHorizontal: 12, 
        paddingVertical: 6, 
        borderRadius: 6, 
        backgroundColor: 'rgba(34,197,94,0.25)',
        borderWidth: 1,
        borderColor: 'rgba(34,197,94,0.3)',
    },
    completeButtonText: { 
        color: '#a7f3d0', 
        fontWeight: '600',
        fontSize: 12,
    },
    completedBadge: { 
        paddingHorizontal: 12, 
        paddingVertical: 6, 
        borderRadius: 6, 
        backgroundColor: 'rgba(34,197,94,0.4)',
        borderWidth: 1,
        borderColor: 'rgba(34,197,94,0.5)',
    },
    completedBadgeText: { 
        color: '#ecfdf5', 
        fontWeight: '600',
        fontSize: 12,
    },
    deleteButton: { 
        paddingHorizontal: 12, 
        paddingVertical: 6, 
        borderRadius: 6, 
        backgroundColor: 'rgba(239,68,68,0.2)',
        borderWidth: 1,
        borderColor: 'rgba(239,68,68,0.3)',
    },
    deleteButtonText: { 
        color: '#fecaca', 
        fontWeight: '600',
        fontSize: 12,
    },
    tasksContainer: {
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: 8,
        padding: 12,
        marginTop: 6,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    tasksHeader: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 8,
    },
    taskItem: {
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    taskInfo: {
        flex: 1,
    },
    taskTitle: {
        color: 'white',
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 2,
    },
    taskTitleDone: {
        textDecorationLine: 'line-through',
        color: 'rgba(255,255,255,0.6)',
    },
    taskMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    taskPriority: {
        fontSize: 10,
        fontWeight: '600',
    },
    taskCompleted: {
        fontSize: 10,
        color: '#a7f3d0',
        fontWeight: '500',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: { 
        color: 'rgba(255,255,255,0.6)', 
        textAlign: 'center',
        fontSize: 14,
        lineHeight: 20,
    },
});