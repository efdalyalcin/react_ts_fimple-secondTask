type Props = {
  installmentData: CalculatedInterest;
};

export default function TableRow({installmentData}: Props) {
  return (
    <tr key={installmentData.installmentNumber}>
      <td>{installmentData.installmentNumber}</td>
      <td>{installmentData.eachInstalmentAmount}</td>
      <td>{installmentData.capitalPaid}</td>
      <td>{installmentData.remainingCapital}</td>
      <td>{installmentData.profitAmount}</td>
      <td>{installmentData.kkdf}</td>
      <td>{installmentData.bsmv}</td>
    </tr>
  )
}
