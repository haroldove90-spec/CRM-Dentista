import React, { useRef } from 'react';
// FIX: Add .ts extension to file import.
import type { Patient, ClinicalFile } from '../types.ts';
// FIX: Add .tsx extension to file import.
import { useTranslation } from '../context/LanguageContext.tsx';
// FIX: Add .tsx extension to file import.
import { UploadIcon, FileIcon, ImageIcon } from './icons/Icon.tsx';

interface PatientFilesProps {
  patient: Patient;
  onFileUpload: (file: Omit<ClinicalFile, 'id'>) => void;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const PatientFiles: React.FC<PatientFilesProps> = ({ patient, onFileUpload }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await fileToBase64(file);
    const type = file.type.startsWith('image/') ? 'image' : 'document';

    onFileUpload({
        name: file.name,
        type,
        url,
        uploadDate: new Date().toISOString().split('T')[0]
    });
    
    // Reset file input
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx"
      />
      <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">{t('patientDetail.clinicalFiles')}</h3>
          <button
            onClick={triggerFileUpload}
            className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg shadow hover:bg-brand-dark transition-colors"
          >
            <UploadIcon />
            {t('patientDetail.uploadFile')}
          </button>
      </div>

      {patient.files.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-text-secondary">{t('patientDetail.noFiles')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {patient.files.map(file => (
            <a href={file.url} target="_blank" rel="noopener noreferrer" key={file.id} className="block group">
                <div className="border rounded-lg p-3 hover:shadow-lg hover:border-brand-primary transition-all flex flex-col items-center text-center">
                    <div className="w-16 h-16 mb-2 flex items-center justify-center text-brand-primary">
                        {file.type === 'image' ? <ImageIcon className="w-12 h-12"/> : <FileIcon className="w-12 h-12"/>}
                    </div>
                    <p className="text-sm font-medium truncate w-full group-hover:text-brand-dark" title={file.name}>{file.name}</p>
                    <p className="text-xs text-text-secondary">{file.uploadDate}</p>
                </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
