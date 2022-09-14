import React, { useContext, useState } from "react";
import { useInstallment } from "./installmentContext";

const SimpleInterestContext =
  React.createContext<SimpleInterestContextType>({
    simpleInterest: [],
    handleSimpleInterest: (arr) => {},
  });

type Children = {
  children: React.ReactNode;
};

export default function SimpleInterestContextProvider({
  children,
}: Children) {
  const {installment} = useInstallment();

  const [simpleInterest, setSimpleInterest] = useState<
    (CalculatedInterest | null)[]
  >(Array(installment).fill(null));

  const handleSimpleInterest = (arr: CalculatedInterest[]) => {
    setSimpleInterest(arr);
  };

  return (
    <SimpleInterestContext.Provider
      value={{ simpleInterest, handleSimpleInterest }}
    >
      {children}
    </SimpleInterestContext.Provider>
  );
}

export function useSimpleInterest() {
  return useContext(SimpleInterestContext);
}
