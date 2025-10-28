import type { Patient, Appointment, OdontogramData, TreatmentPlan, ClinicalFile } from '../types';
import { ToothStatus } from '../types';

const generateInitialOdontogram = (): OdontogramData => {
  const odontogram: OdontogramData = {};
  for (let i = 1; i <= 32; i++) {
    odontogram[i] = { id: i, status: ToothStatus.Healthy };
  }
  return odontogram;
};

const odontogram1 = generateInitialOdontogram();
odontogram1[3].status = ToothStatus.Caries;
odontogram1[14].status = ToothStatus.Filling;
odontogram1[18].status = ToothStatus.Crown;
odontogram1[30].status = ToothStatus.Extraction;

const odontogram2 = generateInitialOdontogram();
odontogram2[5].status = ToothStatus.Implant;
odontogram2[12].status = ToothStatus.Caries;
odontogram2[20].status = ToothStatus.Filling;

const odontogram3 = generateInitialOdontogram();
odontogram3[1].status = ToothStatus.Extraction;
odontogram3[16].status = ToothStatus.Extraction;
odontogram3[17].status = ToothStatus.Extraction;
odontogram3[32].status = ToothStatus.Extraction;
odontogram3[19].status = ToothStatus.Implant;

export const mockAppointments: Appointment[] = [
  { id: 1, patientId: 1, patientName: 'Ana García', date: new Date().toISOString().split('T')[0], time: '09:00', duration: 45, reason: 'Annual Checkup', status: 'confirmed' },
  { id: 2, patientId: 2, patientName: 'Carlos Martinez', date: new Date().toISOString().split('T')[0], time: '10:00', duration: 60, reason: 'Root Canal', status: 'confirmed' },
  { id: 3, patientId: 3, patientName: 'Sofia Rodriguez', date: new Date().toISOString().split('T')[0], time: '11:30', duration: 30, reason: 'Teeth Whitening', status: 'confirmed' },
  { id: 4, patientId: 1, patientName: 'Ana García', date: '2023-10-15', time: '14:00', duration: 60, reason: 'Filling', status: 'completed' },
];

export const mockPatients: Patient[] = [
  {
    id: 1,
    name: 'Ana García',
    dob: '1985-05-20',
    gender: 'Female',
    phone: '+34 612 345 678',
    email: 'ana.garcia@example.com',
    address: 'Calle Falsa 123, Madrid',
    medicalHistory: 'Allergic to penicillin. No other known conditions.',
    notes: 'Patient is nervous about dental procedures. Requires extra reassurance. Came in for a checkup, found caries on tooth #3. Scheduled a filling. Also completed a crown on #18 last year. Tooth #30 was extracted two years ago due to severe decay.',
    avatarUrl: 'https://i.pinimg.com/1200x/9a/37/7c/9a377c47a7951de1944b3f7445a959e9.jpg',
    appointments: mockAppointments.filter(a => a.patientId === 1),
    treatments: [
      { id: 1, date: '2023-10-15', description: 'Composite Filling - Tooth #14', cost: 120, paid: true, toothIds: [14] },
      { id: 2, date: '2023-03-01', description: 'Porcelain Crown - Tooth #18', cost: 800, paid: true, toothIds: [18] },
      { id: 3, date: '2022-07-22', description: 'Extraction - Tooth #30', cost: 150, paid: true, toothIds: [30] },
    ],
    odontogram: odontogram1,
    files: [
      { id: 1, name: 'radiografia-panoramica.jpg', type: 'image', url: 'https://picsum.photos/seed/xray/400/300', uploadDate: '2023-10-10' },
      { id: 2, name: 'historial-medico.pdf', type: 'document', url: '#', uploadDate: '2023-09-01' },
    ],
  },
  {
    id: 2,
    name: 'Carlos Martinez',
    dob: '1992-11-10',
    gender: 'Male',
    phone: '+34 698 765 432',
    email: 'carlos.martinez@example.com',
    address: 'Avenida Siempre Viva 742, Barcelona',
    medicalHistory: 'No known allergies. Takes medication for high blood pressure.',
    notes: 'Patient complains of sensitivity in the upper left quadrant. X-ray confirms need for root canal on tooth #12. Patient has an implant on #5 from a previous clinic.',
    avatarUrl: 'https://www.infobae.com/resizer/v2/DLH6FYJ75ONQBW4WHCF5AI7LYQ.aspx?auth=c863f5b7a2a9d93c66b2cab16b9440dc97cff8b9b5fa79a3cfed59e3cce8fc09&smart=true&width=992&height=658&quality=85',
    appointments: mockAppointments.filter(a => a.patientId === 2),
    treatments: [
      { id: 4, date: '2023-08-05', description: 'Dental Implant - Tooth #5', cost: 2500, paid: true, toothIds: [5] },
      { id: 5, date: '2024-01-20', description: 'Regular Cleaning', cost: 80, paid: true },
    ],
    odontogram: odontogram2,
    files: [],
  },
  {
    id: 3,
    name: 'Sofia Rodriguez',
    dob: '2001-01-30',
    gender: 'Female',
    phone: '+34 655 123 987',
    email: 'sofia.rodriguez@example.com',
    address: 'Plaza Mayor 1, Sevilla',
    medicalHistory: 'None.',
    notes: 'Patient is interested in cosmetic dentistry, specifically teeth whitening. All wisdom teeth were extracted before she became a patient at this clinic. Patient has an implant on #19.',
    avatarUrl: 'https://i.pinimg.com/736x/be/20/cc/be20ccc1456eb061abbf5a77d84fb8b7.jpg',
    appointments: mockAppointments.filter(a => a.patientId === 3),
    treatments: [
        { id: 6, date: '2023-09-12', description: 'Dental Implant - Tooth #19', cost: 2300, paid: true, toothIds: [19] }
    ],
    odontogram: odontogram3,
    files: [],
  },
];

export const mockTreatmentPlans: TreatmentPlan[] = [
    {
        id: 1,
        patientId: 1,
        patientName: 'Ana García',
        planName: 'Restauración Completa',
        status: 'In Progress',
        totalCost: 1570,
        procedures: [
            { id: 1, description: 'Composite Filling - Tooth #3', cost: 150, status: 'pending' },
            { id: 2, description: 'Porcelain Crown - Tooth #18', cost: 800, status: 'completed' },
            { id: 3, description: 'Limpieza Profunda', cost: 200, status: 'completed' },
            { id: 4, description: 'Blanqueamiento Dental', cost: 420, status: 'pending' },
        ],
    },
    {
        id: 2,
        patientId: 2,
        patientName: 'Carlos Martinez',
        planName: 'Implante y Canal Radicular',
        status: 'Proposed',
        totalCost: 3600,
        procedures: [
            { id: 1, description: 'Root Canal - Tooth #12', cost: 1100, status: 'pending' },
            { id: 2, description: 'Dental Implant - Tooth #5', cost: 2500, status: 'completed' },
        ],
    },
    {
        id: 3,
        patientId: 3,
        patientName: 'Sofia Rodriguez',
        planName: 'Plan Cosmético',
        status: 'Completed',
        totalCost: 2800,
        procedures: [
            { id: 1, description: 'Teeth Whitening', cost: 500, status: 'completed' },
            { id: 2, description: 'Dental Implant - Tooth #19', cost: 2300, status: 'completed' },
        ],
    },
];
