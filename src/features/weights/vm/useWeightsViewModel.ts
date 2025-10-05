import { useEffect, useMemo, useState } from 'react'
import type { DailyWeightEntity } from '../../../data/entities/types'
import { createDailyWeightsRepository } from '../data/DailyWeightsRepositoryDexie'
import { recordDailyWeight, updateDailyWeight, removeDailyWeight } from '../model/useCases'

type State = {
  items: DailyWeightEntity[]
  loading: boolean
  error?: string
}

type Actions = {
  create: (input: { batchId: string; date: string; sampleWeight: number; birdsWeighed: number }) => Promise<void>
  update: (patch: Partial<DailyWeightEntity> & { id: string }) => Promise<void>
  remove: (id: string) => Promise<void>
}

export function useWeightsViewModel(batchId: string): { state: State; actions: Actions } {
  const repo = useMemo(() => createDailyWeightsRepository(), [])
  const [state, setState] = useState<State>({ items: [], loading: true })

  useEffect(() => {
    if (!batchId) return
    setState((s) => ({ ...s, loading: true }))
    const sub = repo.watchByBatch(batchId).subscribe({
      next: (items) => setState({ items, loading: false }),
      error: (e) => setState({ items: [], loading: false, error: String(e?.message ?? e) }),
    })
    return () => sub.unsubscribe()
  }, [repo, batchId])

  const actions: Actions = {
    async create(input) {
      try {
        await recordDailyWeight(repo, input)
      } catch (e: any) {
        setState((s) => ({ ...s, error: String(e?.message ?? e) }))
      }
    },
    async update(patch) {
      try {
        await updateDailyWeight(repo, patch)
      } catch (e: any) {
        setState((s) => ({ ...s, error: String(e?.message ?? e) }))
      }
    },
    async remove(id) {
      try {
        await removeDailyWeight(repo, id)
      } catch (e: any) {
        setState((s) => ({ ...s, error: String(e?.message ?? e) }))
      }
    },
  }

  return { state, actions }
}

