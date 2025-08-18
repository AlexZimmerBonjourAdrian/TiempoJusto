import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function TaskBoard({ tasks, setTasks, projects, projectIdToProject }) {
    const [newTitle, setNewTitle] = useState('');
    const [selectedProjectId, setSelectedProjectId] = useState(null);

    const sortedTasks = useMemo(() => {
        return [...(tasks || [])].sort((a, b) => Number(a.done) - Number(b.done));
    }, [tasks]);

    function addTask() {
        const title = newTitle.trim();
        if (!title) return;
        const task = {
            id: String(Date.now()),
            title,
            done: false,
            projectId: selectedProjectId || null,
        };
        setTasks((prev) => [...(prev || []), task]);
        setNewTitle('');
    }

    function toggleTask(id) {
        setTasks((prev) => prev.map((t) => (t.id === id ? {...t, done: !t.done } : t)));
    }

    function removeTask(id) {
        setTasks((prev) => prev.filter((t) => t.id !== id));
    }

    return (
        <View style={styles.container}>
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
                                {projectName ? <Text style={styles.taskProject}>{projectName}</Text> : null}
                            </View>
                            <Pressable onPress={() => removeTask(item.id)} style={styles.deleteButton}>
                                <Text style={styles.deleteButtonText}>Eliminar</Text>
                            </Pressable>
                        </View>
                    );
                }}
                ListEmptyComponent={<Text style={styles.emptyText}>No hay tareas aún.</Text>}
            />
        </View>
    );

}

                const styles = StyleSheet.create({
                    container: { flex: 1 },
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
                    projectPicker: { marginTop: 10 },
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
                    taskProject: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2 },
                    deleteButton: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, backgroundColor: 'rgba(239,68,68,0.2)' },
                    deleteButtonText: { color: '#fecaca', fontWeight: '700' },
                    emptyText: { color: 'rgba(255,255,255,0.6)', marginTop: 20, textAlign: 'center' },
                });