import Dexie from 'dexie'
import type { Table } from 'dexie'
import type {
  BatchEntity,
  DailyWeightEntity,
  DailyEggEntity,
  DailyExpenseEntity,
  DailyMortalityEntity,
  DailyMedicationEntity,
  VaccinationReminderEntity,
} from './entities/types'

class EverallDb extends Dexie {
  batches!: Table<BatchEntity, string>
  daily_weights!: Table<DailyWeightEntity, string>
  daily_eggs!: Table<DailyEggEntity, string>
  daily_expenses!: Table<DailyExpenseEntity, string>
  daily_mortality!: Table<DailyMortalityEntity, string>
  daily_medications!: Table<DailyMedicationEntity, string>
  vaccination_reminders!: Table<VaccinationReminderEntity, number>

  constructor() {
    super('everallfarm_lite')
    this.version(1).stores({
      batches: 'id, startDate, birdType, name',
      daily_weights: 'id, batchId, date, [batchId+date]',
      daily_eggs: 'id, batchId, date, [batchId+date]',
      daily_expenses: 'id, batchId, date, [batchId+date]',
      daily_mortality: 'id, batchId, date, [batchId+date]',
      daily_medications: 'id, batchId, date, [batchId+date]',
      vaccination_reminders: '++id, batchId, vaccinationDate',
    })
  }
}

export const db = new EverallDb()
