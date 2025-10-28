import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';

// Define translations
const translations = {
  en: {
    sidebar: {
      title: 'Dra. Magda Zavala',
      dashboard: 'Dashboard',
      patients: 'Patients',
      agenda: 'Agenda',
      treatmentPlans: 'Treatment Plans',
      settings: 'Settings',
      logout: 'Logout',
    },
    dashboard: {
      title: 'Dashboard',
      totalPatients: 'Total Patients',
      upcomingAppointments: 'Today\'s Appointments',
      activePlans: 'Total Treatments',
      agenda: 'Today\'s Agenda',
      patientActivity: 'Patient Activity',
      noAppointments: 'No appointments for today.',
      view: 'View Profile',
      patient: 'Patient',
      time: 'Time',
      reason: 'Reason',
    },
    patientList: {
      title: 'Patient List',
      addNew: 'Add New Patient',
      searchPlaceholder: 'Search by name, email, or phone...',
      name: 'Name',
      contact: 'Contact',
      dob: 'Date of Birth',
      actions: 'Actions',
    },
    patientDetail: {
        title: 'Patient Details',
        gender: 'Gender',
        email: 'Email',
        address: 'Address',
        medicalHistory: 'Medical History',
        notes: 'Clinical Notes',
        aiSummary: 'AI Summary',
        generateSummaryPrompt: 'Generate a concise summary of the patient\'s clinical notes.',
        generateSummary: 'Generate with Gemini',
        generating: 'Generating...',
        overview: 'Overview',
        odontogram: 'Odontogram',
        treatments: 'Treatments',
        files: 'Files',
        treatmentHistory: 'Treatment History',
        description: 'Description',
        cost: 'Cost',
        paid: 'Paid',
        yes: 'Yes',
        no: 'No',
        clinicalFiles: 'Clinical Files',
        uploadFile: 'Upload File',
        noFiles: 'No clinical files have been uploaded.',
    },
    agenda: {
        title: 'Appointment Calendar',
        today: 'Today',
    },
    treatmentPlans: {
        title: 'Treatment Plans',
        addNew: 'Create New Plan',
        patient: 'Patient',
        plan: 'Plan Name',
        status: 'Status',
        totalCost: 'Total Cost',
        details: 'Details',
        statusProposed: 'Proposed',
        statusInProgress: 'In Progress',
        statusCompleted: 'Completed',
    },
    settings: {
        title: 'Settings',
        clinicInfo: 'Clinic Information',
        clinicName: 'Clinic Name',
        phone: 'Phone',
        address: 'Address',
        email: 'Email',
        userProfile: 'User Profile',
        name: 'Name',
        specialization: 'Specialization',
        billingCurrency: 'Billing & Currency',
        currency: 'Currency',
        save: 'Save Changes',
        saveSuccess: 'Settings saved successfully!',
    },
    modals: {
        fillAllFields: 'Please fill all required fields.',
        addAppointmentTitle: 'Add New Appointment',
        date: 'Date',
        selectPatient: 'Select a patient',
        duration: 'Duration (minutes)',
        cancel: 'Cancel',
        save: 'Save',
        addPatientTitle: 'Add New Patient',
        patientName: 'Patient Name',
        dob: 'Date of Birth',
        gender: 'Gender',
        male: 'Male',
        female: 'Female',
        other: 'Other',
        phone: 'Phone Number',
        email: 'Email Address',
        address: 'Address',
        medicalHistory: 'Medical History',
        notes: 'Notes',
        avatarUrl: 'Avatar URL',
        createPlanTitle: 'Create Treatment Plan',
        selectProcedure: 'Select a procedure',
        manualCreation: 'Manual Creation',
        aiCreation: 'AI-Powered Creation',
        aiPlaceholder: 'Describe the patient\'s condition or desired treatment (e.g., "Patient needs a crown on tooth #14 and has cavities on #3 and #19. Also wants teeth whitening.")',
        generateWithAI: 'Generate with Gemini',
        proceduresList: 'Procedures in Plan',
        noProcedures: 'No procedures added yet.',
        savePlan: 'Save Plan',
        treatmentPlanDetailTitle: 'Treatment Plan Details',
        statusLabel: 'Status',
        procedures: 'Procedures',
    }
  },
  es: {
    sidebar: {
      title: 'Dra. Magda Zavala',
      dashboard: 'Escritorio',
      patients: 'Pacientes',
      agenda: 'Agenda',
      treatmentPlans: 'Planes de Tratamiento',
      settings: 'Configuración',
      logout: 'Cerrar Sesión',
    },
    dashboard: {
      title: 'Escritorio',
      totalPatients: 'Pacientes Totales',
      upcomingAppointments: 'Citas de Hoy',
      activePlans: 'Tratamientos Totales',
      agenda: 'Agenda de Hoy',
      patientActivity: 'Actividad de Pacientes',
      noAppointments: 'No hay citas para hoy.',
      view: 'Ver Ficha',
      patient: 'Paciente',
      time: 'Hora',
      reason: 'Motivo',
    },
    patientList: {
      title: 'Lista de Pacientes',
      addNew: 'Añadir Nuevo Paciente',
      searchPlaceholder: 'Buscar por nombre, email o teléfono...',
      name: 'Nombre',
      contact: 'Contacto',
      dob: 'Fecha de Nacimiento',
      actions: 'Acciones',
    },
    patientDetail: {
        title: 'Ficha del Paciente',
        gender: 'Género',
        email: 'Email',
        address: 'Dirección',
        medicalHistory: 'Historial Médico',
        notes: 'Notas Clínicas',
        aiSummary: 'Resumen con IA',
        generateSummaryPrompt: 'Genera un resumen conciso de las notas clínicas del paciente.',
        generateSummary: 'Generar con Gemini',
        generating: 'Generando...',
        overview: 'Resumen',
        odontogram: 'Odontograma',
        treatments: 'Tratamientos',
        files: 'Archivos',
        treatmentHistory: 'Historial de Tratamientos',
        description: 'Descripción',
        cost: 'Costo',
        paid: 'Pagado',
        yes: 'Sí',
        no: 'No',
        clinicalFiles: 'Archivos Clínicos',
        uploadFile: 'Subir Archivo',
        noFiles: 'No se han subido archivos clínicos.',
    },
    agenda: {
        title: 'Calendario de Citas',
        today: 'Hoy',
    },
    treatmentPlans: {
        title: 'Planes de Tratamiento',
        addNew: 'Crear Nuevo Plan',
        patient: 'Paciente',
        plan: 'Nombre del Plan',
        status: 'Estado',
        totalCost: 'Costo Total',
        details: 'Detalles',
        statusProposed: 'Propuesto',
        statusInProgress: 'En Progreso',
        statusCompleted: 'Completado',
    },
    settings: {
        title: 'Configuración',
        clinicInfo: 'Información de la Clínica',
        clinicName: 'Nombre de la Clínica',
        phone: 'Teléfono',
        address: 'Dirección',
        email: 'Email',
        userProfile: 'Perfil de Usuario',
        name: 'Nombre',
        specialization: 'Especialización',
        billingCurrency: 'Facturación y Moneda',
        currency: 'Moneda',
        save: 'Guardar Cambios',
        saveSuccess: '¡Configuración guardada exitosamente!',
    },
    modals: {
        fillAllFields: 'Por favor, complete todos los campos requeridos.',
        addAppointmentTitle: 'Añadir Nueva Cita',
        date: 'Fecha',
        selectPatient: 'Seleccione un paciente',
        duration: 'Duración (minutos)',
        cancel: 'Cancelar',
        save: 'Guardar',
        addPatientTitle: 'Añadir Nuevo Paciente',
        patientName: 'Nombre del Paciente',
        dob: 'Fecha de Nacimiento',
        gender: 'Género',
        male: 'Masculino',
        female: 'Femenino',
        other: 'Otro',
        phone: 'Número de Teléfono',
        email: 'Correo Electrónico',
        address: 'Dirección',
        medicalHistory: 'Historial Médico',
        notes: 'Notas',
        avatarUrl: 'URL del Avatar',
        createPlanTitle: 'Crear Plan de Tratamiento',
        selectProcedure: 'Seleccione un procedimiento',
        manualCreation: 'Creación Manual',
        aiCreation: 'Creación con IA',
        aiPlaceholder: 'Describa la condición del paciente o el tratamiento deseado (ej: "Paciente necesita corona en el diente #14 y tiene caries en #3 y #19. También quiere blanqueamiento.")',
        generateWithAI: 'Generar con Gemini',
        proceduresList: 'Procedimientos en el Plan',
        noProcedures: 'Aún no se han añadido procedimientos.',
        savePlan: 'Guardar Plan',
        treatmentPlanDetailTitle: 'Detalles del Plan de Tratamiento',
        statusLabel: 'Estado',
        procedures: 'Procedimientos',
    }
  },
};

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('es');

  const t = useMemo(() => (key: string): string => {
    const keys = key.split('.');
    let result: any = translations[language];
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    return result;
  }, [language]);

  const value = { language, setLanguage, t };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const useTranslation = () => {
  const { t } = useLanguage();
  return { t };
};
