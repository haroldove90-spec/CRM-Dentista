import React, { useState } from 'react';
import type { Patient } from '../types';
import { useTranslation } from '../context/LanguageContext';
import { CloseIcon } from './icons/Icon';

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (patient: Omit<Patient, 'id' | 'appointments' | 'treatments' | 'odontogram' | 'files' | 'avatarUrl'>) => void;
}

export const AddPatientModal: React.FC<AddPatientModalProps> = ({ isOpen, onClose, onSave }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: 'Other' as 'Male' | 'Female' | 'Other',
    phone: '',
    email: '',
    address: '',
    medicalHistory: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
        alert(t('modals.fillAllFields'));
        return;
    }
    onSave(formData);
    onClose();
    // Reset form
    setFormData({
        name: '', dob: '', gender: 'Other', phone: '', email: '', address: '', medicalHistory: '', notes: '',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">{t('modals.addPatientTitle')}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200"><CloseIcon /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">{t('patientList.name')}</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-black" />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">{t('modals.email')}</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-black" />
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-text-secondary mb-1">{t('modals.phone')}</label>
                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-black" />
                </div>
                <div>
                    <label htmlFor="dob" className="block text-sm font-medium text-text-secondary mb-1">{t('patientList.dob')}</label>
                    <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-black" />
                </div>
                 <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-text-secondary mb-1">{t('patientDetail.gender')}</label>
                    <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-black">
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-text-secondary mb-1">{t('patientDetail.address')}</label>
                    <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-black" />
                </div>
            </div>
            <div>
                <label htmlFor="medicalHistory" className="block text-sm font-medium text-text-secondary mb-1">{t('patientDetail.history')}</label>
                <textarea id="medicalHistory" name="medicalHistory" value={formData.medicalHistory} onChange={handleChange} rows={3} className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-black"></textarea>
            </div>
            <div>
                <label htmlFor="notes" className="block text-sm font-medium text-text-secondary mb-1">{t('patientDetail.notes')}</label>
                <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={3} className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-black"></textarea>
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
