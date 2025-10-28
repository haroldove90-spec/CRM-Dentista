import React from 'react';
import type { Patient, Appointment } from '../types.ts';
import { useTranslation } from '../context/LanguageContext.tsx';
import { PatientsIcon, CalendarIcon, TreatmentPlanIcon } from './icons/Icon.tsx';
import { Charts } from './Charts.tsx';

interface DashboardProps {
    patients: Patient[];
    appointments: Appointment[];
    onSelectPatient: (id: number) => void;
}

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string | number; color: string }> = ({ icon, title, value, color }) => (
    <div className={`p-6 rounded-lg shadow-md flex items-center text-white ${color}`}>
        <div className="p-3 rounded-full bg-white bg-opacity-30">
            {icon}
        </div>
        <div className="ml-4">
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm opacity-90">{title}</p>
        </div>
    </div>
);


export const Dashboard: React.FC<DashboardProps> = ({ patients, appointments }) => {
    const { t } = useTranslation();
    const todaysDate = new Date().toISOString().split('T')[0];
    const upcomingAppointments = appointments
        .filter(a => a.date === todaysDate && a.status === 'confirmed')
        .sort((a, b) => a.time.localeCompare(b.time));

    return (
        <div className="p-4 md:p-8 bg-background">
            <h1 className="hidden md:block text-3xl font-bold text-text-primary mb-6">{t('dashboard.title')}</h1>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard icon={<PatientsIcon className="w-8 h-8"/>} title={t('dashboard.totalPatients')} value={patients.length} color="bg-gradient-to-r from-blue-500 to-blue-400" />
                <StatCard icon={<CalendarIcon className="w-8 h-8"/>} title={t('dashboard.upcomingAppointments')} value={upcomingAppointments.length} color="bg-gradient-to-r from-green-500 to-green-400" />
                <StatCard icon={<TreatmentPlanIcon className="w-8 h-8"/>} title={t('dashboard.activePlans')} value={patients.reduce((acc, p) => acc + p.treatments.length, 0)} color="bg-gradient-to-r from-purple-500 to-purple-400" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upcoming Appointments */}
                <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-text-primary">{t('dashboard.agenda')}</h2>
                    <div className="max-h-96 overflow-y-auto">
                        {upcomingAppointments.length > 0 ? (
                            <ul className="space-y-4">
                                {upcomingAppointments.map(app => (
                                    <li key={app.id} className="flex items-center space-x-4 p-2 rounded-md hover:bg-gray-50">
                                        <div className="flex-shrink-0 bg-brand-light text-brand-dark p-2 rounded-md text-center w-16">
                                            <p className="font-bold text-lg">{app.time}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-text-primary">{app.patientName}</p>
                                            <p className="text-sm text-text-secondary">{app.reason}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-text-secondary text-center py-4">{t('dashboard.noAppointments')}</p>
                        )}
                    </div>
                </div>

                {/* Patient Activity / Charts */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-text-primary">{t('dashboard.patientActivity')}</h2>
                    <Charts />
                </div>
            </div>
        </div>
    );
}