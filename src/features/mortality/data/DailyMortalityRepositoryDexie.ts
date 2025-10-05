import { liveQuery } from 'dexie'
import { db } from '../../../data/db'
import type { DailyMortalityEntity } from '../../../data/entities/types'
import type { DailyMortalityRepository } from '../../../data/repositories/dailyMortality'
import { createId } from '../../../core/id'

export function createDailyMortalityRepository(): DailyMortalityRepository {
  return {
    async getById(id) {
      return db.daily_mortality.get(id)
    },
    async listByBatch(batchId) {
      return db.daily_mortality.where({ batchId }).reverse().sortBy('date')
    },
    async getByBatchAndDate(batchId, date) {
      return db.daily_mortality.where('[batchId+date]').equals([batchId, date]).first()
    },
    async create(input) {
      const existing = await db.daily_mortality.where('[batchId+date]').equals([input.batchId, input.date]).first()
      if (existing) throw new Error('Daily mortality for this date already exists')
      const entity: DailyMortalityEntity = { id: createId(), ...input }
      await db.daily_mortality.add(entity)
      return entity
    },
    async update(patch) {
      const { id, ...rest } = patch
      await db.daily_mortality.update(id, rest)
    },
    async remove(id) {
      await db.daily_mortality.delete(id)
    },
    watchByBatch(batchId) {
      const obs = liveQuery(() => db.daily_mortality.where({ batchId }).sortBy('date'))
      return obs as any
    },
  }
}

