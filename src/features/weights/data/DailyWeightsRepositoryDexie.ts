import { liveQuery } from 'dexie'
import { db } from '../../../data/db'
import type { DailyWeightEntity } from '../../../data/entities/types'
import type { DailyWeightsRepository } from '../../../data/repositories/dailyWeights'
import { createId } from '../../../core/id'

export function createDailyWeightsRepository(): DailyWeightsRepository {
  return {
    async getById(id) {
      return db.daily_weights.get(id)
    },
    async listByBatch(batchId) {
      return db.daily_weights.where({ batchId }).reverse().sortBy('date')
    },
    async getByBatchAndDate(batchId, date) {
      return db.daily_weights.where('[batchId+date]').equals([batchId, date]).first()
    },
    async create(input) {
      const existing = await db.daily_weights.where('[batchId+date]').equals([input.batchId, input.date]).first()
      if (existing) throw new Error('Daily weight for this date already exists')
      const entity: DailyWeightEntity = { id: createId(), ...input }
      await db.daily_weights.add(entity)
      return entity
    },
    async update(patch) {
      const { id, ...rest } = patch
      await db.daily_weights.update(id, rest)
    },
    async remove(id) {
      await db.daily_weights.delete(id)
    },
    watchByBatch(batchId) {
      const obs = liveQuery(() => db.daily_weights.where({ batchId }).sortBy('date'))
      return obs as any
    },
  }
}

