import { useState } from "react";
import { useCreditAmount } from "../context/creditContext";
import { useInstallment } from "../context/installmentContext";
import AmountInput from "../components/AmountInput";
import PercentInput from "./PercentInput";

export default function InputForm() {
  const { creditAmount, handleCreditAmount } = useCreditAmount();
  const { installment, handleInstallment } = useInstallment();

  const [profitRate, setProfitRate] = useState(0);
  const [installmentPeriod, setInstallmentPeriod] = useState("Aylık");
  const [taxRate, setTaxRate] = useState(0);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    switch (installmentPeriod) {
      case "Haftalık":
        console.log("haftalik kazanc");
        break;
      case "Yıllık":
        console.log("yillik kazanc");
        break;
      default:
        console.log("aylik kazanc");
        break;
    }
  };

  return (
    <form
      className="flex flex-col gap-3 px-4 py-3 rounded-lg w-1/2 bg-slate-300"
      onSubmit={(e) => handleSubmit(e)}
    >
      <div
        className="flex flex-col gap-3"
        // bg-red-400"
      >
        <AmountInput
          value={creditAmount}
          onChangeHandler={handleCreditAmount}
          title={"Kredi Tutarı:"}
        />
        <AmountInput
          value={installment}
          onChangeHandler={handleInstallment}
          title={"Taksit Sayısı:"}
        />
        <PercentInput
          value={profitRate}
          onChangeHandler={setProfitRate}
          title={"Kar oranı:"}
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
        />
      </div>

      <button type="submit" className="border rounded-md p-2 bg-gray-200">
        Hesapla
      </button>
    </form>
  );
}
