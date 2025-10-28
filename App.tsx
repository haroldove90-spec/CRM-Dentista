
import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { PatientList } from './components/PatientList';
import { PatientDetail } from './components/PatientDetail';
import { CalendarView } from './components/CalendarView';
import type { Patient } from './types';
import { mockPatients, mockAppointments } from './data/mockData';

export type View = 'dashboard' | 'patients' | 'calendar' | 'settings';

const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);

  const handleSelectPatient = (id: number) => {
    setSelectedPatientId(id);
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
          return <div className="p-8"><h1 className="text-3xl font-bold">Settings</h1><p className="mt-4 text-text-secondary">Manage your clinic settings here. This feature is under construction.</p></div>
      default:
        return <Dashboard appointments={mockAppointments} patients={patients} onSelectPatient={handleSelectPatient} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeView={view} setView={setView} clearSelectedPatient={() => setSelectedPatientId(null)} />
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
