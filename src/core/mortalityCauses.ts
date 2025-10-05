export type MortalityCause = 'DISEASE' | 'PREDATION' | 'ACCIDENT' | 'ENVIRONMENTAL' | 'OTHER'

export const MORTALITY_CAUSES: ReadonlyArray<{ value: MortalityCause; display: string; description: string }> = [
  { value: 'DISEASE', display: 'Sickness', description: 'Bird was sick or had a disease' },
  { value: 'PREDATION', display: 'Predators', description: 'Killed by cats, dogs, snakes, or other animals' },
  { value: 'ACCIDENT', display: 'Accident', description: 'Accidental death or injury' },
  { value: 'ENVIRONMENTAL', display: 'Weather/Heat', description: 'Died from heat, cold, or bad weather' },
  { value: 'OTHER', display: 'Other - Please Specify', description: 'Other reason - add details in notes' },
]

