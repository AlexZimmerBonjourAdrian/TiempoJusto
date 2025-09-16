// ============================================================================
// HOOK DE ANALÍTICAS - TIEMPOJUSTO
// ============================================================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import { AnalyticsData, TimeRange, PeriodComparison, TimeSeriesData, ProductivityPattern, UseAnalyticsReturn } from '../../../shared/types';
import { useTasks } from '../../tasks/hooks/useTasks';
import { useProjects } from '../../projects/hooks/useProjects';
import { usePomodoro } from '../../pomodoro/hooks/usePomodoro';
import { debugUtils, productivityUtils, dateUtils } from '../../../shared/utils';

// ============================================================================
// HOOK PRINCIPAL DE ANALÍTICAS
// ============================================================================

export const useAnalytics = (): UseAnalyticsReturn => {
  // ============================================================================
  // ESTADO LOCAL
  // ============================================================================

  const [data, setData] = useState<AnalyticsData>({
    date: new Date(),
    tasks: {
      total: 0,
      completed: 0,
      pending: 0,
      inProgress: 0,
      cancelled: 0,
      completionRate: 0,
      averageCompletionTime: 0,
      priorityDistribution: { A: 0, B: 0, C: 0, D: 0 },
      statusDistribution: { pending: 0, in_progress: 0, completed: 0, cancelled: 0 },
      dailyCompletion: 0,
      weeklyCompletion: 0,
      monthlyCompletion: 0,
      productivityScore: 0
    },
    projects: {
      total: 0,
      active: 0,
      completed: 0,
      paused: 0,
      archived: 0,
      averageProgress: 0,
      totalEstimatedHours: 0,
      totalActualHours: 0,
      completionRate: 0,
      averageCompletionTime: 0,
      statusDistribution: { active: 0, completed: 0, paused: 0, archived: 0 },
      progressDistribution: { '0-25': 0, '26-50': 0, '51-75': 0, '76-100': 0 }
    },
    pomodoro: {
      totalSessions: 0,
      completedSessions: 0,
      totalWorkTime: 0,
      totalBreakTime: 0,
      averageSessionLength: 0,
      longestSession: 0,
      dailySessions: 0,
      weeklySessions: 0,
      monthlySessions: 0,
      productivityScore: 0,
      consistencyScore: 0,
      focusScore: 0,
      averageCyclesPerDay: 0,
      bestDay: '',
      bestWeek: '',
      bestMonth: ''
    },
    productivity: {
      overallScore: 0,
      dailyScore: 0,
      weeklyScore: 0,
      monthlyScore: 0,
      trend: 'stable',
      improvementRate: 0,
      consistencyScore: 0,
      efficiencyScore: 0,
      focusScore: 0,
      balanceScore: 0,
      peakHours: [],
      peakDays: [],
      productivityPatterns: []
    }
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Hooks de otros slices
  const { statistics: taskStats } = useTasks();
  const { statistics: projectStats } = useProjects();
  const { statistics: pomodoroStats } = usePomodoro();

  // ============================================================================
  // EFECTOS
  // ============================================================================

  useEffect(() => {
    calculateAnalytics();
  }, [taskStats, projectStats, pomodoroStats]);

  // ============================================================================
  // FUNCIONES DE CÁLCULO
  // ============================================================================

  const calculateAnalytics = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Calcular analíticas de tareas
      const taskAnalytics = {
        total: taskStats.total,
        completed: taskStats.completed,
        pending: taskStats.pending,
        inProgress: taskStats.inProgress,
        cancelled: taskStats.cancelled,
        completionRate: taskStats.completionRate,
        averageCompletionTime: taskStats.averageCompletionTime,
        priorityDistribution: taskStats.priorityDistribution,
        statusDistribution: taskStats.statusDistribution,
        dailyCompletion: taskStats.dailyCompletion[dateUtils.formatDate(new Date(), 'short')] || 0,
        weeklyCompletion: Object.values(taskStats.weeklyCompletion).reduce((sum, val) => sum + val, 0),
        monthlyCompletion: Object.values(taskStats.monthlyCompletion).reduce((sum, val) => sum + val, 0),
        productivityScore: productivityUtils.calculateProductivityScore(
          Object.entries(taskStats.priorityDistribution).flatMap(([priority, count]) => 
            Array(count).fill({ priority, status: 'completed' as const })
          )
        )
      };

      // Calcular analíticas de proyectos
      const projectAnalytics = {
        total: projectStats.totalProjects,
        active: projectStats.activeProjects,
        completed: projectStats.completedProjects,
        paused: projectStats.pausedProjects,
        archived: projectStats.archivedProjects,
        averageProgress: projectStats.averageProgress,
        totalEstimatedHours: projectStats.totalEstimatedHours,
        totalActualHours: projectStats.totalActualHours,
        completionRate: projectStats.completionRate,
        averageCompletionTime: projectStats.averageCompletionTime,
        statusDistribution: projectStats.statusDistribution,
        progressDistribution: projectStats.progressDistribution
      };

      // Calcular analíticas de Pomodoro
      const pomodoroAnalytics = {
        totalSessions: pomodoroStats.totalSessions,
        completedSessions: pomodoroStats.completedSessions,
        totalWorkTime: pomodoroStats.totalWorkTime,
        totalBreakTime: pomodoroStats.totalBreakTime,
        averageSessionLength: pomodoroStats.averageSessionLength,
        longestSession: pomodoroStats.longestSession,
        dailySessions: pomodoroStats.dailySessions[dateUtils.formatDate(new Date(), 'short')] || 0,
        weeklySessions: Object.values(pomodoroStats.weeklySessions).reduce((sum, val) => sum + val, 0),
        monthlySessions: Object.values(pomodoroStats.monthlySessions).reduce((sum, val) => sum + val, 0),
        productivityScore: pomodoroStats.productivityScore,
        consistencyScore: pomodoroStats.consistencyScore,
        focusScore: pomodoroStats.focusScore,
        averageCyclesPerDay: pomodoroStats.averageCyclesPerDay,
        bestDay: pomodoroStats.bestDay,
        bestWeek: pomodoroStats.bestWeek,
        bestMonth: pomodoroStats.bestMonth
      };

      // Calcular analíticas de productividad general
      const productivityAnalytics = {
        overallScore: Math.round((taskAnalytics.productivityScore + pomodoroAnalytics.productivityScore) / 2),
        dailyScore: taskAnalytics.productivityScore,
        weeklyScore: Math.round((taskAnalytics.weeklyCompletion + pomodoroAnalytics.weeklySessions) / 2),
        monthlyScore: Math.round((taskAnalytics.monthlyCompletion + pomodoroAnalytics.monthlySessions) / 2),
        trend: 'stable' as const, // TODO: Implementar cálculo de tendencia
        improvementRate: 0, // TODO: Implementar cálculo de mejora
        consistencyScore: pomodoroAnalytics.consistencyScore,
        efficiencyScore: taskAnalytics.completionRate,
        focusScore: pomodoroAnalytics.focusScore,
        balanceScore: 75, // TODO: Implementar cálculo de balance
        peakHours: [], // TODO: Implementar análisis de horas pico
        peakDays: [], // TODO: Implementar análisis de días pico
        productivityPatterns: [] // TODO: Implementar patrones de productividad
      };

      const newData: AnalyticsData = {
        date: new Date(),
        tasks: taskAnalytics,
        projects: projectAnalytics,
        pomodoro: pomodoroAnalytics,
        productivity: productivityAnalytics
      };

      setData(newData);
      debugUtils.log('Analytics calculated successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error calculating analytics';
      setError(errorMessage);
      debugUtils.error('Error calculating analytics', err);
    } finally {
      setLoading(false);
    }
  }, [taskStats, projectStats, pomodoroStats]);

  // ============================================================================
  // FUNCIONES DE CONSULTA
  // ============================================================================

  const getDataByDate = useCallback(async (date: Date): Promise<AnalyticsData> => {
    // TODO: Implementar obtención de datos por fecha específica
    return data;
  }, [data]);

  const getDataByRange = useCallback(async (range: TimeRange): Promise<AnalyticsData[]> => {
    // TODO: Implementar obtención de datos por rango de fechas
    return [data];
  }, [data]);

  const getComparison = useCallback(async (current: Date, previous: Date): Promise<PeriodComparison> => {
    // TODO: Implementar comparación entre períodos
    return {
      period: 'daily',
      current: data,
      previous: data,
      comparison: {
        tasks: { current: 0, previous: 0, change: 0, trend: 'stable', significance: 'low' },
        projects: { current: 0, previous: 0, change: 0, trend: 'stable', significance: 'low' },
        pomodoro: { current: 0, previous: 0, change: 0, trend: 'stable', significance: 'low' },
        productivity: { current: 0, previous: 0, change: 0, trend: 'stable', significance: 'low' }
      }
    };
  }, [data]);

  const getTrends = useCallback(async (range: TimeRange): Promise<TimeSeriesData[]> => {
    // TODO: Implementar obtención de tendencias
    return [];
  }, []);

  const getProductivityPatterns = useCallback(async (): Promise<ProductivityPattern[]> => {
    // TODO: Implementar obtención de patrones de productividad
    return [];
  }, []);

  const exportData = useCallback(async (range: TimeRange): Promise<AnalyticsData[]> => {
    // TODO: Implementar exportación de datos
    return [data];
  }, [data]);

  const refreshData = useCallback(async (): Promise<void> => {
    await calculateAnalytics();
  }, [calculateAnalytics]);

  // ============================================================================
  // RETORNO DEL HOOK
  // ============================================================================

  return {
    data,
    loading,
    error,
    getDataByDate,
    getDataByRange,
    getComparison,
    getTrends,
    getProductivityPatterns,
    exportData,
    refreshData
  };
};
