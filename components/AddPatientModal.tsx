
import React, { useState, useRef, useCallback } from 'react';
import type { Patient } from '../types';
import { useTranslation } from '../context/LanguageContext';
import { CloseIcon, UploadIcon, CameraIcon } from './icons/Icon';

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (patient: Omit<Patient, 'id' | 'appointments' | 'treatments' | 'odontogram' | 'files'>) => void;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const AddPatientModal: React.FC<AddPatientModalProps> = ({ isOpen, onClose, onSave }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '', dob: '', gender: 'Other' as 'Male' | 'Female' | 'Other', phone: '', email: '', address: '', medicalHistory: '', notes: '',
  });
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const cleanupCamera = useCallback(() => {
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
    }
  }, []);

  const handleClose = () => {
    cleanupCamera();
    setIsCameraOpen(false);
    onClose();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      setAvatar(base64);
    }
  };

  const startCamera = async () => {
    try {
        cleanupCamera();
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        streamRef.current = stream;
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
        setIsCameraOpen(true);
    } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Could not access the camera. Please check permissions.");
    }
  };
  
  const takePhoto = () => {
    const video = videoRef.current;
    if (video) {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setAvatar(dataUrl);
        cleanupCamera();
        setIsCameraOpen(false);
    }
  };

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
    onSave({ ...formData, avatarUrl: avatar || '' });
    handleClose();
    // Reset form
    setFormData({ name: '', dob: '', gender: 'Other', phone: '', email: '', address: '', medicalHistory: '', notes: '' });
    setAvatar(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col relative">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">{t('modals.addPatientTitle')}</h2>
          <button onClick={handleClose} className="p-1 rounded-full hover:bg-gray-200"><CloseIcon /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Photo Section */}
                <div className="md:col-span-1 space-y-3 flex flex-col items-center">
                    <label className="block text-sm font-medium text-text-secondary mb-1">{t('modals.patientPhoto')}</label>
                    <div className="w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        {avatar ? <img src={avatar} alt="Patient Avatar" className="w-full h-full object-cover" /> : <span className="text-gray-500 text-5xl">?</span>}
                    </div>
                     <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                    <div className="flex gap-2 w-full">
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-sm">
                            <UploadIcon className="w-4 h-4" /> {t('modals.uploadImage')}
                        </button>
                        <button type="button" onClick={startCamera} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-sm">
                            <CameraIcon className="w-4 h-4" /> {t('modals.takePhoto')}
                        </button>
                    </div>
                </div>

                {/* Form Fields */}
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                        <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">{t('patientList.name')}</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-black" />
                    </div>
                    <div className="sm:col-span-2">
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
                            <option value="Female">Female</option> <option value="Male">Male</option> <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="address" className="block text-sm font-medium text-text-secondary mb-1">{t('patientDetail.address')}</label>
                        <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-black" />
                    </div>
                     <div className="sm:col-span-2">
                        <label htmlFor="medicalHistory" className="block text-sm font-medium text-text-secondary mb-1">{t('patientDetail.history')}</label>
                        <textarea id="medicalHistory" name="medicalHistory" value={formData.medicalHistory} onChange={handleChange} rows={2} className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-black"></textarea>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="notes" className="block text-sm font-medium text-text-secondary mb-1">{t('patientDetail.notes')}</label>
                        <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={2} className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-black"></textarea>
                    </div>
                </div>
            </div>
        </form>
         <div className="flex justify-end p-4 border-t mt-auto">
          <button type="button" onClick={handleClose} className="px-4 py-2 mr-2 bg-gray-200 rounded-lg hover:bg-gray-300">{t('modals.cancel')}</button>
          <button type="submit" onClick={handleSubmit} className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark">{t('modals.save')}</button>
        </div>

        {isCameraOpen && (
            <div className="absolute inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 p-4">
                <video ref={videoRef} autoPlay playsInline className="w-full h-auto max-w-lg rounded-lg mb-4" />
                <div className="flex gap-4">
                    <button onClick={takePhoto} className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark">{t('modals.capture')}</button>
                    <button onClick={() => { cleanupCamera(); setIsCameraOpen(false); }} className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">{t('modals.cancel')}</button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};