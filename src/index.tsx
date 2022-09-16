import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import CumulativeInterestContextProvider from './context/cumulativeInterestContext';
import InstallmentProvider from './context/installmentContext';
import SimpleInterestContextProvider from './context/simpleInterestContext';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <InstallmentProvider>
      <CumulativeInterestContextProvider>
        <SimpleInterestContextProvider>
          <App />
        </SimpleInterestContextProvider>
      </CumulativeInterestContextProvider>
    </InstallmentProvider>
  </React.StrictMode>
);
