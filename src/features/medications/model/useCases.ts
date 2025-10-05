import type { DailyMedicationsRepository } from '../../../data/repositories/dailyMedications'
import type { DailyMedicationEntity } from '../../../data/entities/types'

function isIsoDate(v: string) { return /^\d{4}-\d{2}-\d{2}$/.test(v) }
function ensure(c: any, m: string): asserts c { if (!c) throw new Error(m) }

export type CreateDailyMedicationInput = {
  batchId: string
  date: string
  medicationName: string
}

export type UpdateDailyMedicationPatch = Partial<Pick<DailyMedicationEntity,
  'batchId' | 'date' | 'medicationName'>> & { id: string }

export async function recordDailyMedication(repo: DailyMedicationsRepository, input: CreateDailyMedicationInput) {
  ensure(!!input.batchId, 'batchId required')
  ensure(isIsoDate(input.date), 'date must be ISO yyyy-MM-dd')
  ensure(input.medicationName.trim().length > 0, 'medication name required')
  return repo.create({ ...input, medicationName: input.medicationName.trim() })
}

export async function listMedications(repo: DailyMedicationsRepository, batchId: string) {
  ensure(!!batchId, 'batchId required')
  return repo.listByBatch(batchId)
}

export async function updateDailyMedication(repo: DailyMedicationsRepository, patch: UpdateDailyMedicationPatch) {
  ensure(!!patch.id, 'id required')
  if (patch.date !== undefined) ensure(isIsoDate(patch.date), 'date must be ISO yyyy-MM-dd')
  if (patch.medicationName !== undefined) ensure(patch.medicationName.trim().length > 0, 'medication name required')
  await repo.update({ ...patch, medicationName: patch.medicationName?.trim() })
}

export async function removeDailyMedication(repo: DailyMedicationsRepository, id: string) {
  ensure(!!id, 'id required')
  await repo.remove(id)
}

