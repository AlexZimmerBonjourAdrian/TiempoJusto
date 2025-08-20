import React, { useMemo, useState, useEffect } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import MotivationalNotification from './MotivationalNotification';

export default function TaskBoard({ tasks, setTasks, projects, projectIdToProject, onShowAnalytics, onShowNotification, onActivity }) {
    const [newTitle, setNewTitle] = useState('');
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [selectedPriority, setSelectedPriority] = useState('C');

    const sortedTasks = useMemo(() => {
        return [...(tasks || [])].sort((a, b) => {
            // Primero por completadas
            if (a.done !== b.done) return Number(a.done) - Number(b.done);
            // Luego por prioridad (A, B, C, D)
            const priorityOrder = { A: 0, B: 1, C: 2, D: 3 };
            const aPriority = priorityOrder[a.priority || 'C'];
            const bPriority = priorityOrder[b.priority || 'C'];
            return aPriority - bPriority;
        });
    }, [tasks]);

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

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>📋 Tablero de Tareas</Text>
                <Text style={styles.headerDateTime}>
                    {new Date().toLocaleDateString('es-ES', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}
                </Text>
                <Text style={styles.headerDateTime}>
                    {new Date().toLocaleTimeString('es-ES', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    })}
                </Text>
            </View>

            <View style={styles.row}>
                <TextInput
                    placeholder="Nueva tarea"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    value={newTitle}
                    onChangeText={setNewTitle}
                    onSubmitEditing={addTask}
                    style={styles.input}
                />
                <Pressable onPress={addTask} style={styles.addButton}>
                    <Text style={styles.addButtonText}>Añadir</Text>
                </Pressable>
            </View>

            <View style={styles.priorityPicker}>
                <Text style={styles.priorityPickerLabel}>Prioridad (Método Traicy):</Text>
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

            {projects?.length ? (
                <View style={styles.projectPicker}>
                    <Text style={styles.projectPickerLabel}>Proyecto:</Text>
                    <FlatList
                        data={[{ id: null, name: 'Ninguno' }, ...projects]}
                        horizontal
                        keyExtractor={(item) => String(item.id)}
                        renderItem={({ item }) => (
                            <Pressable
                                onPress={() => setSelectedProjectId(item.id)}
                                style={[styles.chip, selectedProjectId === item.id && styles.chipActive]}
                            >
                                <Text style={[styles.chipText, selectedProjectId === item.id && styles.chipTextActive]}>
                                    {item.name}
                                </Text>
                            </Pressable>
                        )}
                        ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
            ) : null}

            <FlatList
                data={sortedTasks}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={{ paddingVertical: 8 }}
                renderItem={({ item }) => {
                    const projectName = item.projectId ? projectIdToProject?.[item.projectId]?.name : null;
                    return (
                        <View style={styles.taskCard}>
                            <Pressable onPress={() => toggleTask(item.id)} style={styles.checkbox}>
                                <View style={[styles.checkboxInner, item.done && styles.checkboxInnerChecked]} />
                            </Pressable>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.taskTitle, item.done && styles.taskTitleDone]}>{item.title}</Text>
                                <View style={styles.taskMeta}>
                                    {projectName ? <Text style={styles.taskProject}>{projectName}</Text> : null}
                                    <Text style={[styles.taskPriority, styles[`priority${item.priority || 'C'}`]]}>
                                        {item.priority || 'C'}
                                    </Text>
                                </View>
                            </View>
                            <Pressable onPress={() => removeTask(item.id)} style={styles.deleteButton}>
                                <Text style={styles.deleteButtonText}>Eliminar</Text>
                            </Pressable>
                        </View>
                    );
                }}
                ListEmptyComponent={<Text style={styles.emptyText}>No hay tareas aún.</Text>}
            />

            <View style={styles.actionButtons}>
                <Pressable onPress={handleCloseBoard} style={styles.closeBoardButton}>
                    <Text style={styles.closeBoardButtonText}>📊 Cerrar Tablero</Text>
                </Pressable>
                
                <Pressable 
                    onPress={() => onShowNotification && onShowNotification('general')} 
                    style={styles.motivationButton}
                >
                    <Text style={styles.motivationButtonText}>💡 Motivación</Text>
                </Pressable>
            </View>
        </View>
    );

}

                const styles = StyleSheet.create({
                    container: { flex: 1 },
                    header: {
                        marginBottom: 16,
                        paddingBottom: 12,
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        borderBottomColor: 'rgba(255,255,255,0.1)',
                    },
                    headerTitle: {
                        fontSize: 20,
                        fontWeight: '700',
                        color: 'white',
                        marginBottom: 4,
                    },
                    headerDateTime: {
                        fontSize: 14,
                        color: 'rgba(255,255,255,0.7)',
                        marginBottom: 2,
                    },
                    row: { flexDirection: 'row', gap: 8 },
                    input: {
                        flex: 1,
                        backgroundColor: 'rgba(255,255,255,0.08)',
                        color: 'white',
                        paddingHorizontal: 12,
                        paddingVertical: 10,
                        borderRadius: 8,
                    },
                    addButton: {
                        backgroundColor: '#22c55e',
                        paddingHorizontal: 14,
                        paddingVertical: 10,
                        borderRadius: 8,
                        alignItems: 'center',
                        justifyContent: 'center',
                    },
                    addButtonText: { color: '#051b0e', fontWeight: '700' },
                    priorityPicker: { marginTop: 12 },
                    priorityPickerLabel: { color: 'rgba(255,255,255,0.7)', marginBottom: 8 },
                    priorityButtons: { flexDirection: 'row', gap: 8 },
                    priorityButton: {
                        flex: 1,
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        borderRadius: 8,
                        backgroundColor: 'rgba(255,255,255,0.08)',
                        alignItems: 'center',
                    },
                    priorityButtonActive: { backgroundColor: 'rgba(34,197,94,0.25)' },
                    priorityButtonText: { 
                        color: 'rgba(255,255,255,0.8)', 
                        fontWeight: '600',
                        fontSize: 16,
                    },
                    priorityButtonTextActive: { color: '#a7f3d0', fontWeight: '700' },
                    projectPicker: { marginTop: 12 },
                    projectPickerLabel: { color: 'rgba(255,255,255,0.7)', marginBottom: 6 },
                    chip: {
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 999,
                        backgroundColor: 'rgba(255,255,255,0.08)',
                    },
                    chipActive: { backgroundColor: 'rgba(34,197,94,0.25)' },
                    chipText: { color: 'rgba(255,255,255,0.8)' },
                    chipTextActive: { color: '#a7f3d0', fontWeight: '700' },
                    taskCard: {
                        marginTop: 10,
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        borderRadius: 12,
                        padding: 12,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 12,
                    },
                    checkbox: {
                        width: 22,
                        height: 22,
                        borderRadius: 6,
                        borderWidth: 2,
                        borderColor: 'rgba(255,255,255,0.5)',
                        alignItems: 'center',
                        justifyContent: 'center',
                    },
                    checkboxInner: {
                        width: 12,
                        height: 12,
                        borderRadius: 3,
                    },
                    checkboxInnerChecked: { backgroundColor: '#22c55e' },
                    taskTitle: { color: 'white', fontWeight: '600' },
                    taskTitleDone: { textDecorationLine: 'line-through', color: 'rgba(255,255,255,0.6)' },
                    taskMeta: { 
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        gap: 8, 
                        marginTop: 4 
                    },
                    taskProject: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
                    taskPriority: { 
                        fontSize: 12, 
                        fontWeight: '700',
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        borderRadius: 4,
                        backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                    priorityA: { color: '#ef4444' },
                    priorityB: { color: '#f97316' },
                    priorityC: { color: '#eab308' },
                    priorityD: { color: '#6b7280' },
                    deleteButton: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, backgroundColor: 'rgba(239,68,68,0.2)' },
                    deleteButtonText: { color: '#fecaca', fontWeight: '700' },
                    emptyText: { color: 'rgba(255,255,255,0.6)', marginTop: 20, textAlign: 'center' },
                    actionButtons: {
                        flexDirection: 'row',
                        gap: 12,
                        marginTop: 20,
                        marginBottom: 20,
                    },
                    closeBoardButton: {
                        flex: 1,
                        backgroundColor: '#3b82f6',
                        paddingVertical: 16,
                        paddingHorizontal: 20,
                        borderRadius: 12,
                        alignItems: 'center',
                    },
                    closeBoardButtonText: {
                        color: 'white',
                        fontSize: 16,
                        fontWeight: '700',
                    },
                    motivationButton: {
                        flex: 1,
                        backgroundColor: '#8b5cf6',
                        paddingVertical: 16,
                        paddingHorizontal: 20,
                        borderRadius: 12,
                        alignItems: 'center',
                    },
                    motivationButtonText: {
                        color: 'white',
                        fontSize: 16,
                        fontWeight: '700',
                    },
                });