type Props = {
  value: number;
  onChangeHandler: (event: number) => void;
  title: string;
};

export default function AmountInput({
  value,
  onChangeHandler,
  title,
}: Props) {
  return (
    <div className="flex justify-between items-center">
      <label htmlFor="amountInput">{title}</label>
      <input
        id="amountInput"
        type="number"
        min="0"
        className="h-full rounded-md border bg-transparent py-1 px-4 text-right
          text-gray-600 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        value={value}
        onChange={(e) => onChangeHandler(Number(e.target.value))}
      />
    </div>
  )
}