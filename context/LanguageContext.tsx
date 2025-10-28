
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Spanish translations (Primary)
const es = {
  "sidebar": {
    "title": "Dra. Magda Zavala",
    "dashboard": "Dashboard",
    "patients": "Pacientes",
    "calendar": "Calendario",
    "treatmentPlans": "Planes de Tratamiento",
    "settings": "Configuración",
    "logout": "Cerrar Sesión"
  },
  "dashboard": {
    "title": "Dashboard",
    "todaysAppointments": "Citas de Hoy",
    "totalPatients": "Pacientes Totales",
    "monthlyRevenue": "Ingresos Mensuales",
    "pendingInvoices": "Facturas Pendientes",
    "recentPatients": "Pacientes Recientes",
    "time": "Hora",
    "patient": "Paciente",
    "reason": "Motivo",
    "noAppointments": "No hay citas para hoy.",
    "view": "Ver"
  },
  "patientList": {
    "title": "Pacientes",
    "addNew": "Añadir Nuevo Paciente",
    "searchPlaceholder": "Buscar por nombre, email o teléfono...",
    "name": "Nombre",
    "contact": "Contacto",
    "dob": "Fecha de Nacimiento",
    "actions": "Acciones"
  },
  "patientDetail": {
    "headerTitle": "Detalles del Paciente",
    "tabInfo": "Info",
    "tabAppointments": "Citas",
    "tabOdontogram": "Odontograma",
    "tabBilling": "Facturación",
    "tabFiles": "Archivos",
    "tabAiSummary": "Resumen IA",
    "personalDetails": "Detalles Personales",
    "dob": "Fecha de Nacimiento:",
    "gender": "Género:",
    "address": "Dirección:",
    "medicalNotes": "Notas Médicas",
    "history": "Historial:",
    "notes": "Notas:",
    "billingDate": "Fecha",
    "billingDescription": "Descripción",
    "billingCost": "Costo",
    "billingStatus": "Estado",
    "paid": "Pagado",
    "pending": "Pendiente",
    "generateSummary": "Generar Resumen IA",
    "generating": "Generando...",
    "loadingSummary": "Cargando resumen...",
    "aiSummaryTitle": "Resumen Generado por IA",
    "clinicalFiles": "Archivos Clínicos",
    "uploadFile": "Subir Archivo",
    "noFiles": "No hay archivos para este paciente.",
    "addCharge": "Añadir Cargo"
  },
  "treatmentPlans": {
    "title": "Planes de Tratamiento",
    "addNew": "Crear Nuevo Plan",
    "patient": "Paciente",
    "plan": "Plan",
    "status": "Estado",
    "totalCost": "Costo Total",
    "details": "Detalles",
    "statusProposed": "Propuesto",
    "statusInProgress": "En Progreso",
    "statusCompleted": "Completado"
  },
  "calendar": {
    "title": "Calendario"
  },
  "settings": {
    "title": "Configuración",
    "description": "Gestiona la configuración de tu clínica aquí.",
    "clinicInfo": "Información de la Clínica",
    "clinicName": "Nombre de la Clínica",
    "phone": "Teléfono",
    "address": "Dirección",
    "email": "Email",
    "userProfile": "Perfil de Usuario",
    "name": "Nombre",
    "specialization": "Especialización",
    "billingCurrency": "Facturación y Moneda",
    "currency": "Moneda",
    "save": "Guardar Cambios",
    "saveSuccess": "¡Configuración guardada!"
  },
  "modals": {
    "addPatientTitle": "Añadir Nuevo Paciente",
    "addAppointmentTitle": "Añadir Nueva Cita",
    "createPlanTitle": "Crear Plan de Tratamiento",
    "cancel": "Cancelar",
    "save": "Guardar",
    "savePlan": "Guardar Plan",
    "fillAllFields": "Por favor, rellene todos los campos obligatorios.",
    "email": "Email",
    "phone": "Teléfono",
    "date": "Fecha",
    "selectPatient": "Seleccionar un paciente",
    "duration": "Duración (minutos)",
    "manualCreation": "Creación Manual",
    "aiCreation": "Asistente IA",
    "selectProcedure": "Seleccionar procedimiento",
    "aiPlaceholder": "Notas del paciente para la IA (ej: caries en diente #3, necesita corona en #18)...",
    "generateWithAI": "Generar con IA",
    "proceduresList": "Procedimientos del Plan",
    "noProcedures": "Añada procedimientos manualmente o use la IA."
  }
};

