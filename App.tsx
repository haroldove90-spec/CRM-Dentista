
import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { PatientList } from './components/PatientList';
import { PatientDetail } from './components/PatientDetail';
import { CalendarView } from './components/CalendarView';
import { TreatmentPlans } from './components/TreatmentPlans';
import { Settings } from './components/Settings';
import type { Patient, Appointment, TreatmentPlan, OdontogramData } from './types';
import { mockPatients, mockAppointments, mockTreatmentPlans } from './data/mockData';
import { MenuIcon } from './components/icons/Icon';
import { useTranslation } from './context/LanguageContext';
import { ToothStatus } from './types';

export type View = 'dashboard' | 'patients' | 'calendar' | 'treatment_plans' | 'settings';

const generateInitialOdontogram = (): OdontogramData => {
  const odontogram: OdontogramData = {};
  for (let i = 1; i <= 32; i++) {
    odontogram[i] = { id: i, status: ToothStatus.Healthy };
  }
  return odontogram;
};


const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>(mockTreatmentPlans);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { t } = useTranslation();

  const handleSelectPatient = (id: number) => {
    setSelectedPatientId(id);
    setView('patients'); // Switch view to patients context
    setIsSidebarOpen(false);
  };

  const handleUpdatePatient = (updatedPatient: Patient) => {
    setPatients(prevPatients => 
      prevPatients.map(p => p.id === updatedPatient.id ? updatedPatient : p)
    );
  };
  
  const handleAddNewPatient = (patientData: Omit<Patient, 'id' | 'appointments' | 'treatments' | 'odontogram' | 'files' | 'avatarUrl'>) => {
      const newPatient: Patient = {
          ...patientData,
          id: Date.now(),
          avatarUrl: `https://picsum.photos/seed/${Date.now()}/200/200`,
          appointments: [],
          treatments: [],
          files: [],
          odontogram: generateInitialOdontogram(),
      };
      setPatients(prev => [...prev, newPatient]);
  };

  const handleAddNewAppointment = (appointmentData: Omit<Appointment, 'id' | 'patientName' | 'status'>) => {
      const patient = patients.find(p => p.id === appointmentData.patientId);
      if (!patient) return;

      const newAppointment: Appointment = {
          ...appointmentData,
          id: Date.now(),
          patientName: patient.name,
          status: 'confirmed',
      };
      setAppointments(prev => [...prev, newAppointment]);
      // Also add to patient's record
      const updatedPatient = { ...patient, appointments: [...patient.appointments, newAppointment]};
      handleUpdatePatient(updatedPatient);
  }
  
  const handleAddTreatmentPlan = (planData: Omit<TreatmentPlan, 'id'>) => {
      const newPlan: TreatmentPlan = {
          ...planData,
          id: Date.now(),
      };
      setTreatmentPlans(prev => [...prev, newPlan]);
  }

  const selectedPatient = useMemo(() => {
    return patients.find(p => p.id === selectedPatientId) || null;
  }, [selectedPatientId, patients]);

  const renderContent = () => {
    if (selectedPatientId !== null && selectedPatient) {
        return <PatientDetail patient={selectedPatient} onBack={() => setSelectedPatientId(null)} onUpdatePatient={handleUpdatePatient} />;
    }

    switch (view) {
      case 'dashboard':
        return <Dashboard appointments={appointments} patients={patients} onSelectPatient={handleSelectPatient} />;
      case 'patients':
        return <PatientList patients={patients} onSelectPatient={handleSelectPatient} onAddPatient={handleAddNewPatient} />;
      case 'calendar':
        return <CalendarView appointments={appointments} patients={patients} onAddAppointment={handleAddNewAppointment} />;
      case 'treatment_plans':
        return <TreatmentPlans plans={treatmentPlans} patients={patients} onAddPlan={handleAddTreatmentPlan} />;
      case 'settings':
          return <Settings />;
      default:
        return <Dashboard appointments={appointments} patients={patients} onSelectPatient={handleSelectPatient} />;
    }
  };
  
  const getHeaderTitle = () => {
    if (selectedPatientId !== null) return t('patientDetail.headerTitle');
    
    const viewTitleMap: { [key in View]: string } = {
        'dashboard': 'dashboard.title',
        'patients': 'patientList.title',
        'calendar': 'calendar.title',
        'treatment_plans': 'treatmentPlans.title',
        'settings': 'settings.title'
    };
    
    return t(viewTitleMap[view] || view);
  }

  return (
    <div className="relative min-h-screen md:flex">
      {/* Overlay for mobile */}
      {isSidebarOpen && (
          <div 
              className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
          ></div>
      )}

      <Sidebar 
        activeView={view} 
        setView={setView} 
        clearSelectedPatient={() => setSelectedPatientId(null)}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden bg-brand-dark shadow-md p-4 flex items-center sticky top-0 z-10">
            <button onClick={() => setIsSidebarOpen(true)} className="text-white hover:text-brand-light">
                <MenuIcon />
            </button>
            <h1 className="text-xl font-bold ml-4 text-white capitalize">{getHeaderTitle()}</h1>
        </header>

        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
