import React, { useState } from 'react';
// FIX: Add .ts extension to file import.
import type { TreatmentPlan, Patient } from '../types.ts';
// FIX: Add .tsx extension to file import.
import { useTranslation } from '../context/LanguageContext.tsx';
// FIX: Add .tsx extension to file import.
import { CreateTreatmentPlanModal } from './CreateTreatmentPlanModal.tsx';

interface TreatmentPlansProps {
  plans: TreatmentPlan[];
  patients: Patient[];
  onAddPlan: (plan: Omit<TreatmentPlan, 'id'>) => void;
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

export const TreatmentPlans: React.FC<TreatmentPlansProps> = ({ plans, patients, onAddPlan }) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <CreateTreatmentPlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onAddPlan}
        patients={patients}
      />
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
                      <button className="bg-brand-light text-brand-dark px-3 py-1 rounded-md hover:bg-brand-secondary hover:text-white transition-colors">
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