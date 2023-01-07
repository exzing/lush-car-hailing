export const estimateFare = (
  baseFare,
  timeRate,
  time,
  distanceRate,
  distance,
  surge,
) => {
  const distanceInKm = distance * 0.001;
  const timeInMin = time * 0.0166667;
  const pricePerKm = timeRate * timeInMin;
  const pricePerMinute = distanceRate * distanceInKm;
  const totalFare = (baseFare + pricePerKm + pricePerMinute) * surge;
  return Math.round(totalFare);
};

export const calculateFares = (distanceValue, durationValue) => {
  /**
   * per km  = $0.3
   * per minute = $0.5
   * base fare = $3
   */

  const baseFare = 5;
  const xchangeEffect = 400;
  const distanceFare = (distanceValue / 10) * 0.5;
  const timeFare = (durationValue / 60) * 0.3;

  const totalFare = (baseFare + distanceFare + timeFare) * xchangeEffect;

  return totalFare.toFixed(2);
};
