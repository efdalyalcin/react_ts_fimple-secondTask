import React, { useContext, useState } from "react";
import { useInstallment } from "./installmentContext";

const CumulativeInterestContext =
  React.createContext<CumulativeInterestContextType>({
    cumulativeInterest: [],
    handleCumulativeInterest: (arr) => {},
  });

type Children = {
  children: React.ReactNode;
};

export default function CumulativeInterestContextProvider({
  children,
}: Children) {
  const {installment} = useInstallment();

  const [cumulativeInterest, setCumulativeInterest] = useState<
    (CalculatedInterest | null)[]
  >(Array(installment).fill(null));

  const handleCumulativeInterest = (arr: CalculatedInterest[]) => {
    setCumulativeInterest(arr);
  };

  return (
    <CumulativeInterestContext.Provider
      value={{ cumulativeInterest, handleCumulativeInterest }}
    >
      {children}
    </CumulativeInterestContext.Provider>
  );
}

export function useCumulativeInterest() {
  return useContext(CumulativeInterestContext);
}
