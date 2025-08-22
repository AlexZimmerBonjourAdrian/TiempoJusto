import { Alert } from 'react-native';
import { validateTask } from '../storage';

// Configuración de la lógica de negocio
const BUSINESS_RULES = {
    MAX_TASKS_PER_DAY: 50,
    MAX_TITLE_LENGTH: 200,
    PRIORITY_WEIGHTS: { A: 4, B: 3, C: 2, D: 1 },
    MOTIVATION_THRESHOLD: 0.3,
    IMPORTANT_PRIORITIES: ['A', 'B']
};

class TaskBusinessLogic {
    constructor() {
        this.taskCache = new Map();
        this.statsCache = null;
        this.lastStatsUpdate = 0;
        this.cacheExpiry = 5 * 60 * 1000; // 5 minutos
    }

    // Validación de tarea con reglas de negocio
    validateTaskWithBusinessRules(task, existingTasks = []) {
        const validationErrors = validateTask(task);
        
        // Reglas de negocio adicionales
        if (existingTasks.length >= BUSINESS_RULES.MAX_TASKS_PER_DAY) {
            validationErrors.push(`No puedes crear más de ${BUSINESS_RULES.MAX_TASKS_PER_DAY} tareas por día`);
        }
        
        if (task.title && task.title.length > BUSINESS_RULES.MAX_TITLE_LENGTH) {
            validationErrors.push(`El título no puede tener más de ${BUSINESS_RULES.MAX_TITLE_LENGTH} caracteres`);
        }
        
        // Verificar duplicados
        const isDuplicate = existingTasks.some(existingTask => 
            existingTask.title.toLowerCase().trim() === task.title.toLowerCase().trim() &&
            !existingTask.done
        );
        
        if (isDuplicate) {
            validationErrors.push('Ya existe una tarea pendiente con este título');
        }
        
        return validationErrors;
    }

    // Calcular prioridad inteligente basada en contexto
    calculateSmartPriority(task, existingTasks = []) {
        const { title, projectId } = task;
        
        // Palabras clave que indican alta prioridad
        const highPriorityKeywords = ['urgente', 'crítico', 'importante', 'deadline', 'fecha límite'];
        const hasHighPriorityKeyword = highPriorityKeywords.some(keyword => 
            title.toLowerCase().includes(keyword)
        );
        
        if (hasHighPriorityKeyword) {
            return 'A';
        }
        
        // Si es la primera tarea del día, dar prioridad media
        if (existingTasks.length === 0) {
            return 'B';
        }
        
        // Si hay muchas tareas de alta prioridad, bajar la prioridad
        const highPriorityCount = existingTasks.filter(t => 
            BUSINESS_RULES.IMPORTANT_PRIORITIES.includes(t.priority)
        ).length;
        
        if (highPriorityCount > 5) {
            return 'C';
        }
        
        return 'C'; // Prioridad por defecto
    }

    // Ordenar tareas con algoritmo inteligente
    sortTasksIntelligently(tasks) {
        if (!Array.isArray(tasks)) return [];
        
        return [...tasks].sort((a, b) => {
            // Primero por completadas
            if (a.done !== b.done) {
                return Number(a.done) - Number(b.done);
            }
            
            // Luego por prioridad con peso
            const aWeight = BUSINESS_RULES.PRIORITY_WEIGHTS[a.priority || 'C'];
            const bWeight = BUSINESS_RULES.PRIORITY_WEIGHTS[b.priority || 'C'];
            
            if (aWeight !== bWeight) {
                return bWeight - aWeight; // Prioridad más alta primero
            }
            
            // Si tienen la misma prioridad, por fecha de creación
            const aDate = new Date(a.createdAt || 0);
            const bDate = new Date(b.createdAt || 0);
            return aDate - bDate;
        });
    }

