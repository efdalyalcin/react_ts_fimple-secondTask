type Props = {
  value: number;
  onChangeHandler: (event: number) => void;
  title: string;
  labelId: string;
};

export default function PercentInput({
  value,
  onChangeHandler,
  title,
  labelId,
}: Props) {
  return (
    <div className="flex justify-between items-center">
      <label htmlFor={labelId}>{title}</label>
      <div className="relative flex items-center">
        <input
          id={labelId}
          type="number"
          min="0"
          step=".01"
          className="h-full rounded-md border bg-transparent py-1 px-4 text-right
            text-gray-600 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={value}
          onChange={(e) => onChangeHandler(Number(e.target.value))}
        />
        <label htmlFor={labelId} className="absolute right-1">
          %
        </label>
      </div>
    </div>
  )
}
