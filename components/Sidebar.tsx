
import React from 'react';
import type { View } from '../App';
import { DashboardIcon, PatientsIcon, CalendarIcon, SettingsIcon, ToothIcon, LogoutIcon } from './icons/Icon';

interface SidebarProps {
  activeView: View;
  setView: (view: View) => void;
  clearSelectedPatient: () => void;
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

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setView, clearSelectedPatient }) => {
  const handleSetView = (view: View) => {
    clearSelectedPatient();
    setView(view);
  };

  return (
    <aside className="w-64 bg-brand-dark text-white flex flex-col p-4">
      <div className="flex items-center mb-8 px-2">
        <ToothIcon className="w-10 h-10 text-brand-secondary" />
        <h1 className="text-2xl font-bold ml-2">CRM Dentista</h1>
      </div>
      <nav className="flex-1">
        <ul>
          <NavItem icon={<DashboardIcon />} label="Dashboard" isActive={activeView === 'dashboard'} onClick={() => handleSetView('dashboard')} />
          <NavItem icon={<PatientsIcon />} label="Patients" isActive={activeView === 'patients'} onClick={() => handleSetView('patients')} />
          <NavItem icon={<CalendarIcon />} label="Calendar" isActive={activeView === 'calendar'} onClick={() => handleSetView('calendar')} />
          <NavItem icon={<SettingsIcon />} label="Settings" isActive={activeView === 'settings'} onClick={() => handleSetView('settings')} />
        </ul>
      </nav>
      <div>
         <NavItem icon={<LogoutIcon />} label="Logout" isActive={false} onClick={() => { /* Implement logout */ }} />
      </div>
    </aside>
  );
};
