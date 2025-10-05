import type { DailyWeightEntity } from '../entities/types'
import type { ObservableLike } from './types'

export interface DailyWeightsRepository {
  getById(id: string): Promise<DailyWeightEntity | undefined>
  listByBatch(batchId: string): Promise<DailyWeightEntity[]>
  getByBatchAndDate(batchId: string, date: string): Promise<DailyWeightEntity | undefined>
  create(input: Omit<DailyWeightEntity, 'id'>): Promise<DailyWeightEntity>
  update(patch: Partial<DailyWeightEntity> & { id: string }): Promise<void>
  remove(id: string): Promise<void>
  watchByBatch(batchId: string): ObservableLike<DailyWeightEntity[]>
}

