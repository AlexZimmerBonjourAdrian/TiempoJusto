import { validateTask } from '../../../storage';

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
        this.cacheExpiry = 5 * 60 * 1000;
    }

    validateTaskWithBusinessRules(task, existingTasks = []) {
        const validationErrors = validateTask(task);
        if (existingTasks.length >= BUSINESS_RULES.MAX_TASKS_PER_DAY) {
            validationErrors.push(`No puedes crear más de ${BUSINESS_RULES.MAX_TASKS_PER_DAY} tareas por día`);
        }
        if (task.title && task.title.length > BUSINESS_RULES.MAX_TITLE_LENGTH) {
            validationErrors.push(`El título no puede tener más de ${BUSINESS_RULES.MAX_TITLE_LENGTH} caracteres`);
        }
        const isDuplicate = existingTasks.some(existingTask => 
            existingTask.title.toLowerCase().trim() === task.title.toLowerCase().trim() &&
            !existingTask.done
        );
        if (isDuplicate) {
            validationErrors.push('Ya existe una tarea pendiente con este título');
        }
        return validationErrors;
    }

    calculateSmartPriority(task, existingTasks = []) {
        const { title } = task;
        const highPriorityKeywords = ['urgente', 'crítico', 'importante', 'deadline', 'fecha límite'];
        const hasHighPriorityKeyword = highPriorityKeywords.some(keyword => title.toLowerCase().includes(keyword));
        if (hasHighPriorityKeyword) return 'A';
        if (existingTasks.length === 0) return 'B';
        const highPriorityCount = existingTasks.filter(t => BUSINESS_RULES.IMPORTANT_PRIORITIES.includes(t.priority)).length;
        if (highPriorityCount > 5) return 'C';
        return 'C';
    }

    sortTasksIntelligently(tasks) {
        if (!Array.isArray(tasks)) return [];
        return [...tasks].sort((a, b) => {
            if (a.done !== b.done) return Number(a.done) - Number(b.done);
            const aWeight = BUSINESS_RULES.PRIORITY_WEIGHTS[a.priority || 'C'];
            const bWeight = BUSINESS_RULES.PRIORITY_WEIGHTS[b.priority || 'C'];
            if (aWeight !== bWeight) return bWeight - aWeight;
            const aDate = new Date(a.createdAt || 0);
            const bDate = new Date(b.createdAt || 0);
            return aDate - bDate;
        });
    }

    filterTasksAdvanced(tasks, filters = {}) {
        if (!Array.isArray(tasks)) return [];
        let filtered = tasks;
        if (filters.projectId !== null && filters.projectId !== undefined) {
            filtered = filtered.filter(task => task.projectId === filters.projectId);
        }
        if (filters.priority) {
            filtered = filtered.filter(task => task.priority === filters.priority);
        }
        if (filters.done !== null && filters.done !== undefined) {
            filtered = filtered.filter(task => task.done === filters.done);
        }
        if (filters.searchText) {
            const searchLower = filters.searchText.toLowerCase();
            filtered = filtered.filter(task => task.title.toLowerCase().includes(searchLower));
        }
        if (filters.dateRange) {
            const { start, end } = filters.dateRange;
            filtered = filtered.filter(task => {
                const taskDate = new Date(task.createdAt);
                return (!start || taskDate >= start) && (!end || taskDate <= end);
            });
        }
        return filtered;
    }

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
        const priorityBreakdown = { A: 0, B: 0, C: 0, D: 0 };
        tasks.forEach(task => {
            const priority = task.priority || 'C';
            if (Object.prototype.hasOwnProperty.call(priorityBreakdown, priority)) {
                priorityBreakdown[priority]++;
            }
        });
        const completedTasks = tasks.filter(task => task.done && task.completedAt);
        let averageCompletionTime = 0;
        if (completedTasks.length > 0) {
            const totalTime = completedTasks.reduce((sum, task) => {
                const created = new Date(task.createdAt);
                const completedAt = new Date(task.completedAt);
                return sum + (completedAt - created);
            }, 0);
            averageCompletionTime = Math.round(totalTime / completedTasks.length / (1000 * 60));
        }
        const productivityScore = this.calculateProductivityScore(tasks);
        return { total, completed, pending, completionRate, priorityBreakdown, averageCompletionTime, productivityScore };
    }

    calculateProductivityScore(tasks) {
        if (!Array.isArray(tasks) || tasks.length === 0) return 0;
        const completedTasks = tasks.filter(task => task.done);
        const highPriorityCompleted = completedTasks.filter(task => BUSINESS_RULES.IMPORTANT_PRIORITIES.includes(task.priority)).length;
        const totalHighPriority = tasks.filter(task => BUSINESS_RULES.IMPORTANT_PRIORITIES.includes(task.priority)).length;
        const completionRate = tasks.length > 0 ? completedTasks.length / tasks.length : 0;
        const highPriorityRate = totalHighPriority > 0 ? highPriorityCompleted / totalHighPriority : 0;
        const score = (completionRate * 0.6) + (highPriorityRate * 0.4);
        return Math.round(score * 100);
    }
}

const taskBusinessLogic = new TaskBusinessLogic();
export default taskBusinessLogic;
export { default } from '../../../services/taskBusinessLogic';


