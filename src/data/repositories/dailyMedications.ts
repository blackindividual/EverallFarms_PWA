import type { DailyMedicationEntity } from '../entities/types'
import type { ObservableLike } from './types'

export interface DailyMedicationsRepository {
  getById(id: string): Promise<DailyMedicationEntity | undefined>
  listByBatch(batchId: string): Promise<DailyMedicationEntity[]>
  getByBatchAndDate(batchId: string, date: string): Promise<DailyMedicationEntity | undefined>
  create(input: Omit<DailyMedicationEntity, 'id'>): Promise<DailyMedicationEntity>
  update(patch: Partial<DailyMedicationEntity> & { id: string }): Promise<void>
  remove(id: string): Promise<void>
  watchByBatch(batchId: string): ObservableLike<DailyMedicationEntity[]>
}

