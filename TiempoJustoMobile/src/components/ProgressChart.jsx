import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const ProgressChart = ({ tasks, projects, timeRange = 'month' }) => {
    // Calcular datos de progreso
    const chartData = useMemo(() => {
        const now = new Date();
        const data = [];
        
        if (timeRange === 'month') {
            // Últimos 30 días o hasta el fin del mes actual
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();
            const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
            const startDay = Math.max(1, now.getDate() - 29);
            
            for (let day = startDay; day <= daysInMonth; day++) {
                const date = new Date(currentYear, currentMonth, day);
                const dateStr = date.toISOString().split('T')[0];
                
                // Contar tareas completadas en este día
                const completedTasks = tasks.filter(task => {
                    if (!task.done) return false;
                    
                    if (task.completedAt) {
                        return task.completedAt.startsWith(dateStr);
                    }
                    
                    if (task.createdAt) {
                        return task.createdAt.startsWith(dateStr);
                    }
                    
                    return dateStr === now.toISOString().split('T')[0];
                }).length;
                
                data.push({
                    date: dateStr,
                    completed: completedTasks
                });
            }
        } else if (timeRange === 'week') {
            // Últimos 7 días
            for (let i = 6; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                
                const completedTasks = tasks.filter(task => {
                    if (!task.done) return false;
                    
                    if (task.completedAt) {
                        return task.completedAt.startsWith(dateStr);
                    }
                    
                    if (task.createdAt) {
                        return task.createdAt.startsWith(dateStr);
                    }
                    
                    return dateStr === now.toISOString().split('T')[0];
                }).length;
                
                data.push({
                    date: dateStr,
                    completed: completedTasks
                });
            }
        }
        
        return data;
    }, [tasks, timeRange]);

    // Calcular estadísticas de eficiencia
    const efficiencyStats = useMemo(() => {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.done).length;
        const efficiencyPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        
        // Calcular eficiencia por prioridad
        const priorityEfficiency = {
            A: { total: 0, completed: 0, percentage: 0 },
            B: { total: 0, completed: 0, percentage: 0 },
            C: { total: 0, completed: 0, percentage: 0 },
            D: { total: 0, completed: 0, percentage: 0 }
        };
        
        tasks.forEach(task => {
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
    }, [tasks]);

    // Calcular estadísticas de proyectos
    const projectStats = useMemo(() => {
        const activeProjects = projects.filter(project => !project.completedAt);
        const completedProjects = projects.filter(project => project.completedAt);
        
        // Calcular tiempo promedio de completado de proyectos
        const projectCompletionTimes = completedProjects.map(project => {
            if (project.createdAt && project.completedAt) {
                const start = new Date(project.createdAt);
                const end = new Date(project.completedAt);
                return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            }
            return 0;
        }).filter(days => days > 0);
        
        const avgCompletionDays = projectCompletionTimes.length > 0 
            ? Math.round(projectCompletionTimes.reduce((sum, days) => sum + days, 0) / projectCompletionTimes.length)
            : 0;
        
        return {
            activeProjects: activeProjects.length,
            completedProjects: completedProjects.length,
            totalProjects: projects.length,
            avgCompletionDays
        };
    }, [projects]);

    // Preparar datos para la gráfica
    const chartConfig = {
        backgroundColor: '#1a1a1a',
        backgroundGradientFrom: '#1a1a1a',
        backgroundGradientTo: '#1a1a1a',
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
    };

    // Calcular estadísticas
    const totalCompleted = useMemo(() => {
        return chartData.reduce((sum, item) => sum + item.completed, 0);
    }, [chartData]);

    const averageCompleted = useMemo(() => {
        return chartData.length > 0 ? Math.round(totalCompleted / chartData.length) : 0;
    }, [totalCompleted, chartData]);

    const maxCompleted = useMemo(() => {
        return Math.max(...chartData.map(item => item.completed));
    }, [chartData]);

    // Preparar datos para BarChart
    const barData = {
        labels: chartData.map(item => {
            const date = new Date(item.date);
            return timeRange === 'month' 
                ? `${date.getDate()}/${date.getMonth() + 1}`
                : date.toLocaleDateString('es-ES', { weekday: 'short' });
        }),
        datasets: [{
            data: chartData.map(item => item.completed)
        }]
    };

    return (
        <View style={styles.container}>
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
                        <Text style={styles.statValue}>{averageCompleted}</Text>
                        <Text style={styles.statLabel}>Promedio/Día</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{maxCompleted}</Text>
                        <Text style={styles.statLabel}>Máximo/Día</Text>
                    </View>
                </View>
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
            </View>

            <View style={styles.chartContainer}>
                <BarChart
                    data={barData}
                    width={screenWidth - 40}
                    height={220}
                    yAxisLabel=""
                    chartConfig={chartConfig}
                    style={styles.chart}
                    showValuesOnTopOfBars={true}
                    fromZero={true}
                    withInnerLines={false}
                    withVerticalLabels={true}
                    withHorizontalLabels={true}
                    withDots={false}
                    withShadow={false}
                    withScrollableDot={false}
                />
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>
                    {timeRange === 'month' 
                        ? 'Progreso del mes actual'
                        : 'Últimos 7 días'
                    }
                </Text>
                <Text style={styles.infoSubtext}>
                    Tareas completadas por día
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1a1a1a',
        borderRadius: 16,
        padding: 20,
        margin: 20,
        marginTop: 10,
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
    chartContainer: {
        alignItems: 'center',
        marginBottom: 15,
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    infoContainer: {
        alignItems: 'center',
    },
    infoText: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: '500',
        marginBottom: 4,
    },
    infoSubtext: {
        fontSize: 12,
        color: '#999999',
    },
});

export default ProgressChart;
