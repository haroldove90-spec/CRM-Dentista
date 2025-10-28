
import React, { useState } from 'react';
import { useTranslation } from '../context/LanguageContext';

export const Settings: React.FC = () => {
  const { t } = useTranslation();
  const [clinicInfo, setClinicInfo] = useState({
    name: 'Dra. Magda Zavala Dental Clinic',
    address: 'Calle Falsa 123, Madrid, Spain',
    phone: '+34 912 345 678',
    email: 'contacto@dramagdazavala.com'
  });
  const [userInfo, setUserInfo] = useState({
    name: 'Dra. Magda Zavala',
    specialization: 'General & Cosmetic Dentistry'
  });
  const [currency, setCurrency] = useState('EUR');

  const handleClinicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setClinicInfo({...clinicInfo, [e.target.name]: e.target.value });
  }

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setUserInfo({...userInfo, [e.target.name]: e.target.value });
  }
  
  const handleSave = () => {
      // In a real app, this would make an API call
      alert(t('settings.saveSuccess'));
  }

  return (
    <div className="p-4 md:p-8 bg-background min-h-full">
      <h1 className="text-3xl font-bold text-text-primary mb-6">{t('settings.title')}</h1>
      
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Clinic Information Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">{t('settings.clinicInfo')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="clinicName" className="block text-sm font-medium text-text-secondary mb-1">{t('settings.clinicName')}</label>
              <input type="text" id="clinicName" name="name" value={clinicInfo.name} onChange={handleClinicChange} className="w-full p-2 border border-gray-300 rounded-lg"/>
            </div>
            <div>
              <label htmlFor="clinicPhone" className="block text-sm font-medium text-text-secondary mb-1">{t('settings.phone')}</label>
              <input type="tel" id="clinicPhone" name="phone" value={clinicInfo.phone} onChange={handleClinicChange} className="w-full p-2 border border-gray-300 rounded-lg"/>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="clinicAddress" className="block text-sm font-medium text-text-secondary mb-1">{t('settings.address')}</label>
              <input type="text" id="clinicAddress" name="address" value={clinicInfo.address} onChange={handleClinicChange} className="w-full p-2 border border-gray-300 rounded-lg"/>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="clinicEmail" className="block text-sm font-medium text-text-secondary mb-1">{t('settings.email')}</label>
              <input type="email" id="clinicEmail" name="email" value={clinicInfo.email} onChange={handleClinicChange} className="w-full p-2 border border-gray-300 rounded-lg"/>
            </div>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">{t('settings.userProfile')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-text-secondary mb-1">{t('settings.name')}</label>
              <input type="text" id="userName" name="name" value={userInfo.name} onChange={handleUserChange} className="w-full p-2 border border-gray-300 rounded-lg"/>
            </div>
            <div>
              <label htmlFor="specialization" className="block text-sm font-medium text-text-secondary mb-1">{t('settings.specialization')}</label>
              <input type="text" id="specialization" name="specialization" value={userInfo.specialization} onChange={handleUserChange} className="w-full p-2 border border-gray-300 rounded-lg"/>
            </div>
          </div>
        </div>

        {/* Billing & Currency Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">{t('settings.billingCurrency')}</h2>
          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-text-secondary mb-1">{t('settings.currency')}</label>
            <select id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full md:w-1/2 p-2 border border-gray-300 rounded-lg">
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="MXN">MXN ($)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
            <button onClick={handleSave} className="bg-brand-primary text-white px-6 py-2 rounded-lg shadow hover:bg-brand-dark transition-colors">
                {t('settings.save')}
            </button>
        </div>
      </div>
    </div>
  );
};
