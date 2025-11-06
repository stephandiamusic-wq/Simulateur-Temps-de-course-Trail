
export interface ElevationPoint {
  dist: number; // distance in km
  alt: number; // altitude in m
}

export interface Course {
  name: string;
  eventName:string;
  totalDistance: number; // in km
  totalElevationGain: number; // in m
  elevationProfile: ElevationPoint[];
}

export interface PacesBySlope {
  [key: string]: string; // "pente_0_3": "6:00"
}

export interface FatigueRule {
  id: string;
  startKm: number;
  lossSeconds: number;
  kmsPerInterval: number;
}

export interface RacePlan {
  pacesBySlope: PacesBySlope;
  fatigue: FatigueRule[];
}

export interface Waypoint {
  id: string;
  name: string;
  distanceKm: number;
  timeLimit: string;
  stopTimeMin: number;
}

export interface WaypointSplit {
  name: string;
  distanceKm: number;
  arrivalTime: string;
  avgPace: string;
  departureTime: string;
  stopTimeMin: number;
  timeLimit: string;
  arrivalTimeOfDay: string;
  departureTimeOfDay: string;
}

export interface KilometerSplit {
  km: number;
  cumulativeTime: string;
  timeOfDay: string;
  pace: string;
  elevationGain: number;
  elevationLoss: number;
  cumulativeElevationGain: number;
  cumulativeElevationLoss: number;
}

export interface SimulationResult {
  waypointSplits: WaypointSplit[];
  kilometerSplits: KilometerSplit[];
  totalTime: string;
  avgPace: string;
  totalDistance: number;
  totalElevationGain: number;
  totalElevationLoss: number;
}