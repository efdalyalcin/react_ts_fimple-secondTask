import { useCallback, useState } from "react";
// import { useCreditAmount } from "../context/creditContext";
// import { useInstallment } from "../context/installmentContext";
import AmountInput from "../components/AmountInput";
import PercentInput from "./PercentInput";

export default function InputForm() {
  const [creditAmount, setCreditAmount] = useState(0);
  const [installment, setInstallment] = useState(0);
  const [profitRate, setProfitRate] = useState(0);
  const [installmentPeriod, setInstallmentPeriod] = useState("Aylık");
  const [taxRate, setTaxRate] = useState(0);

  const [simpleInterest, setSimpleInterest] = useState<CalculatedInterest[]>(
    []
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    calculateForm();
  };

  const calculateBSMV = useCallback(
    (capitalAmount: number, profitRate: number, taxRate: number) => {
      return (
        Math.round(capitalAmount * profitRate * 0.01 * taxRate * 0.01 * 100) /
        100
      );
    },
    []
  );

  console.log(simpleInterest);

  const calculateKKDF = useCallback(
    (capitalAmount: number, profitRate: number, taxRate: number) => {
      return (
        Math.round(
          capitalAmount * profitRate * 0.01 * taxRate * 0.01 * 1.5 * 100
        ) / 100
      );
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

  const calculateForm = () => {
    const totalRate =
      profitRate * 0.01 +
      profitRate * 0.01 * taxRate * 0.01 +
      profitRate * 0.01 * taxRate * 0.01 * 1.5;
    const devided = totalRate * (1 + totalRate) ** installment;
    const devider = (1 + totalRate) ** installment - 1;

    const eachInstallmentPayment =
      Math.round(creditAmount * (devided / devider) * 100) / 100;

    // const totalCreditAmount =
    //   Math.round((eachInstallmentPayment * installment) * 100) / 100;

    for (let i = 0; i < installment; i++) {
      if (i === 0) {
        const paidAmount = calculateCapitalPaid(
          eachInstallmentPayment,
          calculateSimpleProfit(creditAmount, profitRate, installmentPeriod),
          calculateKKDF(creditAmount, profitRate, taxRate),
          calculateBSMV(creditAmount, profitRate, taxRate)
        );

        const firstPayment: CalculatedInterest = {
          installmentNumber: 1,
          eachInstalmentAmount: eachInstallmentPayment,
          capitalPaid: paidAmount,
          remainingCapital: creditAmount - paidAmount,
          profitAmount: calculateSimpleProfit(
            creditAmount,
            profitRate,
            installmentPeriod
          ),
          kkdf: calculateKKDF(creditAmount, profitRate, taxRate),
          bsmv: calculateBSMV(creditAmount, profitRate, taxRate),
        };
        setSimpleInterest([firstPayment]);
      } else {
        const paidAmount = calculateCapitalPaid(
          eachInstallmentPayment,
          calculateSimpleProfit(simpleInterest[i - 1]['remainingCapital'], profitRate, installmentPeriod),
          calculateKKDF(simpleInterest[i - 1]['remainingCapital'], profitRate, taxRate),
          calculateBSMV(simpleInterest[i - 1]['remainingCapital'], profitRate, taxRate)
        );

        const payments: CalculatedInterest = {
          installmentNumber: i + 1,
          eachInstalmentAmount: eachInstallmentPayment,
          capitalPaid: paidAmount,
          remainingCapital: creditAmount - paidAmount,
          profitAmount: calculateSimpleProfit(
            simpleInterest[i - 1]['remainingCapital'],
            profitRate,
            installmentPeriod
          ),
          kkdf: calculateKKDF(simpleInterest[i - 1]['remainingCapital'], profitRate, taxRate),
          bsmv: calculateBSMV(simpleInterest[i - 1]['remainingCapital'], profitRate, taxRate),
        }

        setSimpleInterest([...simpleInterest, payments])
      }
    }
  };

  return (
    <form
      className="flex flex-col gap-3 px-4 py-3 rounded-lg w-1/2 bg-slate-300"
      onSubmit={(e) => handleSubmit(e)}
    >
      <div className="flex flex-col gap-3">
        <AmountInput
          value={creditAmount}
          onChangeHandler={setCreditAmount}
          title={"Kredi Tutarı:"}
          labelId={"creditAmountLabel"}
        />
        <AmountInput
          value={installment}
          onChangeHandler={setInstallment}
          title={"Taksit Sayısı:"}
          labelId={"installmentCountLabel"}
        />
        <PercentInput
          value={profitRate}
          onChangeHandler={setProfitRate}
          title={"Aylık Kar oranı:"}
          labelId={"profitAmountLabel"}
        />

        <div className="flex justify-between items-center">
          <label htmlFor="installmentPeriod">Taksit Aralığı:</label>
          <select
            id="installmentPeriod"
            className="h-full rounded-md border bg-transparent py-1 px-2 text-right
              text-gray-600 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={installmentPeriod}
            onChange={(e) => setInstallmentPeriod(e.target.value)}
          >
            <option value="Haftalık">Haftalık</option>
            <option value="Aylık">Aylık</option>
            <option value="Yıllık">Yıllık</option>
          </select>
        </div>

        <PercentInput
          value={taxRate}
          onChangeHandler={setTaxRate}
          title={"Vergi oranı:"}
          labelId={"taxRateLabel"}
        />
      </div>

      <button type="submit" className="border rounded-md p-2 bg-gray-200">
        Hesapla
      </button>
    </form>
  );
}
