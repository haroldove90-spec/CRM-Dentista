import React, { useState, useCallback } from 'react';
import type { Patient, OdontogramData } from '../types';
import { Odontogram } from './Odontogram';
import { generatePatientSummary } from '../services/geminiService';
import { BackArrowIcon } from './icons/Icon';
import { useTranslation } from '../context/LanguageContext';

interface PatientDetailProps {
  patient: Patient;
  onBack: () => void;
  onUpdatePatient: (patient: Patient) => void;
}

type Tab = 'info' | 'appointments' | 'odontogram' | 'billing' | 'ai_summary';

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
            active
                ? 'bg-brand-primary text-white shadow'
                : 'text-text-secondary hover:bg-gray-200'
        }`}
    >
        {children}
    </button>
);

const PatientHeader: React.FC<{ patient: Patient; onBack: () => void }> = ({ patient, onBack }) => (
    <div className="bg-white p-4 md:p-6 rounded-t-lg shadow-md flex flex-col sm:flex-row items-center">
        <div className="flex items-center w-full">
            <button onClick={onBack} className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors">
                <BackArrowIcon className="w-6 h-6 text-text-secondary"/>
            </button>
            <img src={patient.avatarUrl} alt={patient.name} className="w-16 h-16 md:w-20 md:h-20 rounded-full mr-4 border-4 border-brand-light"/>
            <div className="overflow-hidden">
                <h1 className="text-xl md:text-3xl font-bold truncate">{patient.name}</h1>
                <p className="text-text-secondary text-sm truncate">{patient.email}</p>
                <p className="text-text-secondary text-sm sm:hidden">{patient.phone}</p>
            </div>
        </div>
        <p className="text-text-secondary text-sm hidden sm:block mt-2 sm:mt-0 sm:ml-auto whitespace-nowrap">{patient.phone}</p>
    </div>
);

const PatientInfo: React.FC<{ patient: Patient }> = ({ patient }) => {
    const { t } = useTranslation();
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h3 className="font-semibold text-lg mb-2">{t('patientDetail.personalDetails')}</h3>
                <div className="space-y-2 text-text-secondary">
                    <p><strong>{t('patientDetail.dob')}</strong> {patient.dob}</p>
                    <p><strong>{t('patientDetail.gender')}</strong> {patient.gender}</p>
                    <p><strong>{t('patientDetail.address')}</strong> {patient.address}</p>
                </div>
            </div>
            <div>
                <h3 className="font-semibold text-lg mb-2">{t('patientDetail.medicalNotes')}</h3>
                <p className="text-text-secondary bg-yellow-50 p-3 rounded-md"><strong>{t('patientDetail.history')}</strong> {patient.medicalHistory}</p>
                <p className="text-text-secondary bg-blue-50 p-3 rounded-md mt-2"><strong>{t('patientDetail.notes')}</strong> {patient.notes}</p>
            </div>
        </div>
    );
};

const PatientBilling: React.FC<{ patient: Patient }> = ({ patient }) => {
    const { t } = useTranslation();
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
                <thead className="bg-gray-50 border-b">
                    <tr>
                        <th className="p-3">{t('patientDetail.billingDate')}</th>
                        <th className="p-3">{t('patientDetail.billingDescription')}</th>
                        <th className="p-3">{t('patientDetail.billingCost')}</th>
                        <th className="p-3">{t('patientDetail.billingStatus')}</th>
                    </tr>
                </thead>
                <tbody>
                    {patient.treatments.map(t => (
                        <tr key={t.id} className="border-b hover:bg-gray-50">
                            <td className="p-3">{t.date}</td>
                            <td className="p-3">{t.description}</td>
                            <td className="p-3">${t.cost.toFixed(2)}</td>
                            <td className="p-3">
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${t.paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {t.paid ? t('patientDetail.paid') : t('patientDetail.pending')}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const PatientAppointments: React.FC<{ patient: Patient }> = ({ patient }) => (
    <ul className="space-y-3">
        {patient.appointments.map(a => (
            <li key={a.id} className="p-4 border rounded-lg flex justify-between items-center">
                <div>
                    <p className="font-semibold">{a.reason}</p>
                    <p className="text-sm text-text-secondary">{a.date} at {a.time}</p>
                </div>
                <span className={`capitalize px-2 py-1 text-xs font-semibold rounded-full ${
                    a.status === 'completed' ? 'bg-green-100 text-green-800' : 
                    a.status === 'confirmed' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                }`}>
                    {a.status}
                </span>
            </li>
        ))}
    </ul>
);

const PatientAISummary: React.FC<{ patient: Patient }> = ({ patient }) => {
    const { t } = useTranslation();
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateSummary = useCallback(async () => {
        setIsLoading(true);
        const result = await generatePatientSummary(patient.notes);
        setSummary(result);
        setIsLoading(false);
    }, [patient.notes]);

    return (
        <div>
            <button
                onClick={handleGenerateSummary}
                disabled={isLoading}
                className="bg-brand-primary text-white px-4 py-2 rounded-lg shadow hover:bg-brand-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed mb-4"
            >
                {isLoading ? t('patientDetail.generating') : t('patientDetail.generateSummary')}
            </button>
            {isLoading && <div className="text-center p-4">{t('patientDetail.loadingSummary')}</div>}
            {summary && (
                <div className="p-4 bg-brand-light rounded-lg prose max-w-none">
                    <h3 className="text-lg font-semibold mb-2">{t('patientDetail.aiSummaryTitle')}</h3>
                    {summary.split('\n').map((line, index) => {
                       if (line.startsWith('* ')) {
                           return <p key={index} className="ml-4">{line}</p>;
                       }
                       return <p key={index}>{line}</p>;
                    })}
                </div>
            )}
        </div>
    );
};


export const PatientDetail: React.FC<PatientDetailProps> = ({ patient, onBack, onUpdatePatient }) => {
  const [activeTab, setActiveTab] = useState<Tab>('info');
  const { t } = useTranslation();
  
  const handleOdontogramUpdate = (newOdontogram: OdontogramData) => {
    onUpdatePatient({ ...patient, odontogram: newOdontogram });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return <PatientInfo patient={patient} />;
      case 'appointments':
        return <PatientAppointments patient={patient} />;
      case 'odontogram':
        return <Odontogram data={patient.odontogram} onUpdate={handleOdontogramUpdate} />;
      case 'billing':
        return <PatientBilling patient={patient} />;
      case 'ai_summary':
        return <PatientAISummary patient={patient} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 md:p-8 bg-background min-h-full">
      <PatientHeader patient={patient} onBack={onBack} />
      
      <div className="bg-white p-4 md:p-6 rounded-b-lg shadow-md">
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-2 pb-2 -mb-px overflow-x-auto" aria-label="Tabs">
            <TabButton active={activeTab === 'info'} onClick={() => setActiveTab('info')}>{t('patientDetail.tabInfo')}</TabButton>
            <TabButton active={activeTab === 'appointments'} onClick={() => setActiveTab('appointments')}>{t('patientDetail.tabAppointments')}</TabButton>
            <TabButton active={activeTab === 'odontogram'} onClick={() => setActiveTab('odontogram')}>{t('patientDetail.tabOdontogram')}</TabButton>
            <TabButton active={activeTab === 'billing'} onClick={() => setActiveTab('billing')}>{t('patientDetail.tabBilling')}</TabButton>
            <TabButton active={activeTab === 'ai_summary'} onClick={() => setActiveTab('ai_summary')}>{t('patientDetail.tabAiSummary')}</TabButton>
          </nav>
        </div>

        <div>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};