import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated, TextInput, FlatList } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { useTasks } from '../features/tasks/hooks/useTasks';
import { useProjects } from '../features/projects/hooks/useProjects';
import { useTaskStats } from '../hooks/useOptimizedComponents';
import taskBusinessLogic from '../features/tasks/domain/taskBusinessLogic';
import TimeRangeSelector from './TimeRangeSelector';
import SimpleProgressChart from './SimpleProgressChart';
import TaskItem from './optimized/TaskItem';

// Componente de gráfica de barras simple
const MonthlyProgressChart = ({ data }) => {
    const maxValue = Math.max(...data.map(item => item.completionRate), 1);
    
    return (
        <View style={styles.chartContainer}>
            <View style={styles.chartBars}>
                {data.map((item, index) => (
                    <View key={index} style={styles.barContainer}>
                        <View style={styles.barWrapper}>
                            <View 
                                style={[
                                    styles.bar, 
                                    { 
                                        height: `${(item.completionRate / maxValue) * 100}%`,
                                        backgroundColor: item.completionRate >= 80 ? '#10b981' : 
                                                       item.completionRate >= 60 ? '#f59e0b' : 
                                                       item.completionRate >= 40 ? '#f97316' : '#ef4444'
                                    }
                                ]} 
                            />
                        </View>
                        <Text style={styles.barLabel}>{item.day}</Text>
                        <Text style={styles.barValue}>{item.completionRate}%</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

// Componente para agregar nuevas tareas
const NewTaskInput = React.memo(({ newTitle, setNewTitle, isSubmitting, onSubmit }) => (
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

export default function AnalyticsBoard() {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    const [fadeAnim] = useState(new Animated.Value(0));
    const [newTitle, setNewTitle] = useState('');
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [selectedPriority, setSelectedPriority] = useState('C');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [timeRange, setTimeRange] = useState('month');

    const { setActiveTab, dailyLogs } = useAppContext();
    const { list: tasks, create: addTask, toggle: toggleTask, remove: removeTask } = useTasks();
    const { list: projects } = useProjects();
    const projectIdToProject = useMemo(() => (projects || []).reduce((acc, p) => { acc[p.id] = p; return acc; }, {}), [projects]);
    
    const todayTasks = useMemo(() => {
        return tasks.filter(task => {
            const taskDate = task.createdAt ? new Date(task.createdAt).toISOString().split('T')[0] : todayString;
            return taskDate === todayString;
        });
    }, [tasks, todayString]);

    const taskStats = useTaskStats(todayTasks);

    // Filtrar tareas por rango de tiempo
    const filteredTasks = useMemo(() => {
        if (!tasks) return [];
        const now = new Date();
        let startDate;
        if (timeRange === 'month') {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        } else {
            startDate = new Date(now);
            startDate.setDate(startDate.getDate() - 6);
        }
        return taskBusinessLogic.filterTasksAdvanced(tasks, { dateRange: { start: startDate, end: null } });
    }, [tasks, timeRange]);

    // Ordenar tareas
    const sortedTasks = useMemo(() => {
        return taskBusinessLogic.sortTasksIntelligently(filteredTasks);
    }, [filteredTasks]);

    // Datos para la gráfica mensual mejorada
    const monthlyData = useMemo(() => {
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        
        // Obtener logs del mes actual
        const monthLogs = dailyLogs.filter(log => {
            const logDate = new Date(log.date);
            return logDate.getMonth() === currentMonth && logDate.getFullYear() === currentYear;
        });

        // Crear array con todos los días del mes
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const monthProgress = [];

        for (let day = 1; day <= daysInMonth; day++) {
            const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const logEntry = monthLogs.find(log => log.date === dateString);
            
            // Contar tareas del día específico
            const dayTasks = tasks.filter(task => {
                const taskDate = task.createdAt ? new Date(task.createdAt).toISOString().split('T')[0] : null;
                return taskDate === dateString;
            });
            
            const completedTasks = dayTasks.filter(task => task.done);
            
            monthProgress.push({
                day: day,
                date: dateString,
                completionRate: logEntry ? logEntry.completionRate : (dayTasks.length > 0 ? Math.round((completedTasks.length / dayTasks.length) * 100) : 0),
                totalTasks: logEntry ? logEntry.totalTasks : dayTasks.length,
                completedTasks: logEntry ? logEntry.completedTasks : completedTasks.length,
                productivityScore: logEntry ? logEntry.productivityScore : 0
            });
        }

        return monthProgress;
    }, [dailyLogs, today, tasks]);

    // Estadísticas del mes mejoradas
    const monthlyStats = useMemo(() => {
        const completedDays = monthlyData.filter(day => day.completionRate > 0);
        const totalDays = monthlyData.length;
        const activeDays = completedDays.length;
        
        const avgCompletionRate = completedDays.length > 0 
            ? Math.round(completedDays.reduce((sum, day) => sum + day.completionRate, 0) / completedDays.length)
            : 0;
        
        const totalTasks = monthlyData.reduce((sum, day) => sum + day.totalTasks, 0);
        const totalCompleted = monthlyData.reduce((sum, day) => sum + day.completedTasks, 0);
        const totalProductivityScore = monthlyData.reduce((sum, day) => sum + day.productivityScore, 0);

        return {
            totalDays,
            activeDays,
            avgCompletionRate,
            totalTasks,
            totalCompleted,
            totalProductivityScore,
            consistencyRate: totalDays > 0 ? Math.round((activeDays / totalDays) * 100) : 0
        };
    }, [monthlyData]);

    // Manejar agregar nueva tarea
    const handleAddTask = useCallback(async () => {
        if (!newTitle.trim() || isSubmitting) return;
        
        setIsSubmitting(true);
        try {
            const res = await addTask({
                title: newTitle.trim(),
                projectId: selectedProjectId,
                priority: selectedPriority
            });
            if (res?.ok) {
                setNewTitle('');
                setSelectedProjectId(null);
                setSelectedPriority('C');
            }
        } catch (error) {
            console.error('Error al agregar tarea:', error);
        } finally {
            setIsSubmitting(false);
        }
    }, [newTitle, selectedProjectId, selectedPriority, isSubmitting, addTask]);

    // Manejar toggle de tarea
    const handleToggleTask = useCallback((taskId) => {
        toggleTask(taskId);
    }, [toggleTask]);

    // Manejar eliminar tarea
    const handleRemoveTask = useCallback((taskId) => {
        removeTask(taskId);
    }, [removeTask]);

    // Renderizar tarea
    const renderTask = useCallback(({ item }) => (
        <TaskItem
            task={item}
            projectName={item.projectId ? projectIdToProject[item.projectId]?.name : null}
            onToggle={handleToggleTask}
            onRemove={handleRemoveTask}
            onMoveToDaily={() => {}}
        />
    ), [projectIdToProject, handleToggleTask, handleRemoveTask]);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, []);

    const analytics = useMemo(() => {
        if (!todayTasks || todayTasks.length === 0) {
            return {
                totalTasks: 0,
                completedTasks: 0,
                completionRate: 0,
                priorityBreakdown: { A: 0, B: 0, C: 0, D: 0 },
                projectBreakdown: {},
                productivityScore: 0,
                timeSpent: 0,
            };
        }

        const completedTasks = todayTasks.filter(task => task.done);
        const completionRate = todayTasks.length > 0 ? (completedTasks.length / todayTasks.length) * 100 : 0;

        const priorityBreakdown = { A: 0, B: 0, C: 0, D: 0 };
        todayTasks.forEach(task => {
            const priority = task.priority || 'C';
            priorityBreakdown[priority]++;
        });

        const projectBreakdown = {};
        todayTasks.forEach(task => {
            if (task.projectId) {
                const projectName = projectIdToProject?.[task.projectId]?.name || 'Sin proyecto';
                if (!projectBreakdown[projectName]) {
                    projectBreakdown[projectName] = { total: 0, completed: 0 };
                }
                projectBreakdown[projectName].total++;
                if (task.done) {
                    projectBreakdown[projectName].completed++;
                }
            }
        });

        // Calcular score de productividad basado en prioridades completadas
        let productivityScore = 0;
        completedTasks.forEach(task => {
            const priority = task.priority || 'C';
            switch (priority) {
                case 'A': productivityScore += 10; break;
                case 'B': productivityScore += 7; break;
                case 'C': productivityScore += 4; break;
                case 'D': productivityScore += 1; break;
            }
        });

        return {
            totalTasks: todayTasks.length,
            completedTasks: completedTasks.length,
            completionRate: Math.round(completionRate),
            priorityBreakdown,
            projectBreakdown,
            productivityScore,
            timeSpent: completedTasks.length * 25, // Estimación: 25 min por tarea
        };
    }, [todayTasks, projectIdToProject]);

    const handleCloseBoard = () => {
        setActiveTab('tareas');
    };

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <View style={styles.header}>
                <Text style={styles.title}>Análisis y Tareas</Text>
                <Pressable style={styles.closeButton} onPress={handleCloseBoard}>
                    <Text style={styles.closeButtonText}>Cerrar</Text>
                </Pressable>
            </View>

            <ScrollView 
                style={styles.scrollView} 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <TimeRangeSelector
                    selectedRange={timeRange}
                    onRangeChange={setTimeRange}
                />
                
                <SimpleProgressChart
                    data={(timeRange === 'month' ? monthlyData : monthlyData.slice(-7)).map(d => ({ date: d.date, completed: d.completedTasks }))}
                    timeRange={timeRange}
                />

                {/* Sección de estadísticas generales */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Estadísticas Generales</Text>
                    <Text style={styles.sectionSubtitle}>
                        {timeRange === 'month' 
                            ? today.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
                            : 'Últimos 7 días'
                        }
                    </Text>
                    
                    <View style={styles.statsGrid}>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>{analytics.totalTasks}</Text>
                            <Text style={styles.statLabel}>Total Tareas</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>{analytics.completedTasks}</Text>
                            <Text style={styles.statLabel}>Completadas</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>{analytics.completionRate}%</Text>
                            <Text style={styles.statLabel}>Tasa de Éxito</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>{analytics.productivityScore}</Text>
                            <Text style={styles.statLabel}>Puntuación</Text>
                        </View>
                    </View>
                </View>

                {/* Sección de gestión de tareas */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Gestión de Tareas</Text>
                    
                    <View style={styles.inputSection}>
                        <NewTaskInput
                            newTitle={newTitle}
                            setNewTitle={setNewTitle}
                            isSubmitting={isSubmitting}
                            onSubmit={handleAddTask}
                        />
                    </View>

                    <View style={styles.taskListContainer}>
                        {sortedTasks.length > 0 ? (
                            <FlatList
                                data={sortedTasks}
                                renderItem={renderTask}
                                keyExtractor={(item) => item.id}
                                contentContainerStyle={styles.taskListContent}
                            />
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>
                                    No hay tareas en el rango seleccionado
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Análisis del Día</Text>
                    <Text style={styles.date}>{today.toLocaleDateString('es-ES', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}</Text>

                    <View style={styles.statsGrid}>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>{analytics.totalTasks}</Text>
                            <Text style={styles.statLabel}>Total Tareas</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>{analytics.completedTasks}</Text>
                            <Text style={styles.statLabel}>Completadas</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>{analytics.completionRate}%</Text>
                            <Text style={styles.statLabel}>Tasa de Éxito</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>{analytics.productivityScore}</Text>
                            <Text style={styles.statLabel}>Puntuación</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Distribución por Prioridad</Text>
                    <View style={styles.priorityGrid}>
                        {Object.entries(analytics.priorityBreakdown).map(([priority, count]) => (
                            <View key={priority} style={styles.priorityItem}>
                                <Text style={[styles.priorityLabel, styles[`priority${priority}`]]}>
                                    {priority}
                                </Text>
                                <Text style={styles.priorityCount}>{count}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {Object.keys(analytics.projectBreakdown).length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Rendimiento por Proyecto</Text>
                        {Object.entries(analytics.projectBreakdown).map(([projectName, stats]) => (
                            <View key={projectName} style={styles.projectItem}>
                                <Text style={styles.projectName}>{projectName}</Text>
                                <Text style={styles.projectStats}>
                                    {stats.completed}/{stats.total} completadas
                                </Text>
                                <View style={styles.progressBar}>
                                    <View 
                                        style={[
                                            styles.progressFill, 
                                            { width: `${(stats.completed / stats.total) * 100}%` }
                                        ]} 
                                    />
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Resumen de Tiempo</Text>
                    <View style={styles.timeCard}>
                        <Text style={styles.timeEstimate}>
                            Tiempo estimado: {Math.round(analytics.timeSpent / 60)} horas
                        </Text>
                        <Text style={styles.timeNote}>
                            Basado en 25 minutos por tarea completada
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    title: {
        color: 'white',
        fontSize: 20,
        fontWeight: '700',
    },
    closeButton: {
        padding: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 8,
    },
    closeButtonText: {
        fontSize: 16,
        color: 'white',
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 32,
    },
    section: {
        marginBottom: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 12,
        padding: 16,
    },
    sectionTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    sectionSubtitle: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
        marginBottom: 16,
    },
    date: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 16,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: 'rgba(126, 211, 33, 0.1)',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(126, 211, 33, 0.2)',
    },
    statNumber: {
        color: '#7ED321',
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 4,
    },
    statLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        textAlign: 'center',
        fontWeight: '500',
    },
    monthlyStatsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    monthlyStatCard: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
    },
    monthlyStatNumber: {
        color: 'white',
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 2,
    },
    monthlyStatLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 10,
        textAlign: 'center',
    },
    chartContainer: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 16,
        marginTop: 8,
    },
    chartBars: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 120,
        paddingBottom: 20,
    },
    barContainer: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 1,
    },
    barWrapper: {
        height: 80,
        width: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },
    bar: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        borderRadius: 4,
    },
    barLabel: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 10,
        marginBottom: 2,
    },
    barValue: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 8,
        fontWeight: '600',
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
        opacity: 0.5,
    },
    addButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    taskListContainer: {
        marginTop: 8,
    },
    taskListContent: {
        paddingBottom: 20, // Add some padding at the bottom for the last item
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
    },
    emptyText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
        textAlign: 'center',
    },
    priorityGrid: {
        flexDirection: 'row',
        gap: 8,
    },
    priorityItem: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    priorityLabel: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 6,
    },
    priorityCount: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 16,
        fontWeight: '600',
    },
    priorityA: { color: '#ef4444' },
    priorityB: { color: '#f97316' },
    priorityC: { color: '#eab308' },
    priorityD: { color: '#6b7280' },
    projectItem: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    projectName: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 6,
    },
    projectStats: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        marginBottom: 10,
        fontWeight: '500',
    },
    progressBar: {
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#7ED321',
        borderRadius: 3,
    },
    timeCard: {
        backgroundColor: 'rgba(126, 211, 33, 0.1)',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(126, 211, 33, 0.2)',
    },
    timeEstimate: {
        color: '#7ED321',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 6,
    },
    timeNote: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        fontWeight: '500',
    },
});
