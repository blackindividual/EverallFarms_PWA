export const APP_NAME = 'EverallFarm_Lite'
export const BIRD_TYPES = ['broilers', 'layers', 'noilers', 'cockerels'] as const
export type BirdType = typeof BIRD_TYPES[number]

