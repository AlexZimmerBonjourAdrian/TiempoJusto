import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View, Alert, Animated, ScrollView } from 'react-native';
import { useAppContext } from '../context/AppContext';
import TaskItem from './optimized/TaskItem';
import ProgressChart from './ProgressChart';
import TimeRangeSelector from './TimeRangeSelector';

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
        <View style={styles.selectWrapper}>
            <Text style={styles.selectText}>
                {selectedProjectId 
                    ? projects.find(p => p.id === selectedProjectId)?.name 
                    : 'Sin proyecto'
                }
            </Text>
            <Text style={styles.selectArrow}>▼</Text>
        </View>
        <View style={styles.selectDropdown}>
            <Pressable 
                style={styles.selectOption}
                onPress={() => setSelectedProjectId(null)}
            >
                <Text style={styles.selectOptionText}>Sin proyecto</Text>
            </Pressable>
            {projects.map(project => (
                <Pressable 
                    key={project.id}
                    style={styles.selectOption}
                    onPress={() => setSelectedProjectId(project.id)}
                >
                    <Text style={styles.selectOptionText}>{project.name}</Text>
                </Pressable>
            ))}
        </View>
    </View>
));

// Componente memoizado para selección de prioridad
const PrioritySelector = React.memo(({ 
    selectedPriority, 
    setSelectedPriority 
}) => (
    <View style={styles.selectContainer}>
        <Text style={styles.selectLabel}>Prioridad:</Text>
        <View style={styles.priorityButtons}>
            {['A', 'B', 'C', 'D'].map(priority => (
                <Pressable
                    key={priority}
                    style={[
                        styles.priorityButton,
                        selectedPriority === priority && styles.priorityButtonActive
                    ]}
                    onPress={() => setSelectedPriority(priority)}
                >
                    <Text style={[
                        styles.priorityButtonText,
                        selectedPriority === priority && styles.priorityButtonTextActive
                    ]}>
                        {priority}
                    </Text>
                </Pressable>
            ))}
        </View>
    </View>
));

// Componente memoizado para filtros
const FilterSection = React.memo(({ 
    projects, 
    filterProjectId, 
    setFilterProjectId, 
    clearFilter 
}) => (
    <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Filtrar por proyecto:</Text>
        <View style={styles.filterButtons}>
            <Pressable 
                style={[
                    styles.filterButton,
                    filterProjectId === null && styles.filterButtonActive
                ]}
                onPress={clearFilter}
            >
                <Text style={[
                    styles.filterButtonText,
                    filterProjectId === null && styles.filterButtonTextActive
                ]}>
                    Todos
                </Text>
            </Pressable>
            {projects.map(project => (
                <Pressable
                    key={project.id}
                    style={[
                        styles.filterButton,
                        filterProjectId === project.id && styles.filterButtonActive
                    ]}
                    onPress={() => setFilterProjectId(project.id)}
                >
                    <Text style={[
                        styles.filterButtonText,
                        filterProjectId === project.id && styles.filterButtonTextActive
                    ]}>
                        {project.name}
                    </Text>
                </Pressable>
            ))}
        </View>
    </View>
));

// Componente memoizado para lista vacía
const EmptyList = React.memo(({ filterProjectId }) => (
    <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
            {filterProjectId 
                ? 'No hay tareas en este proyecto'
                : 'No hay tareas pendientes'
            }
        </Text>
        <Text style={styles.emptySubtext}>
            ¡Agrega tu primera tarea para comenzar!
        </Text>
    </View>
));

