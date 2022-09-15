import { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import { useCumulativeInterest } from "../context/cumulativeInterestContext";
import { useInstallment } from "../context/installmentContext";
import { useSimpleInterest } from "../context/simpleInterestContext";
import { Calculator } from "../services/Calculator";
import PaymentsTable from "./PaymentsTable";

type Props = {
  creditAmount: number;
  profitRate: number;
  installmentPeriod: string;
  taxRate: number;
}

function CalculatorButton<React, forwardRef>({
  creditAmount,
  profitRate,
  installmentPeriod,
  taxRate,
}: Props, ref: React.MutableRefObject<{}>) {
  const { handleCumulativeInterest } = useCumulativeInterest();
  const { handleSimpleInterest} = useSimpleInterest();
  const { installment } = useInstallment();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalAmountCumulative, setTotalAmountCumulative] = 
    useState(0);
  const [totalAmountSimple, setTotalAmountSimple] = 
    useState(0);

  const closeModal = useCallback(
    () => {setIsModalOpen(false)},
    []
  );

  useImperativeHandle(ref, () => {
    return {
      alertResult: () => {}
    }
  }, []);

  const handleClick = () => {
    const calculationResults = new Calculator(
      creditAmount,
      installment,
      profitRate,
      installmentPeriod,
      taxRate
    );

    const results = calculationResults.calculatePayment();

    setTotalAmountCumulative(results.totalAmountCumulative);
    setTotalAmountSimple(results.totalAmountSimple);
    handleCumulativeInterest([...results.cumulativePayments]);
    handleSimpleInterest([...results.simplePayments]);
    setIsModalOpen(true);
  }

  return (
    <>
      <button 
        type="submit" 
        className="border rounded-md p-2 bg-gray-200"
        onClick={handleClick}
      >
        Hesapla
      </button>
      <PaymentsTable 
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        cumulativeAmount={totalAmountCumulative}
        simpleAmount={totalAmountSimple}
      />
    </>
  )
}

export default forwardRef(CalculatorButton);