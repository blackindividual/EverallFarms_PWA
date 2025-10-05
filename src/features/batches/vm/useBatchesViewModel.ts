import { useEffect, useMemo, useState } from 'react'
import type { BatchEntity } from '../../../data/entities/types'
import { createBatchesRepository } from '../data/BatchesRepositoryDexie'
import { createBatch, updateBatch, removeBatch } from '../model/useCases'
import type { CreateBatchInput, UpdateBatchPatch } from '../model/useCases'

type State = {
  items: BatchEntity[]
  loading: boolean
  error?: string
}

type Actions = {
  create: (input: CreateBatchInput) => Promise<void>
  update: (patch: UpdateBatchPatch) => Promise<void>
  remove: (id: string) => Promise<void>
}

export function useBatchesViewModel(): { state: State; actions: Actions } {
  const repo = useMemo(() => createBatchesRepository(), [])
  const [state, setState] = useState<State>({ items: [], loading: true })

  useEffect(() => {
    setState((s) => ({ ...s, loading: true }))
    const sub = repo.watchAll().subscribe({
      next: (items) => setState({ items, loading: false }),
      error: (e) => setState({ items: [], loading: false, error: String(e?.message ?? e) }),
    })
    return () => sub.unsubscribe()
  }, [repo])

  const actions: Actions = {
    async create(input) {
      try {
        await createBatch(repo, input)
      } catch (e: any) {
        setState((s) => ({ ...s, error: String(e?.message ?? e) }))
      }
    },
    async update(patch) {
      try {
        await updateBatch(repo, patch)
      } catch (e: any) {
        setState((s) => ({ ...s, error: String(e?.message ?? e) }))
      }
    },
    async remove(id) {
      try {
        await removeBatch(repo, id)
      } catch (e: any) {
        setState((s) => ({ ...s, error: String(e?.message ?? e) }))
      }
    },
  }

  return { state, actions }
}

