import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { PatientList } from './components/PatientList.tsx';
import { PatientDetail } from './components/PatientDetail.tsx';
import { CalendarView } from './components/CalendarView.tsx';
import { TreatmentPlans } from './components/TreatmentPlans.tsx';
import { Settings } from './components/Settings.tsx';
import { mockPatients, mockAppointments, mockTreatmentPlans } from './data/mockData.ts';
import type { Patient, Appointment, OdontogramData, TreatmentPlan } from './types.ts';
// FIX: Import ToothStatus to use the enum value instead of a string literal.
import { ToothStatus } from './types.ts';
import { MenuIcon, BackArrowIcon } from './components/icons/Icon.tsx';
import { useTranslation } from './context/LanguageContext.tsx';

export type View = 'dashboard' | 'patients' | 'agenda' | 'treatment_plans' | 'settings';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // State for data, initialized with mock data
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>(mockTreatmentPlans);
  
  const { t } = useTranslation();

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || null;

  const handleSelectPatient = (id: number) => {
    setSelectedPatientId(id);
    setActiveView('patients');
  };

  const clearSelectedPatient = () => {
    setSelectedPatientId(null);
  };
  
  const handleAddPatient = (patientData: Omit<Patient, 'id' | 'appointments' | 'treatments' | 'odontogram' | 'files'>) => {
    const generateInitialOdontogram = (): OdontogramData => {
        const odontogram: OdontogramData = {};
        for (let i = 1; i <= 32; i++) {
          // FIX: Use ToothStatus enum instead of string literal 'Healthy' to conform to the type definition.
          odontogram[i] = { id: i, status: ToothStatus.Healthy };
        }
        return odontogram;
    };

    const newPatient: Patient = {
      ...patientData,
      id: Date.now(),
      appointments: [],
      treatments: [],
      odontogram: generateInitialOdontogram(),
      files: [],
    };
    setPatients([...patients, newPatient]);
  };
  
  const handleUpdatePatient = (updatedPatient: Patient) => {
    setPatients(patients.map(p => p.id === updatedPatient.id ? updatedPatient : p));
  };
  
  const handleAddAppointment = (appointmentData: Omit<Appointment, 'id' | 'patientName' | 'status'>) => {
    const patientName = patients.find(p => p.id === appointmentData.patientId)?.name || 'Unknown';
    const newAppointment: Appointment = {
      ...appointmentData,
      id: Date.now(),
      patientName,
      status: 'confirmed',
    };
    setAppointments([...appointments, newAppointment].sort((a,b) => a.time.localeCompare(b.time)));
  };
  
  const handleAddTreatmentPlan = (planData: Omit<TreatmentPlan, 'id'>) => {
    const newPlan: TreatmentPlan = {
      ...planData,
      id: Date.now(),
    };
    setTreatmentPlans([...treatmentPlans, newPlan]);
  };
  
  const handleUpdateTreatmentPlan = (updatedPlan: TreatmentPlan) => {
    setTreatmentPlans(treatmentPlans.map(p => p.id === updatedPlan.id ? updatedPlan : p));
  };

  const getActiveViewTitle = () => {
    if (activeView === 'patients' && selectedPatient) {
      return t('patientDetail.title');
    }
    switch (activeView) {
      case 'dashboard': return t('dashboard.title');
      case 'patients': return t('patientList.title');
      case 'agenda': return t('agenda.title');
      case 'treatment_plans': return t('treatmentPlans.title');
      case 'settings': return t('settings.title');
      default: return '';
    }
  };

  const renderContent = () => {
    if (activeView === 'patients' && selectedPatient) {
      return <PatientDetail patient={selectedPatient} onBack={clearSelectedPatient} onUpdatePatient={handleUpdatePatient} />;
    }
    switch (activeView) {
      case 'dashboard':
        return <Dashboard patients={patients} appointments={appointments} onSelectPatient={handleSelectPatient} />;
      case 'patients':
        return <PatientList patients={patients} onSelectPatient={handleSelectPatient} onAddPatient={handleAddPatient} />;
      case 'agenda':
        return <CalendarView appointments={appointments} patients={patients} onAddAppointment={handleAddAppointment} />;
      case 'treatment_plans':
        return <TreatmentPlans plans={treatmentPlans} patients={patients} onAddPlan={handleAddTreatmentPlan} onUpdatePlan={handleUpdateTreatmentPlan} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard patients={patients} appointments={appointments} onSelectPatient={handleSelectPatient} />;
    }
  };

  return (
    <div className="flex h-screen bg-background text-text-primary font-sans">
      <Sidebar 
        activeView={activeView} 
        setView={setActiveView} 
        clearSelectedPatient={clearSelectedPatient}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
       {isSidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="md:hidden flex-shrink-0 flex items-center p-4 bg-brand-primary text-white shadow-md z-10">
            {selectedPatient ? (
                <button onClick={clearSelectedPatient} className="mr-4 text-white">
                    <BackArrowIcon />
                </button>
            ) : (
                <button onClick={() => setIsSidebarOpen(true)} className="mr-4 text-white">
                    <MenuIcon />
                </button>
            )}
            <h1 className="text-xl font-bold truncate">{getActiveViewTitle()}</h1>
        </header>
        <div className="flex-1 overflow-y-auto min-h-0">
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;