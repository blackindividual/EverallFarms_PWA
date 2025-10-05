import { liveQuery } from 'dexie'
import { db } from '../../../data/db'
import type { BatchEntity } from '../../../data/entities/types'
import type { BatchesRepository } from '../../../data/repositories/batches'
import { createId } from '../../../core/id'

export function createBatchesRepository(): BatchesRepository {
  return {
    async getAll() {
      return db.batches.orderBy('startDate').reverse().toArray()
    },
    async getById(id: string) {
      return db.batches.get(id)
    },
    async create(input: Omit<BatchEntity, 'id'>) {
      const entity: BatchEntity = { id: createId(), ...input }
      await db.batches.add(entity)
      return entity
    },
    async update(patch) {
      const { id, ...rest } = patch
      await db.batches.update(id, rest)
    },
    async remove(id: string) {
      await db.batches.delete(id)
    },
    watchAll() {
      const observable = liveQuery(() => db.batches.orderBy('startDate').reverse().toArray())
      // Dexie returns an Observable-like with subscribe(); expose as-is
      return observable as any
    },
  }
}

