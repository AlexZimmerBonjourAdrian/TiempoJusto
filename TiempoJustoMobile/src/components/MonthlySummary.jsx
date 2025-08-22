import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const MonthlySummary = ({ tasks, projects, timeRange = 'month' }) => {
    // Calcular datos del mes actual
    const monthlyData = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        // Filtrar tareas del mes actual
        const monthTasks = tasks.filter(task => {
            const taskDate = task.completedAt ? new Date(task.completedAt) : new Date(task.createdAt);
            return taskDate.getMonth() === currentMonth && taskDate.getFullYear() === currentYear;
        });

        // Calcular métricas de eficiencia
        const completedTasks = monthTasks.filter(task => task.done);
        const totalTasks = monthTasks.length;
        
        // Calcular puntuación de eficiencia basada en prioridades
        let efficiencyScore = 0;
        let maxPossibleScore = 0;
        
        completedTasks.forEach(task => {
            const priority = task.priority || 'C';
            const priorityScore = priority === 'A' ? 10 : priority === 'B' ? 7 : priority === 'C' ? 4 : 1;
            efficiencyScore += priorityScore;
        });

        // Calcular máximo posible (asumiendo que todas las tareas se completan)
        monthTasks.forEach(task => {
            const priority = task.priority || 'C';
            const priorityScore = priority === 'A' ? 10 : priority === 'B' ? 7 : priority === 'C' ? 4 : 1;
            maxPossibleScore += priorityScore;
        });

        const efficiencyPercentage = maxPossibleScore > 0 ? Math.round((efficiencyScore / maxPossibleScore) * 100) : 0;

        // Proyectos activos y completados
        const activeProjects = projects.filter(p => !p.completedAt);
        const completedProjects = projects.filter(p => p.completedAt);

        // Proyectos del mes actual
        const monthProjects = projects.filter(project => {
            const projectDate = project.completedAt ? new Date(project.completedAt) : new Date(project.createdAt);
            return projectDate.getMonth() === currentMonth && projectDate.getFullYear() === currentYear;
        });

        return {
            totalTasks,
            completedTasks: completedTasks.length,
            efficiencyScore,
            efficiencyPercentage,
            activeProjects: activeProjects.length,
            completedProjects: completedProjects.length,
            monthProjects: monthProjects.length,
            completionRate: totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0
        };
    }, [tasks, projects, timeRange]);

    // Preparar datos para la gráfica de progreso diario
    const chartData = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        
        const data = [];
        
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            const dayTasks = tasks.filter(task => {
                if (!task.done) return false;
                
                if (task.completedAt) {
                    return task.completedAt.startsWith(dateStr);
                }
                
                if (task.createdAt) {
                    return task.createdAt.startsWith(dateStr);
                }
                
                return false;
            }).length;
            
            data.push({
                day,
                completed: dayTasks
            });
        }
        
        return data;
    }, [tasks]);

    // Configuración de la gráfica
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
    };

    const barData = {
        labels: chartData.map(item => String(item.day)),
        datasets: [{
            data: chartData.map(item => item.completed)
        }]
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Título del mes */}
            <View style={styles.header}>
                <Text style={styles.title}>
                    Resumen de {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                </Text>
            </View>

            {/* Métricas principales */}
            <View style={styles.metricsContainer}>
                <View style={styles.metricRow}>
                    <View style={styles.metricCard}>
                        <Text style={styles.metricValue}>{monthlyData.totalTasks}</Text>
                        <Text style={styles.metricLabel}>Total Tareas</Text>
                    </View>
                    <View style={styles.metricCard}>
                        <Text style={styles.metricValue}>{monthlyData.completedTasks}</Text>
                        <Text style={styles.metricLabel}>Completadas</Text>
                    </View>
                    <View style={styles.metricCard}>
                        <Text style={styles.metricValue}>{monthlyData.completionRate}%</Text>
                        <Text style={styles.metricLabel}>Tasa de Completado</Text>
                    </View>
                </View>

                <View style={styles.metricRow}>
                    <View style={styles.metricCard}>
                        <Text style={styles.metricValue}>{monthlyData.efficiencyPercentage}%</Text>
                        <Text style={styles.metricLabel}>Eficiencia</Text>
                    </View>
                    <View style={styles.metricCard}>
                        <Text style={styles.metricValue}>{monthlyData.activeProjects}</Text>
                        <Text style={styles.metricLabel}>Proyectos Activos</Text>
                    </View>
                    <View style={styles.metricCard}>
                        <Text style={styles.metricValue}>{monthlyData.completedProjects}</Text>
                        <Text style={styles.metricLabel}>Proyectos Completados</Text>
                    </View>
                </View>
            </View>

            {/* Gráfica de progreso diario */}
            <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Progreso Diario del Mes</Text>
                <BarChart
                    data={barData}
                    width={screenWidth - 40}
                    height={200}
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
                />
            </View>

            {/* Información de eficiencia */}
            <View style={styles.efficiencyContainer}>
                <Text style={styles.efficiencyTitle}>Análisis de Eficiencia</Text>
                <View style={styles.efficiencyBar}>
                    <View 
                        style={[
                            styles.efficiencyFill, 
                            { width: `${monthlyData.efficiencyPercentage}%` }
                        ]} 
                    />
                </View>
                <Text style={styles.efficiencyText}>
                    Puntuación: {monthlyData.efficiencyScore} / {monthlyData.totalTasks * 7} 
                    (basado en prioridades A=10, B=7, C=4, D=1)
                </Text>
            </View>

            {/* Resumen de proyectos */}
            <View style={styles.projectsContainer}>
                <Text style={styles.projectsTitle}>Estado de Proyectos</Text>
                <View style={styles.projectStats}>
                    <View style={styles.projectStat}>
                        <Text style={styles.projectStatValue}>{monthlyData.activeProjects}</Text>
                        <Text style={styles.projectStatLabel}>En Progreso</Text>
                    </View>
                    <View style={styles.projectStat}>
                        <Text style={styles.projectStatValue}>{monthlyData.completedProjects}</Text>
                        <Text style={styles.projectStatLabel}>Completados</Text>
                    </View>
                    <View style={styles.projectStat}>
                        <Text style={styles.projectStatValue}>
                            {monthlyData.activeProjects + monthlyData.completedProjects}
                        </Text>
                        <Text style={styles.projectStatLabel}>Total</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
    },
    header: {
        padding: 20,
        paddingBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    metricsContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    metricRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    metricCard: {
        flex: 1,
        backgroundColor: '#2a2a2a',
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    metricValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#7ED321',
        marginBottom: 5,
    },
    metricLabel: {
        fontSize: 12,
        color: '#CCCCCC',
        textAlign: 'center',
    },
    chartContainer: {
        backgroundColor: '#2a2a2a',
        margin: 20,
        borderRadius: 16,
        padding: 20,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 15,
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    efficiencyContainer: {
        backgroundColor: '#2a2a2a',
        margin: 20,
        borderRadius: 16,
        padding: 20,
    },
    efficiencyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 15,
    },
    efficiencyBar: {
        height: 20,
        backgroundColor: '#3a3a3a',
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 10,
    },
    efficiencyFill: {
        height: '100%',
        backgroundColor: '#7ED321',
        borderRadius: 10,
    },
    efficiencyText: {
        fontSize: 14,
        color: '#CCCCCC',
        textAlign: 'center',
    },
    projectsContainer: {
        backgroundColor: '#2a2a2a',
        margin: 20,
        borderRadius: 16,
        padding: 20,
        marginBottom: 40,
    },
    projectsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 15,
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
        marginBottom: 5,
    },
    projectStatLabel: {
        fontSize: 12,
        color: '#CCCCCC',
        textAlign: 'center',
    },
});

export default MonthlySummary;
