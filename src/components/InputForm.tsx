import { useCreditAmount } from "../context/creditContext";
import { useInstallment } from "../context/installmentContext";

export default function InputForm() {
  const {creditAmount, handleCreditAmount} = useCreditAmount();
  const {installment, handleInstallment} = useInstallment();

  return (
    <form className="flex flex-col gap-3 px-4 py-3 rounded-full w-1/2">
      <div className="flex justify-between items-center">
        <label htmlFor="credit">Kredi Tutarı:</label>
        <input
          id="credit"
          type="number"
          className="h-full rounded-md border bg-transparent py-1 px-2 text-right
            text-gray-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={creditAmount}
          onChange={e => handleCreditAmount(Number(e.target.value))}
        />
      </div>
      <div className="flex justify-between items-center">
        <label htmlFor="credit">Taksit Sayısı:</label>
        <input
          id="installment"
          type="number"
          className="h-full rounded-md border bg-transparent py-1 px-2 text-right
            text-gray-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={installment}
          onChange={e => handleInstallment(Number(e.target.value))}
        />
      </div>
    </form>
  );
}
