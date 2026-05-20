import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.jsx';
import { store } from './redux/store';
import './index.css';  // Global Styles 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* App.jsx manages the Router, Toasts, and Protected Routes */}
      <App />
    </Provider>
  </React.StrictMode>
);