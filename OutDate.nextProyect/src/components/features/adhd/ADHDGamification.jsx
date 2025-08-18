import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

function ADHDGamification() {
  const [points, setPoints] = useState(() => {
    try {
      const savedPoints = Cookies.get('adhdPoints');
      return savedPoints ? parseInt(savedPoints) : 0;
    } catch (error) {
      return 0;
    }
  });

  const [level, setLevel] = useState(() => {
    return Math.floor(points / 100) + 1;
  });

  const [badges, setBadges] = useState(() => {
    try {
      const savedBadges = Cookies.get('adhdBadges');
      return savedBadges ? JSON.parse(savedBadges) : [];
    } catch (error) {
      return [];
    }
  });

  const [streak, setStreak] = useState(() => {
    try {
      const savedStreak = Cookies.get('adhdStreak');
      return savedStreak ? parseInt(savedStreak) : 0;
    } catch (error) {
      return 0;
    }
  });

  const [trees, setTrees] = useState(() => {
    try {
      const savedTrees = Cookies.get('adhdTrees');
      return savedTrees ? JSON.parse(savedTrees) : [];
    } catch (error) {
      return [];
    }
  });

  const [showConfetti, setShowConfetti] = useState(false);

  // Guardar datos en cookies
  useEffect(() => {
    Cookies.set('adhdPoints', points.toString(), { expires: 365 });
    Cookies.set('adhdBadges', JSON.stringify(badges), { expires: 365 });
    Cookies.set('adhdStreak', streak.toString(), { expires: 365 });
    Cookies.set('adhdTrees', JSON.stringify(trees), { expires: 365 });
  }, [points, badges, streak, trees]);

  // Calcular nivel basado en puntos
  useEffect(() => {
    const newLevel = Math.floor(points / 100) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      addBadge(`Nivel ${newLevel}`, `¡Alcanzaste el nivel ${newLevel}!`);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [points, level]);

  const addPoints = (amount, reason) => {
    setPoints(prev => prev + amount);
    
    // Verificar badges por puntos
    if (points + amount >= 50 && !badges.find(b => b.id === 'first50')) {
      addBadge('Primeros 50', '¡Ganaste tus primeros 50 puntos!');
    }
    if (points + amount >= 200 && !badges.find(b => b.id === 'first200')) {
      addBadge('Productivo', '¡200 puntos! Eres muy productivo');
    }
    if (points + amount >= 500 && !badges.find(b => b.id === 'first500')) {
      addBadge('Maestro', '¡500 puntos! Eres un maestro de la productividad');
    }
  };

  const addBadge = (name, description) => {
    const newBadge = {
      id: name.toLowerCase().replace(/\s+/g, ''),
      name,
      description,
      date: new Date().toISOString(),
      icon: getBadgeIcon(name)
    };
    setBadges(prev => [...prev, newBadge]);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const getBadgeIcon = (badgeName) => {
    const icons = {
      'Nivel': '⭐',
      'Primeros 50': '🎯',
      'Productivo': '🚀',
      'Maestro': '👑',
      'Racha': '🔥',
      'Árbol': '🌳',
      'Tarea Completa': '✅',
      'Rutina': '📅'
    };
    
    for (const [key, icon] of Object.entries(icons)) {
      if (badgeName.includes(key)) return icon;
    }
    return '🏆';
  };

  const addTree = () => {
    const newTree = {
      id: Date.now(),
      type: getRandomTreeType(),
      plantedAt: new Date().toISOString(),
      size: 'small'
    };
    setTrees(prev => [...prev, newTree]);
    addPoints(10, 'Árbol plantado');
  };

  const getRandomTreeType = () => {
    const types = ['🌳', '🌲', '🌴', '🌵', '🎋', '🎍'];
    return types[Math.floor(Math.random() * types.length)];
  };

  const increaseStreak = () => {
    setStreak(prev => prev + 1);
    if (streak + 1 >= 7 && !badges.find(b => b.id === 'weekstreak')) {
      addBadge('Racha Semanal', '¡7 días consecutivos!');
    }
    if (streak + 1 >= 30 && !badges.find(b => b.id === 'monthstreak')) {
      addBadge('Racha Mensual', '¡30 días consecutivos!');
    }
  };

  const getProgressToNextLevel = () => {
    const pointsInCurrentLevel = points % 100;
    return (pointsInCurrentLevel / 100) * 100;
  };

  const getLevelColor = () => {
    if (level <= 3) return '#4CAF50';
    if (level <= 6) return '#2196F3';
    if (level <= 9) return '#FF9800';
    return '#9C27B0';
  };

  return (
    <div className="minimal-card" style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 20, color: 'var(--color-accent)' }}>
        🎮 Sistema de Gamificación ADHD
      </h2>

      {/* Confetti Effect */}
      {showConfetti && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1000
        }}>
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${Math.random() * 100}%`,
                top: '-10px',
                width: '10px',
                height: '10px',
                background: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][Math.floor(Math.random() * 5)],
                borderRadius: '50%',
                animation: `fall ${Math.random() * 3 + 2}s linear forwards`
              }}
            />
          ))}
        </div>
      )}

      {/* Level and Progress */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '2em', marginBottom: '10px' }}>
          Nivel {level} ⭐
        </div>
        <div style={{ marginBottom: '15px' }}>
          {points} puntos totales
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.3)',
          borderRadius: '10px',
          height: '20px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            background: 'linear-gradient(90deg, #FFD700, #FFA500)',
            height: '100%',
            width: `${getProgressToNextLevel()}%`,
            transition: 'width 0.5s ease',
            borderRadius: '10px'
          }} />
        </div>
        <div style={{ marginTop: '8px', fontSize: '0.9em' }}>
          {100 - (points % 100)} puntos para el siguiente nivel
        </div>
      </div>

      {/* Streak Counter */}
      <div style={{
        background: '#fff3cd',
        border: '2px solid #ffeaa7',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '1.5em', marginBottom: '5px' }}>
          🔥 Racha: {streak} días
        </div>
        <div style={{ fontSize: '0.9em', color: '#856404' }}>
          {streak === 0 ? '¡Empieza tu racha hoy!' : 
           streak === 1 ? '¡Excelente! Mantén el ritmo' :
           `¡${streak} días consecutivos! Eres increíble`}
        </div>
      </div>

      {/* Forest Section */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ textAlign: 'center', marginBottom: '15px', color: 'var(--color-accent)' }}>
          🌳 Tu Bosque de Productividad
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))',
          gap: '10px',
          maxHeight: '200px',
          overflowY: 'auto',
          padding: '10px',
          background: '#f8f9fa',
          borderRadius: '8px'
        }}>
          {trees.map(tree => (
            <div key={tree.id} style={{
              fontSize: '2em',
              textAlign: 'center',
              padding: '10px',
              background: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              {tree.type}
            </div>
          ))}
          {trees.length === 0 && (
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              color: '#666',
              padding: '20px'
            }}>
              ¡Planta tu primer árbol completando tareas!
            </div>
          )}
        </div>
        <button
          onClick={addTree}
          style={{
            display: 'block',
            margin: '15px auto 0',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 20px',
            cursor: 'pointer',
            fontSize: '1em'
          }}
        >
          🌱 Plantar Árbol (10 puntos)
        </button>
      </div>

      {/* Badges Section */}
      <div>
        <h3 style={{ textAlign: 'center', marginBottom: '15px', color: 'var(--color-accent)' }}>
          🏆 Insignias Ganadas ({badges.length})
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '10px',
          maxHeight: '300px',
          overflowY: 'auto'
        }}>
          {badges.map(badge => (
            <div key={badge.id} style={{
              background: 'white',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              padding: '15px',
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '2em', marginBottom: '8px' }}>
                {badge.icon}
              </div>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                {badge.name}
              </div>
              <div style={{ fontSize: '0.8em', color: '#666' }}>
                {badge.description}
              </div>
              <div style={{ fontSize: '0.7em', color: '#999', marginTop: '5px' }}>
                {new Date(badge.date).toLocaleDateString()}
              </div>
            </div>
          ))}
          {badges.length === 0 && (
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              color: '#666',
              padding: '20px'
            }}>
              ¡Completa tareas para ganar insignias!
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: '#f8f9fa',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h4 style={{ marginBottom: '10px', color: 'var(--color-accent)' }}>
          Acciones Rápidas
        </h4>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => addPoints(5, 'Tarea rápida')}
            style={{
              background: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 12px',
              cursor: 'pointer',
              fontSize: '0.9em'
            }}
          >
            ✅ Tarea (5 pts)
          </button>
          <button
            onClick={() => addPoints(10, 'Rutina completada')}
            style={{
              background: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 12px',
              cursor: 'pointer',
              fontSize: '0.9em'
            }}
          >
            📅 Rutina (10 pts)
          </button>
          <button
            onClick={increaseStreak}
            style={{
              background: '#F44336',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 12px',
              cursor: 'pointer',
              fontSize: '0.9em'
            }}
          >
            🔥 Racha +1
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default ADHDGamification; 