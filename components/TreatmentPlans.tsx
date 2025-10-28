import React, { useState, useEffect } from 'react';
// FIX: Add .ts extension to file import.
import type { TreatmentPlan, Patient } from '../types.ts';
// FIX: Add .tsx extension to file import.
import { useTranslation } from '../context/LanguageContext.tsx';
// FIX: Add .tsx extension to file import.
import { CreateTreatmentPlanModal } from './CreateTreatmentPlanModal.tsx';
import { CloseIcon } from './icons/Icon.tsx';


// --- Modal Component for Viewing/Editing a Treatment Plan ---
interface TreatmentPlanDetailModalProps {
  isOpen: boolean;
  plan: TreatmentPlan | null;
  onClose: () => void;
  onSave: (plan: TreatmentPlan) => void;
}

const statusOptions: TreatmentPlan['status'][] = ['Proposed', 'In Progress', 'Completed'];

const TreatmentPlanDetailModal: React.FC<TreatmentPlanDetailModalProps> = ({ isOpen, plan, onClose, onSave }) => {
  const { t } = useTranslation();
  const [currentStatus, setCurrentStatus] = useState<TreatmentPlan['status']>('Proposed');

  useEffect(() => {
    if (plan) {
      setCurrentStatus(plan.status);
    }
  }, [plan]);

  const getStatusTranslationKey = (status: TreatmentPlan['status']) => {
    switch (status) {
        case 'Proposed': return 'treatmentPlans.statusProposed';
        case 'In Progress': return 'treatmentPlans.statusInProgress';
        case 'Completed': return 'treatmentPlans.statusCompleted';
    }
  }

  const handleSave = () => {
    if (plan) {
      onSave({ ...plan, status: currentStatus });
    }
  };

  if (!isOpen || !plan) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">{t('modals.treatmentPlanDetailTitle')}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200"><CloseIcon /></button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-text-secondary">{t('treatmentPlans.patient')}</label>
            <p className="text-lg font-semibold">{plan.patientName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary">{t('treatmentPlans.plan')}</label>
            <p>{plan.planName}</p>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-text-secondary mb-1">{t('modals.statusLabel')}</label>
            <select
              id="status"
              value={currentStatus}
              onChange={(e) => setCurrentStatus(e.target.value as TreatmentPlan['status'])}
              className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-black"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {t(getStatusTranslationKey(status))}
                </option>
              ))}
            </select>
          </div>

          <div>
            <h3 className="font-semibold text-lg mt-4 mb-2">{t('modals.procedures')}</h3>
            <div className="bg-gray-50 p-3 rounded-lg max-h-48 overflow-y-auto">
              {plan.procedures.length > 0 ? (
                <ul className="space-y-2">
                  {plan.procedures.map((proc) => (
                    <li key={proc.id} className="flex justify-between items-center bg-white p-2 rounded-md shadow-sm">
                      <span>{proc.description}</span>
                      <span>${proc.cost.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-text-secondary text-center py-4">{t('modals.noProcedures')}</p>
              )}
            </div>
            <div className="text-right font-bold text-xl mt-3">
              {t('treatmentPlans.totalCost')}: ${plan.totalCost.toFixed(2)}
            </div>
          </div>
        </div>
        <div className="flex justify-end p-4 border-t mt-auto">
          <button type="button" onClick={onClose} className="px-4 py-2 mr-2 bg-gray-200 rounded-lg hover:bg-gray-300">{t('modals.cancel')}</button>
          <button type="button" onClick={handleSave} className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark">{t('modals.save')}</button>
        </div>
      </div>
    </div>
  );
};


// --- Main Component for Treatment Plans List ---
interface TreatmentPlansProps {
  plans: TreatmentPlan[];
  patients: Patient[];
  onAddPlan: (plan: Omit<TreatmentPlan, 'id'>) => void;
  onUpdatePlan: (plan: TreatmentPlan) => void;
}

const statusColorMap: { [key in TreatmentPlan['status']]: string } = {
    'Proposed': 'bg-yellow-100 text-yellow-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    'Completed': 'bg-green-100 text-green-800',
};

const getStatusTranslationKey = (status: TreatmentPlan['status']) => {
    switch (status) {
        case 'Proposed': return 'treatmentPlans.statusProposed';
        case 'In Progress': return 'treatmentPlans.statusInProgress';
        case 'Completed': return 'treatmentPlans.statusCompleted';
    }
}

export const TreatmentPlans: React.FC<TreatmentPlansProps> = ({ plans, patients, onAddPlan, onUpdatePlan }) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingPlan, setViewingPlan] = useState<TreatmentPlan | null>(null);

  const handleSavePlanUpdate = (updatedPlan: TreatmentPlan) => {
    onUpdatePlan(updatedPlan);
    setViewingPlan(null);
  };

  return (
    <>
      <CreateTreatmentPlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onAddPlan}
        patients={patients}
      />
      {viewingPlan && (
        <TreatmentPlanDetailModal
          isOpen={!!viewingPlan}
          plan={viewingPlan}
          onClose={() => setViewingPlan(null)}
          onSave={handleSavePlanUpdate}
        />
      )}
      <div className="p-4 md:p-8 bg-background min-h-full">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
          <h1 className="hidden md:block text-3xl font-bold text-text-primary">{t('treatmentPlans.title')}</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-brand-primary text-white px-4 py-2 rounded-lg shadow hover:bg-brand-dark transition-colors w-full md:w-auto"
          >
            {t('treatmentPlans.addNew')}
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 font-semibold">{t('treatmentPlans.patient')}</th>
                  <th className="p-4 font-semibold">{t('treatmentPlans.plan')}</th>
                  <th className="p-4 font-semibold">{t('treatmentPlans.status')}</th>
                  <th className="p-4 font-semibold text-right">{t('treatmentPlans.totalCost')}</th>
                  <th className="p-4 font-semibold">{t('patientList.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {plans.map(plan => (
                  <tr key={plan.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{plan.patientName}</td>
                    <td className="p-4">{plan.planName}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColorMap[plan.status]}`}>
                          {t(getStatusTranslationKey(plan.status))}
                      </span>
                    </td>
                    <td className="p-4 text-right">${plan.totalCost.toFixed(2)}</td>
                    <td className="p-4">
                      <button 
                        onClick={() => setViewingPlan(plan)}
                        className="bg-brand-light text-brand-dark px-3 py-1 rounded-md hover:bg-brand-secondary hover:text-white transition-colors">
                        {t('treatmentPlans.details')}
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
