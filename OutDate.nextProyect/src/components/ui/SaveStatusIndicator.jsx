'use client'

import React from 'react';

function SaveStatusIndicator({ status, style = {} }) {
  const getStatusInfo = () => {
    switch (status) {
      case 'saving':
        return {
          icon: '⏳',
          text: 'Guardando...',
          color: '#FF9800'
        };
      case 'saved':
        return {
          icon: '✅',
          text: 'Guardado',
          color: '#4CAF50'
        };
      case 'error':
        return {
          icon: '❌',
          text: 'Error al guardar',
          color: '#F44336'
        };
      default:
        return {
          icon: '💾',
          text: 'Guardado automático',
          color: '#2196F3'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '12px',
        color: statusInfo.color,
        fontWeight: '500',
        padding: '4px 8px',
        borderRadius: '12px',
        background: `${statusInfo.color}15`,
        border: `1px solid ${statusInfo.color}30`,
        transition: 'all 0.3s ease',
        ...style
      }}
    >
      <span style={{ fontSize: '14px' }}>{statusInfo.icon}</span>
      <span>{statusInfo.text}</span>
    </div>
  );
}

export default SaveStatusIndicator; 