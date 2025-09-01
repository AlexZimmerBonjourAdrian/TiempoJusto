import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View, Alert, Animated, ScrollView } from 'react-native';
import { useAppContext } from '../context/AppContext';
import TaskItem from './optimized/TaskItem';
import ProjectHistory from './ProjectHistory';

// Componente memoizado para el input de nueva tarea
const NewTaskInput = React.memo(({ 
    newTitle, 
    setNewTitle, 
    isSubmitting, 
    onSubmit 
}) => (
    <View style={styles.inputRow}>
        <TextInput
            style={[styles.titleInput, isSubmitting && styles.titleInputDisabled]}
            placeholder="Nueva tarea..."
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={newTitle}
            onChangeText={setNewTitle}
            onSubmitEditing={onSubmit}
            editable={!isSubmitting}
            maxLength={200}
        />
        <Pressable 
            style={[styles.addButton, isSubmitting && styles.addButtonDisabled]} 
            onPress={onSubmit}
            disabled={isSubmitting}
        >
            <Text style={styles.addButtonText}>
                {isSubmitting ? '...' : '+'}
            </Text>
        </Pressable>
    </View>
));

// Componente memoizado para selección de proyecto
const ProjectSelector = React.memo(({ 
    projects, 
    selectedProjectId, 
    setSelectedProjectId 
}) => (
    <View style={styles.selectContainer}>
        <Text style={styles.selectLabel}>Proyecto:</Text>
        <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.projectScroll}
        >
            <Pressable
                style={[
                    styles.projectOption,
                    !selectedProjectId && styles.projectOptionActive
                ]}
                onPress={() => setSelectedProjectId(null)}
            >
                <Text style={[
                    styles.projectOptionText,
                    !selectedProjectId && styles.projectOptionTextActive
                ]}>
                    Sin proyecto
                </Text>
            </Pressable>
            {projects.map(project => (
                <Pressable
                    key={project.id}
                    style={[
                        styles.projectOption,
                        selectedProjectId === project.id && styles.projectOptionActive
                    ]}
                    onPress={() => setSelectedProjectId(project.id)}
                >
                    <Text style={[
                        styles.projectOptionText,
                        selectedProjectId === project.id && styles.projectOptionTextActive
                    ]}>
                        {project.name}
                    </Text>
                </Pressable>
            ))}
        </ScrollView>
    </View>
));

// Componente memoizado para selección de prioridad
const PrioritySelector = React.memo(({ 
    selectedPriority, 
    setSelectedPriority 
}) => {
    const priorities = [
        { key: 'A', label: 'A', color: '#ef4444' },
        { key: 'B', label: 'B', color: '#f97316' },
        { key: 'C', label: 'C', color: '#eab308' },
        { key: 'D', label: 'D', color: '#6b7280' }
    ];

    return (
        <View style={styles.selectContainer}>
            <Text style={styles.selectLabel}>Prioridad:</Text>
            <View style={styles.priorityContainer}>
                {priorities.map(priority => (
                    <Pressable
                        key={priority.key}
                        style={[
                            styles.priorityOption,
                            selectedPriority === priority.key && styles.priorityOptionActive
                        ]}
                        onPress={() => setSelectedPriority(priority.key)}
                    >
                        <Text style={[
                            styles.priorityOptionText,
                            { color: priority.color },
                            selectedPriority === priority.key && styles.priorityOptionTextActive
                        ]}>
                            {priority.label}
                        </Text>
                    </Pressable>
                ))}
            </View>
        </View>
    );
});

