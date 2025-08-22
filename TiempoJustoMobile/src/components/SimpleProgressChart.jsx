import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const SimpleProgressChart = ({ data, timeRange = 'month' }) => {
    if (!data || data.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>No hay datos para mostrar</Text>
                <Text style={styles.emptySubtitle}>
                    {timeRange === 'month' 
                        ? 'Comienza a crear tareas este mes para ver tu progreso'
                        : 'Comienza a crear tareas esta semana para ver tu progreso'
                    }
                </Text>
            </View>
        );
    }

    const maxValue = Math.max(...data.map(item => item.completed), 1);
    const maxHeight = Math.min(screenHeight * 0.25, 150);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {timeRange === 'month' ? 'Progreso Mensual' : 'Progreso Semanal'}
            </Text>
            
            <View style={styles.chartContainer}>
                <View style={styles.barsContainer}>
                    {data.map((item, index) => {
                        const height = (item.completed / maxValue) * maxHeight;
                        const isToday = new Date(item.date).toDateString() === new Date().toDateString();
                        
                        return (
                            <View key={index} style={styles.barWrapper}>
                                <View style={styles.barContainer}>
                                    <View 
                                        style={[
                                            styles.bar, 
                                            { 
                                                height: Math.max(height, 4),
                                                backgroundColor: item.completed > 0 
                                                    ? (isToday ? '#7ED321' : '#10b981')
                                                    : 'rgba(255,255,255,0.1)'
                                            }
                                        ]} 
                                    />
                                </View>
                                <Text style={styles.barLabel}>
                                    {timeRange === 'month' 
                                        ? new Date(item.date).getDate()
                                        : new Date(item.date).toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase()
                                    }
                                </Text>
                                <Text style={styles.barValue}>{item.completed}</Text>
                            </View>
                        );
                    })}
                </View>
                
                <View style={styles.legend}>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: '#10b981' }]} />
                        <Text style={styles.legendText}>Completadas</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: '#7ED321' }]} />
                        <Text style={styles.legendText}>Hoy</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 16,
        textAlign: 'center',
    },
    chartContainer: {
        alignItems: 'center',
    },
    barsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        width: '100%',
        height: Math.min(screenHeight * 0.25, 150),
        paddingBottom: 30,
    },
    barWrapper: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 2,
    },
    barContainer: {
        height: '100%',
        width: Math.max(screenWidth * 0.02, 8),
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
        justifyContent: 'flex-end',
    },
    bar: {
        width: '100%',
        borderRadius: 4,
        minHeight: 4,
    },
    barLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 10,
        fontWeight: '500',
        marginBottom: 2,
        textAlign: 'center',
    },
    barValue: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 9,
        fontWeight: '600',
        textAlign: 'center',
    },
    legend: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginTop: 12,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    legendDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    legendText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        fontWeight: '500',
    },
    emptyContainer: {
        alignItems: 'center',
        padding: 40,
        minHeight: 150,
        justifyContent: 'center',
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#999999',
        textAlign: 'center',
        lineHeight: 20,
    },
});

export default SimpleProgressChart;
