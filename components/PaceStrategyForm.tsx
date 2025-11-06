import React from 'react';
import { RacePlan, FatigueRule } from '../types';
import { SLOPE_CATEGORIES } from '../constants';
import { PlusIcon, TrashIcon } from './icons';

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

  const handleFatigueChange = (id: string, field: keyof Omit<FatigueRule, 'id'>, value: string) => {
    const updatedFatigue = racePlan.fatigue.map(rule =>
      rule.id === id ? { ...rule, [field]: parseInt(value) || 0 } : rule
    );

    setRacePlan(prev => ({
      ...prev,
      fatigue: updatedFatigue.sort((a, b) => a.startKm - b.startKm),
    }));
  };
  
  const handleAddFatigueRule = () => {
    setRacePlan(prev => {
        const lastRule = prev.fatigue[prev.fatigue.length - 1];
        const newRule: FatigueRule = {
            id: new Date().toISOString(),
            startKm: lastRule ? lastRule.startKm + 20 : 60,
            lossSeconds: 10,
            kmsPerInterval: 10,
        };
        return {
            ...prev,
            fatigue: [...prev.fatigue, newRule].sort((a,b) => a.startKm - b.startKm)
        };
    });
  };

  const handleDeleteFatigueRule = (id: string) => {
    setRacePlan(prev => ({
        ...prev,
        fatigue: prev.fatigue.filter(rule => rule.id !== id),
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
        <div className="space-y-3">
          {racePlan.fatigue.map((rule) => (
            <div key={rule.id} className="grid grid-cols-1 sm:grid-cols-[1fr,1fr,1fr,auto] gap-3 items-center p-3 rounded-lg bg-gray-50 border border-base-300">
              <div>
                <label htmlFor={`fatigueStart-${rule.id}`} className="block text-xs font-medium mb-1 text-gray-500">Début au km</label>
                <input
                  id={`fatigueStart-${rule.id}`}
                  type="number"
                  value={rule.startKm}
                  onChange={(e) => handleFatigueChange(rule.id, 'startKm', e.target.value)}
                  className="w-full bg-white border border-base-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-primary focus:outline-none transition text-sm"
                />
              </div>
              <div>
                <label htmlFor={`fatigueLoss-${rule.id}`} className="block text-xs font-medium mb-1 text-gray-500">Perte (sec)</label>
                <input
                  id={`fatigueLoss-${rule.id}`}
                  type="number"
                  value={rule.lossSeconds}
                  onChange={(e) => handleFatigueChange(rule.id, 'lossSeconds', e.target.value)}
                  className="w-full bg-white border border-base-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-primary focus:outline-none transition text-sm"
                />
              </div>
              <div>
                <label htmlFor={`fatigueInterval-${rule.id}`} className="block text-xs font-medium mb-1 text-gray-500">Par tranche de (km)</label>
                <input
                  id={`fatigueInterval-${rule.id}`}
                  type="number"
                  value={rule.kmsPerInterval}
                  onChange={(e) => handleFatigueChange(rule.id, 'kmsPerInterval', e.target.value)}
                  className="w-full bg-white border border-base-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-primary focus:outline-none transition text-sm"
                />
              </div>
              <div className="self-end">
                <button onClick={() => handleDeleteFatigueRule(rule.id)} className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-100">
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={handleAddFatigueRule}
          className="mt-4 w-full flex items-center justify-center space-x-2 bg-primary/10 text-primary font-semibold py-2 px-4 rounded-lg hover:bg-primary/20 transition duration-300"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Ajouter un seuil de fatigue</span>
        </button>
      </div>
    </div>
  );
};

export default PaceStrategyForm;