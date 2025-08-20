// Cálculo de XP basado en productividad del usuario - Capa de Lógica
// Principio KISS: Keep It Simple, Stupid

import { xpConfig } from '../data/petData';

// Calcular XP total basado en tareas y proyectos
export function calculatePetXP(tasks = [], projects = []) {
    let totalXP = 0;
    
    // XP por tareas completadas
    const completedTasks = tasks.filter(task => task.done);
    totalXP += completedTasks.length * xpConfig.taskCompleted;
    
    // XP bonus por prioridad de tareas completadas
    completedTasks.forEach(task => {
        switch (task.priority) {
            case 'A':
                totalXP += xpConfig.priorityATask;
                break;
            case 'B':
                totalXP += xpConfig.priorityBTask;
                break;
            case 'C':
                totalXP += xpConfig.priorityCTask;
                break;
            case 'D':
                totalXP += xpConfig.priorityDTask;
                break;
        }
    });
    
    // XP por proyectos completados
    const completedProjects = projects.filter(project => project.completedAt);
    totalXP += completedProjects.length * xpConfig.projectCompleted;
    
    // XP por streak de días (simulado)
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = tasks.filter(task => {
        const taskDate = task.createdAt ? new Date(task.createdAt).toISOString().split('T')[0] : today;
        return taskDate === today;
    });
    
    if (todayTasks.length > 0) {
        totalXP += xpConfig.streakDay;
    }
    
    // XP por día perfecto (todas las tareas del día completadas)
    const todayCompletedTasks = todayTasks.filter(task => task.done);
    if (todayTasks.length > 0 && todayCompletedTasks.length === todayTasks.length) {
        totalXP += xpConfig.perfectDay;
    }
    
    return Math.floor(totalXP);
}

// Obtener sugerencias de XP para mejorar
export function getXPSuggestions(tasks = [], projects = []) {
    const suggestions = [];
    
    // Verificar tareas pendientes
    const pendingTasks = tasks.filter(task => !task.done);
    if (pendingTasks.length > 0) {
        suggestions.push({
            type: 'task',
            message: `Completa ${pendingTasks.length} tareas pendientes para ganar XP`,
            potentialXP: pendingTasks.length * xpConfig.taskCompleted
        });
    }
    
    // Verificar proyectos activos
    const activeProjects = projects.filter(project => !project.completedAt);
    if (activeProjects.length > 0) {
        suggestions.push({
            type: 'project',
            message: `Completa proyectos para ganar ${xpConfig.projectCompleted} XP cada uno`,
            potentialXP: activeProjects.length * xpConfig.projectCompleted
        });
    }
    
    // Verificar tareas de alta prioridad
    const highPriorityTasks = tasks.filter(task => !task.done && (task.priority === 'A' || task.priority === 'B'));
    if (highPriorityTasks.length > 0) {
        suggestions.push({
            type: 'priority',
            message: `Enfócate en tareas de alta prioridad para XP extra`,
            potentialXP: highPriorityTasks.length * 15
        });
    }
    
    return suggestions;
}
