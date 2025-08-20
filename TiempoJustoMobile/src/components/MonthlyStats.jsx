import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';

export default function MonthlyStats({ tasks, projects, projectIdToProject, dailyLogs }) {
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const monthlyStats = useMemo(() => {
        const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

        // Helper para estructura vacía
        const emptyStats = {
            totalTasks: 0,
            completedTasks: 0,
            completionRate: 0,
            productivityScore: 0,
            averageDailyTasks: 0,
            bestDay: null,
            priorityBreakdown: { A: 0, B: 0, C: 0, D: 0 },
            weeklyProgress: [],
            dailyProgress: []
        };

        // Si hay registros diarios, priorizarlos para estadísticas mensuales
        const monthLogs = (dailyLogs || []).filter((log) => {
            if (!log?.date) return false;
            const d = new Date(log.date);
            return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
        });

        if (monthLogs.length > 0) {
            const sum = monthLogs.reduce((acc, log) => {
                acc.totalTasks += log.totalTasks || 0;
                acc.completedTasks += log.completedTasks || 0;
                acc.productivityScore += log.productivityScore || 0;
                // Sumar desglose de prioridades
                const pb = log.priorityBreakdown || {};
                acc.priorityBreakdown.A += pb.A || 0;
                acc.priorityBreakdown.B += pb.B || 0;
                acc.priorityBreakdown.C += pb.C || 0;
                acc.priorityBreakdown.D += pb.D || 0;
                return acc;
            }, { totalTasks: 0, completedTasks: 0, productivityScore: 0, priorityBreakdown: { A: 0, B: 0, C: 0, D: 0 } });

            const completionRate = sum.totalTasks > 0 ? Math.round((sum.completedTasks / sum.totalTasks) * 100) : 0;
            const averageDailyTasks = Math.round((sum.totalTasks / daysInMonth) * 10) / 10;

            // Progreso diario últimos 7 días (usar logs cuando haya, completar con ceros)
            const today = new Date(selectedYear, selectedMonth, new Date().getDate());
            const dailyProgress = [];
            for (let i = 6; i >= 0; i--) {
                const date = new Date(selectedYear, selectedMonth, new Date().getDate());
                date.setDate(date.getDate() - i);
                const dateKey = date.toISOString().split('T')[0];
                const log = monthLogs.find((l) => l.date === dateKey);
                const total = log?.totalTasks || 0;
                const completed = log?.completedTasks || 0;
                const rate = total > 0 ? (completed / total) * 100 : 0;
                dailyProgress.push({
                    date: date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }),
                    total,
                    completed,
                    rate,
                });
            }

            // Progreso semanal (semana 1..5) basado en logs del mes
            const weeklyProgress = [];
            for (let week = 1; week <= 5; week++) {
                const weekStart = (week - 1) * 7 + 1;
                const weekEnd = Math.min(week * 7, daysInMonth);
                let total = 0;
                let completed = 0;
                for (let day = weekStart; day <= weekEnd; day++) {
                    const dateKey = new Date(selectedYear, selectedMonth, day).toISOString().split('T')[0];
                    const log = monthLogs.find((l) => l.date === dateKey);
                    total += log?.totalTasks || 0;
                    completed += log?.completedTasks || 0;
                }
                weeklyProgress.push({
                    week,
                    total,
                    completed,
                    rate: total > 0 ? (completed / total) * 100 : 0,
                });
            }

            // Mejor día del mes por completadas
            let bestDay = null;
            let bestScore = -1;
            for (const log of monthLogs) {
                const score = (log.completedTasks || 0) * 10;
                if (score > bestScore) {
                    bestScore = score;
                    bestDay = new Date(log.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
                }
            }

            return {
                totalTasks: sum.totalTasks,
                completedTasks: sum.completedTasks,
                completionRate,
                productivityScore: sum.productivityScore,
                averageDailyTasks,
                bestDay,
                priorityBreakdown: sum.priorityBreakdown,
                weeklyProgress,
                dailyProgress,
            };
        }

        // Filtrar tareas del mes seleccionado
        const monthTasks = tasks.filter(task => {
            if (!task.createdAt) return false;
            const taskDate = new Date(task.createdAt);
            return taskDate.getMonth() === selectedMonth && taskDate.getFullYear() === selectedYear;
        });

        if (!monthTasks || monthTasks.length === 0) return emptyStats;

        const completedTasks = monthTasks.filter(task => task.done);
        const completionRate = monthTasks.length > 0 ? (completedTasks.length / monthTasks.length) * 100 : 0;

        // Calcular score de productividad
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

        // Desglose por prioridad
        const priorityBreakdown = { A: 0, B: 0, C: 0, D: 0 };
        monthTasks.forEach(task => {
            const priority = task.priority || 'C';
            priorityBreakdown[priority]++;
        });

        // Progreso semanal
        const weeklyProgress = [];
        
        for (let week = 1; week <= 5; week++) {
            const weekStart = (week - 1) * 7 + 1;
            const weekEnd = Math.min(week * 7, daysInMonth);
            let weekTasks = 0;
            let weekCompleted = 0;

            for (let day = weekStart; day <= weekEnd; day++) {
                const dayTasks = monthTasks.filter(task => {
                    const taskDate = new Date(task.createdAt);
                    return taskDate.getDate() === day;
                });
                weekTasks += dayTasks.length;
                weekCompleted += dayTasks.filter(task => task.done).length;
            }

            weeklyProgress.push({
                week,
                total: weekTasks,
                completed: weekCompleted,
                rate: weekTasks > 0 ? (weekCompleted / weekTasks) * 100 : 0
            });
        }

        // Progreso diario (últimos 7 días)
        const dailyProgress = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            
            const dayTasks = monthTasks.filter(task => {
                const taskDate = new Date(task.createdAt);
                return taskDate.toDateString() === date.toDateString();
            });
            
            dailyProgress.push({
                date: date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }),
                total: dayTasks.length,
                completed: dayTasks.filter(task => task.done).length,
                rate: dayTasks.length > 0 ? (dayTasks.filter(task => task.done).length / dayTasks.length) * 100 : 0
            });
        }

        // Mejor día del mes
        const dailyStats = {};
        monthTasks.forEach(task => {
            const taskDate = new Date(task.createdAt);
            const dateKey = taskDate.toDateString();
            if (!dailyStats[dateKey]) {
                dailyStats[dateKey] = { total: 0, completed: 0 };
            }
            dailyStats[dateKey].total++;
            if (task.done) dailyStats[dateKey].completed++;
        });

        let bestDay = null;
        let bestScore = 0;
        Object.entries(dailyStats).forEach(([date, stats]) => {
            const score = stats.completed * 10; // Score simple
            if (score > bestScore) {
                bestScore = score;
                bestDay = new Date(date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
            }
        });

        return {
            totalTasks: monthTasks.length,
            completedTasks: completedTasks.length,
            completionRate: Math.round(completionRate),
            productivityScore,
            averageDailyTasks: Math.round(monthTasks.length / daysInMonth * 10) / 10,
            bestDay,
            priorityBreakdown,
            weeklyProgress,
            dailyProgress
        };
    }, [tasks, selectedMonth, selectedYear]);

    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const years = [];
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 2; i <= currentYear; i++) {
        years.push(i);
    }

    const getProgressColor = (rate) => {
        if (rate >= 80) return '#22c55e';
        if (rate >= 60) return '#eab308';
        if (rate >= 40) return '#f97316';
        return '#ef4444';
    };

    const getProductivityLevel = (score) => {
        if (score >= 100) return { level: 'Excelente', color: '#22c55e' };
        if (score >= 70) return { level: 'Muy Bueno', color: '#eab308' };
        if (score >= 40) return { level: 'Bueno', color: '#f97316' };
        return { level: 'En Progreso', color: '#6b7280' };
    };

    const productivityLevel = getProductivityLevel(monthlyStats.productivityScore);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Progreso Mensual</Text>
                <Text style={styles.subtitle}>
                    {months[selectedMonth]} {selectedYear}
                </Text>
            </View>

            {/* Selectores de mes y año */}
            <View style={styles.selectors}>
                <View style={styles.selector}>
                    <Text style={styles.selectorLabel}>Mes:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {months.map((month, index) => (
                            <Pressable
                                key={month}
                                onPress={() => setSelectedMonth(index)}
                                style={[styles.selectorButton, selectedMonth === index && styles.selectorButtonActive]}
                            >
                                <Text style={[styles.selectorButtonText, selectedMonth === index && styles.selectorButtonTextActive]}>
                                    {month}
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.selector}>
                    <Text style={styles.selectorLabel}>Año:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {years.map((year) => (
                            <Pressable
                                key={year}
                                onPress={() => setSelectedYear(year)}
                                style={[styles.selectorButton, selectedYear === year && styles.selectorButtonActive]}
                            >
                                <Text style={[styles.selectorButtonText, selectedYear === year && styles.selectorButtonTextActive]}>
                                    {year}
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>
            </View>

            {/* Estadísticas principales */}
            <View style={styles.mainStats}>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{monthlyStats.totalTasks}</Text>
                    <Text style={styles.statLabel}>Total Tareas</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{monthlyStats.completedTasks}</Text>
                    <Text style={styles.statLabel}>Completadas</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{monthlyStats.completionRate}%</Text>
                    <Text style={styles.statLabel}>Tasa de Éxito</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={[styles.statNumber, { color: productivityLevel.color }]}>
                        {monthlyStats.productivityScore}
                    </Text>
                    <Text style={styles.statLabel}>{productivityLevel.level}</Text>
                </View>
            </View>

            {/* Progreso diario (últimos 7 días) */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Últimos 7 Días</Text>
                <View style={styles.dailyProgress}>
                    {monthlyStats.dailyProgress.map((day, index) => (
                        <View key={index} style={styles.dayCard}>
                            <Text style={styles.dayLabel}>{day.date}</Text>
                            <View style={styles.progressBar}>
                                <View 
                                    style={[
                                        styles.progressFill, 
                                        { 
                                            width: `${day.rate}%`,
                                            backgroundColor: getProgressColor(day.rate)
                                        }
                                    ]} 
                                />
                            </View>
                            <Text style={styles.dayStats}>
                                {day.completed}/{day.total}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Progreso semanal */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Progreso Semanal</Text>
                <View style={styles.weeklyProgress}>
                    {monthlyStats.weeklyProgress.map((week, index) => (
                        <View key={index} style={styles.weekCard}>
                            <Text style={styles.weekLabel}>Semana {week.week}</Text>
                            <Text style={styles.weekStats}>
                                {week.completed}/{week.total} tareas
                            </Text>
                            <Text style={[styles.weekRate, { color: getProgressColor(week.rate) }]}>
                                {Math.round(week.rate)}%
                            </Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Desglose por prioridad */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Prioridades del Mes</Text>
                <View style={styles.priorityGrid}>
                    {Object.entries(monthlyStats.priorityBreakdown).map(([priority, count]) => (
                        <View key={priority} style={styles.priorityCard}>
                            <Text style={[styles.priorityLetter, styles[`priority${priority}`]]}>
                                {priority}
                            </Text>
                            <Text style={styles.priorityCount}>{count}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Información adicional */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Resumen</Text>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryText}>
                        Promedio diario: {monthlyStats.averageDailyTasks} tareas
                    </Text>
                    {monthlyStats.bestDay && (
                        <Text style={styles.summaryText}>
                            Mejor día: {monthlyStats.bestDay}
                        </Text>
                    )}
                    <Text style={styles.summaryText}>
                        Nivel: {productivityLevel.level}
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: 'white',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.7)',
    },
    selectors: {
        marginBottom: 20,
    },
    selector: {
        marginBottom: 12,
    },
    selectorLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: 'white',
        marginBottom: 8,
    },
    selectorButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.08)',
        marginRight: 8,
    },
    selectorButtonActive: {
        backgroundColor: '#22c55e',
    },
    selectorButtonText: {
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '600',
    },
    selectorButtonTextActive: {
        color: 'white',
        fontWeight: '700',
    },
    mainStats: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: '700',
        color: '#22c55e',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
        marginBottom: 12,
    },
    dailyProgress: {
        gap: 8,
    },
    dayCard: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: 12,
    },
    dayLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: 'white',
        marginBottom: 8,
    },
    progressBar: {
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 4,
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    dayStats: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
    },
    weeklyProgress: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    weekCard: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
    },
    weekLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: 'white',
        marginBottom: 4,
    },
    weekStats: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 4,
    },
    weekRate: {
        fontSize: 16,
        fontWeight: '700',
    },
    priorityGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    priorityCard: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    priorityLetter: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 8,
    },
    priorityA: { color: '#ef4444' },
    priorityB: { color: '#f97316' },
    priorityC: { color: '#eab308' },
    priorityD: { color: '#6b7280' },
    priorityCount: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
    summaryCard: {
        backgroundColor: 'rgba(34,197,94,0.1)',
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#22c55e',
    },
    summaryText: {
        fontSize: 14,
        color: 'white',
        marginBottom: 8,
        lineHeight: 20,
    },
});
