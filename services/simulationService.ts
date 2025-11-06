

import { ElevationPoint, RacePlan, Waypoint, SimulationResult, KilometerSplit, WaypointSplit } from '../types';
import { timeStringToSeconds, formatSecondsToTime, formatSecondsToPace, formatSecondsToTimeOfDay } from '../utils/formatters';

const getSlopeCategory = (slope: number): string => {
  if (slope >= 16) return 'pente_16_plus';
  if (slope >= 9) return 'pente_9_15';
  if (slope >= 4) return 'pente_4_8';
  if (slope >= 0) return 'pente_0_3';
  if (slope >= -8) return 'descente_1_8';
  return 'descente_9_plus';
};

export const calculateSimulation = (
  profile: ElevationPoint[],
  plan: RacePlan,
  waypoints: Waypoint[],
  totalDistance: number,
  startTime: string
): SimulationResult => {
  let totalSeconds = 0;
  let nextWaypointIndex = 0;

  const kilometerSplits: KilometerSplit[] = [];
  const waypointSplits: WaypointSplit[] = [];

  let nextKmMarker = 1;
  let cumulativeElevationGain = 0;
  let cumulativeElevationLoss = 0;

  for (let i = 1; i < profile.length; i++) {
    const prevPoint = profile[i - 1];
    const currPoint = profile[i];

    const segmentDistKm = currPoint.dist - prevPoint.dist;
    if (segmentDistKm === 0) continue;

    const segmentEleChangeM = currPoint.alt - prevPoint.alt;
    const slope = (segmentEleChangeM / (segmentDistKm * 1000)) * 100;
    
    if (segmentEleChangeM > 0) {
        cumulativeElevationGain += segmentEleChangeM;
    } else {
        cumulativeElevationLoss -= segmentEleChangeM;
    }

    const slopeCategory = getSlopeCategory(slope);
    let basePaceSecondsPerKm = timeStringToSeconds(plan.pacesBySlope[slopeCategory]);

    // Apply fatigue model
    let totalFatigueSeconds = 0;
    if (plan.fatigue) {
      plan.fatigue.forEach(rule => {
        if (currPoint.dist > rule.startKm && rule.kmsPerInterval > 0) {
          const fatigueTranches = Math.floor((currPoint.dist - rule.startKm) / rule.kmsPerInterval);
          totalFatigueSeconds += fatigueTranches * rule.lossSeconds;
        }
      });
    }
    basePaceSecondsPerKm += totalFatigueSeconds;


    const segmentTimeSeconds = basePaceSecondsPerKm * segmentDistKm;
    totalSeconds += segmentTimeSeconds;

    // Check for kilometer splits
    if (currPoint.dist >= nextKmMarker) {
        kilometerSplits.push({
            km: nextKmMarker,
            cumulativeTime: formatSecondsToTime(totalSeconds),
            timeOfDay: formatSecondsToTimeOfDay(startTime, totalSeconds),
            pace: formatSecondsToPace(totalSeconds / nextKmMarker),
            elevationGain: 0, // Simplified for this view, could be calculated per km
            elevationLoss: 0, // Simplified
            cumulativeElevationGain: cumulativeElevationGain,
            cumulativeElevationLoss: cumulativeElevationLoss,
        });
        nextKmMarker++;
    }

    // Check for waypoints
    if (nextWaypointIndex < waypoints.length && currPoint.dist >= waypoints[nextWaypointIndex].distanceKm) {
      const wp = waypoints[nextWaypointIndex];
      const arrivalTimeSeconds = totalSeconds;
      const departureTimeSeconds = arrivalTimeSeconds + wp.stopTimeMin * 60;
      
      waypointSplits.push({
        name: wp.name,
        distanceKm: wp.distanceKm,
        arrivalTime: formatSecondsToTime(arrivalTimeSeconds),
        avgPace: formatSecondsToPace(arrivalTimeSeconds / wp.distanceKm),
        stopTimeMin: wp.stopTimeMin,
        departureTime: formatSecondsToTime(departureTimeSeconds),
        timeLimit: wp.timeLimit,
        arrivalTimeOfDay: formatSecondsToTimeOfDay(startTime, arrivalTimeSeconds),
        departureTimeOfDay: formatSecondsToTimeOfDay(startTime, departureTimeSeconds),
      });

      totalSeconds += wp.stopTimeMin * 60;
      nextWaypointIndex++;
    }
  }
  
    // Ensure the last km split is added if the race is not an exact integer km
    if (kilometerSplits.length === 0 || kilometerSplits[kilometerSplits.length - 1].km < Math.floor(totalDistance)) {
        kilometerSplits.push({
            km: totalDistance,
            cumulativeTime: formatSecondsToTime(totalSeconds),
            timeOfDay: formatSecondsToTimeOfDay(startTime, totalSeconds),
            pace: formatSecondsToPace(totalSeconds / totalDistance),
            elevationGain: 0,
            elevationLoss: 0,
            cumulativeElevationGain,
            cumulativeElevationLoss
        });
    }

  return {
    waypointSplits,
    kilometerSplits,
    totalTime: formatSecondsToTime(totalSeconds),
    avgPace: formatSecondsToPace(totalSeconds / totalDistance),
    totalDistance,
    totalElevationGain: cumulativeElevationGain,
    totalElevationLoss: cumulativeElevationLoss,
  };
};