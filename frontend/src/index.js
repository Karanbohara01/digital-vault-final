// frontend/src/index.js (Updated)

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext'; // 1. Import AuthProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>  {/* 2. Wrap App with AuthProvider */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);