import React from 'react';
import type { TreatmentPlan } from '../types';
import { useTranslation } from '../context/LanguageContext';

interface TreatmentPlansProps {
  plans: TreatmentPlan[];
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

export const TreatmentPlans: React.FC<TreatmentPlansProps> = ({ plans }) => {
  const { t } = useTranslation();

  return (
    <div className="p-4 md:p-8 bg-background min-h-full">
      <h1 className="text-3xl font-bold text-text-primary mb-6">{t('treatmentPlans.title')}</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-semibold">{t('treatmentPlans.patient')}</th>
                <th className="p-4 font-semibold">{t('treatmentPlans.plan')}</th>
                <th className="p-4 font-semibold">{t('treatmentPlans.status')}</th>
                <th className="p-4 font-semibold">{t('treatmentPlans.totalCost')}</th>
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
                  <td className="p-4">${plan.totalCost.toFixed(2)}</td>
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
  );
};