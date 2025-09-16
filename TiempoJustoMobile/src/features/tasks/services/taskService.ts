// ============================================================================
// SERVICIO DE TAREAS - TIEMPOJUSTO
// ============================================================================

import { Task, CreateTaskData, UpdateTaskData, TaskFilters, TaskSortOptions, TaskStatistics } from '../../../shared/types';
import { storageService } from '../../../shared/storage';
import { STORAGE_KEYS } from '../../../shared/constants';
import { debugUtils, productivityUtils, arrayUtils } from '../../../shared/utils';

// ============================================================================
// CLASE DEL SERVICIO DE TAREAS
// ============================================================================

export class TaskService {
  private tasks: Task[] = [];
  private readonly storageKey = STORAGE_KEYS.TASKS;

  // ============================================================================
  // MÉTODOS DE INICIALIZACIÓN
  // ============================================================================

  async initialize(): Promise<void> {
    try {
      await this.loadTasks();
      debugUtils.log('TaskService initialized successfully');
    } catch (error) {
      debugUtils.error('Error initializing TaskService', error);
      throw error;
    }
  }

  // ============================================================================
  // MÉTODOS DE CRUD
  // ============================================================================

  async createTask(data: CreateTaskData): Promise<Task> {
    try {
      const task: Task = {
        id: this.generateId(),
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: 'pending',
        projectId: data.projectId,
        dueDate: data.dueDate,
        estimatedTime: data.estimatedTime,
        actualTime: undefined,
        tags: data.tags || [],
        isRecurring: data.isRecurring || false,
        recurringPattern: data.recurringPattern,
        completedAt: undefined,
        notes: undefined,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.tasks.push(task);
      await this.saveTasks();
      
      debugUtils.log('Task created successfully', { id: task.id, title: task.title });
      return task;
    } catch (error) {
      debugUtils.error('Error creating task', error);
      throw error;
    }
  }

  async updateTask(id: string, data: UpdateTaskData): Promise<Task> {
    try {
      const taskIndex = this.tasks.findIndex(task => task.id === id);
      if (taskIndex === -1) {
        throw new Error(`Task with id ${id} not found`);
      }

      const task = this.tasks[taskIndex];
      const updatedTask: Task = {
        ...task,
        ...data,
        updatedAt: new Date()
      };

      // Si se marca como completada, establecer completedAt
      if (data.status === 'completed' && task.status !== 'completed') {
        updatedTask.completedAt = new Date();
      }

      this.tasks[taskIndex] = updatedTask;
      await this.saveTasks();
      
      debugUtils.log('Task updated successfully', { id, updates: data });
      return updatedTask;
    } catch (error) {
      debugUtils.error('Error updating task', error);
      throw error;
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      const taskIndex = this.tasks.findIndex(task => task.id === id);
      if (taskIndex === -1) {
        throw new Error(`Task with id ${id} not found`);
      }

      this.tasks.splice(taskIndex, 1);
      await this.saveTasks();
      
      debugUtils.log('Task deleted successfully', { id });
    } catch (error) {
      debugUtils.error('Error deleting task', error);
      throw error;
    }
  }

  async completeTask(id: string): Promise<Task> {
    try {
      return await this.updateTask(id, { 
        status: 'completed',
        completedAt: new Date()
      });
    } catch (error) {
      debugUtils.error('Error completing task', error);
      throw error;
    }
  }

  // ============================================================================
  // MÉTODOS DE CONSULTA
  // ============================================================================

  getTasks(): Task[] {
    return [...this.tasks];
  }

  getTaskById(id: string): Task | undefined {
    return this.tasks.find(task => task.id === id);
  }

  getTasksByProject(projectId: string): Task[] {
    return this.tasks.filter(task => task.projectId === projectId);
  }

  getTasksByPriority(priority: string): Task[] {
    return this.tasks.filter(task => task.priority === priority);
  }

  getTasksByStatus(status: string): Task[] {
    return this.tasks.filter(task => task.status === status);
  }

  getTasksByDate(date: Date): Task[] {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return this.tasks.filter(task => {
      if (!task.dueDate) return false;
      return task.dueDate >= startOfDay && task.dueDate <= endOfDay;
    });
  }

  // ============================================================================
  // MÉTODOS DE FILTRADO Y ORDENAMIENTO
  // ============================================================================

  filterTasks(filters: TaskFilters): Task[] {
    let filteredTasks = [...this.tasks];

    // Filtrar por estado
    if (filters.status && filters.status.length > 0) {
      filteredTasks = filteredTasks.filter(task => 
        filters.status!.includes(task.status)
      );
    }

    // Filtrar por prioridad
    if (filters.priority && filters.priority.length > 0) {
      filteredTasks = filteredTasks.filter(task => 
        filters.priority!.includes(task.priority)
      );
    }

    // Filtrar por proyecto
    if (filters.projectId) {
      filteredTasks = filteredTasks.filter(task => 
        task.projectId === filters.projectId
      );
    }

    // Filtrar por tags
    if (filters.tags && filters.tags.length > 0) {
      filteredTasks = filteredTasks.filter(task => 
        filters.tags!.some(tag => task.tags.includes(tag))
      );
    }

    // Filtrar por fecha de vencimiento
    if (filters.dueDate) {
      if (filters.dueDate.from) {
        filteredTasks = filteredTasks.filter(task => 
          task.dueDate && task.dueDate >= filters.dueDate!.from!
        );
      }
      if (filters.dueDate.to) {
        filteredTasks = filteredTasks.filter(task => 
          task.dueDate && task.dueDate <= filters.dueDate!.to!
        );
      }
    }

    // Filtrar por búsqueda
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredTasks = filteredTasks.filter(task => 
        task.title.toLowerCase().includes(searchTerm) ||
        (task.description && task.description.toLowerCase().includes(searchTerm))
      );
    }

    return filteredTasks;
  }

