import { liveQuery } from 'dexie'
import { db } from '../../../data/db'
import type { DailyExpenseEntity } from '../../../data/entities/types'
import type { DailyExpensesRepository } from '../../../data/repositories/dailyExpenses'
import { createId } from '../../../core/id'

export function createDailyExpensesRepository(): DailyExpensesRepository {
  return {
    async getById(id) {
      return db.daily_expenses.get(id)
    },
    async listByBatch(batchId) {
      return db.daily_expenses.where({ batchId }).reverse().sortBy('date')
    },
    async getByBatchAndDate(batchId, date) {
      return db.daily_expenses.where('[batchId+date]').equals([batchId, date]).first()
    },
    async create(input) {
      const entity: DailyExpenseEntity = { id: createId(), ...input }
      await db.daily_expenses.add(entity)
      return entity
    },
    async update(patch) {
      const { id, ...rest } = patch
      await db.daily_expenses.update(id, rest)
    },
    async remove(id) {
      await db.daily_expenses.delete(id)
    },
    watchByBatch(batchId) {
      const obs = liveQuery(() => db.daily_expenses.where({ batchId }).sortBy('date'))
      return obs as any
    },
  }
}

