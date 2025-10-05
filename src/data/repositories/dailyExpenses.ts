import type { DailyExpenseEntity } from '../entities/types'
import type { ObservableLike } from './types'

export interface DailyExpensesRepository {
  getById(id: string): Promise<DailyExpenseEntity | undefined>
  listByBatch(batchId: string): Promise<DailyExpenseEntity[]>
  getByBatchAndDate(batchId: string, date: string): Promise<DailyExpenseEntity | undefined>
  create(input: Omit<DailyExpenseEntity, 'id'>): Promise<DailyExpenseEntity>
  update(patch: Partial<DailyExpenseEntity> & { id: string }): Promise<void>
  remove(id: string): Promise<void>
  watchByBatch(batchId: string): ObservableLike<DailyExpenseEntity[]>
}