  sortTasks(tasks: Task[], options: TaskSortOptions): Task[] {
    return arrayUtils.sortBy(tasks, options.field, options.direction);
  }

  // ============================================================================
  // MÉTODOS DE ESTADÍSTICAS
  // ============================================================================

  getStatistics(): TaskStatistics {
    const total = this.tasks.length;
    const completed = this.tasks.filter(task => task.status === 'completed').length;
    const pending = this.tasks.filter(task => task.status === 'pending').length;
    const inProgress = this.tasks.filter(task => task.status === 'in_progress').length;
    const cancelled = this.tasks.filter(task => task.status === 'cancelled').length;

    const completionRate = productivityUtils.calculateCompletionRate(total, completed);

    // Distribución por prioridad
    const priorityDistribution = this.tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Distribución por estado
    const statusDistribution = this.tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Tiempo promedio de completitud
    const completedTasksWithTime = this.tasks.filter(task => 
      task.status === 'completed' && task.actualTime && task.estimatedTime
    );
    const averageCompletionTime = productivityUtils.calculateAverageCompletionTime(completedTasksWithTime);

    // Completitud diaria (últimos 7 días)
    const dailyCompletion: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      const dayTasks = this.getTasksByDate(date);
      dailyCompletion[dateKey] = dayTasks.filter(task => task.status === 'completed').length;
    }

    // Completitud semanal (últimas 4 semanas)
    const weeklyCompletion: Record<string, number> = {};
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i * 7));
      const weekKey = `Week ${i + 1}`;
      let weekCompleted = 0;
      
      for (let j = 0; j < 7; j++) {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + j);
        const dayTasks = this.getTasksByDate(date);
        weekCompleted += dayTasks.filter(task => task.status === 'completed').length;
      }
      
      weeklyCompletion[weekKey] = weekCompleted;
    }

    // Completitud mensual (últimos 6 meses)
    const monthlyCompletion: Record<string, number> = {};
    for (let i = 5; i >= 0; i--) {
      const month = new Date();
      month.setMonth(month.getMonth() - i);
      const monthKey = month.toISOString().substring(0, 7);
      const monthTasks = this.tasks.filter(task => {
        if (!task.completedAt) return false;
        const taskMonth = task.completedAt.toISOString().substring(0, 7);
        return taskMonth === monthKey;
      });
      monthlyCompletion[monthKey] = monthTasks.length;
    }

    return {
      total,
      completed,
      pending,
      inProgress,
      cancelled,
      completionRate,
      averageCompletionTime,
      priorityDistribution,
      statusDistribution,
      dailyCompletion,
      weeklyCompletion,
      monthlyCompletion
    };
  }

  // ============================================================================
  // MÉTODOS PRIVADOS
  // ============================================================================

  private async loadTasks(): Promise<void> {
    try {
      const tasks = await storageService.get<Task[]>(this.storageKey);
      this.tasks = tasks || [];
      debugUtils.log(`Loaded ${this.tasks.length} tasks from storage`);
    } catch (error) {
      debugUtils.error('Error loading tasks from storage', error);
      this.tasks = [];
    }
  }

  private async saveTasks(): Promise<void> {
    try {
      await storageService.set(this.storageKey, this.tasks);
      debugUtils.log(`Saved ${this.tasks.length} tasks to storage`);
    } catch (error) {
      debugUtils.error('Error saving tasks to storage', error);
      throw error;
    }
  }

  private generateId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// ============================================================================
// INSTANCIA SINGLETON
// ============================================================================

export const taskService = new TaskService();
