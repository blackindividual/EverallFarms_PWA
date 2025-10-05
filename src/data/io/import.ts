import { db } from '../db'
import type { ExportPayload } from './export'
import type { VaccinationReminderEntity } from '../entities/types'
import type { Table } from 'dexie'

export type ImportStrategy = 'skip' | 'overwrite' | 'clearAndReplace'

type ImportOptions = {
  strategy?: ImportStrategy
  reassignReminderIds?: boolean // if true, ignore incoming id and let Dexie assign
}

export type ImportDryRun = {
  ok: boolean
  errors: string[]
  counts: Record<string, number>
  unknownTables: string[]
}

export function parsePayload(input: string | ExportPayload): ExportPayload {
  const obj = typeof input === 'string' ? (JSON.parse(input) as ExportPayload) : input
  return obj
}

function isIsoDate(v: any) {
  return typeof v === 'string' && /^\d{4}-\d{2}-\d{2}/.test(v)
}

export function dryRunImport(input: string | ExportPayload): ImportDryRun {
  const p = parsePayload(input)
  const errors: string[] = []
  const known = [
    'batches',
    'daily_weights',
    'daily_eggs',
    'daily_expenses',
    'daily_mortality',
    'daily_medications',
    'vaccination_reminders',
  ]
  const unknownTables = Object.keys(p.data).filter((k) => !known.includes(k))
  const counts: Record<string, number> = {}
  for (const k of known) counts[k] = (p.data as any)[k]?.length ?? 0

  // Minimal field validation
  for (const b of p.data.batches) {
    if (!b.id || !b.name || !b.birdType || !isIsoDate(b.startDate)) errors.push('Invalid batch entry')
  }
  for (const w of p.data.daily_weights) {
    if (!w.id || !w.batchId || !isIsoDate(w.date)) errors.push('Invalid weight entry')
  }
  for (const e of p.data.daily_eggs) {
    if (!e.id || !e.batchId || !isIsoDate(e.date)) errors.push('Invalid egg entry')
  }
  for (const e of p.data.daily_expenses) {
    if (!e.id || !e.batchId || !isIsoDate(e.date)) errors.push('Invalid expense entry')
  }
  for (const m of p.data.daily_mortality) {
    if (!m.id || !m.batchId || !isIsoDate(m.date)) errors.push('Invalid mortality entry')
  }
  for (const m of p.data.daily_medications) {
    if (!m.id || !m.batchId || !isIsoDate(m.date)) errors.push('Invalid medication entry')
  }
  for (const r of p.data.vaccination_reminders) {
    if (!r.batchId || !r.vaccinationDate) errors.push('Invalid reminder entry')
  }

  return { ok: errors.length === 0, errors, counts, unknownTables }
}

export async function applyImport(input: string | ExportPayload, opts: ImportOptions = {}) {
  const p = parsePayload(input)
  const strategy: ImportStrategy = opts.strategy ?? 'overwrite'
  const reassignReminderIds = opts.reassignReminderIds ?? true

  await db.transaction('rw', db.tables as any, async () => {
    if (strategy === 'clearAndReplace') {
      await Promise.all(db.tables.map((t) => t.clear()))
    }

    // batches
    await upsertArray(db.batches, p.data.batches, strategy)
    await upsertArray(db.daily_weights, p.data.daily_weights, strategy)
    await upsertArray(db.daily_eggs, p.data.daily_eggs, strategy)
    await upsertArray(db.daily_expenses, p.data.daily_expenses, strategy)
    await upsertArray(db.daily_mortality, p.data.daily_mortality, strategy)
    await upsertArray(db.daily_medications, p.data.daily_medications, strategy)

    // vaccination_reminders: optionally ignore incoming id to let Dexie auto-assign
    const reminders = p.data.vaccination_reminders.map((r) => {
      const { id, ...rest } = r
      return reassignReminderIds ? rest : r
    }) as any

    if (strategy === 'skip') {
      for (const item of reminders) {
        if ('id' in item && item.id != null) {
          const exists = await db.vaccination_reminders.get(item.id as any)
          if (!exists) await db.vaccination_reminders.add(item as VaccinationReminderEntity)
        } else {
          await db.vaccination_reminders.add(item as VaccinationReminderEntity)
        }
      }
    } else if (strategy === 'overwrite') {
      for (const item of reminders) {
        if ('id' in item && item.id != null) {
          await db.vaccination_reminders.put(item as VaccinationReminderEntity)
        } else {
          await db.vaccination_reminders.add(item as VaccinationReminderEntity)
        }
      }
    } else {
      // clearAndReplace already cleared; just bulkAdd
      await db.vaccination_reminders.bulkAdd(reminders as VaccinationReminderEntity[])
    }
  })
}

async function upsertArray<T extends { id: any }>(table: Table<T, any>, items: T[], strategy: ImportStrategy) {
  if (strategy === 'clearAndReplace') {
    await table.bulkAdd(items)
    return
  }
  if (strategy === 'overwrite') {
    for (const item of items) await table.put(item)
    return
  }
  // skip on conflict
  for (const item of items) {
    const exists = await table.get(item.id)
    if (!exists) await table.add(item)
  }
}
