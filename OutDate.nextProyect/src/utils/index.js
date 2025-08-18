import Cookies from 'js-cookie';
import { COOKIE_EXPIRY_DAYS, STORAGE_KEYS } from '../constants';

// Cookie Utilities
export const cookieUtils = {
    set: (key, value) => {
        try {
            Cookies.set(key, JSON.stringify(value), { expires: COOKIE_EXPIRY_DAYS });
        } catch (error) {
            console.error(`Error setting cookie ${key}:`, error);
        }
    },

    get: (key, defaultValue = null) => {
        try {
            const value = Cookies.get(key);
            return value ? JSON.parse(value) : defaultValue;
        } catch (error) {
            console.error(`Error getting cookie ${key}:`, error);
            return defaultValue;
        }
    },

    remove: (key) => {
        try {
            Cookies.remove(key);
        } catch (error) {
            console.error(`Error removing cookie ${key}:`, error);
        }
    }
};

// Time Utilities
export const timeUtils = {
    parseTime: (time) => {
        time = time.trim().toUpperCase();
        const hasAM = time.includes('AM');
        const hasPM = time.includes('PM');
        time = time.replace(/[AP]M/, '').trim();

        if (/^\d+$/.test(time)) {
            let hours = parseInt(time);
            if (hasPM && hours !== 12) hours += 12;
            if (hasAM && hours === 12) hours = 0;
            return hours * 60;
        }

        if (/^\d{4}$/.test(time)) {
            const hours = parseInt(time.substring(0, 2));
            const minutes = parseInt(time.substring(2));
            let totalMinutes = hours * 60 + minutes;
            if (hasPM && hours !== 12) totalMinutes += 12 * 60;
            if (hasAM && hours === 12) totalMinutes -= 12 * 60;
            return totalMinutes;
        }

        if (time.includes(':')) {
            const [hours, minutes] = time.split(':').map(Number);
            let totalMinutes = hours * 60 + minutes;
            if (hasPM && hours !== 12) totalMinutes += 12 * 60;
            if (hasAM && hours === 12) totalMinutes -= 12 * 60;
            return totalMinutes;
        }

        return NaN;
    },

    formatDuration: (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours} horas y ${mins} minutos`;
    },

    getCurrentTime: () => {
        return new Date().toLocaleTimeString();
    }
};

// Task Utilities
export const taskUtils = {
    sortByImportance: (tasks) => {
        return [...tasks].sort((a, b) => {
            const importanceOrder = { 'A': 1, 'B': 2, 'C': 3, 'D': 4 };
            const [importanceA, indexA] = a.importance.split('-');
            const [importanceB, indexB] = b.importance.split('-');

            const orderA = importanceOrder[importanceA] || 5;
            const orderB = importanceOrder[importanceB] || 5;

            if (orderA !== orderB) {
                return orderA - orderB;
            }

            const indexANum = parseInt(indexA) || 0;
            const indexBNum = parseInt(indexB) || 0;
            return indexANum - indexBNum;
        });
    },

    isDuplicate: (tasks, newTaskText) => {
        return tasks.some(task => task.text.trim() === newTaskText.trim());
    },

    calculateProductivity: (tasks) => {
        const completedTasks = tasks.filter(task => task.completed).length;
        const totalTasks = tasks.length;
        return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    }
};

// Project Utilities
export const projectUtils = {
    generateId: () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    calculateProgress: (project) => {
        if (!project.tasks || project.tasks.length === 0) return 0;
        const completedTasks = project.tasks.filter(task => task.completed).length;
        return (completedTasks / project.tasks.length) * 100;
    },

    getDaysUntilDeadline: (deadline) => {
        if (!deadline) return null;
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const diffTime = deadlineDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    },

    formatDate: (date) => {
        return new Date(date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    sortProjects: (projects, sortBy = 'updatedAt') => {
        return [...projects].sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'deadline':
                    if (!a.deadline) return 1;
                    if (!b.deadline) return -1;
                    return new Date(a.deadline) - new Date(b.deadline);
                case 'progress':
                    return projectUtils.calculateProgress(b) - projectUtils.calculateProgress(a);
                default:
                    return new Date(b.updatedAt) - new Date(a.updatedAt);
            }
        });
    }
};

// Validation Utilities
export const validationUtils = {
    isValidTime: (time) => {
        const minutes = timeUtils.parseTime(time);
        return !isNaN(minutes) && minutes >= 0 && minutes < 24 * 60;
    },

    isValidTask: (text) => {
        return text && text.trim().length > 0;
    },

    canAddTask: (tasks, maxTasks = 8) => {
        return tasks.length < maxTasks;
    }
};

// Date Utilities
export const dateUtils = {
    isNewDay: (lastReset) => {
        const now = new Date();
        const lastResetDate = lastReset ? new Date(lastReset) : null;
        return !lastResetDate || now - lastResetDate >= 24 * 60 * 60 * 1000;
    },

    getSixMonthsAgo: () => {
        const now = new Date();
        return new Date(now.setMonth(now.getMonth() - 6));
    },

    formatDate: (date) => {
        return new Date(date).toLocaleDateString();
    }
};