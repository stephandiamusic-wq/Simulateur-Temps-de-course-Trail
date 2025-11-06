import React, { useState } from 'react';
import { Course, RacePlan, Waypoint, SimulationResult } from '../types';
import WaypointsTable from './WaypointsTable';
import PaceStrategyForm from './PaceStrategyForm';
import ResultsDisplay from './ResultsDisplay';
import { calculateSimulation } from '../services/simulationService';
import { DownloadIcon, UploadIcon, RefreshIcon } from './icons';

interface RacePlannerProps {
  course: Course;
  waypoints: Waypoint[];
  setWaypoints: React.Dispatch<React.SetStateAction<Waypoint[]>>;
  racePlan: RacePlan;
  setRacePlan: React.Dispatch<React.SetStateAction<RacePlan>>;
  simulationResult: SimulationResult | null;
  setSimulationResult: React.Dispatch<React.SetStateAction<SimulationResult | null>>;
  onReset: () => void;
}

const RacePlanner: React.FC<RacePlannerProps> = ({
  course,
  waypoints,
  setWaypoints,
  racePlan,
  setRacePlan,
  simulationResult,
  setSimulationResult,
  onReset,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [startTime, setStartTime] = useState('08:00');

  const handleCalculate = () => {
    setIsLoading(true);
    // Simulate async calculation for better UX
    setTimeout(() => {
      const result = calculateSimulation(course.elevationProfile, racePlan, waypoints, course.totalDistance, startTime);
      setSimulationResult(result);
      setIsLoading(false);
      // Scroll to results
      document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  };

  const handleExport = () => {
    const dataToExport = {
        racePlan,
        waypoints,
    };
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${course.name.replace(/ /g, '_')}_plan.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const result = JSON.parse(e.target?.result as string);
            if (result.racePlan && result.waypoints) {
                setRacePlan(result.racePlan);
                setWaypoints(result.waypoints);
            } else {
                alert("Format JSON invalide. Assurez-vous qu'il contienne 'racePlan' et 'waypoints'.");
            }
        } catch (error) {
            alert("Erreur lors de l'analyse du fichier JSON.");
        }
    };
    reader.readAsText(file);
    // Reset file input to allow re-uploading the same file
    event.target.value = '';
  };

  return (
    <div className="space-y-8">
        <div className="p-6 bg-base-200 rounded-2xl shadow-lg border border-base-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h2 className="text-2xl font-bold text-primary">{course.name}</h2>
                    {course.eventName && <p className="text-gray-500">{course.eventName}</p>}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2">
                        <p className="text-sm">
                            <span className="font-semibold">{course.totalDistance.toFixed(2)} km</span>
                            <span className="mx-2">|</span>
                            <span className="font-semibold">{Math.round(course.totalElevationGain)} m D+</span>
                        </p>
                        <div>
                            <label htmlFor="startTime" className="block text-xs font-medium text-gray-500 mb-1">Heure de départ</label>
                            <input
                              id="startTime"
                              type="time"
                              value={startTime}
                              onChange={(e) => setStartTime(e.target.value)}
                              className="bg-gray-50 border border-base-300 rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-primary focus:outline-none transition"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-2 mt-4 md:mt-0">
                    <button onClick={handleExport} className="flex items-center space-x-2 bg-base-100 hover:bg-base-300 border border-base-300 text-content font-semibold py-2 px-4 rounded-lg transition duration-300">
                        <DownloadIcon className="w-5 h-5" />
                        <span>Exporter le Plan</span>
                    </button>
                    <label className="flex items-center space-x-2 bg-base-100 hover:bg-base-300 border border-base-300 text-content font-semibold py-2 px-4 rounded-lg transition duration-300 cursor-pointer">
                        <UploadIcon className="w-5 h-5" />
                        <span>Importer le Plan</span>
                        <input type="file" className="hidden" accept=".json" onChange={handleImport} />
                    </label>
                    <button onClick={onReset} className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300">
                        <RefreshIcon className="w-5 h-5" />
                        <span>Nouveau Parcours</span>
                    </button>
                </div>
            </div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <WaypointsTable waypoints={waypoints} setWaypoints={setWaypoints} courseDistance={course.totalDistance} />
        <PaceStrategyForm racePlan={racePlan} setRacePlan={setRacePlan} />
      </div>

      <div className="text-center mt-8">
        <button
          onClick={handleCalculate}
          disabled={isLoading}
          className="bg-secondary text-white font-bold py-4 px-10 rounded-lg text-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-100 focus:ring-secondary transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center w-full md:w-auto mx-auto"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Calcul en cours...
            </>
          ) : 'Calculer Ma Course'}
        </button>
      </div>

      {simulationResult && (
        <div id="results-section">
            <ResultsDisplay result={simulationResult} courseProfile={course.elevationProfile} waypoints={waypoints} startTime={startTime} />
        </div>
      )}
    </div>
  );
};

export default RacePlanner;