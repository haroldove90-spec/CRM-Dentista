
import React, { useState } from 'react';
import type { Patient } from '../types';

interface PatientListProps {
  patients: Patient[];
  onSelectPatient: (id: number) => void;
}

export const PatientList: React.FC<PatientListProps> = ({ patients, onSelectPatient }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  return (
    <div className="p-8 bg-background min-h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-text-primary">Patients</h1>
        <button className="bg-brand-primary text-white px-4 py-2 rounded-lg shadow hover:bg-brand-dark transition-colors">
          Add New Patient
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Contact</th>
                <th className="p-4 font-semibold">Date of Birth</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map(patient => (
                <tr key={patient.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center">
                      <img src={patient.avatarUrl} alt={patient.name} className="w-10 h-10 rounded-full mr-4" />
                      <span className="font-medium">{patient.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p>{patient.phone}</p>
                      <p className="text-sm text-text-secondary">{patient.email}</p>
                    </div>
                  </td>
                  <td className="p-4">{patient.dob}</td>
                  <td className="p-4">
                    <button
                      onClick={() => onSelectPatient(patient.id)}
                      className="bg-brand-light text-brand-dark px-3 py-1 rounded-md hover:bg-brand-secondary hover:text-white transition-colors"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
