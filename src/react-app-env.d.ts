/// <reference types="react-scripts" />

interface CreditContextType {
  creditAmount: number;
  handleCreditAmount: (value: number) => void;
}

interface InstallmentContextType {
  installment: number;
  handleInstallment: (value: number) => void;
}
