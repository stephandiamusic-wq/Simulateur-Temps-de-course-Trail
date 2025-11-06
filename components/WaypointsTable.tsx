import React from 'react';
import { Waypoint } from '../types';
import { TrashIcon, PlusIcon } from './icons';

interface WaypointsTableProps {
  waypoints: Waypoint[];
  setWaypoints: React.Dispatch<React.SetStateAction<Waypoint[]>>;
  courseDistance: number;
}

const WaypointsTable: React.FC<WaypointsTableProps> = ({ waypoints, setWaypoints, courseDistance }) => {

  const handleAddWaypoint = () => {
    const newWaypoint: Waypoint = {
      id: new Date().toISOString(),
      name: `Nouveau Point`,
      distanceKm: waypoints.length > 0 ? Math.min(courseDistance, waypoints[waypoints.length-1].distanceKm + 10) : Math.min(courseDistance, 10),
      timeLimit: '00:00',
      stopTimeMin: 5,
    };
    setWaypoints([...waypoints, newWaypoint].sort((a,b) => a.distanceKm - b.distanceKm));
  };

  const handleUpdateWaypoint = (id: string, field: keyof Waypoint, value: string | number) => {
    const updatedWaypoints = waypoints.map((wp) => {
      if (wp.id === id) {
        if (field === 'distanceKm' && typeof value === 'number') {
            return { ...wp, [field]: Math.max(0, Math.min(courseDistance, value)) };
        }
        return { ...wp, [field]: value };
      }
      return wp;
    });
    setWaypoints(updatedWaypoints.sort((a,b) => a.distanceKm - b.distanceKm));
  };

  const handleDeleteWaypoint = (id: string) => {
    setWaypoints(waypoints.filter((wp) => wp.id !== id));
  };

  return (
    <div className="bg-base-200 p-6 rounded-2xl shadow-lg border border-base-300">
      <h3 className="text-xl font-bold mb-4 text-content">Ravitaillements & Points de Passage</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="p-3">Nom</th>
              <th className="p-3">Distance (km)</th>
              <th className="p-3">Barrière Horaire</th>
              <th className="p-3">Arrêt (min)</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-300">
            {waypoints.map((wp) => (
              <tr key={wp.id} className="hover:bg-gray-50">
                <td className="p-2">
                  <input
                    type="text"
                    value={wp.name}
                    onChange={(e) => handleUpdateWaypoint(wp.id, 'name', e.target.value)}
                    className="w-full bg-transparent p-1 rounded-md focus:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={wp.distanceKm}
                    onChange={(e) => handleUpdateWaypoint(wp.id, 'distanceKm', parseFloat(e.target.value) || 0)}
                    className="w-20 bg-transparent p-1 rounded-md focus:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-primary"
                    step="0.1"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    value={wp.timeLimit}
                    onChange={(e) => handleUpdateWaypoint(wp.id, 'timeLimit', e.target.value)}
                    className="w-20 bg-transparent p-1 rounded-md focus:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="HH:MM"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={wp.stopTimeMin}
                    onChange={(e) => handleUpdateWaypoint(wp.id, 'stopTimeMin', parseInt(e.target.value) || 0)}
                    className="w-16 bg-transparent p-1 rounded-md focus:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </td>
                <td className="p-2 text-right">
                  <button onClick={() => handleDeleteWaypoint(wp.id)} className="text-gray-400 hover:text-red-500">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={handleAddWaypoint}
        className="mt-4 w-full flex items-center justify-center space-x-2 bg-primary/10 text-primary font-semibold py-2 px-4 rounded-lg hover:bg-primary/20 transition duration-300"
      >
        <PlusIcon className="w-5 h-5" />
        <span>Ajouter un point de passage</span>
      </button>
    </div>
  );
};

export default WaypointsTable;