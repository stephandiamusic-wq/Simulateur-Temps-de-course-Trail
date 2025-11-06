
export const timeStringToSeconds = (time: string): number => {
  if (!time || !time.includes(':')) return 360; // Default to 6:00 min/km if format is bad
  const parts = time.split(':').map(Number);
  if(parts.length === 2) {
      return parts[0] * 60 + parts[1];
  }
  if(parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 360;
};

export const formatSecondsToTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  return [hours, minutes, seconds]
    .map(v => v < 10 ? '0' + v : v)
    .join(':');
};

export const formatSecondsToPace = (secondsPerKm: number): string => {
  if (isNaN(secondsPerKm) || !isFinite(secondsPerKm)) return '00:00';
  const minutes = Math.floor(secondsPerKm / 60);
  const seconds = Math.floor(secondsPerKm % 60);

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export const formatSecondsToTimeOfDay = (startTime: string, secondsOffset: number): string => {
  if (!startTime || !startTime.includes(':')) return '--:--';
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const startTotalSeconds = startHours * 3600 + startMinutes * 60;
  
  const finalTotalSeconds = startTotalSeconds + secondsOffset;
  
  const day = Math.floor(finalTotalSeconds / (24 * 3600));
  const hours = Math.floor((finalTotalSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((finalTotalSeconds % 3600) / 60);

  const dayString = day > 0 ? `J+${day} ` : '';

  return `${dayString}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};