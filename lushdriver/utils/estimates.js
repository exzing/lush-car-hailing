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

export const estimatedCarbonFP = async ({api, fuel, type}) => {
  const value =
    fuel === 'Diesel' && type === 'SmallDieselCar'
      ? api.Diesel1L + api.SmallDieselCar1Km
      : fuel === 'Diesel' && type === 'MediumDieselCar'
      ? api.Diesel1L + api.MediumDieselCar1Km
      : fuel === 'Diesel' && type === 'LargeDieselCar'
      ? api.Diesel1L + api.LargeDieselCar1Km
      : fuel === 'Petrol' && type === 'SmallPetrolCar'
      ? api.Petrol1L + api.SmallPetrolCar1Km
      : fuel === 'Petrol' && type === 'MediumPetrolCar'
      ? api.Petrol1L + api.MediumPetrolCar1Km
      : fuel === 'Petrol' && type === 'LargePetrolCar'
      ? api.Petrol1L + api.LargePetrolCar1Km
      : fuel === 'LPG' && type === 'MediumLPGCar'
      ? api.Petrol1L + api.MediumLPGCar1Km
      : fuel === 'LPG' && type === 'LargeLPGCar'
      ? api.Petrol1L + api.LargeLPGCar1Km
      : 0;

  // setCarbonFP(value.toString());
  console.log({value});
  return value;
};
