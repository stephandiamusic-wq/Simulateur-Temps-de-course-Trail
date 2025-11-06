import { Course, ElevationPoint, Waypoint } from '../types';
import { haversineDistance } from '../utils/calculations';

export const parseGPX = (gpxString: string, courseName: string, eventName: string): { course: Course; waypoints: Waypoint[] } => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(gpxString, 'text/xml');

  const errorNode = xmlDoc.querySelector('parsererror');
    if (errorNode) {
        throw new Error("Échec de l'analyse du fichier GPX. Vérifiez le format du fichier.");
    }

  const trackPoints = xmlDoc.querySelectorAll('trkpt');
  const waypointsFromGPX = xmlDoc.querySelectorAll('wpt');

  if (trackPoints.length === 0) {
      throw new Error("Aucun point de trace (<trkpt>) trouvé dans le fichier GPX.");
  }

  const elevationProfile: ElevationPoint[] = [];
  let totalDistance = 0;
  let totalElevationGain = 0;
  let lastPoint: { lat: number; lon: number; ele: number } | null = null;

  trackPoints.forEach((pt) => {
    const lat = parseFloat(pt.getAttribute('lat')!);
    const lon = parseFloat(pt.getAttribute('lon')!);
    const eleNode = pt.querySelector('ele');
    const ele = eleNode ? parseFloat(eleNode.textContent!) : 0;

    if (lastPoint) {
      const dist = haversineDistance(
        { lat: lastPoint.lat, lon: lastPoint.lon },
        { lat, lon }
      );
      totalDistance += dist;

      const eleDiff = ele - lastPoint.ele;
      if (eleDiff > 0) {
        totalElevationGain += eleDiff;
      }
    }
    
    elevationProfile.push({ dist: totalDistance, alt: ele });
    lastPoint = { lat, lon, ele };
  });

  const waypoints: Waypoint[] = [];
  waypointsFromGPX.forEach((wpt) => {
    const nameNode = wpt.querySelector('name');
    if (nameNode) {
      const lat = parseFloat(wpt.getAttribute('lat')!);
      const lon = parseFloat(wpt.getAttribute('lon')!);
      let closestDist = Infinity;
      let wayPointDist = 0;

      // Find the distance along the track for this waypoint
      for(let i = 1; i < elevationProfile.length; i++) {
        const pt = trackPoints[i];
        const ptLat = parseFloat(pt.getAttribute('lat')!);
        const ptLon = parseFloat(pt.getAttribute('lon')!);
        const dist = haversineDistance({lat, lon}, {lat: ptLat, lon: ptLon});
        if(dist < closestDist) {
            closestDist = dist;
            wayPointDist = elevationProfile[i].dist;
        }
      }

      waypoints.push({
        id: new Date().toISOString() + Math.random(),
        name: nameNode.textContent || 'Point de passage',
        distanceKm: wayPointDist,
        timeLimit: '00:00',
        stopTimeMin: 5,
      });
    }
  });

  // Add arrival point if not present
  const arrivalExists = waypoints.some(wp => Math.abs(wp.distanceKm - totalDistance) < 0.1);
  if (!arrivalExists) {
      waypoints.push({
        id: new Date().toISOString() + 'arrival',
        name: 'Arrivée',
        distanceKm: totalDistance,
        timeLimit: '00:00',
        stopTimeMin: 0,
      });
  }


  const course: Course = {
    name: courseName,
    eventName: eventName,
    totalDistance,
    totalElevationGain,
    elevationProfile,
  };

  return { course, waypoints: waypoints.sort((a, b) => a.distanceKm - b.distanceKm) };
};