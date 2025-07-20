'use client'

import React, { useState, useEffect } from 'react';
import DailyLog from './DailyLog';
import LogTask from './LogTask';
import MonthlyProgress from './MonthlyProgress';
import AdvancedStats from './AdvancedStats';
import SaveStatusIndicator from '../../ui/SaveStatusIndicator';
import { useAutoSave, useDataSync } from '../../../hooks/useAutoSave';

function AnalyticsView() {
  const [tasks, setTasks] = useState([]);
  const [dailyLogs, setDailyLogs] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalTasks: 0,
    completedTasks: 0,
    productivityRate: 0,
    weeklyProgress: [],
    dailyStats: []
  });
  const [saveStatus, setSaveStatus] = useState('idle');

  // Usar el nuevo sistema de guardado automático para tareas
  const { loadData: loadTasks } = useAutoSave('tasks', tasks, {
    onSaveSuccess: () => setSaveStatus('saved'),
    onSaveError: () => setSaveStatus('error'),
    onLoadSuccess: (loadedTasks) => {
      setTasks(loadedTasks || []);
      setSaveStatus('idle');
    }
  });

  // Usar el nuevo sistema de guardado automático para logs diarios
  const { loadData: loadDailyLogs } = useAutoSave('dailyLogs', dailyLogs, {
    onLoadSuccess: (loadedLogs) => {
      if (loadedLogs) {
        const sortedLogs = loadedLogs.sort((a, b) => new Date(b.date) - new Date(a.date));
        setDailyLogs(sortedLogs);
      }
    }
  });

  // Sincronizar datos entre pestañas
  useDataSync('tasks', tasks, (newTasks) => {
    setTasks(newTasks);
  });

  useDataSync('dailyLogs', dailyLogs, (newLogs) => {
    setDailyLogs(newLogs);
  });

  // Cargar datos al montar el componente
  useEffect(() => {
    loadTasks();
    loadDailyLogs();
  }, []);

  useEffect(() => {
    // Calculate analytics from daily logs
    if (dailyLogs.length > 0) {
      const totalTasks = dailyLogs.reduce((sum, log) => sum + log.totalTasks, 0);
      const completedTasks = dailyLogs.reduce((sum, log) => sum + log.completedTasks, 0);
      const productivityRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

      // Calculate weekly progress (last 4 weeks)
      const weeklyProgress = [];
      const now = new Date();
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - (now.getDay() + 7 * i));
        weekStart.setHours(0, 0, 0, 0);

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);

        const weekLogs = dailyLogs.filter(log => {
          const logDate = new Date(log.date);
          return logDate >= weekStart && logDate <= weekEnd;
        });

        const weekTotal = weekLogs.reduce((sum, log) => sum + log.totalTasks, 0);
        const weekCompleted = weekLogs.reduce((sum, log) => sum + log.completedTasks, 0);
        const weekRate = weekTotal > 0 ? (weekCompleted / weekTotal) * 100 : 0;

        weeklyProgress.push({
          week: `Semana ${4 - i}`,
          total: weekTotal,
          completed: weekCompleted,
          rate: weekRate
        });
      }

      // Calculate daily stats (last 7 days)
      const dailyStats = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        const dayLog = dailyLogs.find(log => log.date === dateStr);
        dailyStats.push({
          date: dateStr,
          total: dayLog ? dayLog.totalTasks : 0,
          completed: dayLog ? dayLog.completedTasks : 0,
          rate: dayLog ? dayLog.productivityRate : 0
        });
      }

      setAnalytics({
        totalTasks,
        completedTasks,
        productivityRate,
        weeklyProgress,
        dailyStats
      });
    }
  }, [dailyLogs]);

  const getProductivityColor = (rate) => {
    if (rate >= 80) return '#4CAF50';
    if (rate >= 60) return '#FF9800';
    if (rate >= 40) return '#FFC107';
    return '#F44336';
  };

  const getProductivityEmoji = (rate) => {
    if (rate >= 80) return '🚀';
    if (rate >= 60) return '👍';
    if (rate >= 40) return '😐';
    return '😔';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMotivationalQuote = (productivityRate) => {
    const quotes = [
      {
        range: [90, 100],
        quote: "La responsabilidad es el precio de la grandeza.",
        author: "Jordan Peterson"
      },
      {
        range: [80, 89],
        quote: "La excelencia no es un acto, sino un hábito.",
        author: "Aristóteles"
      },
      {
        range: [70, 79],
        quote: "El éxito es la suma de pequeños esfuerzos repetidos día tras día.",
        author: "Brian Tracy"
      },
      {
        range: [60, 69],
        quote: "La disciplina es el puente entre metas y logros.",
        author: "Jim Rohn"
      },
      {
        range: [50, 59],
        quote: "El éxito no es final, el fracaso no es fatal: es el coraje para continuar lo que cuenta.",
        author: "Winston Churchill"
      },
      {
        range: [40, 49],
        quote: "La diferencia entre lo imposible y lo posible está en la determinación.",
        author: "Tommy Lasorda"
      },
      {
        range: [30, 39],
        quote: "La paciencia y la persistencia son virtudes que pagan dividendos.",
        author: "Brian Tracy"
      },
      {
        range: [0, 29],
        quote: "Compara tu ser de hoy con tu ser de ayer, no con el ser de otra persona.",
        author: "Jordan Peterson"
      }
    ];

    const quote = quotes.find(q => productivityRate >= q.range[0] && productivityRate <= q.range[1]);
    return quote || quotes[quotes.length - 1];
  };

  return (
    <div className="minimal-card" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0, marginBottom: '8px' }}>📊 Analytics y Progreso</h2>
          <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '0.9em' }}>
            Analiza tu productividad y progreso a lo largo del tiempo
          </p>
        </div>
        <SaveStatusIndicator status={saveStatus} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <AdvancedStats analytics={analytics} />
        <MonthlyProgress dailyStats={analytics.dailyStats} />
        <DailyLog tasks={tasks} />
        <LogTask />
      </div>
    </div>
  );
}

export default AnalyticsView; 