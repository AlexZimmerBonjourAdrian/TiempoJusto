// ============================================================================
// HOOK PARA MANEJO DE NOTIFICACIONES - TIEMPOJUSTO
// ============================================================================

import { useState, useCallback, useEffect } from 'react';
import { useAppNotifications } from '../context/AppContext';
import { debugUtils } from '../utils';

// ============================================================================
// TIPOS
// ============================================================================

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  timestamp: Date;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  showNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  hideNotification: (id: string) => void;
  clearAllNotifications: () => void;
  showSuccess: (title: string, message: string, duration?: number) => void;
  showError: (title: string, message: string, duration?: number) => void;
  showWarning: (title: string, message: string, duration?: number) => void;
  showInfo: (title: string, message: string, duration?: number) => void;
}

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { notifications: appNotifications } = useAppNotifications();

  // ============================================================================
  // FUNCIONES
  // ============================================================================

  const showNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>): void => {
    const newNotification: Notification = {
      ...notification,
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-hide notification after duration
    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        hideNotification(newNotification.id);
      }, notification.duration);
    }

    debugUtils.log('Notification shown', { id: newNotification.id, type: notification.type });
  }, []);

  const hideNotification = useCallback((id: string): void => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    debugUtils.log('Notification hidden', { id });
  }, []);

  const clearAllNotifications = useCallback((): void => {
    setNotifications([]);
    debugUtils.log('All notifications cleared');
  }, []);

  // ============================================================================
  // FUNCIONES CONVENIENCE
  // ============================================================================

  const showSuccess = useCallback((title: string, message: string, duration: number = 3000): void => {
    showNotification({ type: 'success', title, message, duration });
  }, [showNotification]);

  const showError = useCallback((title: string, message: string, duration: number = 5000): void => {
    showNotification({ type: 'error', title, message, duration });
  }, [showNotification]);

  const showWarning = useCallback((title: string, message: string, duration: number = 4000): void => {
    showNotification({ type: 'warning', title, message, duration });
  }, [showNotification]);

  const showInfo = useCallback((title: string, message: string, duration: number = 3000): void => {
    showNotification({ type: 'info', title, message, duration });
  }, [showNotification]);

  // ============================================================================
  // EFECTOS
  // ============================================================================

  // Auto-hide notifications based on app settings
  useEffect(() => {
    if (!appNotifications.enabled) {
      clearAllNotifications();
    }
  }, [appNotifications.enabled, clearAllNotifications]);

  return {
    notifications,
    showNotification,
    hideNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
}
