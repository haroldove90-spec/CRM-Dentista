
import React, { useState } from 'react';
import type { Patient } from '../types';
import { useTranslation } from '../context/LanguageContext';
import { AddPatientModal } from './AddPatientModal';

interface PatientListProps {
  patients: Patient[];
  onSelectPatient: (id: number) => void;
  onAddPatient: (patient: Omit<Patient, 'id' | 'appointments' | 'treatments' | 'odontogram' | 'files' | 'avatarUrl'>) => void;
}

export const PatientList: React.FC<PatientListProps> = ({ patients, onSelectPatient, onAddPatient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  return (
    <>
      <AddPatientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={onAddPatient} />
      <div className="p-4 md:p-8 bg-background min-h-full">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-text-primary">{t('patientList.title')}</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-brand-primary text-white px-4 py-2 rounded-lg shadow hover:bg-brand-dark transition-colors w-full md:w-auto"
          >
            {t('patientList.addNew')}
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder={t('patientList.searchPlaceholder')}
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
                  <th className="p-4 font-semibold">{t('patientList.name')}</th>
                  <th className="p-4 font-semibold hidden md:table-cell">{t('patientList.contact')}</th>
                  <th className="p-4 font-semibold hidden lg:table-cell">{t('patientList.dob')}</th>
                  <th className="p-4 font-semibold">{t('patientList.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map(patient => (
                  <tr key={patient.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center">
                        <img src={patient.avatarUrl} alt={patient.name} className="w-10 h-10 rounded-full mr-4" />
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-sm text-text-secondary md:hidden">{patient.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <div>
                        <p>{patient.phone}</p>
                        <p className="text-sm text-text-secondary">{patient.email}</p>
                      </div>
                    </td>
                    <td className="p-4 hidden lg:table-cell">{patient.dob}</td>
                    <td className="p-4">
                      <button
                        onClick={() => onSelectPatient(patient.id)}
                        className="bg-brand-light text-brand-dark px-3 py-1 rounded-md hover:bg-brand-secondary hover:text-white transition-colors"
                      >
                        {t('dashboard.view')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
