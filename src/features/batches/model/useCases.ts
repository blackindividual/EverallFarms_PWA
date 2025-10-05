import type { BatchesRepository } from '../../../data/repositories/batches'
import type { BatchEntity } from '../../../data/entities/types'
import type { BirdType } from '../../../core/birds'

export type CreateBatchInput = {
  name: string
  birdType: BirdType
  initialCount: number
  costPerBird: number
  startDate: string // ISO yyyy-MM-dd
}

export type UpdateBatchPatch = Partial<Pick<BatchEntity, 'name' | 'birdType' | 'initialCount' | 'currentCount' | 'costPerBird' | 'startDate'>> & {
  id: string
}

export function isIsoDate(value: string): boolean {
  // very light ISO yyyy-MM-dd validation
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
}

function ensure(condition: any, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

export function computeInitialCost(input: { initialCount: number; costPerBird: number }): number {
  return Math.max(0, input.initialCount) * Math.max(0, input.costPerBird)
}

export async function createBatch(repo: BatchesRepository, input: CreateBatchInput): Promise<BatchEntity> {
  ensure(input.name.trim().length > 0, 'Name is required')
  ensure(['BROILER', 'LAYER', 'NOILER', 'COCKEREL'].includes(input.birdType), 'Invalid bird type')
  ensure(Number.isFinite(input.initialCount) && input.initialCount >= 0, 'initialCount must be >= 0')
  ensure(Number.isFinite(input.costPerBird) && input.costPerBird >= 0, 'costPerBird must be >= 0')
  ensure(isIsoDate(input.startDate), 'startDate must be ISO yyyy-MM-dd')

  const entity = await repo.create({
    name: input.name.trim(),
    birdType: input.birdType,
    initialCount: Math.round(input.initialCount),
    currentCount: Math.round(input.initialCount),
    costPerBird: Number(input.costPerBird),
    startDate: input.startDate,
  })
  return entity
}

export async function listBatches(repo: BatchesRepository): Promise<BatchEntity[]> {
  return repo.getAll()
}

export async function getBatch(repo: BatchesRepository, id: string): Promise<BatchEntity | undefined> {
  ensure(!!id, 'id required')
  return repo.getById(id)
}

export async function updateBatch(repo: BatchesRepository, patch: UpdateBatchPatch): Promise<void> {
  ensure(!!patch.id, 'id required')
  if (patch.name !== undefined) ensure(patch.name.trim().length > 0, 'name cannot be empty')
  if (patch.birdType !== undefined) ensure(['BROILER', 'LAYER', 'NOILER', 'COCKEREL'].includes(patch.birdType), 'Invalid bird type')
  if (patch.initialCount !== undefined) ensure(Number.isFinite(patch.initialCount) && patch.initialCount >= 0, 'initialCount must be >= 0')
  if (patch.currentCount !== undefined) ensure(Number.isFinite(patch.currentCount) && patch.currentCount >= 0, 'currentCount must be >= 0')
  if (patch.costPerBird !== undefined) ensure(Number.isFinite(patch.costPerBird) && patch.costPerBird >= 0, 'costPerBird must be >= 0')
  if (patch.startDate !== undefined) ensure(isIsoDate(patch.startDate), 'startDate must be ISO yyyy-MM-dd')

  // If initialCount decreases below currentCount, clamp currentCount
  if (patch.initialCount !== undefined && patch.currentCount === undefined) {
    const prev = await repo.getById(patch.id)
    if (prev && prev.currentCount > patch.initialCount) {
      patch.currentCount = patch.initialCount
    }
  }

  await repo.update(patch)
}

export async function removeBatch(repo: BatchesRepository, id: string): Promise<void> {
  ensure(!!id, 'id required')
  await repo.remove(id)
}

