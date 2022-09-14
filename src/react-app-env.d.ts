/// <reference types="react-scripts" />

interface InstallmentContextType {
  installment: number;
  handleInstallment: (value: number) => void;
}

interface CalculatedInterest {
  installmentNumber: number,
  eachInstalmentAmount: number,
  capitalPaid: number,
  remainingCapital: number,
  profitAmount: number,
  kkdf: number,
  bsmv: number,
}

interface CumulativeInterestContextType {
  cumulativeInterest: (CalculatedInterest | null)[];
  handleCumulativeInterest: (arr: CalculatedInterest[]) => void;
}