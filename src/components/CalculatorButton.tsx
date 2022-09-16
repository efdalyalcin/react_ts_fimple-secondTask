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
};

export type FormRef = {
  alertResult: () => void;
};

const CalculatorButton: React.ForwardRefRenderFunction<FormRef, Props> = (
  { creditAmount, profitRate, installmentPeriod, taxRate }: Props,
  ref
) => {
  const { handleCumulativeInterest } = useCumulativeInterest();
  const { handleSimpleInterest } = useSimpleInterest();
  const { installment } = useInstallment();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalAmountCumulative, setTotalAmountCumulative] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // use of useImperativeHandle, just to meet the requirements of the test
  useImperativeHandle(
    ref,
    () => {
      return {
        alertResult: () => {
          alert(
            `Basit faiz ile ödenecek toplam tutar: ${totalAmount}` + 
            `\nBileşik faiz ile ödenecek toplam tutar: ${totalAmountCumulative}` +
            `\nÖdeme tablosunu görmek için OK tuşuna basınız!`
          );
        },
      };
    },
    [totalAmountCumulative, totalAmount]
  );

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
    setTotalAmount(results.totalAmount);
    handleCumulativeInterest([...results.cumulativePayments]);
    handleSimpleInterest([...results.simplePayments]);

    if (creditAmount && profitRate && installment) {
      setIsModalOpen(true);
    }
  };

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
      />
    </>
  );
};

export default forwardRef(CalculatorButton);
