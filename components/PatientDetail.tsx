import React, { useState, useEffect } from 'react';
import type { Patient, Treatment, OdontogramData, ClinicalFile } from '../types.ts';
import { useTranslation } from '../context/LanguageContext.tsx';
import { BackArrowIcon, CameraIcon } from './icons/Icon.tsx';
import { Odontogram } from './Odontogram.tsx';
import { PatientFiles } from './PatientFiles.tsx';
import { generatePatientSummary } from '../services/geminiService.ts';
import ReactMarkdown from 'react-markdown';


interface PatientDetailProps {
  patient: Patient;
  onBack: () => void;
  onUpdatePatient: (patient: Patient) => void;
}

const InfoField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div>
        <p className="text-sm font-medium text-text-secondary">{label}</p>
        <p className="text-text-primary">{value || '-'}</p>
    </div>
);

const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 font-semibold transition-colors ${isActive ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-text-secondary hover:text-text-primary'}`}
    >
        {label}
    </button>
);

export const PatientDetail: React.FC<PatientDetailProps> = ({ patient, onBack, onUpdatePatient }) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'overview' | 'odontogram' | 'treatments' | 'files'>('overview');
    const [aiSummary, setAiSummary] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        setAiSummary(''); // Reset summary when patient changes
        setActiveTab('overview');
    }, [patient.id]);

    const handleGenerateSummary = async () => {
        setIsGenerating(true);
        try {
            const summary = await generatePatientSummary(patient.notes);
            setAiSummary(summary);
        } catch (error) {
            setAiSummary("Failed to generate summary.");
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleOdontogramUpdate = (newData: OdontogramData) => {
        onUpdatePatient({ ...patient, odontogram: newData });
    };

    const handleFileUpload = (file: Omit<ClinicalFile, 'id'>) => {
        const newFile: ClinicalFile = { ...file, id: Date.now() };
        onUpdatePatient({ ...patient, files: [...patient.files, newFile] });
    };

    return (
        <div className="p-4 md:p-8 bg-background min-h-full">
            {/* Header */}
            <div className="hidden md:flex items-center mb-6">
                <button onClick={onBack} className="p-2 mr-4 rounded-full hover:bg-gray-200">
                    <BackArrowIcon />
                </button>
                <h1 className="text-3xl font-bold text-text-primary">{t('patientDetail.title')}</h1>
            </div>

            {/* Patient Card */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8 flex flex-col md:flex-row items-start gap-6">
                <div className="relative">
                    <img src={patient.avatarUrl} alt={patient.name} className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg" />
                    <button className="absolute bottom-1 right-1 bg-brand-primary p-2 rounded-full text-white hover:bg-brand-dark transition-colors">
                        <CameraIcon className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
                    <div className="col-span-full md:col-span-1">
                        <p className="text-sm font-medium text-text-secondary">{t('patientList.name')}</p>
                        <p className="text-xl font-bold text-text-primary">{patient.name}</p>
                    </div>
                    <InfoField label={t('patientList.dob')} value={patient.dob} />
                    <InfoField label={t('patientDetail.gender')} value={patient.gender} />
                    <InfoField label={t('patientList.contact')} value={patient.phone} />
                    <InfoField label={t('patientDetail.email')} value={patient.email} />
                    <div className="col-span-full">
                        <InfoField label={t('patientDetail.address')} value={patient.address} />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md">
                 <div className="border-b">
                    <nav className="flex space-x-4 px-6">
                        <TabButton label={t('patientDetail.overview')} isActive={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                        <TabButton label={t('patientDetail.odontogram')} isActive={activeTab === 'odontogram'} onClick={() => setActiveTab('odontogram')} />
                        <TabButton label={t('patientDetail.treatments')} isActive={activeTab === 'treatments'} onClick={() => setActiveTab('treatments')} />
                        <TabButton label={t('patientDetail.files')} isActive={activeTab === 'files'} onClick={() => setActiveTab('files')} />
                    </nav>
                 </div>
                 <div className="p-6">
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div>
                                <h3 className="font-semibold text-lg mb-2">{t('patientDetail.medicalHistory')}</h3>
                                <p className="text-text-secondary bg-gray-50 p-3 rounded-md whitespace-pre-wrap">{patient.medicalHistory || 'No history provided.'}</p>
                            </div>
                             <div>
                                <h3 className="font-semibold text-lg mb-2">{t('patientDetail.notes')}</h3>
                                <p className="text-text-secondary bg-gray-50 p-3 rounded-md whitespace-pre-wrap">{patient.notes || 'No notes available.'}</p>
                            </div>
                            <div className="lg:col-span-2">
                                <h3 className="font-semibold text-lg mb-2">{t('patientDetail.aiSummary')}</h3>
                                <div className="bg-gradient-to-r from-brand-light to-blue-50 p-4 rounded-lg">
                                    {aiSummary ? (
                                        <div className="prose prose-sm max-w-none text-text-primary"><ReactMarkdown>{aiSummary}</ReactMarkdown></div>
                                    ) : (
                                        <div className="text-center">
                                            <p className="mb-4 text-text-secondary">{t('patientDetail.generateSummaryPrompt')}</p>
                                            <button onClick={handleGenerateSummary} disabled={isGenerating || !patient.notes} className="bg-brand-primary text-white px-4 py-2 rounded-lg shadow hover:bg-brand-dark disabled:bg-gray-400 disabled:cursor-not-allowed">
                                                 {isGenerating ? t('patientDetail.generating') : t('patientDetail.generateSummary')}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'odontogram' && (
                        <Odontogram data={patient.odontogram} onUpdate={handleOdontogramUpdate} />
                    )}
                    {activeTab === 'treatments' && (
                        <div>
                             <h3 className="font-semibold text-lg mb-4">{t('patientDetail.treatmentHistory')}</h3>
                             <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="p-3 font-semibold">{t('modals.date')}</th>
                                            <th className="p-3 font-semibold">{t('patientDetail.description')}</th>
                                            <th className="p-3 font-semibold text-right">{t('patientDetail.cost')}</th>
                                            <th className="p-3 font-semibold text-center">{t('patientDetail.paid')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {patient.treatments.length > 0 ? patient.treatments.map((treatment: Treatment) => (
                                            <tr key={treatment.id} className="border-b hover:bg-gray-50">
                                                <td className="p-3">{treatment.date}</td>
                                                <td className="p-3">{treatment.description}</td>
                                                <td className="p-3 text-right">${treatment.cost.toFixed(2)}</td>
                                                <td className="p-3 text-center">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${treatment.paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {treatment.paid ? t('patientDetail.yes') : t('patientDetail.no')}
                                                    </span>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={4} className="text-center p-4 text-text-secondary">No treatment history found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                             </div>
                        </div>
                    )}
                    {activeTab === 'files' && <PatientFiles patient={patient} onFileUpload={handleFileUpload} />}
                 </div>
            </div>
        </div>
    );
};