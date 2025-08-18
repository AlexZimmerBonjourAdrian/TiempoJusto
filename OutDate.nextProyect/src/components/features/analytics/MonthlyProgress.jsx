'use client'

import React, { useState, useEffect } from 'react';

function MonthlyProgress({ dailyLogs }) {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [monthlyData, setMonthlyData] = useState({
    days: [],
    averageProductivity: 0,
    totalTasks: 0,
    completedTasks: 0,
    bestDay: null,
    worstDay: null,
    streakDays: 0,
    consistency: 0
  });

  useEffect(() => {
    if (dailyLogs.length === 0) return;

    const [year, month] = selectedMonth.split('-');
    const monthLogs = dailyLogs.filter(log => {
      const logDate = new Date(log.date);
      return logDate.getFullYear() === parseInt(year) && 
             logDate.getMonth() === parseInt(month) - 1;
    });

    if (monthLogs.length === 0) {
      setMonthlyData({
        days: [],
        averageProductivity: 0,
        totalTasks: 0,
        completedTasks: 0,
        bestDay: null,
        worstDay: null,
        streakDays: 0,
        consistency: 0
      });
      return;
    }

    // Calculate monthly statistics
    const totalTasks = monthLogs.reduce((sum, log) => sum + log.totalTasks, 0);
    const completedTasks = monthLogs.reduce((sum, log) => sum + log.completedTasks, 0);
    const averageProductivity = monthLogs.reduce((sum, log) => sum + log.productivityRate, 0) / monthLogs.length;

    // Find best and worst days
    const bestDay = monthLogs.reduce((best, current) => 
      current.productivityRate > best.productivityRate ? current : best
    );
    const worstDay = monthLogs.reduce((worst, current) => 
      current.productivityRate < worst.productivityRate ? current : worst
    );

    // Calculate consistency (days with productivity > 50%)
    const productiveDays = monthLogs.filter(log => log.productivityRate >= 50).length;
    const consistency = (productiveDays / monthLogs.length) * 100;

    // Calculate streak (consecutive days with productivity > 60%)
    let currentStreak = 0;
    let maxStreak = 0;
    const sortedLogs = monthLogs.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    for (const log of sortedLogs) {
      if (log.productivityRate >= 60) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    // Create daily data for chart
    const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
    const days = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${month}-${String(day).padStart(2, '0')}`;
      const dayLog = monthLogs.find(log => log.date === dateStr);
      
      days.push({
        day,
        date: dateStr,
        productivity: dayLog ? dayLog.productivityRate : 0,
        totalTasks: dayLog ? dayLog.totalTasks : 0,
        completedTasks: dayLog ? dayLog.completedTasks : 0,
        hasData: !!dayLog
      });
    }

    setMonthlyData({
      days,
      averageProductivity,
      totalTasks,
      completedTasks,
      bestDay,
      worstDay,
      streakDays: maxStreak,
      consistency
    });
  }, [dailyLogs, selectedMonth]);

  const getProductivityColor = (rate) => {
    if (rate >= 80) return '#4CAF50';
    if (rate >= 60) return '#8BC34A';
    if (rate >= 40) return '#FFC107';
    if (rate >= 20) return '#FF9800';
    return '#F44336';
  };

  const getProductivityEmoji = (rate) => {
    if (rate >= 80) return '🚀';
    if (rate >= 60) return '👍';
    if (rate >= 40) return '😐';
    if (rate >= 20) return '😔';
    return '😞';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    });
  };

  const getMonthName = (monthStr) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  };

  const getAvailableMonths = () => {
    if (dailyLogs.length === 0) return [];
    
    const months = new Set();
    dailyLogs.forEach(log => {
      const date = new Date(log.date);
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months.add(monthStr);
    });
    
    return Array.from(months).sort().reverse();
  };

  return (
    <div style={{ 
      background: '#fff', 
      borderRadius: '12px', 
      padding: '20px',
      border: '1px solid #e0e0e0',
      marginBottom: '30px'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <h3 style={{ margin: 0, color: '#333' }}>📅 Progreso Mensual</h3>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '14px',
            minWidth: '150px'
          }}
        >
          {getAvailableMonths().map(month => (
            <option key={month} value={month}>
              {getMonthName(month)}
            </option>
          ))}
        </select>
      </div>

      {monthlyData.days.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <h4 style={{ marginBottom: '10px' }}>No hay datos para este mes</h4>
          <p>Completa algunos días de tareas para ver tu progreso mensual.</p>
        </div>
      ) : (
        <>
          {/* Monthly Statistics */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
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
              <div style={{ fontSize: '1.8em', marginBottom: '5px' }}>
                {getProductivityEmoji(monthlyData.averageProductivity)}
              </div>
              <div style={{ fontSize: '1.3em', fontWeight: 'bold' }}>
                {monthlyData.averageProductivity.toFixed(1)}%
              </div>
              <div style={{ fontSize: '0.9em', opacity: 0.9 }}>Productividad Promedio</div>
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
                {monthlyData.consistency.toFixed(1)}%
              </div>
              <div style={{ fontSize: '0.9em', opacity: 0.9 }}>Consistencia</div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #FF9800, #F57C00)',
              color: 'white',
              padding: '15px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.8em', marginBottom: '5px' }}>🔥</div>
              <div style={{ fontSize: '1.3em', fontWeight: 'bold' }}>
                {monthlyData.streakDays}
              </div>
              <div style={{ fontSize: '0.9em', opacity: 0.9 }}>Racha Máxima</div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #9C27B0, #7B1FA2)',
              color: 'white',
              padding: '15px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.8em', marginBottom: '5px' }}>✅</div>
              <div style={{ fontSize: '1.3em', fontWeight: 'bold' }}>
                {monthlyData.completedTasks}/{monthlyData.totalTasks}
              </div>
              <div style={{ fontSize: '0.9em', opacity: 0.9 }}>Tareas Completadas</div>
            </div>
          </div>

          {/* Monthly Chart */}
          <div style={{ 
            background: '#f8f9fa', 
            borderRadius: '8px', 
            padding: '20px',
            marginBottom: '25px'
          }}>
            <h4 style={{ marginBottom: '15px', color: '#333', textAlign: 'center' }}>
              Gráfica de Productividad Diaria - {getMonthName(selectedMonth)}
            </h4>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(20px, 1fr))', 
              gap: '2px',
              height: '200px',
              alignItems: 'end',
              padding: '10px 0'
            }}>
              {monthlyData.days.map((day, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  height: '100%'
                }}>
                  <div style={{
                    background: day.hasData ? getProductivityColor(day.productivity) : '#e0e0e0',
                    width: '100%',
                    maxWidth: '25px',
                    height: `${day.hasData ? Math.max(day.productivity, 5) : 0}%`,
                    borderRadius: '3px 3px 0 0',
                    marginBottom: '5px',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  title={`${day.day} ${getMonthName(selectedMonth).split(' ')[0]}: ${day.hasData ? day.productivity.toFixed(1) + '%' : 'Sin datos'}`}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.1)';
                    e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = 'none';
                  }}
                  />
                  <div style={{ 
                    fontSize: '0.7em', 
                    color: '#666',
                    textAlign: 'center',
                    writingMode: 'vertical-rl',
                    transform: 'rotate(180deg)',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {day.day}
                  </div>
                </div>
              ))}
            </div>

            {/* Chart Legend */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '15px',
              marginTop: '15px',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '12px', height: '12px', background: '#4CAF50', borderRadius: '2px' }}></div>
                <span style={{ fontSize: '0.8em', color: '#666' }}>80-100%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '12px', height: '12px', background: '#8BC34A', borderRadius: '2px' }}></div>
                <span style={{ fontSize: '0.8em', color: '#666' }}>60-79%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '12px', height: '12px', background: '#FFC107', borderRadius: '2px' }}></div>
                <span style={{ fontSize: '0.8em', color: '#666' }}>40-59%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '12px', height: '12px', background: '#FF9800', borderRadius: '2px' }}></div>
                <span style={{ fontSize: '0.8em', color: '#666' }}>20-39%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '12px', height: '12px', background: '#F44336', borderRadius: '2px' }}></div>
                <span style={{ fontSize: '0.8em', color: '#666' }}>0-19%</span>
              </div>
            </div>
          </div>

          {/* Best and Worst Days */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '15px'
          }}>
            {monthlyData.bestDay && (
              <div style={{
                background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                color: 'white',
                padding: '15px',
                borderRadius: '8px'
              }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '1.1em' }}>🏆 Mejor Día</h4>
                <div style={{ fontSize: '1.2em', fontWeight: 'bold', marginBottom: '5px' }}>
                  {formatDate(monthlyData.bestDay.date)}
                </div>
                <div style={{ fontSize: '1.5em', marginBottom: '5px' }}>
                  {monthlyData.bestDay.productivityRate.toFixed(1)}% Productividad
                </div>
                <div style={{ fontSize: '0.9em', opacity: 0.9 }}>
                  {monthlyData.bestDay.completedTasks}/{monthlyData.bestDay.totalTasks} tareas completadas
                </div>
              </div>
            )}

            {monthlyData.worstDay && (
              <div style={{
                background: 'linear-gradient(135deg, #F44336, #D32F2F)',
                color: 'white',
                padding: '15px',
                borderRadius: '8px'
              }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '1.1em' }}>📉 Día Más Difícil</h4>
                <div style={{ fontSize: '1.2em', fontWeight: 'bold', marginBottom: '5px' }}>
                  {formatDate(monthlyData.worstDay.date)}
                </div>
                <div style={{ fontSize: '1.5em', marginBottom: '5px' }}>
                  {monthlyData.worstDay.productivityRate.toFixed(1)}% Productividad
                </div>
                <div style={{ fontSize: '0.9em', opacity: 0.9 }}>
                  {monthlyData.worstDay.completedTasks}/{monthlyData.worstDay.totalTasks} tareas completadas
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default MonthlyProgress; 