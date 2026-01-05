// ============================================================================
// REPOSITORY BASE - TIEMPOJUSTO
// ============================================================================

import { storageService } from '../../storage';

/**
 * Interfaz genérica para repositorios
 * Define las operaciones básicas de persistencia
 */
export interface IRepository<TEntity> {
  findAll(): Promise<TEntity[]>;
  findById(id: string): Promise<TEntity | null>;
  create(entity: TEntity): Promise<TEntity>;
  update(id: string, entity: TEntity): Promise<TEntity>;
  delete(id: string): Promise<void>;
  saveAll(entities: TEntity[]): Promise<void>;
}

/**
 * Clase abstracta base para repositorios
 * Implementa operaciones comunes de persistencia usando AsyncStorage
 */
export abstract class BaseRepository<TEntity, TModel = TEntity>
  implements IRepository<TEntity> {

  /**
   * Clave de almacenamiento (debe ser definida por subclases)
   */
  protected abstract storageKey: string;

  /**
   * Serializa entidad para persistencia
   */
  protected abstract serialize(entity: TEntity): TModel;

  /**
   * Deserializa modelo a entidad
   */
  protected abstract deserialize(model: TModel): TEntity;

  /**
   * Obtiene todas las entidades
   */
  async findAll(): Promise<TEntity[]> {
    try {
      const models = await storageService.get<TModel[]>(this.storageKey) || [];
      return models.map(model => this.deserialize(model));
    } catch (error) {
      console.error(`Error finding all entities in ${this.storageKey}:`, error);
      return [];
    }
  }

  /**
   * Obtiene una entidad por ID
   */
  async findById(id: string): Promise<TEntity | null> {
    try {
      const entities = await this.findAll();
      return entities.find((entity: any) => entity.id === id) || null;
    } catch (error) {
      console.error(`Error finding entity by id ${id} in ${this.storageKey}:`, error);
      return null;
    }
  }

  /**
   * Crea una nueva entidad
   */
  async create(entity: TEntity): Promise<TEntity> {
    try {
      const entities = await this.findAll();
      entities.push(entity);
      await this.saveAll(entities);
      return entity;
    } catch (error) {
      console.error(`Error creating entity in ${this.storageKey}:`, error);
      throw error;
    }
  }

  /**
   * Actualiza una entidad existente
   */
  async update(id: string, entity: TEntity): Promise<TEntity> {
    try {
      const entities = await this.findAll();
      const index = entities.findIndex((e: any) => e.id === id);

      if (index === -1) {
        throw new Error(`Entity with id ${id} not found`);
      }

      entities[index] = entity;
      await this.saveAll(entities);
      return entity;
    } catch (error) {
      console.error(`Error updating entity ${id} in ${this.storageKey}:`, error);
      throw error;
    }
  }

  /**
   * Elimina una entidad
   */
  async delete(id: string): Promise<void> {
    try {
      const entities = await this.findAll();
      const filteredEntities = entities.filter((entity: any) => entity.id !== id);
      await this.saveAll(filteredEntities);
    } catch (error) {
      console.error(`Error deleting entity ${id} in ${this.storageKey}:`, error);
      throw error;
    }
  }

  /**
   * Guarda todas las entidades
   */
  async saveAll(entities: TEntity[]): Promise<void> {
    try {
      const models = entities.map(entity => this.serialize(entity));
      await storageService.set(this.storageKey, models);
    } catch (error) {
      console.error(`Error saving all entities in ${this.storageKey}:`, error);
      throw error;
    }
  }

  /**
   * Busca entidades por predicado
   */
  async findBy(predicate: (entity: TEntity) => boolean): Promise<TEntity[]> {
    try {
      const entities = await this.findAll();
      return entities.filter(predicate);
    } catch (error) {
      console.error(`Error finding entities by predicate in ${this.storageKey}:`, error);
      return [];
    }
  }

  /**
   * Cuenta entidades
   */
  async count(): Promise<number> {
    try {
      const entities = await this.findAll();
      return entities.length;
    } catch (error) {
      console.error(`Error counting entities in ${this.storageKey}:`, error);
      return 0;
    }
  }

  /**
   * Verifica si existe entidad con ID
   */
  async exists(id: string): Promise<boolean> {
    try {
      const entity = await this.findById(id);
      return entity !== null;
    } catch (error) {
      console.error(`Error checking existence of entity ${id} in ${this.storageKey}:`, error);
      return false;
    }
  }
}


