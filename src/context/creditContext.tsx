import React, { useContext, useState } from 'react';

const CreditContext = React.createContext<CreditContextType>({
  creditAmount: 0,
  handleCreditAmount: (value: number) => {},
});

type Children = {
  children: React.ReactNode;
}

export default function CreditAmountProvider({ children }: Children) {
  const [creditAmount, setCreditAmount] = useState(0);
  
  const handleCreditAmount = (value: number) => {
    setCreditAmount(value);
  };
  
  return (
    <CreditContext.Provider value={{creditAmount, handleCreditAmount}}>
      {children}
    </CreditContext.Provider>
  )
}

export function useCreditAmount() {
  return useContext(CreditContext);
}
