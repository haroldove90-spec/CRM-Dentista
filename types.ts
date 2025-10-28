
export enum ToothStatus {
  Healthy = 'Healthy',
  Caries = 'Caries',
  Extraction = 'Extraction',
  Implant = 'Implant',
  Crown = 'Crown',
  Filling = 'Filling',
}

export interface Tooth {
  id: number;
  status: ToothStatus;
}

export interface OdontogramData {
  [key: number]: Tooth;
}

export interface Treatment {
  id: number;
  date: string;
  description: string;
  cost: number;
  paid: boolean;
  toothIds?: number[];
}

export interface Appointment {
  id: number;
  patientId: number;
  patientName: string;
  date: string;
  time: string;
  duration: number; // in minutes
  reason: string;
  status: 'confirmed' | 'completed' | 'cancelled';
}

export interface Patient {
  id: number;
  name: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  address: string;
  medicalHistory: string;
  notes: string;
  avatarUrl: string;
  appointments: Appointment[];
  treatments: Treatment[];
  odontogram: OdontogramData;
}

export interface TreatmentPlanProcedure {
    id: number;
    description: string;
    cost: number;
    status: 'pending' | 'completed';
}

export interface TreatmentPlan {
    id: number;
    patientId: number;
    patientName: string;
    planName: string;
    status: 'Proposed' | 'In Progress' | 'Completed';
    totalCost: number;
    procedures: TreatmentPlanProcedure[];
}