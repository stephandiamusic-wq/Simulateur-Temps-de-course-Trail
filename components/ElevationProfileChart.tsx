import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine, Label } from 'recharts';
import { ElevationPoint, Waypoint, WaypointSplit } from '../types';

interface ElevationProfileChartProps {
  profile: ElevationPoint[];
  waypoints: Waypoint[];
  waypointSplits: WaypointSplit[];
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-2 border border-gray-300 rounded-md shadow-lg">
                <p className="label text-sm text-gray-600">{`Distance : ${label.toFixed(2)} km`}</p>
                <p className="intro text-sm text-primary">{`Altitude : ${payload[0].value.toFixed(0)} m`}</p>
            </div>
        );
    }
    return null;
};

const CustomWaypointLabel = (props: any) => {
  const { x, y, waypoint } = props;
  if (x === undefined || y === undefined || !waypoint) {
    return null;
  }

  return (
    <text x={x} y={y} textAnchor="middle" fontSize="12px" fill="#F97316">
      <tspan x={x} dy="-1em" fontWeight="bold">{waypoint.name}</tspan>
      <tspan x={x} dy="1.2em">{waypoint.arrival}</tspan>
    </text>
  );
};


const ElevationProfileChart: React.FC<ElevationProfileChartProps> = ({ profile, waypoints, waypointSplits }) => {

  const waypointsWithTimes = waypoints.map(wp => {
    const split = waypointSplits.find(s => s.distanceKm === wp.distanceKm);
    return {
      ...wp,
      arrival: split?.arrivalTime || 'N/A',
      departure: split?.departureTime || 'N/A',
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={profile} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <XAxis 
          dataKey="dist" 
          type="number" 
          domain={['dataMin', 'dataMax']} 
          tick={{ fill: '#6B7280', fontSize: 12 }} 
          stroke="#D1D5DB"
          unit="km"
        />
        <YAxis 
          tick={{ fill: '#6B7280', fontSize: 12 }} 
          stroke="#D1D5DB"
          unit="m"
          domain={['dataMin - 100', 'dataMax + 100']}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="alt" stroke="#10B981" fillOpacity={1} fill="url(#colorUv)" />
        
        {waypointsWithTimes.map((wp, index) => (
          <ReferenceLine key={index} x={wp.distanceKm} stroke="#F97316" strokeDasharray="3 3">
             <Label
              position="top"
              offset={10}
              content={(props) => <CustomWaypointLabel {...props} waypoint={wp} />}
            />
          </ReferenceLine>
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default ElevationProfileChart;