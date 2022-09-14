import { useCallback } from "react";
import { useCumulativeInterest } from "../context/cumulativeInterestContext";
import { useInstallment } from "../context/installmentContext";

type Props = {
  creditAmount: number;
  profitRate: number;
  installmentPeriod: string;
  taxRate: number;
}

export default function CalculatorButton({
  creditAmount,
  profitRate,
  installmentPeriod,
  taxRate,
}: Props) {
  const { cumulativeInterest, handleCumulativeInterest } = useCumulativeInterest();
  const { installment } = useInstallment();

  console.log(cumulativeInterest);
  

  const calculateBSMV = useCallback(
    (capitalAmount: number, profitRate: number, taxRate: number, period: string) => {
      switch (period) {
        case "Haftalık":
          return (
            Math.round(capitalAmount * profitRate * 0.01 
              * taxRate * 0.01 * 100 * (7/30)) / 100
          );
        case "Yıllık":
          return (
            Math.round(capitalAmount * profitRate * 0.01 
              * taxRate * 0.01 * 100 * (365/30)) / 100
          );
        default:
          return Math.round(capitalAmount * profitRate * 0.01
            * taxRate * 0.01 * 100) / 100;
      }
    },
    []
  );

  const calculateKKDF = useCallback(
    (capitalAmount: number, profitRate: number, taxRate: number, period: string) => {

      switch (period) {
        case "Haftalık":
          return (
            Math.round(capitalAmount * profitRate * 0.01 
              * taxRate * 0.01 * 1.5 * 100 * (7/30)) / 100
          );
        case "Yıllık":
          return (
            Math.round(capitalAmount * profitRate * 0.01 
              * taxRate * 0.01 * 1.5 * 100 * (365/30)) / 100
          );
        default:
          return Math.round(capitalAmount * profitRate * 0.01
            * taxRate * 0.01 * 1.5 * 100) / 100;
      }
    },
    []
  );

  const calculateCapitalPaid = useCallback(
    (eachPayment: number, profitAmount: number, kkdf: number, bsmv: number) => {
      return Math.round((eachPayment - profitAmount - kkdf - bsmv) * 100) / 100;
    },
    []
  );

  const calculateSimpleProfit = useCallback(
    (creditAmount: number, profitRate: number, period: string) => {
      switch (period) {
        case "Haftalık":
          return (
            Math.round(creditAmount * profitRate * 0.01 * (7 / 30) * 100) / 100
          );
        case "Yıllık":
          return (
            Math.round(creditAmount * profitRate * 0.01 * (365 / 30) * 100) /
            100
          );
        default:
          return Math.round(creditAmount * profitRate * 0.01 * 100) / 100;
      }
    },
    []
  );

  const calculateTotalRate = useCallback(
    (profitRate: number, taxRate: number, period: string) => {
      switch (period) {
        case "Haftalık":
          return (
            profitRate * 0.01 * (7/30) +
            profitRate * 0.01 * taxRate * 0.01 * (7/30)+
            profitRate * 0.01 * taxRate * 0.01 * 1.5 * (7/30)
          );
        case "Yıllık":
          return (
            profitRate * 0.01 * (365/30) +
            profitRate * 0.01 * taxRate * 0.01 * (365/30)+
            profitRate * 0.01 * taxRate * 0.01 * 1.5 * (365/30)
          );
        default:
          return (
            profitRate * 0.01 +
            profitRate * 0.01 * taxRate * 0.01 +
            profitRate * 0.01 * taxRate * 0.01 * 1.5
          );
      }
    }, 
    []
  )

  const calculateForm = () => {
    const totalRate = calculateTotalRate(profitRate, taxRate, installmentPeriod);
    const devided = totalRate * (1 + totalRate) ** installment;
    const devider = (1 + totalRate) ** installment - 1;

    const eachInstallmentPayment =
      Math.round(creditAmount * (devided / devider) * 100) / 100;

    let totalStandingCredit = creditAmount;
    const newArr = [];

    for (let i = 0; i < installment; i++) {
      if (i === 0) {
        const paidAmount = calculateCapitalPaid(
          eachInstallmentPayment,
          calculateSimpleProfit(creditAmount, profitRate, installmentPeriod),
          calculateKKDF(creditAmount, profitRate, taxRate, installmentPeriod),
          calculateBSMV(creditAmount, profitRate, taxRate, installmentPeriod)
        );

        const firstPayment: CalculatedInterest = {
          installmentNumber: 1,
          eachInstalmentAmount: eachInstallmentPayment,
          capitalPaid: paidAmount,
          remainingCapital: Math.ceil((creditAmount - paidAmount) * 100) / 100,
          profitAmount: calculateSimpleProfit(
            creditAmount,
            profitRate,
            installmentPeriod
          ),
          kkdf: calculateKKDF(creditAmount, profitRate, taxRate, installmentPeriod),
          bsmv: calculateBSMV(creditAmount, profitRate, taxRate, installmentPeriod),
        };

        totalStandingCredit = Math.ceil((creditAmount - paidAmount) * 100) / 100;
        newArr.push(firstPayment);
      } else {
        const paidAmount = calculateCapitalPaid(
          eachInstallmentPayment,
          calculateSimpleProfit(
            totalStandingCredit,
            profitRate,
            installmentPeriod
          ),
          calculateKKDF(totalStandingCredit, profitRate, taxRate, installmentPeriod),
          calculateBSMV(totalStandingCredit, profitRate, taxRate, installmentPeriod)
        );

        const payments: CalculatedInterest = {
          installmentNumber: i + 1,
          eachInstalmentAmount: eachInstallmentPayment,
          capitalPaid: paidAmount,
          remainingCapital:
            Math.ceil((totalStandingCredit - paidAmount) * 100) / 100,
          profitAmount: calculateSimpleProfit(
            totalStandingCredit,
            profitRate,
            installmentPeriod
          ),
          kkdf: calculateKKDF(totalStandingCredit, profitRate, taxRate, installmentPeriod),
          bsmv: calculateBSMV(totalStandingCredit, profitRate, taxRate, installmentPeriod),
        };

        totalStandingCredit =
          Math.ceil((totalStandingCredit - paidAmount) * 100) / 100;
        newArr.push(payments);
      }
    }

    const lastInstallment = newArr[newArr.length - 1];
    lastInstallment.remainingCapital = 0;
    newArr[newArr.length - 1] = lastInstallment;

    handleCumulativeInterest([...newArr]);
  };

  return (
    <button 
      type="submit" 
      className="border rounded-md p-2 bg-gray-200"
      onClick={calculateForm}
    >
      Hesapla
    </button>
  )
}
