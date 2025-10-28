import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { PatientList } from './components/PatientList';
import { PatientDetail } from './components/PatientDetail';
import { CalendarView } from './components/CalendarView';
import { TreatmentPlans } from './components/TreatmentPlans';
import type { Patient } from './types';
import { mockPatients, mockAppointments, mockTreatmentPlans } from './data/mockData';
import { MenuIcon } from './components/icons/Icon';
import { useTranslation } from './context/LanguageContext';

export type View = 'dashboard' | 'patients' | 'calendar' | 'treatment_plans' | 'settings';

const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { t } = useTranslation();

  const handleSelectPatient = (id: number) => {
    setSelectedPatientId(id);
    setIsSidebarOpen(false);
  };

  const handleUpdatePatient = (updatedPatient: Patient) => {
    setPatients(prevPatients => 
      prevPatients.map(p => p.id === updatedPatient.id ? updatedPatient : p)
    );
  };
  
  const selectedPatient = useMemo(() => {
    return patients.find(p => p.id === selectedPatientId) || null;
  }, [selectedPatientId, patients]);

  const renderContent = () => {
    if (selectedPatientId !== null && selectedPatient) {
        return <PatientDetail patient={selectedPatient} onBack={() => setSelectedPatientId(null)} onUpdatePatient={handleUpdatePatient} />;
    }

    switch (view) {
      case 'dashboard':
        return <Dashboard appointments={mockAppointments} patients={patients} onSelectPatient={handleSelectPatient} />;
      case 'patients':
        return <PatientList patients={patients} onSelectPatient={handleSelectPatient} />;
      case 'calendar':
        return <CalendarView appointments={mockAppointments} />;
      case 'treatment_plans':
        return <TreatmentPlans plans={mockTreatmentPlans} />;
      case 'settings':
          return <div className="p-4 md:p-8"><h1 className="text-3xl font-bold">{t('settings.title')}</h1><p className="mt-4 text-text-secondary">{t('settings.description')}</p></div>
      default:
        return <Dashboard appointments={mockAppointments} patients={patients} onSelectPatient={handleSelectPatient} />;
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