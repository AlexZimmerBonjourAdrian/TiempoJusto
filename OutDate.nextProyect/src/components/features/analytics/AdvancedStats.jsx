'use client'

import React, { useState, useEffect } from 'react';

function AdvancedStats({ dailyLogs }) {
  const [stats, setStats] = useState({
    totalDays: 0,
    averageDailyTasks: 0,
    averageDailyCompleted: 0,
    bestWeek: null,
    worstWeek: null,
    productivityTrend: 'stable',
    consistencyScore: 0,
    improvementRate: 0,
    peakProductivityTime: null,
    taskCompletionPattern: {}
  });

  useEffect(() => {
    if (dailyLogs.length === 0) return;

    // Calculate advanced statistics
    const totalDays = dailyLogs.length;
    const averageDailyTasks = dailyLogs.reduce((sum, log) => sum + log.totalTasks, 0) / totalDays;
    const averageDailyCompleted = dailyLogs.reduce((sum, log) => sum + log.completedTasks, 0) / totalDays;

    // Calculate productivity trend
    const sortedLogs = dailyLogs.sort((a, b) => new Date(a.date) - new Date(b.date));
    const firstHalf = sortedLogs.slice(0, Math.floor(sortedLogs.length / 2));
    const secondHalf = sortedLogs.slice(Math.floor(sortedLogs.length / 2));
    
    const firstHalfAvg = firstHalf.reduce((sum, log) => sum + log.productivityRate, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, log) => sum + log.productivityRate, 0) / secondHalf.length;
    
    let productivityTrend = 'stable';
    if (secondHalfAvg > firstHalfAvg + 5) productivityTrend = 'improving';
    else if (secondHalfAvg < firstHalfAvg - 5) productivityTrend = 'declining';

    // Calculate consistency score (standard deviation of productivity)
    const avgProductivity = dailyLogs.reduce((sum, log) => sum + log.productivityRate, 0) / totalDays;
    const variance = dailyLogs.reduce((sum, log) => sum + Math.pow(log.productivityRate - avgProductivity, 2), 0) / totalDays;
    const stdDev = Math.sqrt(variance);
    const consistencyScore = Math.max(0, 100 - stdDev); // Higher consistency = lower standard deviation

    // Calculate improvement rate
    const improvementRate = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;

    // Find best and worst weeks
    const weeklyData = [];
    for (let i = 0; i < sortedLogs.length; i += 7) {
      const weekLogs = sortedLogs.slice(i, i + 7);
      if (weekLogs.length > 0) {
        const weekAvg = weekLogs.reduce((sum, log) => sum + log.productivityRate, 0) / weekLogs.length;
        weeklyData.push({
          week: Math.floor(i / 7) + 1,
          average: weekAvg,
          logs: weekLogs
        });
      }
    }

    const bestWeek = weeklyData.reduce((best, current) => 
      current.average > best.average ? current : best
    );
    const worstWeek = weeklyData.reduce((worst, current) => 
      current.average < worst.average ? current : worst
    );

    // Analyze task completion patterns
    const taskPattern = {};
    dailyLogs.forEach(log => {
      log.tasks.forEach(task => {
        if (!taskPattern[task.importance]) {
          taskPattern[task.importance] = { total: 0, completed: 0 };
        }
        taskPattern[task.importance].total++;
        if (task.completed) taskPattern[task.importance].completed++;
      });
    });

    setStats({
      totalDays,
      averageDailyTasks,
      averageDailyCompleted,
      bestWeek,
      worstWeek,
      productivityTrend,
      consistencyScore,
      improvementRate,
      peakProductivityTime: null, // Could be enhanced with time data
      taskCompletionPattern: taskPattern
    });
  }, [dailyLogs]);

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      default: return '➡️';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'improving': return '#4CAF50';
      case 'declining': return '#F44336';
      default: return '#FF9800';
    }
  };

  const getConsistencyLevel = (score) => {
    if (score >= 80) return { level: 'Excelente', color: '#4CAF50', emoji: '🎯' };
    if (score >= 60) return { level: 'Buena', color: '#8BC34A', emoji: '👍' };
    if (score >= 40) return { level: 'Regular', color: '#FFC107', emoji: '😐' };
    return { level: 'Necesita Mejora', color: '#F44336', emoji: '⚠️' };
  };

  return (
    <div style={{ 
      background: '#fff', 
      borderRadius: '12px', 
      padding: '20px',
      border: '1px solid #e0e0e0',
      marginBottom: '30px'
    }}>
      <h3 style={{ marginBottom: '20px', color: '#333' }}>📊 Estadísticas Avanzadas</h3>

      {dailyLogs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <h4 style={{ marginBottom: '10px' }}>No hay suficientes datos</h4>
          <p>Necesitas al menos 7 días de datos para ver estadísticas avanzadas.</p>
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '15px',
            marginBottom: '25px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #4CAF50, #45a049)',
              color: 'white',
              padding: '15px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.8em', marginBottom: '5px' }}>📅</div>
              <div style={{ fontSize: '1.3em', fontWeight: 'bold' }}>
                {stats.totalDays} días
              </div>
              <div style={{ fontSize: '0.9em', opacity: 0.9 }}>Total de Días Registrados</div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #2196F3, #1976D2)',
              color: 'white',
              padding: '15px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.8em', marginBottom: '5px' }}>📊</div>
              <div style={{ fontSize: '1.3em', fontWeight: 'bold' }}>
                {stats.averageDailyTasks.toFixed(1)}
              </div>
              <div style={{ fontSize: '0.9em', opacity: 0.9 }}>Promedio Tareas/Día</div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #FF9800, #F57C00)',
              color: 'white',
              padding: '15px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.8em', marginBottom: '5px' }}>✅</div>
              <div style={{ fontSize: '1.3em', fontWeight: 'bold' }}>
                {stats.averageDailyCompleted.toFixed(1)}
              </div>
              <div style={{ fontSize: '0.9em', opacity: 0.9 }}>Promedio Completadas/Día</div>
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${getTrendColor(stats.productivityTrend)}, ${getTrendColor(stats.productivityTrend)}dd)`,
              color: 'white',
              padding: '15px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.8em', marginBottom: '5px' }}>{getTrendIcon(stats.productivityTrend)}</div>
              <div style={{ fontSize: '1.3em', fontWeight: 'bold' }}>
                {stats.productivityTrend === 'improving' ? 'Mejorando' : 
                 stats.productivityTrend === 'declining' ? 'Declinando' : 'Estable'}
              </div>
              <div style={{ fontSize: '0.9em', opacity: 0.9 }}>Tendencia</div>
            </div>
          </div>

          {/* Consistency and Improvement */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '15px',
            marginBottom: '25px'
          }}>
            <div style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #e0e0e0'
            }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>🎯 Consistencia</h4>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '15px',
                marginBottom: '10px'
              }}>
                <div style={{ fontSize: '2em' }}>
                  {getConsistencyLevel(stats.consistencyScore).emoji}
                </div>
                <div>
                  <div style={{ 
                    fontSize: '1.5em', 
                    fontWeight: 'bold',
                    color: getConsistencyLevel(stats.consistencyScore).color
                  }}>
                    {stats.consistencyScore.toFixed(1)}%
                  </div>
                  <div style={{ fontSize: '0.9em', color: '#666' }}>
                    {getConsistencyLevel(stats.consistencyScore).level}
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '0.9em', color: '#666', margin: 0 }}>
                Tu consistencia mide qué tan estable es tu productividad día a día.
              </p>
            </div>

            <div style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #e0e0e0'
            }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>📈 Tasa de Mejora</h4>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '15px',
                marginBottom: '10px'
              }}>
                <div style={{ fontSize: '2em' }}>
                  {stats.improvementRate > 0 ? '🚀' : stats.improvementRate < 0 ? '📉' : '➡️'}
                </div>
                <div>
                  <div style={{ 
                    fontSize: '1.5em', 
                    fontWeight: 'bold',
                    color: stats.improvementRate > 0 ? '#4CAF50' : stats.improvementRate < 0 ? '#F44336' : '#FF9800'
                  }}>
                    {stats.improvementRate > 0 ? '+' : ''}{stats.improvementRate.toFixed(1)}%
                  </div>
                  <div style={{ fontSize: '0.9em', color: '#666' }}>
                    {stats.improvementRate > 0 ? 'Mejorando' : 
                     stats.improvementRate < 0 ? 'Necesita Atención' : 'Estable'}
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '0.9em', color: '#666', margin: 0 }}>
                Comparación entre la primera y segunda mitad de tu período.
              </p>
            </div>
          </div>

          {/* Best and Worst Weeks */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '15px',
            marginBottom: '25px'
          }}>
            {stats.bestWeek && (
              <div style={{
                background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                color: 'white',
                padding: '20px',
                borderRadius: '8px'
              }}>
                <h4 style={{ margin: '0 0 15px 0', fontSize: '1.1em' }}>🏆 Mejor Semana</h4>
                <div style={{ fontSize: '1.3em', fontWeight: 'bold', marginBottom: '5px' }}>
                  Semana {stats.bestWeek.week}
                </div>
                <div style={{ fontSize: '1.8em', marginBottom: '10px' }}>
                  {stats.bestWeek.average.toFixed(1)}% Productividad
                </div>
                <div style={{ fontSize: '0.9em', opacity: 0.9 }}>
                  {stats.bestWeek.logs.length} días registrados
                </div>
              </div>
            )}

            {stats.worstWeek && (
              <div style={{
                background: 'linear-gradient(135deg, #F44336, #D32F2F)',
                color: 'white',
                padding: '20px',
                borderRadius: '8px'
              }}>
                <h4 style={{ margin: '0 0 15px 0', fontSize: '1.1em' }}>📉 Semana Más Difícil</h4>
                <div style={{ fontSize: '1.3em', fontWeight: 'bold', marginBottom: '5px' }}>
                  Semana {stats.worstWeek.week}
                </div>
                <div style={{ fontSize: '1.8em', marginBottom: '10px' }}>
                  {stats.worstWeek.average.toFixed(1)}% Productividad
                </div>
                <div style={{ fontSize: '0.9em', opacity: 0.9 }}>
                  {stats.worstWeek.logs.length} días registrados
                </div>
              </div>
            )}
          </div>

          {/* Task Priority Analysis */}
          {Object.keys(stats.taskCompletionPattern).length > 0 && (
            <div style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #e0e0e0'
            }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>📋 Análisis por Prioridad</h4>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '15px'
              }}>
                {Object.entries(stats.taskCompletionPattern).map(([priority, data]) => {
                  const completionRate = (data.completed / data.total) * 100;
                  return (
                    <div key={priority} style={{
                      background: 'white',
                      padding: '15px',
                      borderRadius: '6px',
                      border: '1px solid #e0e0e0'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '10px'
                      }}>
                        <span style={{ 
                          fontSize: '1.2em', 
                          fontWeight: 'bold',
                          color: priority === 'A' ? '#F44336' : 
                                 priority === 'B' ? '#FF9800' : 
                                 priority === 'C' ? '#FFC107' : '#4CAF50'
                        }}>
                          Prioridad {priority}
                        </span>
                        <span style={{ 
                          fontSize: '1.1em', 
                          fontWeight: 'bold',
                          color: completionRate >= 80 ? '#4CAF50' : 
                                 completionRate >= 60 ? '#FF9800' : '#F44336'
                        }}>
                          {completionRate.toFixed(1)}%
                        </span>
                      </div>
                      <div style={{ fontSize: '0.9em', color: '#666' }}>
                        {data.completed}/{data.total} tareas completadas
                      </div>
                      <div style={{
                        background: '#e0e0e0',
                        height: '6px',
                        borderRadius: '3px',
                        marginTop: '8px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          background: completionRate >= 80 ? '#4CAF50' : 
                                     completionRate >= 60 ? '#FF9800' : '#F44336',
                          height: '100%',
                          width: `${completionRate}%`,
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdvancedStats; 