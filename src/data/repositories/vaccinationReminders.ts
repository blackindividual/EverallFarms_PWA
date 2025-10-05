import type { VaccinationReminderEntity } from '../entities/types'

export interface VaccinationRemindersRepository {
  getActiveCount(batchId: string): Promise<number>
  getByBatch(batchId: string): Promise<VaccinationReminderEntity[]>
  addMany(reminders: Omit<VaccinationReminderEntity, 'id'>[]): Promise<void>
  deleteByBatch(batchId: string): Promise<void>
}

