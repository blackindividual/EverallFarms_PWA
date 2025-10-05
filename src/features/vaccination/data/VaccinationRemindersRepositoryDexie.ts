import { db } from '../../../data/db'
import type { VaccinationRemindersRepository } from '../../../data/repositories/vaccinationReminders'
import type { VaccinationReminderEntity } from '../../../data/entities/types'

export function createVaccinationRemindersRepository(): VaccinationRemindersRepository {
  return {
    async getActiveCount(batchId: string) {
      return db.vaccination_reminders.where({ batchId, isEnabled: true as any }).count()
    },
    async getByBatch(batchId: string) {
      return db.vaccination_reminders.where({ batchId }).sortBy('vaccinationDate')
    },
    async addMany(reminders: Omit<VaccinationReminderEntity, 'id'>[]) {
      await db.vaccination_reminders.bulkAdd(reminders as VaccinationReminderEntity[])
    },
    async deleteByBatch(batchId: string) {
      await db.vaccination_reminders.where({ batchId }).delete()
    },
  }
}