export default function TaskBoard() {
    const [newTitle, setNewTitle] = useState('');
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [selectedPriority, setSelectedPriority] = useState('C');
    const [filterProjectId, setFilterProjectId] = useState(null);
    const [fadeAnim] = useState(new Animated.Value(0));
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [timeRange, setTimeRange] = useState('month');

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

    // Filtrar y ordenar tareas
    const filteredTasks = useMemo(() => {
        if (!tasks) return [];
        
        let filtered = tasks;
        
        if (filterProjectId !== null) {
            filtered = filtered.filter(task => task.projectId === filterProjectId);
        }
        
        return filtered;
    }, [tasks, filterProjectId]);

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

    // Memoizar keyExtractor
    const keyExtractor = useCallback((item) => item.id, []);

    // Memoizar ListEmptyComponent
    const ListEmptyComponent = useMemo(() => (
        <EmptyList filterProjectId={filterProjectId} />
    ), [filterProjectId]);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, []);

    // Mostrar errores de storage
    useEffect(() => {
        if (storageError) {
            Alert.alert(
                'Error de Almacenamiento',
                'Hubo un problema al cargar los datos. Algunas funciones pueden no estar disponibles.',
                [{ text: 'OK' }]
            );
        }
    }, [storageError]);

    // Función memoizada para agregar tarea
    const handleAddTask = useCallback(async () => {
        const title = newTitle.trim();
        if (!title) {
            Alert.alert('Error', 'El título de la tarea es requerido');
            return;
        }
        
        if (isSubmitting) return;
        
        const taskData = {
            title,
            done: false,
            projectId: selectedProjectId || null,
            priority: selectedPriority,
        };
        
        setIsSubmitting(true);
        
        try {
            addTask(taskData);
            setNewTitle('');
        } catch (error) {
            Alert.alert('Error', 'No se pudo crear la tarea. Inténtalo de nuevo.');
            console.error('Error adding task:', error);
        } finally {
            setIsSubmitting(false);
        }
    }, [newTitle, selectedProjectId, selectedPriority, isSubmitting, addTask]);

    // Función memoizada para toggle de tarea
    const handleToggleTask = useCallback(async (id) => {
        try {
            toggleTask(id);
        } catch (error) {
            Alert.alert('Error', 'No se pudo actualizar la tarea. Inténtalo de nuevo.');
            console.error('Error toggling task:', error);
        }
    }, [toggleTask]);

    // Función memoizada para remover tarea
    const handleRemoveTask = useCallback(async (id) => {
        Alert.alert(
            "Eliminar Tarea",
            "¿Estás seguro de que quieres eliminar esta tarea?",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Eliminar", 
                    style: "destructive",
                    onPress: async () => {
                        try {
                            removeTask(id);
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo eliminar la tarea. Inténtalo de nuevo.');
                            console.error('Error removing task:', error);
                        }
                    }
                }
            ]
        );
    }, [removeTask]);

    // Función memoizada para mover a daily board
    const moveToDailyBoard = useCallback((id) => {
        console.log('Move to daily board:', id);
    }, []);

    // Función memoizada para cerrar board
    const handleCloseBoard = useCallback(() => {
        Alert.alert(
            "Cerrar Tablero",
            "¿Estás seguro de que quieres cerrar el tablero? Se mostrarán las estadísticas del día.",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Cerrar", onPress: archiveToday }
            ]
        );
    }, [archiveToday]);

    // Función memoizada para limpiar filtro
    const clearFilter = useCallback(() => {
        setFilterProjectId(null);
    }, []);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Cargando tareas...</Text>
            </View>
        );
    }

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <View style={styles.header}>
                <Text style={styles.title}>Tablero de Tareas</Text>
                <Pressable style={styles.closeButton} onPress={handleCloseBoard}>
                    <Text style={styles.closeButtonText}>Cerrar</Text>
                </Pressable>
            </View>

            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {/* Gráfica de Progreso */}
                <TimeRangeSelector
                    selectedRange={timeRange}
                    onRangeChange={setTimeRange}
                />
                <ProgressChart
                    tasks={tasks || []}
                    timeRange={timeRange}
                />

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

                {/* Lista de Tareas */}
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
    closeButton: {
        padding: 8,
    },
    closeButtonText: {
        fontSize: 16,
        color: 'white',
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
    selectWrapper: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 6,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectText: {
        color: 'white',
        fontSize: 14,
    },
    selectArrow: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 10,
    },
    selectDropdown: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: '#1e293b',
        borderRadius: 6,
        marginTop: 2,
        zIndex: 1000,
    },
    selectOption: {
        paddingHorizontal: 8,
        paddingVertical: 6,
    },
    selectOptionText: {
        color: 'white',
        fontSize: 14,
    },
    priorityButtons: {
        flexDirection: 'row',
        gap: 4,
    },
    priorityButton: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 4,
        paddingVertical: 6,
        alignItems: 'center',
    },
    priorityButtonActive: {
        backgroundColor: '#10b981',
    },
    priorityButtonText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        fontWeight: '600',
    },
    priorityButtonTextActive: {
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
    filterButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    filterButton: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    filterButtonActive: {
        backgroundColor: '#10b981',
    },
    filterButtonText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
    },
    filterButtonTextActive: {
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