
import React, { useState } from 'react';
import type { Appointment, Patient } from '../types';
import { useLanguage, useTranslation } from '../context/LanguageContext';
import { AddAppointmentModal } from './AddAppointmentModal';
import { ChevronLeftIcon, ChevronRightIcon } from './icons/Icon';

interface CalendarViewProps {
  appointments: Appointment[];
  patients: Patient[];
  onAddAppointment: (appointment: Omit<Appointment, 'id' | 'patientName' | 'status'>) => void;
}

const hours = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 8;
    return `${hour.toString().padStart(2, '0')}:00`;
}); // 08:00 to 19:00

export const CalendarView: React.FC<CalendarViewProps> = ({ appointments, patients, onAddAppointment }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleCellClick = (time: string) => {
    setSelectedTime(time);
    setIsModalOpen(true);
  }

  const changeDate = (amount: number) => {
    setCurrentDate(prev => {
        const newDate = new Date(prev);
        newDate.setDate(prev.getDate() + amount);
        return newDate;
    });
  };

  const getAppointmentsForDay = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return appointments.filter(app => app.date === dateString);
  };

  const todaysAppointments = getAppointmentsForDay(currentDate);
  const formattedDate = new Intl.DateTimeFormat(language, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(currentDate);

  return (
    <>
      <AddAppointmentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onAddAppointment}
        patients={patients}
        selectedDate={currentDate.toISOString().split('T')[0]}
      />
      <div className="p-4 md:p-8 bg-background min-h-full">
        <h1 className="text-3xl font-bold text-text-primary mb-6">{t('agenda.title')}</h1>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header with Date Navigation */}
            <div className="p-4 flex justify-between items-center border-b">
                <button onClick={() => changeDate(-1)} className="p-2 rounded-full hover:bg-gray-100"><ChevronLeftIcon /></button>
                <div className="text-center">
                    <h2 className="text-xl font-semibold capitalize">{formattedDate}</h2>
                    <button onClick={() => setCurrentDate(new Date())} className="text-sm text-brand-primary hover:underline">{t('agenda.today')}</button>
                </div>
                <button onClick={() => changeDate(1)} className="p-2 rounded-full hover:bg-gray-100"><ChevronRightIcon /></button>
            </div>

            {/* Agenda Body */}
            <div className="overflow-x-auto max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-[100px_auto] min-w-[600px]">
                  {/* Time column */}
                  <div className="hidden md:block border-r">
                      {hours.map(hour => (
                          <div key={hour} className="h-20 border-t flex items-center justify-center text-sm text-text-secondary">
                              {hour}
                          </div>
                      ))}
                  </div>

                  {/* Appointments column */}
                  <div className="relative">
                      {hours.map(hour => (
                          <div 
                            key={hour} 
                            onClick={() => handleCellClick(hour)} 
                            className="h-20 border-t cursor-pointer hover:bg-brand-light transition-colors flex items-center md:items-start p-2"
                          >
                            <span className="md:hidden text-xs text-text-secondary mr-2">{hour}</span>
                          </div>
                      ))}

                      {/* Render appointments */}
                      {todaysAppointments.map(app => {
                          const [hour, minute] = app.time.split(':').map(Number);
                          const top = ((hour - 8) * 80) + (minute / 60 * 80);
                          const height = (app.duration / 60 * 80) - 4; 
                          return (
                              <div
                                  key={app.id}
                                  className="absolute w-full md:w-[calc(100%-0.5rem)] left-0 md:left-2 px-1 cursor-pointer"
                                  style={{ top: `${top}px` }}
                              >
                                  <div 
                                      className="bg-brand-light border-l-4 border-brand-primary p-2 rounded-r-lg shadow-sm overflow-hidden"
                                      style={{ height: `${height}px` }}
                                  >
                                      <p className="text-sm font-bold text-brand-dark truncate">{app.patientName}</p>
                                      <p className="text-xs text-text-secondary truncate">{app.reason}</p>
                                      <p className="text-xs text-text-secondary truncate">{app.time}</p>
                                  </div>
                              </div>
                          );
                      })}
                  </div>
              </div>
          </div>
        </div>
      </div>
    </>
  );
};