import React, { useState } from 'react';
import type { Patient, TreatmentPlan, TreatmentPlanProcedure } from '../types';
import { useTranslation } from '../context/LanguageContext';
import { CloseIcon } from './icons/Icon';
import { commonProcedures, Procedure } from '../data/procedures';
import { generateTreatmentPlan } from '../services/geminiService';

interface CreateTreatmentPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: Omit<TreatmentPlan, 'id'>) => void;
  patients: Patient[];
}

export const CreateTreatmentPlanModal: React.FC<CreateTreatmentPlanModalProps> = ({ isOpen, onClose, onSave, patients }) => {
  const { t } = useTranslation();
  const [patientId, setPatientId] = useState<string>('');
  const [planName, setPlanName] = useState<string>('');
  const [procedures, setProcedures] = useState<Omit<TreatmentPlanProcedure, 'id' | 'status'>[]>([]);
  const [selectedProcedure, setSelectedProcedure] = useState<string>('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAddProcedure = () => {
    const procedureToAdd = commonProcedures.find(p => p.name === selectedProcedure);
    if (procedureToAdd && !procedures.find(p => p.description === procedureToAdd.name)) {
      setProcedures([...procedures, { description: procedureToAdd.name, cost: procedureToAdd.defaultCost }]);
    }
  };
  
  const handleRemoveProcedure = (description: string) => {
    setProcedures(procedures.filter(p => p.description !== description));
  };

  const handleGenerateWithAI = async () => {
    if (!aiPrompt) return;
    setIsGenerating(true);
    try {
        const generatedProcedures = await generateTreatmentPlan(aiPrompt);
        setProcedures(generatedProcedures);
    } catch (error) {
        alert(error instanceof Error ? error.message : "An unknown error occurred.");
    } finally {
        setIsGenerating(false);
    }
  };

  const calculateTotal = () => procedures.reduce((acc, curr) => acc + curr.cost, 0);

  const handleSubmit = () => {
    if (!patientId || !planName || procedures.length === 0) {
        alert(t('modals.fillAllFields'));
        return;
    }
    const finalProcedures = procedures.map((p, index) => ({ ...p, id: Date.now() + index, status: 'pending' as const }));
    onSave({
      patientId: parseInt(patientId),
      patientName: patients.find(p => p.id === parseInt(patientId))?.name || '',
      planName,
      status: 'Proposed',
      totalCost: calculateTotal(),
      procedures: finalProcedures,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">{t('modals.createPlanTitle')}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200"><CloseIcon /></button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Patient and Plan Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="patient" className="block text-sm font-medium text-text-secondary mb-1">{t('dashboard.patient')}</label>
              <select id="patient" value={patientId} onChange={(e) => setPatientId(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-black">
                <option value="">{t('modals.selectPatient')}</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="planName" className="block text-sm font-medium text-text-secondary mb-1">{t('treatmentPlans.plan')}</label>
              <input type="text" id="planName" value={planName} onChange={(e) => setPlanName(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-black" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {/* Manual Creation */}
            <div className="space-y-3">
                <h3 className="font-semibold text-lg border-b pb-2">{t('modals.manualCreation')}</h3>
                <div className="flex gap-2">
                    <select value={selectedProcedure} onChange={(e) => setSelectedProcedure(e.target.value)} className="flex-grow p-2 border border-gray-300 rounded-lg bg-gray-100 text-black">
                        <option value="">{t('modals.selectProcedure')}</option>
                        {commonProcedures.map(p => <option key={p.name} value={p.name}>{p.name} - ${p.defaultCost}</option>)}
                    </select>
                    <button onClick={handleAddProcedure} className="px-4 py-2 bg-brand-light text-brand-dark rounded-lg hover:bg-brand-secondary hover:text-white font-semibold">+</button>
                </div>
            </div>
            {/* AI Creation */}
            <div className="space-y-3">
                <h3 className="font-semibold text-lg border-b pb-2">{t('modals.aiCreation')}</h3>
                <textarea placeholder={t('modals.aiPlaceholder')} value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} rows={2} className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-black"></textarea>
                <button onClick={handleGenerateWithAI} disabled={isGenerating} className="w-full px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark disabled:bg-gray-400">
                    {isGenerating ? t('patientDetail.generating') : t('modals.generateWithAI')}
                </button>
            </div>
          </div>
          
          {/* Procedures List */}
          <div>
            <h3 className="font-semibold text-lg mt-4 mb-2">{t('modals.proceduresList')}</h3>
            <div className="bg-gray-50 p-3 rounded-lg max-h-48 overflow-y-auto">
                {procedures.length === 0 ? (
                    <p className="text-text-secondary text-center py-4">{t('modals.noProcedures')}</p>
                ) : (
                    <ul className="space-y-2">
                        {procedures.map((proc, index) => (
                            <li key={index} className="flex justify-between items-center bg-white p-2 rounded-md shadow-sm">
                                <span>{proc.description}</span>
                                <div className="flex items-center gap-4">
                                    <span>${proc.cost.toFixed(2)}</span>
                                    <button onClick={() => handleRemoveProcedure(proc.description)} className="text-red-500 hover:text-red-700">&times;</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="text-right font-bold text-xl mt-3">
                {t('treatmentPlans.totalCost')}: ${calculateTotal().toFixed(2)}
            </div>
          </div>

        </div>
        <div className="flex justify-end p-4 border-t mt-auto">
          <button type="button" onClick={onClose} className="px-4 py-2 mr-2 bg-gray-200 rounded-lg hover:bg-gray-300">{t('modals.cancel')}</button>
          <button type="button" onClick={handleSubmit} className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark">{t('modals.savePlan')}</button>
        </div>
      </div>
    </div>
  );
};
