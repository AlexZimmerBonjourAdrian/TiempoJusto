import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const ProgressChart = ({ tasks, projects, timeRange = 'month' }) => {
    // Calcular datos de progreso mejorado
    const chartData = useMemo(() => {
        const now = new Date();
        const data = [];
        
        if (timeRange === 'month') {
            // Mes actual completo
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();
            const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
            
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(currentYear, currentMonth, day);
                const dateStr = date.toISOString().split('T')[0];
                
                // Contar tareas creadas en este día
                const dayTasks = tasks.filter(task => {
                    if (!task.createdAt) return false;
                    return task.createdAt.startsWith(dateStr);
                });
                
                // Contar tareas completadas en este día
                const completedTasks = dayTasks.filter(task => {
                    if (!task.done) return false;
                    
                    // Si tiene completedAt, usar esa fecha
                    if (task.completedAt) {
                        return task.completedAt.startsWith(dateStr);
                    }
                    
                    // Si no tiene completedAt pero está done, usar createdAt
                    return task.createdAt.startsWith(dateStr);
                });
                
                data.push({
                    date: dateStr,
                    total: dayTasks.length,
                    completed: completedTasks.length,
                    completionRate: dayTasks.length > 0 ? Math.round((completedTasks.length / dayTasks.length) * 100) : 0
                });
            }
        } else if (timeRange === 'week') {
            // Últimos 7 días
            for (let i = 6; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                
                // Contar tareas creadas en este día
                const dayTasks = tasks.filter(task => {
                    if (!task.createdAt) return false;
                    return task.createdAt.startsWith(dateStr);
                });
                
                // Contar tareas completadas en este día
                const completedTasks = dayTasks.filter(task => {
                    if (!task.done) return false;
                    
                    // Si tiene completedAt, usar esa fecha
                    if (task.completedAt) {
                        return task.completedAt.startsWith(dateStr);
                    }
                    
                    // Si no tiene completedAt pero está done, usar createdAt
                    return task.createdAt.startsWith(dateStr);
                });
                
                data.push({
                    date: dateStr,
                    total: dayTasks.length,
                    completed: completedTasks.length,
                    completionRate: dayTasks.length > 0 ? Math.round((completedTasks.length / dayTasks.length) * 100) : 0
                });
            }
        }
        
        return data;
    }, [tasks, timeRange]);

    // Calcular estadísticas de eficiencia mejoradas
    const efficiencyStats = useMemo(() => {
        // Filtrar tareas por rango de tiempo
        const now = new Date();
        let startDate;
        
        if (timeRange === 'month') {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        } else {
            startDate = new Date(now);
            startDate.setDate(startDate.getDate() - 6);
        }
        
        const rangeTasks = tasks.filter(task => {
            if (!task.createdAt) return false;
            const taskDate = new Date(task.createdAt);
            return taskDate >= startDate;
        });
        
        const totalTasks = rangeTasks.length;
        const completedTasks = rangeTasks.filter(task => task.done).length;
        const efficiencyPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        
        // Calcular eficiencia por prioridad
        const priorityEfficiency = {
            A: { total: 0, completed: 0, percentage: 0 },
            B: { total: 0, completed: 0, percentage: 0 },
            C: { total: 0, completed: 0, percentage: 0 },
            D: { total: 0, completed: 0, percentage: 0 }
        };
        
        rangeTasks.forEach(task => {
            const priority = task.priority || 'C';
            priorityEfficiency[priority].total++;
            if (task.done) {
                priorityEfficiency[priority].completed++;
            }
        });
        
        // Calcular porcentajes
        Object.keys(priorityEfficiency).forEach(priority => {
            const { total, completed } = priorityEfficiency[priority];
            priorityEfficiency[priority].percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        });
        
        return {
            totalTasks,
            completedTasks,
            efficiencyPercentage,
            priorityEfficiency
        };
    }, [tasks, timeRange]);

    // Calcular estadísticas de proyectos
    const projectStats = useMemo(() => {
        const now = new Date();
        let startDate;
        
        if (timeRange === 'month') {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        } else {
            startDate = new Date(now);
            startDate.setDate(startDate.getDate() - 6);
        }
        
        const rangeTasks = tasks.filter(task => {
            if (!task.createdAt) return false;
            const taskDate = new Date(task.createdAt);
            return taskDate >= startDate;
        });
        
        const projectBreakdown = {};
        
        rangeTasks.forEach(task => {
            if (task.projectId) {
                if (!projectBreakdown[task.projectId]) {
                    projectBreakdown[task.projectId] = { total: 0, completed: 0 };
                }
                projectBreakdown[task.projectId].total++;
                if (task.done) {
                    projectBreakdown[task.projectId].completed++;
                }
            }
        });
        
        const activeProjects = Object.keys(projectBreakdown).length;
        const completedProjects = Object.values(projectBreakdown).filter(stats => stats.completed === stats.total).length;
        
        // Calcular días promedio de completación
        const completionDays = [];
        rangeTasks.forEach(task => {
            if (task.done && task.createdAt && task.completedAt) {
                const created = new Date(task.createdAt);
                const completed = new Date(task.completedAt);
                const daysDiff = Math.ceil((completed - created) / (1000 * 60 * 60 * 24));
                completionDays.push(daysDiff);
            }
        });
        
        const avgCompletionDays = completionDays.length > 0 
            ? Math.round(completionDays.reduce((sum, days) => sum + days, 0) / completionDays.length)
            : 0;
        
        return {
            activeProjects,
            completedProjects,
            avgCompletionDays,
            projectBreakdown
        };
    }, [tasks, timeRange]);

    // Configuración del gráfico mejorada
    const chartConfig = {
        backgroundColor: '#1e293b',
        backgroundGradientFrom: '#1e293b',
        backgroundGradientTo: '#1e293b',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(126, 211, 33, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#7ED321',
        },
        propsForBackgroundLines: {
            strokeDasharray: '', // Líneas sólidas
            stroke: 'rgba(255, 255, 255, 0.1)',
            strokeWidth: 1,
        },
    };

    // Calcular estadísticas mejoradas
    const totalCompleted = useMemo(() => {
        return chartData.reduce((sum, item) => sum + item.completed, 0);
    }, [chartData]);

    const totalTasks = useMemo(() => {
        return chartData.reduce((sum, item) => sum + item.total, 0);
    }, [chartData]);

    const averageCompleted = useMemo(() => {
        const activeDays = chartData.filter(item => item.total > 0).length;
        return activeDays > 0 ? Math.round(totalCompleted / activeDays) : 0;
    }, [totalCompleted, chartData]);

    const maxCompleted = useMemo(() => {
        return Math.max(...chartData.map(item => item.completed), 0);
    }, [chartData]);

    // Preparar datos para BarChart con mejor formato
    const barData = {
        labels: chartData.map(item => {
            const date = new Date(item.date);
            if (timeRange === 'month') {
                // Para mes: mostrar solo el día
                return `${date.getDate()}`;
            } else {
                // Para semana: mostrar día de la semana abreviado
                return date.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase();
            }
        }),
        datasets: [{
            data: chartData.map(item => item.completed),
            color: (opacity = 1) => `rgba(126, 211, 33, ${opacity})`,
            strokeWidth: 2,
        }]
    };

    // Verificar si hay datos para mostrar
    const hasData = totalTasks > 0 || totalCompleted > 0;

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Text style={styles.title}>Progreso de Tareas</Text>
                
                <View style={styles.efficiencyContainer}>
                    <Text style={styles.efficiencyLabel}>Eficiencia General</Text>
                    <Text style={styles.efficiencyPercentage}>{efficiencyStats.efficiencyPercentage}%</Text>
                    <Text style={styles.efficiencyDetails}>
                        {efficiencyStats.completedTasks} de {efficiencyStats.totalTasks} tareas completadas
                    </Text>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{totalCompleted}</Text>
                        <Text style={styles.statLabel}>Completadas</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{totalTasks}</Text>
                        <Text style={styles.statLabel}>Total</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{averageCompleted}</Text>
                        <Text style={styles.statLabel}>Promedio/Día</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{maxCompleted}</Text>
                        <Text style={styles.statLabel}>Máximo/Día</Text>
                    </View>
                </View>
            </View>

            <View style={styles.chartContainer}>
                {hasData ? (
                    <>
                        <Text style={styles.chartTitle}>
                            {timeRange === 'month' ? 'Progreso Mensual' : 'Progreso Semanal'}
                        </Text>
                        <BarChart
                            data={barData}
                            width={Math.min(screenWidth - 40, 350)}
                            height={Math.min(screenHeight * 0.3, 220)}
                            chartConfig={chartConfig}
                            verticalLabelRotation={0}
                            showBarTops={true}
                            showValuesOnTopOfBars={true}
                            fromZero={true}
                            withInnerLines={true}
                            withVerticalLabels={true}
                            withHorizontalLabels={true}
                            withDots={false}
                            segments={4}
                            style={styles.chart}
                        />
                    </>
                ) : (
                    <View style={styles.emptyChartContainer}>
                        <Text style={styles.emptyChartTitle}>No hay datos para mostrar</Text>
                        <Text style={styles.emptyChartSubtitle}>
                            {timeRange === 'month' 
                                ? 'Comienza a crear tareas este mes para ver tu progreso'
                                : 'Comienza a crear tareas esta semana para ver tu progreso'
                            }
                        </Text>
                    </View>
                )}
            </View>

            <View style={styles.priorityEfficiencyContainer}>
                <Text style={styles.sectionTitle}>Eficiencia por Prioridad</Text>
                <View style={styles.priorityBars}>
                    {Object.entries(efficiencyStats.priorityEfficiency).map(([priority, stats]) => (
                        <View key={priority} style={styles.priorityBar}>
                            <View style={styles.priorityHeader}>
                                <Text style={styles.priorityLabel}>Prioridad {priority}</Text>
                                <Text style={styles.priorityPercentage}>{stats.percentage}%</Text>
                            </View>
                            <View style={styles.progressBar}>
                                <View 
                                    style={[
                                        styles.progressFill, 
                                        { width: `${stats.percentage}%` }
                                    ]} 
                                />
                            </View>
                            <Text style={styles.priorityDetails}>
                                {stats.completed} de {stats.total} completadas
                            </Text>
                        </View>
                    ))}
                </View>
            </View>

            <View style={styles.projectStatsContainer}>
                <Text style={styles.sectionTitle}>Proyectos</Text>
                <View style={styles.projectStats}>
                    <View style={styles.projectStat}>
                        <Text style={styles.projectStatValue}>{projectStats.activeProjects}</Text>
                        <Text style={styles.projectStatLabel}>Activos</Text>
                    </View>
                    <View style={styles.projectStat}>
                        <Text style={styles.projectStatValue}>{projectStats.completedProjects}</Text>
                        <Text style={styles.projectStatLabel}>Completados</Text>
                    </View>
                    <View style={styles.projectStat}>
                        <Text style={styles.projectStatValue}>{projectStats.avgCompletionDays}</Text>
                        <Text style={styles.projectStatLabel}>Días Promedio</Text>
                    </View>
                </View>
                
                {Object.keys(projectStats.projectBreakdown).length > 0 && (
                    <View style={styles.projectBreakdown}>
                        {Object.entries(projectStats.projectBreakdown).map(([projectId, stats]) => {
                            const project = projects.find(p => p.id === projectId);
                            const projectName = project ? project.name : 'Proyecto desconocido';
                            const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
                            
                            return (
                                <View key={projectId} style={styles.projectItem}>
                                    <Text style={styles.projectName}>{projectName}</Text>
                                    <Text style={styles.projectStatsText}>
                                        {stats.completed}/{stats.total} completadas ({completionRate}%)
                                    </Text>
                                    <View style={styles.progressBar}>
                                        <View 
                                            style={[
                                                styles.progressFill, 
                                                { width: `${completionRate}%` }
                                            ]} 
                                        />
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1a1a1a',
        borderRadius: 16,
        padding: 20,
        margin: 20,
        marginTop: 10,
        maxHeight: screenHeight * 0.8,
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 15,
        textAlign: 'center',
    },
    efficiencyContainer: {
        alignItems: 'center',
        marginBottom: 15,
        padding: 15,
        backgroundColor: 'rgba(126, 211, 33, 0.1)',
        borderRadius: 12,
    },
    efficiencyLabel: {
        fontSize: 14,
        color: '#CCCCCC',
        marginBottom: 5,
    },
    efficiencyPercentage: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#7ED321',
        marginBottom: 5,
    },
    efficiencyDetails: {
        fontSize: 12,
        color: '#999999',
        textAlign: 'center',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#7ED321',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#CCCCCC',
        textAlign: 'center',
    },
    chartContainer: {
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: 16,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 12,
        textAlign: 'center',
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    emptyChartContainer: {
        alignItems: 'center',
        padding: 40,
        minHeight: 200,
        justifyContent: 'center',
    },
    emptyChartTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptyChartSubtitle: {
        fontSize: 14,
        color: '#999999',
        textAlign: 'center',
        lineHeight: 20,
    },
    priorityEfficiencyContainer: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 12,
    },
    priorityBars: {
        gap: 10,
    },
    priorityBar: {
        marginBottom: 8,
    },
    priorityHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    priorityLabel: {
        fontSize: 12,
        color: '#CCCCCC',
    },
    priorityPercentage: {
        fontSize: 12,
        color: '#7ED321',
        fontWeight: 'bold',
    },
    progressBar: {
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 2,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#7ED321',
        borderRadius: 3,
    },
    priorityDetails: {
        fontSize: 10,
        color: '#999999',
    },
    projectStatsContainer: {
        marginBottom: 20,
    },
    projectStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    projectStat: {
        alignItems: 'center',
        flex: 1,
    },
    projectStatValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#7ED321',
        marginBottom: 4,
    },
    projectStatLabel: {
        fontSize: 11,
        color: '#CCCCCC',
        textAlign: 'center',
    },
    projectBreakdown: {
        marginTop: 10,
    },
    projectItem: {
        marginBottom: 8,
    },
    projectName: {
        fontSize: 14,
        color: '#FFFFFF',
        marginBottom: 2,
    },
    projectStatsText: {
        fontSize: 12,
        color: '#999999',
        marginBottom: 4,
    },
});

export default ProgressChart;