// Componente memoizado para filtros
const FilterSection = React.memo(({ 
    projects, 
    filterProjectId, 
    setFilterProjectId, 
    clearFilter 
}) => (
    <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Filtrar por proyecto:</Text>
        <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
        >
            <Pressable
                style={[
                    styles.filterOption,
                    filterProjectId === null && styles.filterOptionActive
                ]}
                onPress={clearFilter}
            >
                <Text style={[
                    styles.filterOptionText,
                    filterProjectId === null && styles.filterOptionTextActive
                ]}>
                    Todas
                </Text>
            </Pressable>
            {projects.map(project => (
                <Pressable
                    key={project.id}
                    style={[
                        styles.filterOption,
                        filterProjectId === project.id && styles.filterOptionActive
                    ]}
                    onPress={() => setFilterProjectId(project.id)}
                >
                    <Text style={[
                        styles.filterOptionText,
                        filterProjectId === project.id && styles.filterOptionTextActive
                    ]}>
                        {project.name}
                    </Text>
                </Pressable>
            ))}
        </ScrollView>
    </View>
));

// Componente memoizado para lista vacía
const EmptyList = React.memo(({ filterProjectId }) => (
    <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
            {filterProjectId !== null 
                ? 'No hay tareas para este proyecto'
                : '¡Agrega tu primera tarea para comenzar!'
            }
        </Text>
    </View>
));

