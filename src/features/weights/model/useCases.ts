import type { DailyWeightsRepository } from '../../../data/repositories/dailyWeights'
import type { DailyWeightEntity } from '../../../data/entities/types'

function isIsoDate(v: string) { return /^\d{4}-\d{2}-\d{2}$/.test(v) }
function ensure(c: any, m: string): asserts c { if (!c) throw new Error(m) }

export type CreateDailyWeightInput = {
  batchId: string
  date: string
  sampleWeight: number
  birdsWeighed: number
}

export type UpdateDailyWeightPatch = Partial<Pick<DailyWeightEntity,
  'batchId' | 'date' | 'sampleWeight' | 'birdsWeighed'>> & { id: string }

export async function recordDailyWeight(repo: DailyWeightsRepository, input: CreateDailyWeightInput) {
  ensure(!!input.batchId, 'batchId required')
  ensure(isIsoDate(input.date), 'date must be ISO yyyy-MM-dd')
  ensure(Number.isFinite(input.sampleWeight) && input.sampleWeight > 0, 'sampleWeight must be > 0')
  ensure(Number.isInteger(input.birdsWeighed) && input.birdsWeighed > 0, 'birdsWeighed must be > 0')
  return repo.create(input)
}

export async function listWeights(repo: DailyWeightsRepository, batchId: string) {
  ensure(!!batchId, 'batchId required')
  return repo.listByBatch(batchId)
}

export async function updateDailyWeight(repo: DailyWeightsRepository, patch: UpdateDailyWeightPatch) {
  ensure(!!patch.id, 'id required')
  if (patch.date !== undefined) ensure(isIsoDate(patch.date), 'date must be ISO yyyy-MM-dd')
  if (patch.sampleWeight !== undefined) ensure(Number.isFinite(patch.sampleWeight) && patch.sampleWeight > 0, 'sampleWeight must be > 0')
  if (patch.birdsWeighed !== undefined) ensure(Number.isInteger(patch.birdsWeighed) && patch.birdsWeighed > 0, 'birdsWeighed must be > 0')
  await repo.update(patch)
}

export async function removeDailyWeight(repo: DailyWeightsRepository, id: string) {
  ensure(!!id, 'id required')
  await repo.remove(id)
}

