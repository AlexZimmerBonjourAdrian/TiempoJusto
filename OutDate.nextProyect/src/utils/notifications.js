// Utility functions for browser notifications

export const requestNotificationPermission = async() => {
    if (!('Notification' in window)) {
        console.log('Este navegador no soporta notificaciones');
        return false;
    }

    if (Notification.permission === 'granted') {
        return true;
    }

    if (Notification.permission === 'denied') {
        console.log('Permisos de notificación denegados');
        return false;
    }

    try {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    } catch (error) {
        console.error('Error al solicitar permisos de notificación:', error);
        return false;
    }
};

export const showNotification = (title, options = {}) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
        return;
    }

    try {
        const notification = new Notification(title, {
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            ...options
        });

        // Auto-close notification after 5 seconds
        setTimeout(() => {
            notification.close();
        }, 5000);

        return notification;
    } catch (error) {
        console.error('Error al mostrar notificación:', error);
    }
};

export const showTaskboardClosureNotification = (productivityRate, motivationalMessage) => {
    const title = '🎯 Día Completado';
    const body = `Productividad: ${productivityRate.toFixed(1)}%\n\n${motivationalMessage}`;

    return showNotification(title, {
        body,
        requireInteraction: true,
        tag: 'taskboard-closure'
    });
};

export const showMidnightReminder = () => {
    return showNotification('⏰ Recordatorio', {
        body: 'Es medianoche. Tu tablero de tareas se cerrará automáticamente.',
        requireInteraction: false,
        tag: 'midnight-reminder'
    });
};