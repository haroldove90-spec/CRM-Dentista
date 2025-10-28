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
import { MenuIcon } from './components/icons/Icon.tsx';

export type View = 'dashboard' | 'patients' | 'agenda' | 'treatment_plans' | 'settings';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // State for data, initialized with mock data
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>(mockTreatmentPlans);

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
          odontogram[i] = { id: i, status: 'Healthy' };
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

  const renderContent = () => {
    if (activeView === 'patients' && selectedPatient) {
      return <PatientDetail patient={selectedPatient} onBack={() => setSelectedPatientId(null)} onUpdatePatient={handleUpdatePatient} />;
    }
    switch (activeView) {
      case 'dashboard':
        return <Dashboard patients={patients} appointments={appointments} onSelectPatient={handleSelectPatient} />;
      case 'patients':
        return <PatientList patients={patients} onSelectPatient={handleSelectPatient} onAddPatient={handleAddPatient} />;
      case 'agenda':
        return <CalendarView appointments={appointments} patients={patients} onAddAppointment={handleAddAppointment} />;
      case 'treatment_plans':
        return <TreatmentPlans plans={treatmentPlans} patients={patients} onAddPlan={handleAddTreatmentPlan} />;
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
      <main className="flex-1 overflow-y-auto relative">
        <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 m-4 rounded-md bg-white shadow fixed top-0 left-0 z-10">
            <MenuIcon />
        </button>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
