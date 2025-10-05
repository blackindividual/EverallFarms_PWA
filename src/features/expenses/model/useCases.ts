import type { DailyExpensesRepository } from '../../../data/repositories/dailyExpenses'
import type { DailyExpenseEntity } from '../../../data/entities/types'

function isIsoDate(v: string) { return /^\d{4}-\d{2}-\d{2}$/.test(v) }
function ensure(c: any, m: string): asserts c { if (!c) throw new Error(m) }

export type CreateDailyExpenseInput = {
  batchId: string
  date: string
  amount: number
  description: string
}

export type UpdateDailyExpensePatch = Partial<Pick<DailyExpenseEntity,
  'batchId' | 'date' | 'amount' | 'description'>> & { id: string }

export async function recordDailyExpense(repo: DailyExpensesRepository, input: CreateDailyExpenseInput) {
  ensure(!!input.batchId, 'batchId required')
  ensure(isIsoDate(input.date), 'date must be ISO yyyy-MM-dd')
  ensure(Number.isFinite(input.amount) && input.amount >= 0, 'amount must be >= 0')
  ensure(input.description.trim().length > 0, 'description required')
  return repo.create({ ...input, description: input.description.trim() })
}

export async function listExpenses(repo: DailyExpensesRepository, batchId: string) {
  ensure(!!batchId, 'batchId required')
  return repo.listByBatch(batchId)
}

export async function updateDailyExpense(repo: DailyExpensesRepository, patch: UpdateDailyExpensePatch) {
  ensure(!!patch.id, 'id required')
  if (patch.date !== undefined) ensure(isIsoDate(patch.date), 'date must be ISO yyyy-MM-dd')
  if (patch.amount !== undefined) ensure(Number.isFinite(patch.amount) && patch.amount >= 0, 'amount must be >= 0')
  if (patch.description !== undefined) ensure(patch.description.trim().length > 0, 'description required')
  await repo.update({ ...patch, description: patch.description?.trim() })
}

export async function removeDailyExpense(repo: DailyExpensesRepository, id: string) {
  ensure(!!id, 'id required')
  await repo.remove(id)
}

