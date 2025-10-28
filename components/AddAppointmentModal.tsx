import React, { useState } from 'react';
// FIX: Add .ts extension to file import.
import type { Patient, Appointment } from '../types.ts';
// FIX: Add .tsx extension to file import.
import { useTranslation } from '../context/LanguageContext.tsx';
// FIX: Add .tsx extension to file import.
import { CloseIcon } from './icons/Icon.tsx';

interface AddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointment: Omit<Appointment, 'id' | 'patientName' | 'status'>) => void;
  patients: Patient[];
  selectedDate: string;
}

export const AddAppointmentModal: React.FC<AddAppointmentModalProps> = ({ isOpen, onClose, onSave, patients, selectedDate }) => {
  const { t } = useTranslation();
  const [patientId, setPatientId] = useState<string>('');
  const [time, setTime] = useState<string>('09:00');
  const [duration, setDuration] = useState<number>(30);
  const [reason, setReason] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !reason) {
        alert(t('modals.fillAllFields'));
        return;
    }
    onSave({
      patientId: parseInt(patientId, 10),
      date: selectedDate,
      time,
      duration,
      reason,
    });
    onClose();
    // Reset form
    setPatientId('');
    setTime('09:00');
    setDuration(30);
    setReason('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">{t('modals.addAppointmentTitle')}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200"><CloseIcon /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">{t('modals.date')}</label>
            <input type="date" value={selectedDate} disabled className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100" />
          </div>
          <div>
            <label htmlFor="patient" className="block text-sm font-medium text-text-secondary mb-1">{t('dashboard.patient')}</label>
            <select id="patient" value={patientId} onChange={(e) => setPatientId(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-black">
              <option value="">{t('modals.selectPatient')}</option>
              {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
           <div>
            <label htmlFor="time" className="block text-sm font-medium text-text-secondary mb-1">{t('dashboard.time')}</label>
            <input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-black" />
          </div>
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-text-secondary mb-1">{t('modals.duration')}</label>
            <input id="duration" type="number" value={duration} onChange={(e) => setDuration(parseInt(e.target.value, 10))} required min="15" step="15" className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-black" />
          </div>
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-text-secondary mb-1">{t('dashboard.reason')}</label>
            <textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} required rows={3} className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-black"></textarea>
          </div>
        </form>
         <div className="flex justify-end p-4 border-t mt-auto">
          <button type="button" onClick={onClose} className="px-4 py-2 mr-2 bg-gray-200 rounded-lg hover:bg-gray-300">{t('modals.cancel')}</button>
          <button type="submit" onClick={handleSubmit} className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark">{t('modals.save')}</button>
        </div>
      </div>
    </div>
  );
};
