import type { DailyMortalityEntity } from '../entities/types'
import type { ObservableLike } from './types'

export interface DailyMortalityRepository {
  getById(id: string): Promise<DailyMortalityEntity | undefined>
  listByBatch(batchId: string): Promise<DailyMortalityEntity[]>
  getByBatchAndDate(batchId: string, date: string): Promise<DailyMortalityEntity | undefined>
  create(input: Omit<DailyMortalityEntity, 'id'>): Promise<DailyMortalityEntity>
  update(patch: Partial<DailyMortalityEntity> & { id: string }): Promise<void>
  remove(id: string): Promise<void>
  watchByBatch(batchId: string): ObservableLike<DailyMortalityEntity[]>
}

