import { useLayoutEffect, useRef } from "react";
import ReactDom from "react-dom";

type Props = {
  isModalOpen: boolean;
  closeModal: () => void;
  cumulativeAmount: number;
  simpleAmount: number;
};

export default function PaymentsTable({
  isModalOpen,
  closeModal,
  cumulativeAmount,
  simpleAmount,
}: Props) {
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
    <div className="h-screen w-full bg-slate-400 absolute top-0 bottom-0">
      {cumulativeAmount}
    </div>,
    document.getElementById("modal")!
  );
}
