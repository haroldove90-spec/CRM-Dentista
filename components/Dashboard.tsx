
import React from 'react';
import type { Appointment, Patient } from '../types';

interface DashboardProps {
  appointments: Appointment[];
  patients: Patient[];
  onSelectPatient: (id: number) => void;
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
    <div className="bg-brand-light p-3 rounded-full mr-4">
      {icon}
    </div>
    <div>
      <p className="text-sm text-text-secondary">{title}</p>
      <p className="text-2xl font-bold text-text-primary">{value}</p>
    </div>
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ appointments, patients, onSelectPatient }) => {
  const today = new Date().toISOString().split('T')[0];
  const todaysAppointments = appointments.filter(a => a.date === today);

  return (
    <div className="p-8 bg-background min-h-full">
      <h1 className="text-3xl font-bold text-text-primary mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Today's Appointments" value={todaysAppointments.length.toString()} icon={<svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>} />
        <StatCard title="Total Patients" value={patients.length.toString()} icon={<svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.995 5.995 0 0012 12a5.995 5.995 0 00-3-5.197z"></path></svg>} />
        <StatCard title="Monthly Revenue" value="$12,450" icon={<svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6v-1.667a1.667 1.667 0 00-1.667-1.667H10M12 6h1.667A1.667 1.667 0 0115.333 6H14m0 0V5.333A1.667 1.667 0 0012.333 3.667H12m0 0V3m0 0H9.667A1.667 1.667 0 008 4.667H9m0 0v1.667A1.667 1.667 0 0010.667 8H12m0 12V10m0 10a8 8 0 110-16 8 8 0 010 16z"></path></svg>} />
        <StatCard title="Pending Invoices" value="12" icon={<svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Today's Appointments</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Time</th>
                  <th className="p-2">Patient</th>
                  <th className="p-2">Reason</th>
                </tr>
              </thead>
              <tbody>
                {todaysAppointments.map(app => (
                  <tr key={app.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{app.time}</td>
                    <td className="p-2 text-brand-primary font-medium">{app.patientName}</td>
                    <td className="p-2">{app.reason}</td>
                  </tr>
                ))}
                {todaysAppointments.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-text-secondary">No appointments for today.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Patients</h2>
          <ul>
            {patients.slice(0, 5).map(patient => (
              <li key={patient.id} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 cursor-pointer" onClick={() => onSelectPatient(patient.id)}>
                <div className="flex items-center">
                  <img src={patient.avatarUrl} alt={patient.name} className="w-10 h-10 rounded-full mr-3" />
                  <div>
                    <p className="font-semibold">{patient.name}</p>
                    <p className="text-sm text-text-secondary">{patient.email}</p>
                  </div>
                </div>
                <button className="text-brand-primary hover:text-brand-dark">View</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
