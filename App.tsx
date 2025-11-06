import React, { useState } from 'react';
import { Course, RacePlan, Waypoint, SimulationResult } from './types';
import { DEFAULT_RACE_PLAN } from './constants';
import GpxUpload from './components/GpxUpload';
import RacePlanner from './components/RacePlanner';
import { parseGPX } from './services/gpxParser';

const App: React.FC = () => {
  const [course, setCourse] = useState<Course | null>(null);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [racePlan, setRacePlan] = useState<RacePlan>(DEFAULT_RACE_PLAN);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGpxUpload = async (file: File, courseName: string, eventName: string) => {
    setIsLoading(true);
    setError(null);
    setSimulationResult(null);
    try {
      const gpxText = await file.text();
      const parsedData = parseGPX(gpxText, courseName, eventName);
      setCourse(parsedData.course);
      setWaypoints(parsedData.waypoints);
      setRacePlan(DEFAULT_RACE_PLAN);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue lors de l'analyse du GPX.");
      setCourse(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCourse(null);
    setWaypoints([]);
    setRacePlan(DEFAULT_RACE_PLAN);
    setSimulationResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-base-100 text-content font-sans p-4 md:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-primary">Simulateur de Course Trail</h1>
        <p className="text-lg text-gray-500 mt-2">Planifiez votre course, prédisez votre temps.</p>
      </header>
      <main className="max-w-7xl mx-auto">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
            <strong className="font-bold">Erreur : </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {!course ? (
          <GpxUpload onUpload={handleGpxUpload} isLoading={isLoading} />
        ) : (
          <RacePlanner
            course={course}
            waypoints={waypoints}
            setWaypoints={setWaypoints}
            racePlan={racePlan}
            setRacePlan={setRacePlan}
            simulationResult={simulationResult}
            setSimulationResult={setSimulationResult}
            onReset={handleReset}
          />
        )}
      </main>
      <footer className="text-center mt-12 text-gray-500">
        <p>Conçu pour les passionnés de trail.</p>
      </footer>
    </div>
  );
};

export default App;