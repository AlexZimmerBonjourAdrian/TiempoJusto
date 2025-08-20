import React, { useMemo, useState, useEffect } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View, Alert, Animated } from 'react-native';
import MotivationalNotification from './MotivationalNotification';

export default function TaskBoard({ tasks, setTasks, projects, projectIdToProject, onShowAnalytics, onShowNotification, onActivity }) {
    const [newTitle, setNewTitle] = useState('');
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [selectedPriority, setSelectedPriority] = useState('C');
    const [filterProjectId, setFilterProjectId] = useState(null);
    const [fadeAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, []);

    const filteredTasks = useMemo(() => {
        let filtered = tasks || [];
        if (filterProjectId !== null) {
            filtered = filtered.filter(task => task.projectId === filterProjectId);
        }
        return filtered;
    }, [tasks, filterProjectId]);

    const sortedTasks = useMemo(() => {
        return [...filteredTasks].sort((a, b) => {
            // Primero por completadas
            if (a.done !== b.done) return Number(a.done) - Number(b.done);
            // Luego por prioridad (A, B, C, D)
            const priorityOrder = { A: 0, B: 1, C: 2, D: 3 };
            const aPriority = priorityOrder[a.priority || 'C'];
            const bPriority = priorityOrder[b.priority || 'C'];
            return aPriority - bPriority;
        });
    }, [filteredTasks]);

    function addTask() {
        const title = newTitle.trim();
        if (!title) return;
        const task = {
            id: String(Date.now()),
            title,
            done: false,
            projectId: selectedProjectId || null,
            priority: selectedPriority,
            createdAt: new Date().toISOString(),
        };
        setTasks((prev) => [...(prev || []), task]);
        setNewTitle('');
        onActivity && onActivity();
        
        // Mostrar notificación motivacional ocasionalmente
        if (Math.random() < 0.3 && onShowNotification) {
            onShowNotification('productivity');
        }
    }

    function toggleTask(id) {
        setTasks((prev) => prev.map((t) => (t.id === id ? {...t, done: !t.done } : t)));
        onActivity && onActivity();
        
        // Mostrar notificación motivacional al completar tareas importantes
        const task = tasks.find(t => t.id === id);
        if (task && !task.done && (task.priority === 'A' || task.priority === 'B') && onShowNotification) {
            onShowNotification('motivation');
        }
    }

    function removeTask(id) {
        setTasks((prev) => prev.filter((t) => t.id !== id));
        onActivity && onActivity();
    }

    function moveToDailyBoard(id) {
        setTasks((prev) => prev.map((t) => 
            t.id === id ? {...t, projectId: null} : t
        ));
        onActivity && onActivity();
    }

    function handleCloseBoard() {
        Alert.alert(
            "Cerrar Tablero",
            "¿Estás seguro de que quieres cerrar el tablero? Se mostrarán las estadísticas del día.",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Cerrar", onPress: onShowAnalytics }
            ]
        );
    }

    function clearFilter() {
        setFilterProjectId(null);
    }

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            {/* Header compacto */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Tablero de Tareas</Text>
                <Text style={styles.headerLegend}>Organiza tareas por importancia usando el método ABCDE</Text>
            </View>

            {/* Input en la parte superior */}
            <View style={styles.inputSection}>
                <TextInput
                    placeholder="Nueva tarea"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    value={newTitle}
                    onChangeText={setNewTitle}
                    onSubmitEditing={addTask}
                    style={styles.input}
                />
                <Pressable onPress={addTask} style={styles.addButton}>
                    <Text style={styles.addButtonText}>+</Text>
                </Pressable>
            </View>

            {/* Prioridades compactas */}
            <View style={styles.prioritySection}>
                <Text style={styles.sectionLabel}>Prioridad:</Text>
                <View style={styles.priorityButtons}>
                    {['A', 'B', 'C', 'D'].map((priority) => (
                        <Pressable
                            key={priority}
                            onPress={() => setSelectedPriority(priority)}
                            style={[styles.priorityButton, selectedPriority === priority && styles.priorityButtonActive]}
                        >
                            <Text style={[styles.priorityButtonText, selectedPriority === priority && styles.priorityButtonTextActive]}>
                                {priority}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </View>

            {/* Proyectos compactos */}
            {projects?.length ? (
                <View style={styles.projectSection}>
                    <Text style={styles.sectionLabel}>Proyecto:</Text>
                    <FlatList
                        data={[{ id: null, name: 'Diario' }, ...projects]}
                        horizontal
                        keyExtractor={(item) => String(item.id)}
                        renderItem={({ item }) => (
                            <Pressable
                                onPress={() => setSelectedProjectId(item.id)}
                                style={[styles.projectChip, selectedProjectId === item.id && styles.projectChipActive]}
                            >
                                <Text style={[styles.projectChipText, selectedProjectId === item.id && styles.projectChipTextActive]}>
                                    {item.name}
                                </Text>
                            </Pressable>
                        )}
                        ItemSeparatorComponent={() => <View style={{ width: 4 }} />}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
            ) : null}

            {/* Filtro compacto */}
            {projects?.length > 0 && (
                <View style={styles.filterSection}>
                    <Text style={styles.sectionLabel}>Filtrar:</Text>
                    <View style={styles.filterContainer}>
                        <Pressable
                            onPress={clearFilter}
                            style={[styles.filterChip, filterProjectId === null && styles.filterChipActive]}
                        >
                            <Text style={[styles.filterChipText, filterProjectId === null && styles.filterChipTextActive]}>
                                Todas
                            </Text>
                        </Pressable>
                        {projects.map((project) => (
                            <Pressable
                                key={project.id}
                                onPress={() => setFilterProjectId(project.id)}
                                style={[styles.filterChip, filterProjectId === project.id && styles.filterChipActive]}
                            >
                                <Text style={[styles.filterChipText, filterProjectId === project.id && styles.filterChipTextActive]}>
                                    {project.name}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </View>
            )}

            {/* Lista de tareas en tarjetas */}
            <FlatList
                data={sortedTasks}
                keyExtractor={(item) => String(item.id)}
                style={{ width: '100%' }}
                contentContainerStyle={{ width: '100%' }}
                renderItem={({ item }) => {
                    const projectName = item.projectId ? projectIdToProject?.[item.projectId]?.name : null;
                    return (
                        <View style={styles.taskCard}>
                            <Pressable onPress={() => toggleTask(item.id)} style={styles.checkbox}>
                                <View style={[styles.checkboxInner, item.done && styles.checkboxInnerChecked]} />
                            </Pressable>
                            <Text style={[styles.taskPriority, styles[`priority${item.priority || 'C'}`]]}>
                                {item.priority || 'C'}
                            </Text>
                            <Text style={[styles.taskTitle, item.done && styles.taskTitleDone]} numberOfLines={2}>
                                {item.title}
                            </Text>
                            {projectName && (
                                <Text style={styles.taskProject}>
                                    {projectName}
                                </Text>
                            )}
                            <View style={styles.taskActions}>
                                {item.projectId && (
                                    <Pressable 
                                        onPress={() => moveToDailyBoard(item.id)} 
                                        style={styles.actionButton}
                                    >
                                        <Text style={styles.actionButtonText}>Mover</Text>
                                    </Pressable>
                                )}
                                <Pressable onPress={() => removeTask(item.id)} style={styles.deleteButton}>
                                    <Text style={styles.deleteButtonText}>×</Text>
                                </Pressable>
                            </View>
                        </View>
                    );
                }}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            {filterProjectId ? 'No hay tareas en este proyecto.' : 'No hay tareas aún.'}
                        </Text>
                    </View>
                }
            />

            {/* Botón de cerrar compacto */}
            <View style={styles.closeSection}>
                <Pressable onPress={handleCloseBoard} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Cerrar Tablero</Text>
                </Pressable>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        alignItems: 'center',
        width: '100%',
    },
    header: {
        width: '100%',
        marginBottom: 8,
        paddingBottom: 8,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: 'white',
        marginBottom: 2,
        textAlign: 'center',
    },
    headerLegend: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    inputSection: {
        flexDirection: 'row', 
        gap: 6,
        width: '100%',
        marginBottom: 8,
    },
    input: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.08)',
        color: 'white',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
        fontSize: 13,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    addButton: {
        backgroundColor: '#22c55e',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 32,
    },
    addButtonText: { 
        color: '#051b0e', 
        fontWeight: '700',
        fontSize: 16,
    },
    prioritySection: {
        width: '100%',
        marginBottom: 8,
    },
    sectionLabel: {
        color: 'rgba(255,255,255,0.8)', 
        marginBottom: 4,
        fontSize: 11,
        fontWeight: '600',
    },
    priorityButtons: {
        flexDirection: 'row', 
        gap: 4,
    },
    priorityButton: {
        flex: 1,
        paddingVertical: 4,
        paddingHorizontal: 6,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.08)',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    priorityButtonActive: { 
        backgroundColor: 'rgba(34,197,94,0.25)',
        borderColor: 'rgba(34,197,94,0.5)',
    },
    priorityButtonText: { 
        color: 'rgba(255,255,255,0.8)', 
        fontWeight: '600',
        fontSize: 12,
    },
    priorityButtonTextActive: { 
        color: '#a7f3d0', 
        fontWeight: '700' 
    },
    projectSection: {
        width: '100%',
        marginBottom: 8,
    },
    projectChip: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    projectChipActive: { 
        backgroundColor: 'rgba(34,197,94,0.25)',
        borderColor: 'rgba(34,197,94,0.5)',
    },
    projectChipText: { 
        color: 'rgba(255,255,255,0.8)',
        fontSize: 11,
        fontWeight: '500',
    },
    projectChipTextActive: { 
        color: '#a7f3d0', 
        fontWeight: '700' 
    },
    filterSection: {
        width: '100%',
        marginBottom: 8,
    },
    filterContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
    },
    filterChip: {
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    filterChipActive: {
        backgroundColor: 'rgba(59,130,246,0.3)',
        borderColor: 'rgba(59,130,246,0.5)',
    },
    filterChipText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 10,
        fontWeight: '500',
    },
    filterChipTextActive: {
        color: '#93c5fd',
        fontWeight: '700',
    },
    taskCard: {
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.08)',
        padding: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
        marginBottom: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        minHeight: 60,
    },
    checkbox: {
        width: 18,
        height: 18,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.6)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxInner: {
        width: 10,
        height: 10,
        borderRadius: 2,
    },
    checkboxInnerChecked: { 
        backgroundColor: '#22c55e' 
    },
    taskPriority: { 
        fontSize: 14, 
        fontWeight: '700',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.15)',
        minWidth: 24,
        textAlign: 'center',
    },
    priorityA: { color: '#ef4444' },
    priorityB: { color: '#f97316' },
    priorityC: { color: '#eab308' },
    priorityD: { color: '#6b7280' },
    taskTitle: { 
        color: 'white', 
        fontWeight: '500',
        fontSize: 15,
        flex: 1,
        lineHeight: 20,
    },
    taskTitleDone: { 
        textDecorationLine: 'line-through', 
        color: 'rgba(255,255,255,0.6)' 
    },
    taskProject: { 
        color: 'rgba(255,255,255,0.7)', 
        fontSize: 12,
        fontWeight: '500',
        backgroundColor: 'rgba(59,130,246,0.2)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
        marginLeft: 8,
    },
    taskActions: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
    },
    actionButton: { 
        paddingHorizontal: 10, 
        paddingVertical: 6, 
        borderRadius: 6, 
        backgroundColor: 'rgba(59,130,246,0.25)',
        borderWidth: 1,
        borderColor: 'rgba(59,130,246,0.4)',
        minWidth: 50,
        alignItems: 'center',
    },
    actionButtonText: { 
        color: '#93c5fd', 
        fontWeight: '600',
        fontSize: 11,
    },
    deleteButton: { 
        paddingHorizontal: 10, 
        paddingVertical: 6, 
        borderRadius: 6, 
        backgroundColor: 'rgba(239,68,68,0.25)',
        borderWidth: 1,
        borderColor: 'rgba(239,68,68,0.4)',
        minWidth: 40,
        alignItems: 'center',
    },
    deleteButtonText: { 
        color: '#fecaca', 
        fontWeight: '700',
        fontSize: 16,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 20,
        width: '100%',
    },
    emptyText: { 
        color: 'rgba(255,255,255,0.6)', 
        textAlign: 'center',
        fontSize: 12,
    },
    closeSection: {
        width: '100%',
        marginTop: 8,
        marginBottom: 8,
    },
    closeButton: {
        backgroundColor: '#3b82f6',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(59,130,246,0.3)',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '700',
    },
});