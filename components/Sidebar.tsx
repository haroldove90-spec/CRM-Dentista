import React from 'react';
import type { View } from '../App';
import { DashboardIcon, PatientsIcon, CalendarIcon, SettingsIcon, ToothIcon, LogoutIcon, CloseIcon } from './icons/Icon';

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
            <h1 className="text-2xl font-bold ml-2">CRM Dentista</h1>
        </div>
        <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-1 text-gray-300 hover:text-white">
            <CloseIcon />
        </button>
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
         <NavItem icon={<LogoutIcon />} label="Logout" isActive={false} onClick={() => { setIsSidebarOpen(false); /* Implement logout */ }} />
      </div>
    </aside>
  );
};