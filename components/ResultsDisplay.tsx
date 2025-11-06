import React from 'react';
import { SimulationResult, ElevationPoint, Waypoint } from '../types';
import ElevationProfileChart from './ElevationProfileChart';
import { formatSecondsToPace, formatSecondsToTime, formatSecondsToTimeOfDay, timeStringToSeconds } from '../utils/formatters';

interface ResultsDisplayProps {
  result: SimulationResult;
  courseProfile: ElevationPoint[];
  waypoints: Waypoint[];
  startTime: string;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, courseProfile, waypoints, startTime }) => {
  const { waypointSplits, kilometerSplits, totalTime, avgPace, totalDistance, totalElevationGain, totalElevationLoss } = result;

  const fiveKmSplits = [];
  
  if (kilometerSplits && kilometerSplits.length > 0) {
      let lastKm = 0;
      let lastTimeSeconds = 0;
      
      const timeToSeconds = (time: string): number => {
        if (!time || !time.includes(':')) return 0;
        return time.split(':').map(Number).reduce((acc, val) => acc * 60 + val, 0);
      };

      for (let i = 5; i <= Math.ceil(kilometerSplits[kilometerSplits.length - 1].km); i += 5) {
          const splitPoint = kilometerSplits.find(s => s.km >= i);
    
          if (splitPoint) {
            const currentTimeSeconds = timeToSeconds(splitPoint.cumulativeTime);
            const intervalTime = currentTimeSeconds - lastTimeSeconds;
            const intervalDist = splitPoint.km - lastKm;
            const intervalPace = intervalDist > 0 ? intervalTime / intervalDist : 0;
            
            fiveKmSplits.push({
                ...splitPoint,
                km: Math.round(splitPoint.km),
                intervalPace: formatSecondsToPace(intervalPace),
            });

            lastKm = splitPoint.km;
            lastTimeSeconds = currentTimeSeconds;
          }
      }
  }

  const finishTimeOfDay = formatSecondsToTimeOfDay(startTime, timeStringToSeconds(totalTime));

  return (
    <div className="mt-10 space-y-8">
      <div className="bg-base-200 p-6 rounded-2xl shadow-lg border border-base-300">
        <h2 className="text-2xl font-bold mb-4 text-center text-primary">Résultats de la Simulation</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-base-100 rounded-lg border border-base-300">
                <p className="text-sm text-gray-500">Temps Total</p>
                <p className="text-2xl font-bold text-secondary">{totalTime}</p>
            </div>
            <div className="p-4 bg-base-100 rounded-lg border border-base-300">
                <p className="text-sm text-gray-500">Allure Moyenne</p>
                <p className="text-2xl font-bold">{avgPace} <span className="text-base font-normal">/km</span></p>
            </div>
            <div className="p-4 bg-base-100 rounded-lg col-span-2 md:col-span-1 border border-base-300">
                 <p className="text-sm text-gray-500">Temps d'Arrêt Total</p>
                 <p className="text-2xl font-bold">{formatSecondsToTime(waypoints.reduce((acc, wp) => acc + wp.stopTimeMin * 60, 0))}</p>
            </div>
        </div>
      </div>
      
      <div className="bg-base-200 p-6 rounded-2xl shadow-lg border border-base-300">
        <h3 className="text-xl font-bold mb-4 text-content">Profil d'Altitude & Points de Passage</h3>
        <div className="h-96">
            <ElevationProfileChart profile={courseProfile} waypoints={waypoints} waypointSplits={waypointSplits}/>
        </div>
      </div>

      <div className="bg-base-200 p-6 rounded-2xl shadow-lg border border-base-300">
        <h3 className="text-xl font-bold mb-4 text-content">Temps de Passage (Ravitaillements)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="p-3">Nom</th>
                <th className="p-3">Dist. (km)</th>
                <th className="p-3">Temps Course</th>
                <th className="p-3">Heure Arrivée</th>
                <th className="p-3">Arrêt</th>
                <th className="p-3">Heure Départ</th>
                <th className="p-3">Allure Moy.</th>
                <th className="p-3">Barrière H.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-300">
              {waypointSplits.map((split, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-3 font-semibold">{split.name}</td>
                  <td className="p-3">{split.distanceKm.toFixed(2)}</td>
                  <td className="p-3">{split.arrivalTime}</td>
                  <td className="p-3 font-semibold text-secondary">{split.arrivalTimeOfDay}</td>
                  <td className="p-3">{split.stopTimeMin} min</td>
                  <td className="p-3 font-semibold text-secondary">{split.departureTimeOfDay}</td>
                  <td className="p-3">{split.avgPace} /km</td>
                  <td className="p-3">{split.timeLimit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-base-200 p-6 rounded-2xl shadow-lg border border-base-300">
        <h3 className="text-xl font-bold mb-4 text-content">Détail des Passages (tous les 5km)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="p-3">KM</th>
                <th className="p-3">Temps Course</th>
                <th className="p-3">Heure Passage</th>
                <th className="p-3">Allure (5km)</th>
                <th className="p-3">D+ Cumulé</th>
                <th className="p-3">D- Cumulé</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-300">
              {fiveKmSplits.map((split, index) => (
                <tr key={index} className={`hover:bg-gray-50 ${split.km % 10 === 0 ? 'font-bold bg-gray-50' : ''}`}>
                  <td className="p-3">{split.km.toFixed(0)}</td>
                  <td className="p-3">{split.cumulativeTime}</td>
                  <td className="p-3 font-semibold text-secondary">{split.timeOfDay}</td>
                  <td className="p-3">{split.intervalPace} /km</td>
                  <td className="p-3 text-green-600">{Math.round(split.cumulativeElevationGain)} m</td>
                  <td className="p-3 text-red-600">{Math.round(split.cumulativeElevationLoss)} m</td>
                </tr>
              ))}
               <tr key="finish" className="font-bold bg-primary/10">
                <td className="p-3">Arrivée ({totalDistance.toFixed(1)} km)</td>
                <td className="p-3">{totalTime}</td>
                <td className="p-3 font-semibold text-secondary">{finishTimeOfDay}</td>
                <td className="p-3">{avgPace} /km</td>
                <td className="p-3 text-green-600">{Math.round(totalElevationGain)} m</td>
                <td className="p-3 text-red-600">{Math.round(totalElevationLoss)} m</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;