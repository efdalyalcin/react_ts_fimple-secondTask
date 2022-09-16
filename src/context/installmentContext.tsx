import React, { useContext, useState } from 'react';

const InstallmentContext = React.createContext<InstallmentContextType>({
  installment: 0,
  handleInstallment: (value: number) => {},
});

type Children = {
  children: React.ReactNode;
}

export default function InstallmentProvider({ children }: Children) {
  const [installment, setInstallment] = useState(12);
  
  const handleInstallment = (value: number) => {
    if (value >= 520) {
      setInstallment(520);
    } else if (value <= 0) {
      setInstallment(0);
    } else {
      setInstallment(value);
    }
  };
  
  return (
    <InstallmentContext.Provider value={{installment, handleInstallment}}>
      {children}
    </InstallmentContext.Provider>
  )
}

export function useInstallment() {
  return useContext(InstallmentContext);
}