    // Filtrar tareas con lógica avanzada
    filterTasksAdvanced(tasks, filters = {}) {
        if (!Array.isArray(tasks)) return [];
        
        let filtered = tasks;
        
        // Filtro por proyecto
        if (filters.projectId !== null && filters.projectId !== undefined) {
            filtered = filtered.filter(task => task.projectId === filters.projectId);
        }
        
        // Filtro por prioridad
        if (filters.priority) {
            filtered = filtered.filter(task => task.priority === filters.priority);
        }
        
        // Filtro por estado
        if (filters.done !== null && filters.done !== undefined) {
            filtered = filtered.filter(task => task.done === filters.done);
        }
        
        // Filtro por texto
        if (filters.searchText) {
            const searchLower = filters.searchText.toLowerCase();
            filtered = filtered.filter(task => 
                task.title.toLowerCase().includes(searchLower)
            );
        }
        
        // Filtro por fecha
        if (filters.dateRange) {
            const { start, end } = filters.dateRange;
            filtered = filtered.filter(task => {
                const taskDate = new Date(task.createdAt);
                return (!start || taskDate >= start) && (!end || taskDate <= end);
            });
        }
        
        return filtered;
    }

    // Calcular estadísticas avanzadas
    calculateAdvancedStats(tasks) {
        if (!Array.isArray(tasks)) {
            return {
                total: 0,
                completed: 0,
                pending: 0,
                completionRate: 0,
                priorityBreakdown: { A: 0, B: 0, C: 0, D: 0 },
                averageCompletionTime: 0,
                productivityScore: 0
            };
        }
        
        const total = tasks.length;
        const completed = tasks.filter(task => task.done).length;
        const pending = total - completed;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        // Desglose por prioridad
        const priorityBreakdown = { A: 0, B: 0, C: 0, D: 0 };
        tasks.forEach(task => {
            const priority = task.priority || 'C';
            if (priorityBreakdown.hasOwnProperty(priority)) {
                priorityBreakdown[priority]++;
            }
        });
        
        // Tiempo promedio de completado
        const completedTasks = tasks.filter(task => task.done && task.completedAt);
        let averageCompletionTime = 0;
        
        if (completedTasks.length > 0) {
            const totalTime = completedTasks.reduce((sum, task) => {
                const created = new Date(task.createdAt);
                const completed = new Date(task.completedAt);
                return sum + (completed - created);
            }, 0);
            averageCompletionTime = Math.round(totalTime / completedTasks.length / (1000 * 60)); // en minutos
        }
        
        // Puntuación de productividad
        const productivityScore = this.calculateProductivityScore(tasks);
        
        return {
            total,
            completed,
            pending,
            completionRate,
            priorityBreakdown,
            averageCompletionTime,
            productivityScore
        };
    }

    // Calcular puntuación de productividad
    calculateProductivityScore(tasks) {
        if (!Array.isArray(tasks) || tasks.length === 0) return 0;
        
        const completedTasks = tasks.filter(task => task.done);
        const highPriorityCompleted = completedTasks.filter(task => 
            BUSINESS_RULES.IMPORTANT_PRIORITIES.includes(task.priority)
        ).length;
        
        const totalHighPriority = tasks.filter(task => 
            BUSINESS_RULES.IMPORTANT_PRIORITIES.includes(task.priority)
        ).length;
        
        const completionRate = tasks.length > 0 ? completedTasks.length / tasks.length : 0;
        const highPriorityRate = totalHighPriority > 0 ? highPriorityCompleted / totalHighPriority : 0;
        
        // Puntuación basada en completado general y prioridades importantes
        const score = (completionRate * 0.6) + (highPriorityRate * 0.4);
        return Math.round(score * 100);
    }

    // Determinar si mostrar notificación motivacional
    shouldShowMotivationalNotification(action, task = null) {
        // Probabilidad base
        let probability = BUSINESS_RULES.MOTIVATION_THRESHOLD;
        
        // Ajustar basado en la acción
        switch (action) {
            case 'task_completed':
                if (task && BUSINESS_RULES.IMPORTANT_PRIORITIES.includes(task.priority)) {
                    probability = 0.8; // Alta probabilidad para tareas importantes
                }
                break;
            case 'task_created':
                probability = 0.2; // Baja probabilidad al crear
                break;
            case 'productivity_boost':
                probability = 0.5; // Probabilidad media
                break;
            default:
                probability = 0.1; // Probabilidad baja por defecto
        }
        
        return Math.random() < probability;
    }

