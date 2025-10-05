import type { BirdType } from '../../core/birds'

export interface BatchEntity {
  id: string
  name: string
  birdType: BirdType
  initialCount: number
  currentCount: number
  costPerBird: number
  startDate: string // ISO yyyy-MM-dd
}

export interface DailyWeightEntity {
  id: string
  batchId: string
  date: string // ISO yyyy-MM-dd
  sampleWeight: number
  birdsWeighed: number
}

export interface DailyEggEntity {
  id: string
  batchId: string
  date: string // ISO yyyy-MM-dd
  cratesCount: number
  looseEggs: number
}

export interface DailyExpenseEntity {
  id: string
  batchId: string
  date: string // ISO yyyy-MM-dd
  amount: number
  description: string
}

export interface DailyMortalityEntity {
  id: string
  batchId: string
  date: string // ISO yyyy-MM-dd
  deathsCount: number
  cause?: string | null
  notes?: string | null
}

export interface DailyMedicationEntity {
  id: string
  batchId: string
  date: string // ISO yyyy-MM-dd
  medicationName: string
}

export interface VaccinationReminderEntity {
  id?: number // auto-increment
  batchId: string
  vaccinationDay: number
  vaccinationDate: string // ISO yyyy-MM-dd
  vaccinationName: string
  eveningRequestCode: number
  morningRequestCode: number
  isEveningScheduled: boolean
  isMorningScheduled: boolean
  isEnabled: boolean
}
