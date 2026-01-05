// ============================================================================
// SERVICIO DE TAREAS - TIEMPOJUSTO
// ============================================================================

import { Task, CreateTaskData, UpdateTaskData, TaskFilters, TaskSortOptions, TaskStatistics } from '../../../shared/types';
import { storageService } from '../../../shared/storage';
import { STORAGE_KEYS } from '../../../shared/constants';
import { debugUtils, productivityUtils, arrayUtils } from '../../../shared/utils';
import { TaskFactory } from '../../../shared/factories';
import { TaskRepository } from '../../../shared/data/repositories';
import { TaskEntity } from '../../../shared/data/entities';
import { TaskMapper } from '../../../shared/data/mappers';

// ============================================================================
// CLASE DEL SERVICIO DE TAREAS
// ============================================================================

export class TaskService {
  private tasks: Task[] = [];
  private readonly storageKey = STORAGE_KEYS.TASKS;
  private repository: TaskRepository;

  constructor() {
    this.repository = new TaskRepository();
  }

  // ============================================================================
  // MÉTODOS DE INICIALIZACIÓN
  // ============================================================================

  async initialize(): Promise<void> {
    try {
      // Initialize repository
      this.repository = new TaskRepository();

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
      // 1. Validar que el projectId sea obligatorio
      if (!data.projectId || data.projectId.trim() === '') {
        throw new Error('El projectId es obligatorio. Una tarea debe pertenecer a un proyecto.');
      }

      // 2. Validar duplicados usando repository
      const existingTasks = await this.repository.findByProject(data.projectId);
      const existingTask = existingTasks.find(
        task => task.title.toLowerCase() === data.title.toLowerCase()
      );

      if (existingTask) {
        throw new Error(`Ya existe una tarea con el título "${data.title}" en este proyecto.`);
      }

      // 3. Crear tarea usando Factory
      const task = data.isRecurring
        ? TaskFactory.createRecurring(data)
        : TaskFactory.createStandard(data);

      // 4. Convertir a Entity
      const entity = TaskEntity.fromTask(task);

      // 5. Guardar en repository
      const savedEntity = await this.repository.create(entity);

      // 6. Mantener compatibilidad: actualizar array interno y guardar en storage
      const savedTask = savedEntity.toTask();
      this.tasks.push(savedTask);
      await this.saveTasks();

      debugUtils.log('Task created successfully', { id: savedTask.id, title: savedTask.title, projectId: savedTask.projectId });
      return savedTask;
    } catch (error) {
      debugUtils.error('Error creating task', error);
      throw error;
    }
  }

  async updateTask(id: string, data: UpdateTaskData): Promise<Task> {
    try {
      // 1. Obtener la entidad del repository
      const entity = await this.repository.findById(id);
      if (!entity) {
        throw new Error(`Task with id ${id} not found`);
      }

      // 2. Validar cambios de projectId si aplica
      if (data.projectId !== undefined && data.projectId !== entity.projectId) {
        if (!data.projectId || data.projectId.trim() === '') {
          throw new Error('El projectId no puede estar vacío. Una tarea debe pertenecer a un proyecto.');
        }

        // Validar que no exista otra tarea con el mismo título en el nuevo proyecto
        const tasksInNewProject = await this.repository.findByProject(data.projectId);
        const existingTask = tasksInNewProject.find(
          t => t.id !== id && t.title.toLowerCase() === entity.title.toLowerCase()
        );

        if (existingTask) {
          throw new Error(`Ya existe una tarea con el título "${entity.title}" en el proyecto seleccionado.`);
        }
      }

      // 3. Aplicar lógica de negocio usando la entidad
      if (data.status === 'completed' && entity.status !== 'completed') {
        entity.complete(); // Usa el método de negocio de la entidad
      } else {
        // Aplicar otras actualizaciones
        if (data.title !== undefined) entity.title = data.title;
        if (data.description !== undefined) entity.description = data.description;
        if (data.priority !== undefined) entity.updatePriority(data.priority);
        if (data.status !== undefined && data.status !== 'completed') entity.status = data.status;
        if (data.projectId !== undefined) entity.projectId = data.projectId;
        if (data.dueDate !== undefined) entity.dueDate = data.dueDate ? new Date(data.dueDate) : undefined;
        if (data.estimatedTime !== undefined) entity.estimatedTime = data.estimatedTime;
        if (data.actualTime !== undefined) entity.actualTime = data.actualTime;
        if (data.tags !== undefined) entity.tags = data.tags;
        if (data.notes !== undefined) entity.notes = data.notes;
        entity.updatedAt = new Date();
      }

      // 4. Guardar en repository
      const updatedEntity = await this.repository.update(id, entity);

      // 5. Mantener sincronización con lista local (compatibilidad)
      const updatedTask = updatedEntity.toTask();
      const taskIndex = this.tasks.findIndex(t => t.id === id);
      if (taskIndex !== -1) {
        this.tasks[taskIndex] = updatedTask;
        await this.saveTasks();
      }

      debugUtils.log('Task updated successfully', { id, updates: data });
      return updatedTask; // Retornar Task para compatibilidad
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
        status: 'completed'
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
