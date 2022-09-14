import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import CumulativeInterestContextProvider from './context/cumulativeInterestContext';
import InstallmentProvider from './context/installmentContext';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <InstallmentProvider>
      <CumulativeInterestContextProvider>
        <App />
      </CumulativeInterestContextProvider>
    </InstallmentProvider>
  </React.StrictMode>
);
