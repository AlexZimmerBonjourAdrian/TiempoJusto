import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function ProjectBoard({ projects, setProjects, tasks, onCompleteProject, onActivity }) {
    const [newName, setNewName] = useState('');

    const projectIdToTaskCount = useMemo(() => {
        const counts = {};
        for (const t of tasks || []) {
            if (!t.projectId) continue;
            counts[t.projectId] = (counts[t.projectId] || 0) + 1;
        }
        return counts;
    }, [tasks]);

    function addProject() {
        const name = newName.trim();
        if (!name) return;
        const project = { id: String(Date.now()), name };
        setProjects((prev) => [...(prev || []), project]);
        setNewName('');
        onActivity && onActivity();
    }

    function removeProject(id) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        onActivity && onActivity();
    }

    return (
        <View style={styles.container}>
            <View style={styles.row}>
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
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.title}>{item.name}</Text>
                            <Text style={styles.subtitle}>{projectIdToTaskCount[item.id] || 0} tareas</Text>
                            {item.status === 'completed' && (
                                <Text style={styles.milestone}>🏁 Hito registrado • {item.completedAt ? new Date(item.completedAt).toLocaleDateString('es-ES') : ''}</Text>
                            )}
                        </View>
                        {item.status === 'completed' ? (
                            <View style={styles.completedBadge}>
                                <Text style={styles.completedBadgeText}>Completado</Text>
                            </View>
                        ) : (
                            <Pressable onPress={() => { onCompleteProject && onCompleteProject(item.id); onActivity && onActivity(); }} style={styles.completeButton}>
                                <Text style={styles.completeButtonText}>Completar</Text>
                            </Pressable>
                        )}
                        <Pressable onPress={() => removeProject(item.id)} style={styles.deleteButton}>
                            <Text style={styles.deleteButtonText}>Eliminar</Text>
                        </Pressable>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>Crea tu primer proyecto.</Text>}
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
            backgroundColor: '#3b82f6',
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
        },
        addButtonText: { color: '#0b1220', fontWeight: '700' },
        card: {
            marginTop: 10,
            backgroundColor: 'rgba(255,255,255,0.06)',
            borderRadius: 12,
            padding: 12,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        title: { color: 'white', fontWeight: '700' },
        subtitle: { color: 'rgba(255,255,255,0.6)', marginTop: 2 },
        milestone: { color: '#a7f3d0', fontSize: 12, marginTop: 2 },
        completeButton: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, backgroundColor: 'rgba(34,197,94,0.25)' },
        completeButtonText: { color: '#a7f3d0', fontWeight: '700' },
        completedBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, backgroundColor: 'rgba(34,197,94,0.4)' },
        completedBadgeText: { color: '#ecfdf5', fontWeight: '700' },
        deleteButton: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, backgroundColor: 'rgba(239,68,68,0.2)' },
        deleteButtonText: { color: '#fecaca', fontWeight: '700' },
        emptyText: { color: 'rgba(255,255,255,0.6)', marginTop: 20, textAlign: 'center' },
    });