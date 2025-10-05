import { liveQuery } from 'dexie'
import { db } from '../../../data/db'
import type { DailyMedicationEntity } from '../../../data/entities/types'
import type { DailyMedicationsRepository } from '../../../data/repositories/dailyMedications'
import { createId } from '../../../core/id'

export function createDailyMedicationsRepository(): DailyMedicationsRepository {
  return {
    async getById(id) {
      return db.daily_medications.get(id)
    },
    async listByBatch(batchId) {
      return db.daily_medications.where({ batchId }).reverse().sortBy('date')
    },
    async getByBatchAndDate(batchId, date) {
      return db.daily_medications.where('[batchId+date]').equals([batchId, date]).first()
    },
    async create(input) {
      const entity: DailyMedicationEntity = { id: createId(), ...input }
      await db.daily_medications.add(entity)
      return entity
    },
    async update(patch) {
      const { id, ...rest } = patch
      await db.daily_medications.update(id, rest)
    },
    async remove(id) {
      await db.daily_medications.delete(id)
    },
    watchByBatch(batchId) {
      const obs = liveQuery(() => db.daily_medications.where({ batchId }).sortBy('date'))
      return obs as any
    },
  }
}