    // Generar sugerencias inteligentes
    generateTaskSuggestions(existingTasks, projects) {
        const suggestions = [];
        
        // Sugerir tareas basadas en proyectos sin tareas
        const projectsWithTasks = new Set(existingTasks.map(task => task.projectId).filter(Boolean));
        const projectsWithoutTasks = projects.filter(project => !projectsWithTasks.has(project.id));
        
        if (projectsWithoutTasks.length > 0) {
            suggestions.push({
                type: 'project_without_tasks',
                message: `Tienes ${projectsWithoutTasks.length} proyecto(s) sin tareas`,
                action: 'add_tasks_to_projects'
            });
        }
        
        // Sugerir revisar tareas antiguas
        const oldTasks = existingTasks.filter(task => {
            const created = new Date(task.createdAt);
            const daysOld = (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24);
            return daysOld > 7 && !task.done;
        });
        
        if (oldTasks.length > 0) {
            suggestions.push({
                type: 'old_tasks',
                message: `Tienes ${oldTasks.length} tarea(s) pendiente(s) por más de una semana`,
                action: 'review_old_tasks'
            });
        }
        
        // Sugerir balancear prioridades
        const priorityCounts = { A: 0, B: 0, C: 0, D: 0 };
        existingTasks.forEach(task => {
            const priority = task.priority || 'C';
            priorityCounts[priority]++;
        });
        
        if (priorityCounts.A > 5) {
            suggestions.push({
                type: 'too_many_high_priority',
                message: 'Tienes muchas tareas de alta prioridad. Considera reorganizar.',
                action: 'reorganize_priorities'
            });
        }
        
        return suggestions;
    }

    // Optimizar rendimiento con caché
    getCachedStats(tasks, forceUpdate = false) {
        const now = Date.now();
        
        if (!forceUpdate && this.statsCache && (now - this.lastStatsUpdate) < this.cacheExpiry) {
            return this.statsCache;
        }
        
        this.statsCache = this.calculateAdvancedStats(tasks);
        this.lastStatsUpdate = now;
        
        return this.statsCache;
    }

    // Limpiar caché
    clearCache() {
        this.taskCache.clear();
        this.statsCache = null;
        this.lastStatsUpdate = 0;
    }

    // Validar y limpiar datos corruptos
    validateAndCleanTasks(tasks) {
        if (!Array.isArray(tasks)) return [];
        
        return tasks.filter(task => {
            // Validar estructura básica
            if (!task || typeof task !== 'object') return false;
            if (!task.id || !task.title) return false;
            
            // Validar tipos de datos
            if (typeof task.title !== 'string') return false;
            if (typeof task.done !== 'boolean') return false;
            if (task.priority && !['A', 'B', 'C', 'D'].includes(task.priority)) return false;
            
            // Validar fechas
            if (task.createdAt && isNaN(new Date(task.createdAt).getTime())) return false;
            if (task.completedAt && isNaN(new Date(task.completedAt).getTime())) return false;
            
            return true;
        });
    }

    // Exportar datos para backup
    exportTaskData(tasks) {
        return {
            version: '1.0.0',
            timestamp: Date.now(),
            totalTasks: tasks.length,
            tasks: tasks.map(task => ({
                id: task.id,
                title: task.title,
                done: task.done,
                priority: task.priority || 'C',
                projectId: task.projectId || null,
                createdAt: task.createdAt,
                completedAt: task.completedAt || null
            }))
        };
    }

    // Importar datos con validación
    importTaskData(data) {
        try {
            if (!data || !data.tasks || !Array.isArray(data.tasks)) {
                throw new Error('Formato de datos inválido');
            }
            
            const validatedTasks = data.tasks.map(task => ({
                id: task.id || String(Date.now() + Math.random()),
                title: task.title || 'Tarea sin título',
                done: Boolean(task.done),
                priority: ['A', 'B', 'C', 'D'].includes(task.priority) ? task.priority : 'C',
                projectId: task.projectId || null,
                createdAt: task.createdAt || new Date().toISOString(),
                completedAt: task.completedAt || null
            }));
            
            return validatedTasks;
        } catch (error) {
            console.error('Error importando datos:', error);
            throw new Error('No se pudieron importar los datos');
        }
    }
}

// Instancia singleton del servicio
const taskBusinessLogic = new TaskBusinessLogic();

export default taskBusinessLogic;
