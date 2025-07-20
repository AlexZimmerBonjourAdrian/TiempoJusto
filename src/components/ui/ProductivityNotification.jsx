'use client'

import React, { useState, useEffect } from 'react';

function ProductivityNotification() {
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Mostrar la notificación solo una vez por sesión
    const hasSeenNotification = sessionStorage.getItem('productivityNotificationShown');
    if (!hasSeenNotification) {
      setShowNotification(true);
      sessionStorage.setItem('productivityNotificationShown', 'true');
    }
  }, []);

  if (!showNotification) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        maxWidth: '350px',
        zIndex: 1000,
        animation: 'slideIn 0.5s ease-out',
        border: '1px solid rgba(255,255,255,0.2)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>🚀 ¡Nuevas Mejoras!</h4>
        <button
          onClick={() => setShowNotification(false)}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '18px',
            cursor: 'pointer',
            padding: '0',
            marginLeft: '10px'
          }}
        >
          ×
        </button>
      </div>
      
      <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
        <p style={{ margin: '0 0 8px 0' }}>
          <strong>✅ Guardado Automático Mejorado:</strong> Tus datos se guardan automáticamente con respaldo y sincronización entre pestañas.
        </p>
        <p style={{ margin: '0 0 8px 0' }}>
          <strong>🎯 Enfoque en Productividad:</strong> Herramientas optimizadas para maximizar tu eficiencia y resultados.
        </p>
        <p style={{ margin: '0 0 12px 0' }}>
          <strong>💾 Indicadores de Estado:</strong> Sabrás siempre cuándo se están guardando tus datos.
        </p>
      </div>

      <button
        onClick={() => setShowNotification(false)}
        style={{
          background: 'rgba(255,255,255,0.2)',
          border: '1px solid rgba(255,255,255,0.3)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: '500',
          transition: 'all 0.2s ease'
        }}
        onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
        onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
      >
        ¡Entendido!
      </button>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default ProductivityNotification; 