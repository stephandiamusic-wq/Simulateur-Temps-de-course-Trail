import React from 'react';
import { RacePlan } from '../types';
import { SLOPE_CATEGORIES } from '../constants';

interface PaceStrategyFormProps {
  racePlan: RacePlan;
  setRacePlan: React.Dispatch<React.SetStateAction<RacePlan>>;
}

const PaceStrategyForm: React.FC<PaceStrategyFormProps> = ({ racePlan, setRacePlan }) => {

  const handlePaceChange = (category: string, value: string) => {
    setRacePlan(prev => ({
      ...prev,
      pacesBySlope: {
        ...prev.pacesBySlope,
        [category]: value,
      },
    }));
  };

  const handleFatigueChange = (field: keyof RacePlan['fatigue'], value: string) => {
    setRacePlan(prev => ({
      ...prev,
      fatigue: {
        ...prev.fatigue,
        [field]: parseInt(value) || 0,
      },
    }));
  };

  return (
    <div className="bg-base-200 p-6 rounded-2xl shadow-lg border border-base-300 space-y-6">
      <div>
        <h3 className="text-xl font-bold mb-4 text-content">Stratégie d'Allure (min/km)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SLOPE_CATEGORIES.map(({ id, label }) => (
            <div key={id}>
              <label htmlFor={id} className="block text-sm font-medium mb-1 text-gray-500">{label}</label>
              <input
                id={id}
                type="text"
                value={racePlan.pacesBySlope[id]}
                onChange={(e) => handlePaceChange(id, e.target.value)}
                placeholder="MM:SS"
                className="w-full bg-gray-50 border border-base-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none transition"
              />
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-4 text-content">Modèle de Fatigue</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="fatigueStart" className="block text-sm font-medium mb-1 text-gray-500">Début au km</label>
            <input
              id="fatigueStart"
              type="number"
              value={racePlan.fatigue.startKm}
              onChange={(e) => handleFatigueChange('startKm', e.target.value)}
              className="w-full bg-gray-50 border border-base-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none transition"
            />
          </div>
          <div>
            <label htmlFor="fatigueLoss" className="block text-sm font-medium mb-1 text-gray-500">Perte (sec)</label>
            <input
              id="fatigueLoss"
              type="number"
              value={racePlan.fatigue.lossSeconds}
              onChange={(e) => handleFatigueChange('lossSeconds', e.target.value)}
              className="w-full bg-gray-50 border border-base-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none transition"
            />
          </div>
          <div>
            <label htmlFor="fatigueInterval" className="block text-sm font-medium mb-1 text-gray-500">Par tranche de (km)</label>
            <input
              id="fatigueInterval"
              type="number"
              value={racePlan.fatigue.kmsPerInterval}
              onChange={(e) => handleFatigueChange('kmsPerInterval', e.target.value)}
              className="w-full bg-gray-50 border border-base-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none transition"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaceStrategyForm;