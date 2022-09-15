import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from "react";
import ReactDom from "react-dom";

type Props = {
  isModalOpen: boolean;
  closeModal: () => void;
  cumulativeAmount: number;
  simpleAmount: number;
};

export default function PaymentsTable({ isModalOpen, closeModal }: Props) {
  const menuRef = useRef<HTMLDivElement>();

  // useImperativeHandle(ref, () => {
  //   return {
  //     value: false,
  //     closeModal: () => {ref.current = false }
  //   }
  // }, []);

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
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sequi laudantium ut, ipsa fuga cumque non eum commodi incidunt enim tenetur rem vitae saepe veniam ducimus repellat! Aliquid quas beatae quia, atque cum enim nostrum vero dolor dolorem officiis sit aliquam vitae! Necessitatibus quis suscipit, veritatis laboriosam obcaecati repellendus eligendi quaerat?
    </div>,
    document.getElementById("modal")!
  );
}
