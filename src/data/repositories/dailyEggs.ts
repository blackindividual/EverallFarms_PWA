import type { DailyEggEntity } from '../entities/types'
import type { ObservableLike } from './types'

export interface DailyEggsRepository {
  getById(id: string): Promise<DailyEggEntity | undefined>
  listByBatch(batchId: string): Promise<DailyEggEntity[]>
  getByBatchAndDate(batchId: string, date: string): Promise<DailyEggEntity | undefined>
  create(input: Omit<DailyEggEntity, 'id'>): Promise<DailyEggEntity>
  update(patch: Partial<DailyEggEntity> & { id: string }): Promise<void>
  remove(id: string): Promise<void>
  watchByBatch(batchId: string): ObservableLike<DailyEggEntity[]>
}

