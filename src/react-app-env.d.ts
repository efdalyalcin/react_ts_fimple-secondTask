/// <reference types="react-scripts" />

interface CreditContextType {
  creditAmount: number;
  handleCreditAmount: (value: number) => void;
}

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
