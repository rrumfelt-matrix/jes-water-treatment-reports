import { ControlLimit, ValidationStatus } from '../types';

export const controlLimits: Record<string, ControlLimit> = {
  // Boiler measurements (applies to all boilers)
  boilerPh: { min: 11.0, max: 12.5 },
  boilerSo3: { min: 30, max: 60 },
  boilerPAlk: { min: 300, max: 600 },
  boilerMAlk: { min: null, max: 800 },
  boilerOhAlk: { min: 300, max: 600 },
  boilerCond: { min: 3000, max: 4000 },
  boilerFluor: { min: 200, max: 300 },

  // Support System measurements
  systemPh: { min: 8, max: 9.5 },
  systemTrh: { min: 0, max: 2 },

  // Closed Loop measurements
  loopPh: { min: 9, max: 9.5 },
  loopNo2Hot: { min: 900, max: 1500 },
  loopNo2Cold: { min: 600, max: 900 },
};

export const getValidationStatus = (value: string, field: string): ValidationStatus => {
  if (!value || !controlLimits[field]) return 'neutral';
  const num = parseFloat(value);
  if (isNaN(num)) return 'neutral';

  const { min, max } = controlLimits[field];
  if (min !== null && num < min) return 'low';
  if (max !== null && num > max) return 'high';
  return 'good';
};

export const getControlLimitDisplay = (field: string): string => {
  const limit = controlLimits[field];
  if (!limit) return '';

  if (limit.min === null && limit.max !== null) {
    return `MAX ${limit.max}`;
  }
  if (limit.min !== null && limit.max !== null) {
    return `${limit.min}-${limit.max}`;
  }
  return '';
};
