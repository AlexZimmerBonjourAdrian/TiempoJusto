// ============================================================================
// MAPPER DE TAREAS - TIEMPOJUSTO
// ============================================================================

import { Task } from '../../types';
import { TaskEntity } from '../entities/task.entity';
import {
  CreateTaskDTO,
  UpdateTaskDTO,
  TaskResponseDTO
} from '../dto/task.dto';

/**
 * Mapper entre diferentes representaciones de Tarea
 * Convierte entre DTOs, Entities y tipos originales
 */
export class TaskMapper {
  // ============================================================================
  // DTO → ENTIDAD
  // ============================================================================

  /**
   * Convierte CreateTaskDTO a TaskEntity
   */
  static fromCreateDTO(dto: CreateTaskDTO): TaskEntity {
    return new TaskEntity({
      title: dto.title,
      description: dto.description,
      priority: dto.priority,
      projectId: dto.projectId,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      estimatedTime: dto.estimatedTime,
      tags: dto.tags || [],
      isRecurring: dto.isRecurring || false,
      recurringPattern: dto.recurringPattern
    });
  }

  /**
   * Aplica UpdateTaskDTO a TaskEntity existente
   */
  static applyUpdateDTO(entity: TaskEntity, dto: UpdateTaskDTO): TaskEntity {
    const updates: Partial<TaskEntity> = {};

    if (dto.title !== undefined) updates.title = dto.title;
    if (dto.description !== undefined) updates.description = dto.description;
    if (dto.priority !== undefined) updates.priority = dto.priority;
    if (dto.status !== undefined) updates.status = dto.status;
    if (dto.projectId !== undefined) updates.projectId = dto.projectId;
    if (dto.dueDate !== undefined) {
      updates.dueDate = dto.dueDate ? new Date(dto.dueDate) : undefined;
    }
    if (dto.estimatedTime !== undefined) updates.estimatedTime = dto.estimatedTime;
    if (dto.actualTime !== undefined) updates.actualTime = dto.actualTime;
    if (dto.tags !== undefined) updates.tags = dto.tags;
    if (dto.notes !== undefined) updates.notes = dto.notes;

    // Crear nueva entidad con las actualizaciones
    return new TaskEntity({
      ...entity,
      ...updates,
      updatedAt: new Date()
    });
  }

  // ============================================================================
  // ENTIDAD → DTO
  // ============================================================================

  /**
   * Convierte TaskEntity a TaskResponseDTO
   * Incluye projectName opcional para evitar joins en UI
   */
  static toResponseDTO(
    entity: TaskEntity,
    projectName?: string
  ): TaskResponseDTO {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      priority: entity.priority,
      status: entity.status,
      projectId: entity.projectId,
      projectName,
      dueDate: entity.dueDate?.toISOString(),
      estimatedTime: entity.estimatedTime,
      actualTime: entity.actualTime,
      tags: entity.tags,
      isRecurring: entity.isRecurring,
      completedAt: entity.completedAt?.toISOString(),
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString()
    };
  }

  /**
   * Convierte array de TaskEntity a TaskResponseDTO[]
   * Incluye map de nombres de proyectos para optimización
   */
  static toResponseDTOArray(
    entities: TaskEntity[],
    projectMap?: Map<string, string>
  ): TaskResponseDTO[] {
    return entities.map(entity =>
      this.toResponseDTO(
        entity,
        projectMap?.get(entity.projectId)
      )
    );
  }

  // ============================================================================
  // ENTIDAD ↔ TIPO ORIGINAL (COMPATIBILIDAD)
  // ============================================================================

  /**
   * Convierte Task (tipo original) a TaskEntity
   * Para compatibilidad con código existente
   */
  static fromTask(task: Task): TaskEntity {
    return TaskEntity.fromTask(task);
  }

  /**
   * Convierte TaskEntity a Task (tipo original)
   * Para compatibilidad con código existente
   */
  static toTask(entity: TaskEntity): Task {
    return entity.toTask();
  }

  /**
   * Convierte array de Task a TaskEntity[]
   */
  static fromTaskArray(tasks: Task[]): TaskEntity[] {
    return tasks.map(task => this.fromTask(task));
  }

  /**
   * Convierte array de TaskEntity a Task[]
   */
  static toTaskArray(entities: TaskEntity[]): Task[] {
    return entities.map(entity => this.toTask(entity));
  }
}