export default function TaskBoard() {
    const [newTitle, setNewTitle] = useState('');
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [selectedPriority, setSelectedPriority] = useState('A');
    const [filterProjectId, setFilterProjectId] = useState(null);
    const [fadeAnim] = useState(new Animated.Value(0));
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isAddingRef = useRef(false);

    const { 
        projects, 
        projectIdToProject, 
        tasks,
        addTask,
        toggleTask,
        removeTask,
        archiveToday,
        isLoading,
        storageError
    } = useAppContext();

    // Filtrar tareas del día actual
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    const todayTasks = useMemo(() => {
        if (!tasks) return [];
        
        return tasks.filter(task => {
            const taskDate = task.createdAt ? new Date(task.createdAt).toISOString().split('T')[0] : todayString;
            return taskDate === todayString;
        });
    }, [tasks, todayString]);

    // Filtrar y ordenar tareas
    const filteredTasks = useMemo(() => {
        if (!todayTasks) return [];
        
        let filtered = todayTasks;
        
        if (filterProjectId !== null) {
            filtered = filtered.filter(task => task.projectId === filterProjectId);
        }
        
        return filtered;
    }, [todayTasks, filterProjectId]);

    const sortedTasks = useMemo(() => {
        if (!Array.isArray(filteredTasks)) return [];
        
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

    // Función para mover tarea al tablero diario
    const moveToDailyBoard = useCallback((taskId) => {
        // Esta funcionalidad se puede implementar si es necesaria
        console.log('Mover tarea al tablero diario:', taskId);
    }, []);

    // Memoizar el renderTask para evitar re-creaciones
    const renderTask = useCallback(({ item }) => (
        <TaskItem
            task={item}
            projectName={item.projectId ? projectIdToProject[item.projectId]?.name : null}
            onToggle={toggleTask}
            onRemove={removeTask}
            onMoveToDaily={moveToDailyBoard}
        />
    ), [projectIdToProject, toggleTask, removeTask, moveToDailyBoard]);

    // Manejar agregar nueva tarea
    const handleAddTask = useCallback(async () => {
        const title = newTitle.trim();
        if (!title) return;
        if (isAddingRef.current) return; // candado sincronizado para evitar dobles envíos
        isAddingRef.current = true;
        setIsSubmitting(true);

        try {
            const ok = await addTask({
                title,
                projectId: selectedProjectId,
                priority: selectedPriority
            });
            if (ok) {
                setNewTitle('');
                setSelectedProjectId(null);
                setSelectedPriority('A');
            }
        } catch (error) {
            console.error('Error al agregar tarea:', error);
            Alert.alert('Error', 'No se pudo agregar la tarea');
        } finally {
            setIsSubmitting(false);
            isAddingRef.current = false;
        }
    }, [newTitle, selectedProjectId, selectedPriority, addTask]);

    // Manejar toggle de tarea
    const handleToggleTask = useCallback((taskId) => {
        toggleTask(taskId);
    }, [toggleTask]);

    // Manejar eliminar tarea
    const handleRemoveTask = useCallback((taskId) => {
        Alert.alert(
            'Eliminar Tarea',
            '¿Estás seguro de que quieres eliminar esta tarea?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Eliminar', style: 'destructive', onPress: () => removeTask(taskId) }
            ]
        );
    }, [removeTask]);

    // Limpiar filtro
    const clearFilter = useCallback(() => {
        setFilterProjectId(null);
    }, []);

    // Manejar cerrar tablero
    const handleCloseBoard = useCallback(() => {
        // Esta funcionalidad se puede implementar si es necesaria
        console.log('Cerrar tablero de tareas');
    }, []);

    // Animación de entrada
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, []);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Cargando tareas...</Text>
            </View>
        );
    }

    if (storageError) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Error al cargar datos: {storageError}</Text>
            </View>
        );
    }

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <View style={styles.header} />

            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <ProjectHistory projects={projects || []} />

                <View style={styles.inputSection}>
                    <NewTaskInput
                        newTitle={newTitle}
                        setNewTitle={setNewTitle}
                        isSubmitting={isSubmitting}
                        onSubmit={handleAddTask}
                    />

                    <View style={styles.optionsRow}>
                        <ProjectSelector
                            projects={projects}
                            selectedProjectId={selectedProjectId}
                            setSelectedProjectId={setSelectedProjectId}
                        />
                        <PrioritySelector
                            selectedPriority={selectedPriority}
                            setSelectedPriority={setSelectedPriority}
                        />
                    </View>
                </View>

                <FilterSection
                    projects={projects}
                    filterProjectId={filterProjectId}
                    setFilterProjectId={setFilterProjectId}
                    clearFilter={clearFilter}
                />

                <View style={styles.taskListContainer}>
                    {sortedTasks.length > 0 ? (
                        sortedTasks.map((task) => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                projectName={task.projectId ? projectIdToProject[task.projectId]?.name : null}
                                onToggle={handleToggleTask}
                                onRemove={handleRemoveTask}
                                onMoveToDaily={moveToDailyBoard}
                            />
                        ))
                    ) : (
                        <EmptyList filterProjectId={filterProjectId} />
                    )}
                </View>
            </ScrollView>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: 'white',
        fontSize: 16,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        color: 'white',
        fontSize: 20,
        fontWeight: '700',
    },
    date: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
    },
    inputSection: {
        marginBottom: 16,
    },
    inputRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    titleInput: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        color: 'white',
        fontSize: 16,
        marginRight: 8,
    },
    titleInputDisabled: {
        opacity: 0.5,
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
    optionsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    selectContainer: {
        flex: 1,
    },
    selectLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        marginBottom: 4,
    },
    projectScroll: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    projectOption: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 6,
    },
    projectOptionActive: {
        backgroundColor: '#10b981',
    },
    projectOptionText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
    },
    projectOptionTextActive: {
        color: 'white',
        fontWeight: '600',
    },
    priorityContainer: {
        flexDirection: 'row',
        gap: 4,
    },
    priorityOption: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 4,
        paddingVertical: 6,
        alignItems: 'center',
    },
    priorityOptionActive: {
        backgroundColor: '#10b981',
    },
    priorityOptionText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        fontWeight: '600',
    },
    priorityOptionTextActive: {
        color: 'white',
    },
    filterSection: {
        marginBottom: 16,
    },
    filterLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        marginBottom: 8,
    },
    filterScroll: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    filterOption: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 6,
    },
    filterOptionActive: {
        backgroundColor: '#10b981',
    },
    filterOptionText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
    },
    filterOptionTextActive: {
        color: 'white',
        fontWeight: '600',
    },
    scrollContainer: {
        flex: 1,
    },
    taskListContainer: {
        paddingBottom: 20,
    },
    taskList: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 8,
    },
    emptySubtext: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
        textAlign: 'center',
    },
    suggestionsContainer: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    suggestionsTitle: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    suggestionItem: {
        marginBottom: 6,
    },
    suggestionText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        lineHeight: 16,
    },
});