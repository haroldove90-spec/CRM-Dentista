import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { PatientList } from './components/PatientList';
import { PatientDetail } from './components/PatientDetail';
import { CalendarView } from './components/CalendarView';
import type { Patient } from './types';
import { mockPatients, mockAppointments } from './data/mockData';
import { MenuIcon } from './components/icons/Icon';

export type View = 'dashboard' | 'patients' | 'calendar' | 'settings';

const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      case 'settings':
          return <div className="p-4 md:p-8"><h1 className="text-3xl font-bold">Settings</h1><p className="mt-4 text-text-secondary">Manage your clinic settings here. This feature is under construction.</p></div>
      default:
        return <Dashboard appointments={mockAppointments} patients={patients} onSelectPatient={handleSelectPatient} />;
    }
  };
  
  const getHeaderTitle = () => {
      if (selectedPatientId !== null) return 'Patient Details';
      return view.charAt(0).toUpperCase() + view.slice(1);
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