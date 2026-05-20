import React from 'react';
import { Toaster } from 'react-hot-toast';
import AppRouter from './routes/AppRouter';

const App = () => (
  <>
    <AppRouter />
    <Toaster
      position="top-right"
      gutter={8}
      toastOptions={{
        duration: 3500,
        style: {
          background: 'var(--color-surface)',
          color: 'var(--color-text)',
          border: '1px solid var(--color-border)',
          borderRadius: '12px',
          fontSize: '13px',
          fontWeight: '500',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
        },
        success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
        error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
      }}
    />
  </>
);

export default App;