import { liveQuery } from 'dexie'
import { db } from '../../../data/db'
import type { DailyEggEntity } from '../../../data/entities/types'
import type { DailyEggsRepository } from '../../../data/repositories/dailyEggs'
import { createId } from '../../../core/id'

export function createDailyEggsRepository(): DailyEggsRepository {
  return {
    async getById(id) {
      return db.daily_eggs.get(id)
    },
    async listByBatch(batchId) {
      return db.daily_eggs.where({ batchId }).reverse().sortBy('date')
    },
    async getByBatchAndDate(batchId, date) {
      return db.daily_eggs.where('[batchId+date]').equals([batchId, date]).first()
    },
    async create(input) {
      const existing = await db.daily_eggs.where('[batchId+date]').equals([input.batchId, input.date]).first()
      if (existing) throw new Error('Daily eggs for this date already exists')
      const entity: DailyEggEntity = { id: createId(), ...input }
      await db.daily_eggs.add(entity)
      return entity
    },
    async update(patch) {
      const { id, ...rest } = patch
      await db.daily_eggs.update(id, rest)
    },
    async remove(id) {
      await db.daily_eggs.delete(id)
    },
    watchByBatch(batchId) {
      const obs = liveQuery(() => db.daily_eggs.where({ batchId }).sortBy('date'))
      return obs as any
    },
  }
}

