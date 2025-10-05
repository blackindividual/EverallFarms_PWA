import type { DailyMortalityRepository } from '../../../data/repositories/dailyMortality'
import type { DailyMortalityEntity } from '../../../data/entities/types'
import type { BatchesRepository } from '../../../data/repositories/batches'
import type { MortalityCause } from '../../../core/mortalityCauses'

function isIsoDate(v: string) { return /^\d{4}-\d{2}-\d{2}$/.test(v) }
function ensure(c: any, m: string): asserts c { if (!c) throw new Error(m) }

export type CreateDailyMortalityInput = {
  batchId: string
  date: string
  deathsCount: number
  cause?: MortalityCause | null
  notes?: string | null
}

export type UpdateDailyMortalityPatch = Partial<Pick<DailyMortalityEntity,
  'batchId' | 'date' | 'deathsCount' | 'cause' | 'notes'>> & { id: string }

export async function recordDailyMortality(repo: DailyMortalityRepository, input: CreateDailyMortalityInput) {
  ensure(!!input.batchId, 'batchId required')
  ensure(isIsoDate(input.date), 'date must be ISO yyyy-MM-dd')
  ensure(Number.isInteger(input.deathsCount) && input.deathsCount > 0, 'deathsCount must be > 0')
  if (input.cause === 'OTHER') ensure(!!(input.notes && input.notes.trim().length > 0), 'Notes required when cause is Other')
  const trimmed = { ...input, notes: input.notes?.trim() ?? null }
  return repo.create(trimmed)
}

export async function listMortality(repo: DailyMortalityRepository, batchId: string) {
  ensure(!!batchId, 'batchId required')
  return repo.listByBatch(batchId)
}

export async function updateDailyMortality(repo: DailyMortalityRepository, patch: UpdateDailyMortalityPatch) {
  ensure(!!patch.id, 'id required')
  if (patch.date !== undefined) ensure(isIsoDate(patch.date), 'date must be ISO yyyy-MM-dd')
  if (patch.deathsCount !== undefined) ensure(Number.isInteger(patch.deathsCount) && patch.deathsCount >= 0, 'deathsCount must be >= 0')
  await repo.update({
    ...patch,
    notes: patch.notes !== undefined ? (patch.notes?.trim() ?? null) : undefined,
  })
}

export async function removeDailyMortality(repo: DailyMortalityRepository, id: string) {
  ensure(!!id, 'id required')
  await repo.remove(id)
}

export async function recordDailyMortalityWithBatch(
  mortalityRepo: DailyMortalityRepository,
  batchesRepo: BatchesRepository,
  input: CreateDailyMortalityInput,
) {
  ensure(!!input.batchId, 'batchId required')
  ensure(isIsoDate(input.date), 'date must be ISO yyyy-MM-dd')
  ensure(Number.isInteger(input.deathsCount) && input.deathsCount > 0, 'deathsCount must be > 0')
  if (input.cause === 'OTHER') ensure(!!(input.notes && input.notes.trim().length > 0), 'Notes required when cause is Other')

  const batch = await batchesRepo.getById(input.batchId)
  ensure(batch, 'Batch not found')
  if (batch) ensure(input.deathsCount <= batch.currentCount, 'Deaths exceed current bird count')

  await mortalityRepo.create({ ...input, notes: input.notes?.trim() ?? null })
  if (batch) {
    const newCount = Math.max(0, batch.currentCount - input.deathsCount)
    await batchesRepo.update({ id: input.batchId, currentCount: newCount })
  }
}

export async function removeDailyMortalityAndRestoreCount(
  mortalityRepo: DailyMortalityRepository,
  batchesRepo: BatchesRepository,
  id: string,
) {
  ensure(!!id, 'id required')
  const rec = await mortalityRepo.getById(id)
  if (rec) {
    const batch = await batchesRepo.getById(rec.batchId)
    if (batch) {
      const restored = batch.currentCount + rec.deathsCount
      const capped = Math.min(restored, batch.initialCount)
      await batchesRepo.update({ id: rec.batchId, currentCount: capped })
    }
  }
  await mortalityRepo.remove(id)
}
