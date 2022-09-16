import { useRef, useState } from "react";
import { useInstallment } from "../context/installmentContext";
import AmountInput from "../components/AmountInput";
import PercentInput from "./PercentInput";
import CalculatorButton, { FormRef } from "./CalculatorButton";

export default function InputForm() {
  const { installment, handleInstallment } = useInstallment();

  const [creditAmount, setCreditAmount] = useState(1000);
  const [profitRate, setProfitRate] = useState(1);
  const [installmentPeriod, setInstallmentPeriod] = useState("Aylık");
  const [taxRate, setTaxRate] = useState(10);

  const formRef = useRef<FormRef>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (creditAmount && installment && profitRate) {
      if (formRef.current) {
        formRef.current.alertResult();
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
          onChangeHandler={handleInstallment}
          title={"Taksit Sayısı:"}
          labelId={"installmentCountLabel"}
        />
        <PercentInput
          value={profitRate}
          onChangeHandler={setProfitRate}
          title={"Aylık Kâr oranı:"}
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

      <CalculatorButton 
        creditAmount={creditAmount}
        profitRate={profitRate}
        installmentPeriod={installmentPeriod}
        taxRate={taxRate}
        ref={formRef}
      />
    </form>
  );
}
