import type { DailyEggsRepository } from '../../../data/repositories/dailyEggs'
import type { DailyEggEntity } from '../../../data/entities/types'

function isIsoDate(v: string) { return /^\d{4}-\d{2}-\d{2}$/.test(v) }
function ensure(c: any, m: string): asserts c { if (!c) throw new Error(m) }

export type CreateDailyEggInput = {
  batchId: string
  date: string
  cratesCount: number
  looseEggs: number
}

export type UpdateDailyEggPatch = Partial<Pick<DailyEggEntity,
  'batchId' | 'date' | 'cratesCount' | 'looseEggs'>> & { id: string }

export async function recordDailyEggs(repo: DailyEggsRepository, input: CreateDailyEggInput) {
  ensure(!!input.batchId, 'batchId required')
  ensure(isIsoDate(input.date), 'date must be ISO yyyy-MM-dd')
  ensure(Number.isInteger(input.cratesCount) && input.cratesCount >= 0, 'cratesCount must be >= 0')
  ensure(Number.isInteger(input.looseEggs) && input.looseEggs >= 0, 'looseEggs must be >= 0')
  return repo.create(input)
}

export async function listEggs(repo: DailyEggsRepository, batchId: string) {
  ensure(!!batchId, 'batchId required')
  return repo.listByBatch(batchId)
}

export async function updateDailyEggs(repo: DailyEggsRepository, patch: UpdateDailyEggPatch) {
  ensure(!!patch.id, 'id required')
  if (patch.date !== undefined) ensure(isIsoDate(patch.date), 'date must be ISO yyyy-MM-dd')
  if (patch.cratesCount !== undefined) ensure(Number.isInteger(patch.cratesCount) && patch.cratesCount >= 0, 'cratesCount must be >= 0')
  if (patch.looseEggs !== undefined) ensure(Number.isInteger(patch.looseEggs) && patch.looseEggs >= 0, 'looseEggs must be >= 0')
  await repo.update(patch)
}

export async function removeDailyEggs(repo: DailyEggsRepository, id: string) {
  ensure(!!id, 'id required')
  await repo.remove(id)
}

