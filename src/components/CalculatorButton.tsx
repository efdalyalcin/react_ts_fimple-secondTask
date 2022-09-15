import { useRef } from "react";
import { useCumulativeInterest } from "../context/cumulativeInterestContext";
import { useInstallment } from "../context/installmentContext";
import { useSimpleInterest } from "../context/simpleInterestContext";
import { Calculator } from "../services/Calculator";

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
  const { handleCumulativeInterest } = useCumulativeInterest();
  const { handleSimpleInterest} = useSimpleInterest();
  const { installment } = useInstallment();

  const totalAmountCumulative = useRef(0);
  const totalAmountSimple = useRef(0);
  
  const handleClick = () => {
    const calculationResults = new Calculator(
      creditAmount,
      installment,
      profitRate,
      installmentPeriod,
      taxRate
    );

    const results = calculationResults.calculatePayment();

    totalAmountCumulative.current = results.totalAmountCumulative;
    totalAmountSimple.current = results.totalAmountSimple;

    handleCumulativeInterest([...results.cumulativePayments]);
    handleSimpleInterest([...results.simplePayments])
  }

  return (
    <button 
      type="submit" 
      className="border rounded-md p-2 bg-gray-200"
      onClick={handleClick}
    >
      Hesapla
    </button>
  )
}
