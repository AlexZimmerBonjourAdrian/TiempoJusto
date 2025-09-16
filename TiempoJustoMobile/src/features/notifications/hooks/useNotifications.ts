// ============================================================================
// HOOK DE NOTIFICACIONES - TIEMPOJUSTO
// ============================================================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Notification, NotificationConfig, NotificationStatistics, UseNotificationsReturn } from '../../../shared/types';
import { debugUtils } from '../../../shared/utils';

// ============================================================================
// HOOK PRINCIPAL DE NOTIFICACIONES
// ============================================================================

export const useNotifications = (): UseNotificationsReturn => {
  // ============================================================================
  // ESTADO LOCAL
  // ============================================================================

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [config, setConfig] = useState<NotificationConfig>({
    enabled: true,
    types: {
      motivational: true,
      reminder: true,
      achievement: true,
      pomodoro: true
    },
    schedule: {
      startTime: '08:00',
      endTime: '22:00',
      daysOfWeek: [1, 2, 3, 4, 5],
      timezone: 'America/Mexico_City'
    },
    frequency: {
      motivational: 120,
      reminder: 15,
      achievement: 5,
      pomodoro: 3
    },
    sound: {
      enabled: true,
      volume: 70
    },
    vibration: {
      enabled: true,
      pattern: [200, 100, 200]
    },
    display: {
      duration: 5,
      position: 'top',
      style: 'banner'
    }
  });
  const [statistics, setStatistics] = useState<NotificationStatistics>({
    total: 0,
    read: 0,
    unread: 0,
    byType: { motivational: 0, reminder: 0, achievement: 0, pomodoro: 0 },
    byPriority: { low: 0, medium: 0, high: 0, urgent: 0 },
    readRate: 0,
    averageReadTime: 0,
    dailyNotifications: {},
    weeklyNotifications: {},
    monthlyNotifications: {},
    mostEffectiveType: 'motivational',
    leastEffectiveType: 'reminder'
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ============================================================================
  // EFECTOS
  // ============================================================================

  useEffect(() => {
    initializeNotifications();
  }, []);

  useEffect(() => {
    calculateStatistics();
  }, [notifications]);

  // ============================================================================
  // FUNCIONES DE INICIALIZACIÓN
  // ============================================================================

  const initializeNotifications = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Cargar notificaciones desde storage
      setNotifications([]);
      
      debugUtils.log('Notifications initialized successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error initializing notifications';
      setError(errorMessage);
      debugUtils.error('Error initializing notifications', err);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // FUNCIONES DE CRUD
  // ============================================================================

  const addNotification = useCallback(async (notification: Omit<Notification, 'id' | 'createdAt'>): Promise<void> => {
    try {
      setError(null);
      
      const newNotification: Notification = {
        ...notification,
        id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date()
      };

      setNotifications(prev => [...prev, newNotification]);
      
      debugUtils.log('Notification added successfully', { id: newNotification.id });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error adding notification';
      setError(errorMessage);
      debugUtils.error('Error adding notification', err);
      throw err;
    }
  }, []);

  const markAsRead = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, isRead: true, readAt: new Date() }
            : notification
        )
      );
      
      debugUtils.log('Notification marked as read', { id });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error marking notification as read';
      setError(errorMessage);
      debugUtils.error('Error marking notification as read', err);
      throw err;
    }
  }, []);

  const markAllAsRead = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      
      setNotifications(prev => 
        prev.map(notification => 
          notification.isRead 
            ? notification 
            : { ...notification, isRead: true, readAt: new Date() }
        )
      );
      
      debugUtils.log('All notifications marked as read');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error marking all notifications as read';
      setError(errorMessage);
      debugUtils.error('Error marking all notifications as read', err);
      throw err;
    }
  }, []);

  const deleteNotification = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      
      setNotifications(prev => prev.filter(notification => notification.id !== id));
      
      debugUtils.log('Notification deleted successfully', { id });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error deleting notification';
      setError(errorMessage);
      debugUtils.error('Error deleting notification', err);
      throw err;
    }
  }, []);

  const clearAll = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      
      setNotifications([]);
      
      debugUtils.log('All notifications cleared');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error clearing all notifications';
      setError(errorMessage);
      debugUtils.error('Error clearing all notifications', err);
      throw err;
    }
  }, []);

  // ============================================================================
  // FUNCIONES DE CONFIGURACIÓN
  // ============================================================================

  const updateConfig = useCallback(async (newConfig: Partial<NotificationConfig>): Promise<void> => {
    try {
      setError(null);
      
      setConfig(prev => ({ ...prev, ...newConfig }));
      
      debugUtils.log('Notification config updated', newConfig);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error updating notification config';
      setError(errorMessage);
      debugUtils.error('Error updating notification config', err);
      throw err;
    }
  }, []);

  // ============================================================================
  // FUNCIONES DE RECORDATORIOS
  // ============================================================================

  const scheduleReminder = useCallback(async (reminder: Omit<Notification, 'id' | 'createdAt'>): Promise<void> => {
    try {
      setError(null);
      
      // TODO: Implementar programación de recordatorios
      await addNotification(reminder);
      
      debugUtils.log('Reminder scheduled successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error scheduling reminder';
      setError(errorMessage);
      debugUtils.error('Error scheduling reminder', err);
      throw err;
    }
  }, [addNotification]);

  const cancelReminder = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      
      // TODO: Implementar cancelación de recordatorios
      await deleteNotification(id);
      
      debugUtils.log('Reminder cancelled successfully', { id });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error cancelling reminder';
      setError(errorMessage);
      debugUtils.error('Error cancelling reminder', err);
      throw err;
    }
  }, [deleteNotification]);

  // ============================================================================
  // FUNCIONES DE CONSULTA
  // ============================================================================

  const getNotificationsByType = useCallback((type: string): Notification[] => {
    return notifications.filter(notification => notification.type === type);
  }, [notifications]);

  const getNotificationsByPriority = useCallback((priority: string): Notification[] => {
    return notifications.filter(notification => notification.priority === priority);
  }, [notifications]);

  const refreshNotifications = useCallback(async (): Promise<void> => {
    await initializeNotifications();
  }, []);

  // ============================================================================
  // FUNCIONES DE ESTADÍSTICAS
  // ============================================================================

  const calculateStatistics = useCallback((): void => {
    const total = notifications.length;
    const read = notifications.filter(n => n.isRead).length;
    const unread = total - read;

    const byType = notifications.reduce((acc, notification) => {
      acc[notification.type] = (acc[notification.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byPriority = notifications.reduce((acc, notification) => {
      acc[notification.priority] = (acc[notification.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const readRate = total > 0 ? (read / total) * 100 : 0;

    setStatistics({
      total,
      read,
      unread,
      byType,
      byPriority,
      readRate,
      averageReadTime: 0, // TODO: Implementar cálculo
      dailyNotifications: {},
      weeklyNotifications: {},
      monthlyNotifications: {},
      mostEffectiveType: 'motivational',
      leastEffectiveType: 'reminder'
    });
  }, [notifications]);

  // ============================================================================
  // VALORES MEMOIZADOS
  // ============================================================================

  const unreadCount = useMemo(() => {
    return notifications.filter(notification => !notification.isRead).length;
  }, [notifications]);

  // ============================================================================
  // RETORNO DEL HOOK
  // ============================================================================

  return {
    notifications,
    unreadCount,
    loading,
    error,
    config,
    statistics,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    updateConfig,
    scheduleReminder,
    cancelReminder,
    getNotificationsByType,
    getNotificationsByPriority,
    refreshNotifications
  };
};
