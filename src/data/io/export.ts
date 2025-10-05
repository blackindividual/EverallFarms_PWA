import { db } from '../db'
import type {
  BatchEntity,
  DailyWeightEntity,
  DailyEggEntity,
  DailyExpenseEntity,
  DailyMortalityEntity,
  DailyMedicationEntity,
  VaccinationReminderEntity,
} from '../entities/types'

export type ExportPayload = {
  version: number
  app: 'EverallFarm_Lite_PWA'
  exportedAt: string
  counts: Record<string, number>
  data: {
    batches: BatchEntity[]
    daily_weights: DailyWeightEntity[]
    daily_eggs: DailyEggEntity[]
    daily_expenses: DailyExpenseEntity[]
    daily_mortality: DailyMortalityEntity[]
    daily_medications: DailyMedicationEntity[]
    vaccination_reminders: VaccinationReminderEntity[]
  }
}

export async function exportAll(): Promise<ExportPayload> {
  const [
    batches,
    daily_weights,
    daily_eggs,
    daily_expenses,
    daily_mortality,
    daily_medications,
    vaccination_reminders,
  ] = await Promise.all([
    db.batches.toArray(),
    db.daily_weights.toArray(),
    db.daily_eggs.toArray(),
    db.daily_expenses.toArray(),
    db.daily_mortality.toArray(),
    db.daily_medications.toArray(),
    db.vaccination_reminders.toArray(),
  ])

  const payload: ExportPayload = {
    version: 1,
    app: 'EverallFarm_Lite_PWA',
    exportedAt: new Date().toISOString(),
    counts: {
      batches: batches.length,
      daily_weights: daily_weights.length,
      daily_eggs: daily_eggs.length,
      daily_expenses: daily_expenses.length,
      daily_mortality: daily_mortality.length,
      daily_medications: daily_medications.length,
      vaccination_reminders: vaccination_reminders.length,
    },
    data: {
      batches,
      daily_weights,
      daily_eggs,
      daily_expenses,
      daily_mortality,
      daily_medications,
      vaccination_reminders,
    },
  }
  return payload
}

export function stringifyExport(payload: ExportPayload, pretty = false): string {
  return JSON.stringify(payload, null, pretty ? 2 : undefined)
}

export function defaultBackupFileName(now = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  const yyyy = now.getFullYear()
  const MM = pad(now.getMonth() + 1)
  const dd = pad(now.getDate())
  const HH = pad(now.getHours())
  const mm = pad(now.getMinutes())
  return `EverallFarm_Lite_backup_${yyyy}${MM}${dd}_${HH}${mm}.json`
}

export function downloadJson(filename: string, json: string) {
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

