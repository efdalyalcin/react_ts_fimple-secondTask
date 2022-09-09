import { useState } from "react";
import { useCreditAmount } from "../context/creditContext";
import { useInstallment } from "../context/installmentContext";

export default function InputForm() {
  const { creditAmount, handleCreditAmount } = useCreditAmount();
  const { installment, handleInstallment } = useInstallment();

  const [profitRate, setProfitRate] = useState(0);
  const [installmentPeriod, setInstallmentPeriod] = useState('Aylık');
  const [taxRate, setTaxRate] = useState(0);

  return (
    <form className="flex flex-col gap-3 px-4 py-3 rounded-full w-1/2">
      <div className="flex justify-between items-center">
        <label htmlFor="credit">Kredi Tutarı:</label>
        <input
          id="credit"
          type="number"
          className="h-full rounded-md border bg-transparent py-1 px-4 text-right
            text-gray-600 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={creditAmount}
          onChange={(e) => handleCreditAmount(Number(e.target.value))}
        />
      </div>
      <div className="flex justify-between items-center">
        <label htmlFor="credit">Taksit Sayısı:</label>
        <input
          id="installment"
          type="number"
          className="h-full rounded-md border bg-transparent py-1 px-4 text-right
            text-gray-600 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={installment}
          onChange={(e) => handleInstallment(Number(e.target.value))}
        />
      </div>
      <div className="flex justify-between items-center">
        <label htmlFor="profitRate">Kar oranı:</label>
        <div className="relative flex items-center">
          <input
            id="profitRate"
            type="number"
            className="h-full rounded-md border bg-transparent py-1 px-4 text-right
              text-gray-600 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={profitRate}
            onChange={(e) => setProfitRate(Number(e.target.value))}
          />
          <label htmlFor="profitRate" className="absolute right-1">%</label>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <label htmlFor="installmentPeriod">Taksit Aralığı:</label>
        <select
          id="installmentPeriod"
          className="h-full rounded-md border bg-transparent py-1 px-2 text-right
            text-gray-600 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={installmentPeriod}
          onChange={e => setInstallmentPeriod(e.target.value)}
        > 
          <option value="Haftalık">Haftalık</option>
          <option value="Aylık" >Aylık</option>
          <option value="Yıllık" >Yıllık</option>
        </select>
      </div>
      <div className="flex justify-between items-center">
        <label htmlFor="taxRate">Vergi oranı:</label>
        <div className="relative flex items-center">
          <input
            id="taxRate"
            type="number"
            className="h-full rounded-md border bg-transparent py-1 px-4 text-right
              text-gray-600 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={taxRate}
            onChange={(e) => setTaxRate(Number(e.target.value))}
          />
          <label htmlFor="profitRate" className="absolute right-1">%</label>
        </div>
      </div>
    </form>
  );
}