// English translations
const en = {
  "sidebar": {
    "title": "Dr. Magda Zavala",
    "dashboard": "Dashboard",
    "patients": "Patients",
    "calendar": "Calendar",
    "treatmentPlans": "Treatment Plans",
    "settings": "Settings",
    "logout": "Logout"
  },
  "dashboard": {
    "title": "Dashboard",
    "todaysAppointments": "Today's Appointments",
    "totalPatients": "Total Patients",
    "monthlyRevenue": "Monthly Revenue",
    "pendingInvoices": "Pending Invoices",
    "recentPatients": "Recent Patients",
    "time": "Time",
    "patient": "Patient",
    "reason": "Reason",
    "noAppointments": "No appointments for today.",
    "view": "View"
  },
  "patientList": {
    "title": "Patients",
    "addNew": "Add New Patient",
    "searchPlaceholder": "Search by name, email, or phone...",
    "name": "Name",
    "contact": "Contact",
    "dob": "Date of Birth",
    "actions": "Actions"
  },
  "patientDetail": {
    "headerTitle": "Patient Details",
    "tabInfo": "Info",
    "tabAppointments": "Appointments",
    "tabOdontogram": "Odontogram",
    "tabBilling": "Billing",
    "tabFiles": "Files",
    "tabAiSummary": "AI Summary",
    "personalDetails": "Personal Details",
    "dob": "Date of Birth:",
    "gender": "Gender:",
    "address": "Address:",
    "medicalNotes": "Medical Notes",
    "history": "History:",
    "notes": "Notes:",
    "billingDate": "Date",
    "billingDescription": "Description",
    "billingCost": "Cost",
    "billingStatus": "Status",
    "paid": "Paid",
    "pending": "Pending",
    "generateSummary": "Generate AI Summary",
    "generating": "Generating...",
    "loadingSummary": "Loading summary...",
    "aiSummaryTitle": "AI Generated Summary",
    "clinicalFiles": "Clinical Files",
    "uploadFile": "Upload File",
    "noFiles": "There are no files for this patient.",
    "addCharge": "Add Charge"
  },
  "treatmentPlans": {
    "title": "Treatment Plans",
    "addNew": "Create New Plan",
    "patient": "Patient",
    "plan": "Plan",
    "status": "Status",
    "totalCost": "Total Cost",
    "details": "Details",
    "statusProposed": "Proposed",
    "statusInProgress": "In Progress",
    "statusCompleted": "Completed"
  },
  "calendar": {
    "title": "Calendar"
  },
  "settings": {
    "title": "Settings",
    "description": "Manage your clinic settings here.",
    "clinicInfo": "Clinic Information",
    "clinicName": "Clinic Name",
    "phone": "Phone",
    "address": "Address",
    "email": "Email",
    "userProfile": "User Profile",
    "name": "Name",
    "specialization": "Specialization",
    "billingCurrency": "Billing & Currency",
    "currency": "Currency",
    "save": "Save Changes",
    "saveSuccess": "Settings saved!"
  },
  "modals": {
    "addPatientTitle": "Add New Patient",
    "addAppointmentTitle": "Add New Appointment",
    "createPlanTitle": "Create Treatment Plan",
    "cancel": "Cancel",
    "save": "Save",
    "savePlan": "Save Plan",
    "fillAllFields": "Please fill in all required fields.",
    "email": "Email",
    "phone": "Phone",
    "date": "Date",
    "selectPatient": "Select a patient",
    "duration": "Duration (minutes)",
    "manualCreation": "Manual Creation",
    "aiCreation": "AI Assistant",
    "selectProcedure": "Select procedure",
    "aiPlaceholder": "Patient notes for AI (e.g., caries on tooth #3, needs crown on #18)...",
    "generateWithAI": "Generate with AI",
    "proceduresList": "Plan Procedures",
    "noProcedures": "Add procedures manually or use the AI assistant."
  }
};


type Language = 'es' | 'en';
type Translations = typeof es;

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Translations;
}

const translations: Record<Language, Translations> = { es, en };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('es');

  const value = {
    language,
    setLanguage,
    translations: translations[language],
  };

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

// Helper hook for translations
export const useTranslation = () => {
    const { translations } = useLanguage();
    
    const t = (key: string): string => {
        const keys = key.split('.');
        let result: any = translations;
        for (const k of keys) {
            result = result?.[k];
            if (result === undefined) {
                // Return key as fallback
                return key;
            }
        }
        return result as string;
    };

    return { t };
};
