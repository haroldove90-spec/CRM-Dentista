import React from 'react';
import ReactDOM from 'react-dom/client';
// FIX: Add .tsx extension to file import.
import App from './App.tsx';
// FIX: Add .tsx extension to file import.
import { LanguageProvider } from './context/LanguageContext.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>
);
