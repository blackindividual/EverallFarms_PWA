import type { BirdType } from '../../../core/birds'

type StaticVaccinationItem = { day: number; vaccinationName: string; route?: string | null; notes?: string | null }

const BROILER: StaticVaccinationItem[] = [
  { day: 1, vaccinationName: 'Multivitamins/Glucose', route: 'Drinking water', notes: 'On arrival' },
  { day: 2, vaccinationName: 'Antibiotics' },
  { day: 3, vaccinationName: 'Antibiotics' },
  { day: 4, vaccinationName: 'Antibiotics' },
  { day: 5, vaccinationName: 'Multivitamins' },
  { day: 6, vaccinationName: 'LaSota' },
  { day: 7, vaccinationName: 'Multivitamins + Calcium' },
  { day: 8, vaccinationName: 'Multivitamins + Calcium' },
  { day: 10, vaccinationName: 'Gumboro' },
  { day: 11, vaccinationName: 'Multivitamins' },
  { day: 12, vaccinationName: 'Multivitamins' },
  { day: 13, vaccinationName: 'Anti Cocci + Anti CRD (AM/PM)' },
  { day: 14, vaccinationName: 'Anti Cocci + Anti CRD (AM/PM)' },
  { day: 16, vaccinationName: 'Multivitamins + Calcium', route: 'Drinking water' },
  { day: 17, vaccinationName: 'Gumboro' },
  { day: 18, vaccinationName: 'Multivitamins' },
  { day: 19, vaccinationName: 'Multivitamins' },
  { day: 20, vaccinationName: 'Water' },
  { day: 21, vaccinationName: 'LaSota' },
  { day: 22, vaccinationName: 'Multivitamins' },
  { day: 23, vaccinationName: 'Multivitamins' },
  { day: 24, vaccinationName: 'Multivitamins' },
  { day: 25, vaccinationName: 'Anti CRD' },
  { day: 26, vaccinationName: 'Anti CRD' },
  { day: 27, vaccinationName: 'Anti CRD' },
  { day: 28, vaccinationName: 'Multivitamins + Calcium' },
  { day: 29, vaccinationName: 'Anti Cocci' },
  { day: 30, vaccinationName: 'Anti Cocci' },
  { day: 31, vaccinationName: 'Anti Cocci' },
  { day: 32, vaccinationName: 'Multivitamins' },
  { day: 33, vaccinationName: 'Multivitamins' },
  { day: 34, vaccinationName: 'Multivitamins' },
  { day: 35, vaccinationName: 'Multivitamins' },
  { day: 36, vaccinationName: 'Liver Tonic' },
  { day: 37, vaccinationName: 'Liver Tonic' },
  { day: 38, vaccinationName: 'Liver Tonic' },
  { day: 39, vaccinationName: 'Multivitamins' },
  { day: 40, vaccinationName: 'Multivitamins' },
  { day: 41, vaccinationName: 'Multivitamins' },
  { day: 42, vaccinationName: 'Multivitamins' },
]

const LAYER: StaticVaccinationItem[] = [
  { day: 1, vaccinationName: 'Multivitamins/Glucose', route: 'Drinking water', notes: 'On arrival' },
  { day: 7, vaccinationName: 'Newcastle Disease (Lasota)', route: 'Eye drop/Nasal' },
  { day: 14, vaccinationName: 'Infectious Bursal Disease (Gumboro)', route: 'Drinking water' },
  { day: 21, vaccinationName: 'Newcastle Disease (Lasota)', route: 'Drinking water', notes: 'Booster' },
  { day: 28, vaccinationName: 'Infectious Bursal Disease (Gumboro)', route: 'Drinking water', notes: 'Booster' },
  { day: 42, vaccinationName: 'Fowl Pox', route: 'Wing web' },
  { day: 56, vaccinationName: 'Newcastle Disease (Killed)', route: 'Intramuscular' },
  { day: 70, vaccinationName: 'Infectious Bronchitis', route: 'Drinking water' },
  { day: 84, vaccinationName: 'Fowl Cholera', route: 'Intramuscular', notes: 'Optional' },
  { day: 112, vaccinationName: 'Newcastle Disease (Killed)', route: 'Intramuscular', notes: 'Pre-lay booster' },
  { day: 126, vaccinationName: 'Infectious Bronchitis', route: 'Drinking water', notes: 'Pre-lay booster' },
]

const NOILER: StaticVaccinationItem[] = [
  { day: 1, vaccinationName: 'Multivitamins/Glucose', route: 'Drinking water', notes: 'On arrival' },
  { day: 6, vaccinationName: 'LaSota' },
  { day: 10, vaccinationName: 'Gumboro' },
  { day: 17, vaccinationName: 'Gumboro', notes: 'Booster' },
  { day: 21, vaccinationName: 'LaSota', notes: 'Booster' },
  { day: 28, vaccinationName: 'Fowl Pox', route: 'Wing web' },
  { day: 35, vaccinationName: 'Newcastle Disease (Killed)', route: 'Intramuscular' },
]

const COCKEREL: StaticVaccinationItem[] = [
  { day: 1, vaccinationName: 'Multivitamins/Glucose', route: 'Drinking water', notes: 'On arrival' },
  { day: 2, vaccinationName: 'Antibiotics' },
  { day: 3, vaccinationName: 'Antibiotics' },
  { day: 4, vaccinationName: 'Antibiotics' },
  { day: 6, vaccinationName: 'LaSota' },
  { day: 10, vaccinationName: 'Gumboro' },
  { day: 17, vaccinationName: 'Gumboro', notes: 'Booster' },
  { day: 21, vaccinationName: 'LaSota', notes: 'Booster' },
  { day: 28, vaccinationName: 'Fowl Pox', route: 'Wing web' },
]

function getStaticSchedule(birdType: BirdType): StaticVaccinationItem[] {
  switch (birdType) {
    case 'BROILER': return BROILER
    case 'LAYER': return LAYER
    case 'NOILER': return NOILER
    case 'COCKEREL': return COCKEREL
  }
}

export type VaccinationItem = { day: number; date: string; vaccinationName: string; route?: string | null; notes?: string | null }

export function getVaccinationSchedule(birdType: BirdType, startDateIso: string) {
  const start = new Date(startDateIso + 'T00:00:00')
  const addDays = (d: number) => {
    const dt = new Date(start)
    dt.setDate(dt.getDate() + (d - 1))
    return dt.toISOString().slice(0, 10)
  }
  const items = getStaticSchedule(birdType).map(i => ({
    day: i.day,
    date: addDays(i.day),
    vaccinationName: i.vaccinationName,
    route: i.route ?? null,
    notes: i.notes ?? null,
  }))
  const totalDays = Math.max(...items.map(i => i.day))
  return { birdType, startDate: startDateIso, totalDays, items }
}

