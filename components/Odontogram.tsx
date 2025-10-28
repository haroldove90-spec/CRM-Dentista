import React from 'react';
// FIX: Add .ts extension to file import.
import type { OdontogramData, Tooth } from '../types.ts';
// FIX: Add .ts extension to file import.
import { ToothStatus } from '../types.ts';

interface OdontogramProps {
  data: OdontogramData;
  onUpdate: (newData: OdontogramData) => void;
}

const toothStatusColors: { [key in ToothStatus]: string } = {
  [ToothStatus.Healthy]: 'fill-white',
  [ToothStatus.Caries]: 'fill-red-500',
  [ToothStatus.Extraction]: 'fill-gray-400',
  [ToothStatus.Implant]: 'fill-blue-500',
  [ToothStatus.Crown]: 'fill-yellow-400',
  [ToothStatus.Filling]: 'fill-green-500',
};

const statusCycle: ToothStatus[] = [
    ToothStatus.Healthy,
    ToothStatus.Caries,
    ToothStatus.Filling,
    ToothStatus.Crown,
    ToothStatus.Implant,
    ToothStatus.Extraction,
];

const ToothComponent: React.FC<{ id: number; status: ToothStatus; onClick: (id: number) => void }> = ({ id, status, onClick }) => (
    <g transform={`translate(${((id > 16 ? 32-id : id-1) % 8) * 45 + (id > 8 && id < 25 ? 20 : 0)}, ${id > 16 ? 100 : 0})`}
        className="cursor-pointer group"
        onClick={() => onClick(id)}
    >
        <path d="M10 5 C 5 5, 5 15, 10 15 L 20 15 C 25 15, 25 5, 20 5 Z" className={`${toothStatusColors[status]} stroke-gray-600 stroke-2 group-hover:stroke-brand-primary transition-all`} />
        <text x="15" y="28" textAnchor="middle" className="text-xs font-sans fill-gray-700">{id}</text>
    </g>
);

const Legend: React.FC = () => (
    <div className="flex flex-wrap gap-4 mt-4 justify-center">
        {statusCycle.map(status => (
            <div key={status} className="flex items-center">
                <div className={`w-4 h-4 rounded-sm mr-2 ${toothStatusColors[status].replace('fill-','bg-')} border border-gray-400`}></div>
                <span className="text-sm">{status}</span>
            </div>
        ))}
    </div>
);

export const Odontogram: React.FC<OdontogramProps> = ({ data, onUpdate }) => {

  const handleToothClick = (id: number) => {
    const currentStatus = data[id].status;
    const currentIndex = statusCycle.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % statusCycle.length;
    const nextStatus = statusCycle[nextIndex];
    
    const newData = {
      ...data,
      [id]: { ...data[id], status: nextStatus },
    };
    onUpdate(newData);
  };
  
  // FIX: Cast the result of Object.values to Tooth[] to ensure correct type inference.
  const upperJaw = (Object.values(data) as Tooth[]).filter((tooth) => tooth.id <= 16).sort((a, b) => a.id - b.id);
  const lowerJaw = (Object.values(data) as Tooth[]).filter((tooth) => tooth.id > 16).sort((a, b) => b.id - a.id);

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="text-xl font-semibold text-center mb-4">Interactive Odontogram</h3>
        <div className="flex justify-center">
            <svg viewBox="0 0 400 200" className="max-w-full">
                {upperJaw.map(tooth => <ToothComponent key={tooth.id} id={tooth.id} status={tooth.status} onClick={handleToothClick} />)}
                {lowerJaw.map(tooth => <ToothComponent key={tooth.id} id={tooth.id} status={tooth.status} onClick={handleToothClick} />)}
            </svg>
        </div>
        <Legend />
    </div>
  );
};
