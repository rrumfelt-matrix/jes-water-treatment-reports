export type ServiceFrequency = 'weekly' | 'bi-weekly' | 'monthly';

// Dynamic section types
export interface Boiler {
  id: string;
  name: string;
  ph: string;
  so3: string;
  pAlk: string;
  mAlk: string;
  ohAlk: string;
  cond: string;
  fluor: string;
  notes: string;
}

export interface SupportSystem {
  id: string;
  name: string;
  cond: string;
  ph: string;
  trh: string;
  notes: string;
}

export interface ClosedLoop {
  id: string;
  name: string;
  ph: string;
  cond: string;
  no2Hot: string;
  no2Cold: string;
  notes: string;
}

export interface FormData {
  // Header
  date: string;
  plantName: string;
  address: string;
  attention: string;
  technician: string;
  phone: string;
  serviceFrequency: ServiceFrequency;
  includeCoverPage: boolean;

  // Dynamic sections
  boilers: Boiler[];
  supportSystems: SupportSystem[];
  closedLoops: ClosedLoop[];

  // General
  generalNotes: string;
}

export interface ControlLimit {
  min: number | null;
  max: number | null;
}

export type ValidationStatus = 'good' | 'low' | 'high' | 'neutral';

// Helper functions to create new items with unique IDs
let idCounter = 0;
const generateId = () => `${Date.now()}-${++idCounter}`;

export const createBoiler = (name: string = 'Boiler'): Boiler => ({
  id: generateId(),
  name,
  ph: '',
  so3: '',
  pAlk: '',
  mAlk: '',
  ohAlk: '',
  cond: '',
  fluor: '',
  notes: '',
});

export const createSupportSystem = (name: string = 'Support System'): SupportSystem => ({
  id: generateId(),
  name,
  cond: '',
  ph: '',
  trh: '',
  notes: '',
});

export const createClosedLoop = (name: string = 'Closed Loop'): ClosedLoop => ({
  id: generateId(),
  name,
  ph: '',
  cond: '',
  no2Hot: '',
  no2Cold: '',
  notes: '',
});

export const initialFormData: FormData = {
  date: new Date().toISOString().split('T')[0],
  plantName: '',
  address: '',
  attention: '',
  technician: '',
  phone: '',
  serviceFrequency: 'weekly',
  includeCoverPage: true,
  boilers: [createBoiler('Boiler 1')],
  supportSystems: [createSupportSystem('DA')],
  closedLoops: [createClosedLoop('Loop 1')],
  generalNotes: '',
};
