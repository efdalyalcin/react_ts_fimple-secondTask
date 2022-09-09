import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import CreditAmountProvider from './context/creditContext';
import InstallmentProvider from './context/installmentContext';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <CreditAmountProvider>
      <InstallmentProvider>
        <App />
      </InstallmentProvider>
    </CreditAmountProvider>
  </React.StrictMode>
);
