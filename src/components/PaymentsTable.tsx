import { useLayoutEffect, useRef } from "react";
import ReactDom from "react-dom";
import { useCumulativeInterest } from "../context/cumulativeInterestContext";
import { useSimpleInterest } from "../context/simpleInterestContext";
import TableRow from "./TableRow";

type Props = {
  isModalOpen: boolean;
  closeModal: () => void;
};

export default function PaymentsTable({
  isModalOpen,
  closeModal,
}: Props) {
  const { cumulativeInterest } = useCumulativeInterest();
  const { simpleInterest } = useSimpleInterest();

  const menuRef = useRef<HTMLDivElement>();

  // mouse click outside handler
  const handleClick = (e: MouseEvent) => {
    if (menuRef.current && menuRef.current.contains(e.target as HTMLElement)) {
      return;
    }
    closeModal();
  };

  useLayoutEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  if (!isModalOpen) {
    return null;
  }

  return ReactDom.createPortal(
    <div className="w-full bg-slate-300 absolute top-0 flex 
      flex-col items-center gap-2 p-6"
    >
      <h2 className="font-bold text-xl">Bileşik Faiz Ödeme Tablosu</h2>
      <table>
        <thead>
          <tr>
            <th>Taksit No</th>
            <th>Taksit Tutarı</th>
            <th>Ana Para</th>
            <th>Kalan Ana Para</th>
            <th>Kâr Tutarı</th>
            <th>KKDF</th>
            <th>BSMV</th>
          </tr>
        </thead>
        <tbody>
          {cumulativeInterest.map(installment => (
            installment && (<TableRow installmentData={installment} key={installment.installmentNumber}/>)
          ))}
        </tbody>
      </table>
      <br />
      <h2 className="font-bold text-xl">Basit Faiz Ödeme Tablosu</h2>
      <table>
        <thead>
          <tr>
            <th>Taksit No</th>
            <th>Taksit Tutarı</th>
            <th>Ana Para</th>
            <th>Kalan Ana Para</th>
            <th>Kâr Tutarı</th>
            <th>KKDF</th>
            <th>BSMV</th>
          </tr>
        </thead>
        <tbody>
          {simpleInterest.map(installment => (
            installment && (<TableRow installmentData={installment} key={installment.installmentNumber}/>)
          ))}
        </tbody>
      </table>
    </div>,
    document.getElementById("modal")!
  );
}
