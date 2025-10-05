import { db } from '../../../data/db'

export async function deleteBatchCascade(batchId: string) {
  await db.transaction('rw', [
    db.daily_weights,
    db.daily_eggs,
    db.daily_expenses,
    db.daily_medications,
    db.daily_mortality,
    db.vaccination_reminders,
    db.batches,
  ], async () => {
    await Promise.all([
      db.daily_weights.where({ batchId }).delete(),
      db.daily_eggs.where({ batchId }).delete(),
      db.daily_expenses.where({ batchId }).delete(),
      db.daily_medications.where({ batchId }).delete(),
      db.daily_mortality.where({ batchId }).delete(),
      db.vaccination_reminders.where({ batchId }).delete(),
    ])
    await db.batches.delete(batchId)
  })
}

