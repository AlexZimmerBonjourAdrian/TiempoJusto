import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const ProgressChart = ({ tasks, timeRange = 'month' }) => {
    // Calcular datos de progreso
    const chartData = useMemo(() => {
        const now = new Date();
        const data = [];
        
        if (timeRange === 'month') {
            // Últimos 30 días
            for (let i = 29; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                
                // Contar tareas completadas en este día
                const completedTasks = tasks.filter(task => {
                    if (!task.done) return false;
                    
                    // Si la tarea tiene completedAt, usar esa fecha
                    if (task.completedAt) {
                        return task.completedAt.startsWith(dateStr);
                    }
                    
                    // Si no tiene completedAt pero tiene createdAt, usar createdAt
                    if (task.createdAt) {
                        return task.createdAt.startsWith(dateStr);
                    }
                    
                    // Fallback: asumir que se completó hoy
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
                    
                    // Si la tarea tiene completedAt, usar esa fecha
                    if (task.completedAt) {
                        return task.completedAt.startsWith(dateStr);
                    }
                    
                    // Si no tiene completedAt pero tiene createdAt, usar createdAt
                    if (task.createdAt) {
                        return task.createdAt.startsWith(dateStr);
                    }
                    
                    // Fallback: asumir que se completó hoy
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

    // Preparar datos para la gráfica
    const chartConfig = {
        backgroundColor: '#1a1a1a',
        backgroundGradientFrom: '#1a1a1a',
        backgroundGradientTo: '#1a1a1a',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(126, 211, 33, ${opacity})`, // Color verde de TiempoJusto
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
            {/* Título y estadísticas */}
            <View style={styles.header}>
                <Text style={styles.title}>Progreso de Tareas</Text>
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{totalCompleted}</Text>
                        <Text style={styles.statLabel}>Total Completadas</Text>
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

            {/* Gráfica de barras */}
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

            {/* Información adicional */}
            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>
                    {timeRange === 'month' 
                        ? 'Últimos 30 días'
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
