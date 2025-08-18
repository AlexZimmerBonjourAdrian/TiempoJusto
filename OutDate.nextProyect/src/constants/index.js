// Application Constants
export const APP_NAME = 'Tiempo Justo';
export const APP_DESCRIPTION = 'Gestiona tus tareas diarias con propósito y claridad';

// Task Management
export const MAX_TASKS = 8;
export const TASK_PRIORITIES = ['A', 'B', 'C', 'D'];

// Project Management
export const PROJECT_STATUSES = {
    ACTIVE: 'active',
    COMPLETED: 'completed',
    PAUSED: 'paused'
};

export const PROJECT_STATUS_LABELS = {
    active: 'Activo',
    completed: 'Completado',
    paused: 'Pausado'
};

export const PROJECT_STATUS_COLORS = {
    active: '#4CAF50',
    completed: '#2196F3',
    paused: '#FF9800'
};

export const COOKIE_EXPIRY_DAYS = 182;

// Colors
export const COLORS = {
    primary: '#4A148C',
    secondary: '#009688',
    success: '#4CAF50',
    error: '#f44336',
    warning: '#FF9800',
    info: '#2196F3',
    light: '#F3E5F5',
    dark: '#333',
    white: '#FFFFFF',
    gray: '#777',
    lightGray: '#ccc'
};

// Routes
export const ROUTES = {
    home: '/',
    log: '/log',
    adhd: '/adhd',
    about: '/about'
};

// External Links
export const EXTERNAL_LINKS = {
    koFi: 'https://ko-fi.com/zimtech',
    cafecito: 'https://cafecito.app/zimtech'
};

// Time Formats
export const TIME_FORMATS = {
    display: 'HH:mm',
    input: 'HH:MM',
    full: 'HH:mm:ss'
};

// Local Storage Keys
export const STORAGE_KEYS = {
    tasks: 'tasks',
    completedLog: 'completedLog',
    lastReset: 'lastReset',
    hasADHD: 'hasADHD',
    taskLog: 'taskLog',
    projects: 'projects'
};