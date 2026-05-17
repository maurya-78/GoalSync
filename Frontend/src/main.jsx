import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

// Internal Imports
import App from './App.jsx';
import { store } from './redux/store';

// Global Styles (Tailwind and Custom Scrollbars)
import './index.css';

/**
 * ROOT INITIALIZATION
 * -------------------
 * 1. React.StrictMode: Development mode mein bugs catch karne ke liye.
 * 2. Provider: Redux store ko inject karta hai taaki hooks (useAuth, useGoals) kaam karein.
 */

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* App.jsx manages the Router, Toasts, and Protected Routes */}
      <App />
    </Provider>
  </React.StrictMode>
);