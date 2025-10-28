import React from 'react';
import type { Appointment } from '../types';

interface CalendarViewProps {
  appointments: Appointment[];
}

const hours = Array.from({ length: 12 }, (_, i) => `${i + 8}:00`); // 8 AM to 7 PM

export const CalendarView: React.FC<CalendarViewProps> = ({ appointments }) => {
  const today = new Date();
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - today.getDay() + i);
    return date;
  });

  const getAppointmentsForDay = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return appointments.filter(app => app.date === dateString);
  };

  return (
    <div className="p-4 md:p-8 bg-background min-h-full">
      <h1 className="text-3xl font-bold text-text-primary mb-6">Calendar</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
            <div className="grid grid-cols-8 min-w-[800px]">
              {/* Time column */}
              <div className="col-span-1 border-r border-gray-200">
                <div className="h-16 flex items-center justify-center font-semibold"></div>
                {hours.map(hour => (
                  <div key={hour} className="h-20 border-t border-gray-200 flex items-center justify-center text-sm text-text-secondary">
                    {hour}
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {weekDates.map((date, index) => (
                <div key={index} className={`col-span-1 ${index < 6 ? 'border-r border-gray-200' : ''}`}>
                  <div className="h-16 flex flex-col items-center justify-center border-b border-gray-200">
                    <span className="font-semibold">{daysOfWeek[date.getDay()]}</span>
                    <span className={`text-xl font-bold ${date.toDateString() === today.toDateString() ? 'text-brand-primary' : ''}`}>
                      {date.getDate()}
                    </span>
                  </div>
                  <div className="relative">
                    {hours.map((hour) => (
                      <div key={hour} className="h-20 border-t border-gray-200"></div>
                    ))}
                    {/* Render appointments */}
                    {getAppointmentsForDay(date).map(app => {
                      const [hour, minute] = app.time.split(':').map(Number);
                      const top = ((hour - 8) * 80) + (minute / 60 * 80);
                      const height = (app.duration / 60 * 80) - 4; // 2px padding
                      return (
                        <div
                          key={app.id}
                          className="absolute w-full p-1"
                          style={{ top: `${top}px` }}
                        >
                            <div 
                               className="bg-brand-light border-l-4 border-brand-primary p-1 rounded-r-lg shadow-sm overflow-hidden"
                               style={{ height: `${height}px` }}
                            >
                                <p className="text-xs font-bold text-brand-dark truncate">{app.patientName}</p>
                                <p className="text-xs text-text-secondary truncate">{app.reason}</p>
                            </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>
    </div>
  );
};