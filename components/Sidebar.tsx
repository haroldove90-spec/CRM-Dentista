import React from 'react';
// FIX: Add .tsx extension to file import.
import type { View } from '../App.tsx';
// FIX: Add .tsx extension to file import.
import { DashboardIcon, PatientsIcon, CalendarIcon, SettingsIcon, ToothIcon, LogoutIcon, CloseIcon, TreatmentPlanIcon } from './icons/Icon.tsx';
// FIX: Add .tsx extension to file import.
import { useLanguage, useTranslation } from '../context/LanguageContext.tsx';

interface SidebarProps {
  activeView: View;
  setView: (view: View) => void;
  clearSelectedPatient: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <li>
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`flex items-center p-3 my-1 rounded-lg transition-colors ${
        isActive
          ? 'bg-brand-primary text-white shadow-md'
          : 'text-gray-300 hover:bg-brand-dark hover:text-white'
      }`}
    >
      {icon}
      <span className="ml-4 font-medium">{label}</span>
    </a>
  </li>
);

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setView, clearSelectedPatient, isSidebarOpen, setIsSidebarOpen }) => {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();

  const handleSetView = (view: View) => {
    clearSelectedPatient();
    setView(view);
    setIsSidebarOpen(false); // Close sidebar on mobile after navigation
  };

  return (
    <aside className={`fixed z-30 inset-y-0 left-0 w-64 bg-brand-dark text-white flex flex-col p-4 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex-shrink-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center">
            <ToothIcon className="w-10 h-10 text-brand-secondary" />
            <h1 className="text-2xl font-bold ml-2">{t('sidebar.title')}</h1>
        </div>
        <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-1 text-gray-300 hover:text-white">
            <CloseIcon />
        </button>
      </div>
      <nav className="flex-1">
        <ul>
          <NavItem icon={<DashboardIcon />} label={t('sidebar.dashboard')} isActive={activeView === 'dashboard'} onClick={() => handleSetView('dashboard')} />
          <NavItem icon={<PatientsIcon />} label={t('sidebar.patients')} isActive={activeView === 'patients'} onClick={() => handleSetView('patients')} />
          <NavItem icon={<CalendarIcon />} label={t('sidebar.agenda')} isActive={activeView === 'agenda'} onClick={() => handleSetView('agenda')} />
          <NavItem icon={<TreatmentPlanIcon />} label={t('sidebar.treatmentPlans')} isActive={activeView === 'treatment_plans'} onClick={() => handleSetView('treatment_plans')} />
          <NavItem icon={<SettingsIcon />} label={t('sidebar.settings')} isActive={activeView === 'settings'} onClick={() => handleSetView('settings')} />
        </ul>
      </nav>
      
      <div className="mb-4">
        <div className="flex justify-center items-center p-1 bg-gray-900/20 rounded-lg">
            <button
                onClick={() => setLanguage('es')}
                className={`w-full px-3 py-1 text-sm font-bold rounded-md transition-colors ${language === 'es' ? 'bg-brand-primary text-white' : 'text-gray-300 hover:text-white'}`}
            >
                ES
            </button>
            <button
                onClick={() => setLanguage('en')}
                className={`w-full px-3 py-1 text-sm font-bold rounded-md transition-colors ${language === 'en' ? 'bg-brand-primary text-white' : 'text-gray-300 hover:text-white'}`}
            >
                EN
            </button>
        </div>
        <p className="text-xs text-center text-gray-400 mt-4 px-2">Desarrollada por Harold Anguiano para App Design.</p>
      </div>

      <div>
         <NavItem icon={<LogoutIcon />} label={t('sidebar.logout')} isActive={false} onClick={() => { setIsSidebarOpen(false); /* Implement logout */ }} />
      </div>
    </aside>
  );
};
