import { RacePlan } from './types';

export const DEFAULT_RACE_PLAN: RacePlan = {
  pacesBySlope: {
    'pente_0_3': '06:00',
    'pente_4_8': '07:30',
    'pente_9_15': '10:00',
    'pente_16_plus': '15:00',
    'descente_1_8': '05:45',
    'descente_9_plus': '07:00',
  },
  fatigue: [{
    id: 'default-fatigue-1',
    startKm: 60,
    lossSeconds: 15,
    kmsPerInterval: 10,
  }],
};

export const SLOPE_CATEGORIES = [
    { id: 'pente_0_3', label: 'Plat / Faux plat montant (0-3%)' },
    { id: 'pente_4_8', label: 'Pente modérée (4-8%)' },
    { id: 'pente_9_15', label: 'Pente forte (9-15%)' },
    { id: 'pente_16_plus', label: 'Pente très forte (>15%)' },
    { id: 'descente_1_8', label: 'Descente modérée (-1 à -8%)' },
    { id: 'descente_9_plus', label: 'Descente forte (<-8%)' },
];