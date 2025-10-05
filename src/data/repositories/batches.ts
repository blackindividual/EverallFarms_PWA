import type { BatchEntity } from '../entities/types'
import type { ObservableLike } from './types'

export interface BatchesRepository {
  getAll(): Promise<BatchEntity[]>
  getById(id: string): Promise<BatchEntity | undefined>
  create(input: Omit<BatchEntity, 'id'>): Promise<BatchEntity>
  update(patch: Partial<BatchEntity> & { id: string }): Promise<void>
  remove(id: string): Promise<void>
  watchAll(): ObservableLike<BatchEntity[]>
}
