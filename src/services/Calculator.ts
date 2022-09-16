interface CalculatorType {
  creditAmount: number;
  installment: number;
  profitRate: number;
  installmentPeriod: string;
  taxRate: number;
}

export class Calculator implements CalculatorType {
  public creditAmount;
  public installment;
  public profitRate;
  public installmentPeriod;
  public taxRate;

  constructor(
    creditAmount: number,
    installment: number,
    profitRate: number,
    installmentPeriod: string,
    taxRate: number
  ) {
    this.creditAmount = creditAmount;
    this.installment = installment;
    this.profitRate = profitRate;
    this.installmentPeriod = installmentPeriod;
    this.taxRate = taxRate;
  }

  private calculateProfit(creditAmount: number): number {
    switch (this.installmentPeriod) {
      case "Haftalık":
        return (
          Math.round(
            creditAmount * (this.profitRate * 0.01) * (7 / 30) * 100
          ) / 100
        );
      case "Yıllık":
        return (
          Math.round(
            creditAmount * (this.profitRate * 0.01) * (365 / 30) * 100
          ) / 100
        );
      default:
        return Math.round(creditAmount * (this.profitRate * 0.01) * 100) / 100;
    }
  }

  private calculateCumulativeProfit(creditAmount: number): number {
    switch (this.installmentPeriod) {
      case "Haftalık":
        return (
          Math.round(
            (creditAmount * (1 + this.profitRate * 0.01) ** (7 / 30) -
              creditAmount) * 100
          ) / 100
        );
      case "Yıllık":
        return (
          Math.round(
            (creditAmount * (1 + this.profitRate * 0.01) ** (365 / 30) -
              creditAmount) * 100
          ) / 100
        );
      default:
        return (
          Math.round(
            (creditAmount * (1 + this.profitRate * 0.01) - creditAmount) * 100
          ) / 100
        );
    }
  }

  private calculateBSMV(creditAmount: number): number {
    return (
      Math.round(
        this.calculateProfit(creditAmount) * this.taxRate * 0.01 * 100
      ) / 100
    );
  }

  private calculateCumulativeBSMV(creditAmount: number): number {
    return (
      Math.round(
        this.calculateCumulativeProfit(creditAmount) * this.taxRate * 0.01 * 100
      ) / 100
    );
  }

  private calculateKKDF(creditAmount: number): number {
    return Math.round(this.calculateBSMV(creditAmount) * 1.5 * 100) / 100;
  }

  private calculateCumulativeKKDF(creditAmount: number): number {
    return (
      Math.round(this.calculateCumulativeBSMV(creditAmount) * 1.5 * 100) / 100
    );
  }

  private calculateTotalRate(): number {
    switch (this.installmentPeriod) {
      case "Haftalık":
        return (
          this.profitRate * 0.01 * (7 / 30) +
          this.profitRate * 0.01 * this.taxRate * 0.01 * (7 / 30) +
          this.profitRate * 0.01 * this.taxRate * 0.01 * 1.5 * (7 / 30)
        );
      case "Yıllık":
        return (
          this.profitRate * 0.01 * (365 / 30) +
          this.profitRate * 0.01 * this.taxRate * 0.01 * (365 / 30) +
          this.profitRate * 0.01 * this.taxRate * 0.01 * 1.5 * (365 / 30)
        );
      default:
        return (
          this.profitRate * 0.01 +
          this.profitRate * 0.01 * this.taxRate * 0.01 +
          this.profitRate * 0.01 * this.taxRate * 0.01 * 1.5
        );
    }
  }

  private calculateCumulativeTotalRate(): number {
    switch (this.installmentPeriod) {
      case "Haftalık":
        return (
          ((1 + this.profitRate * 0.01) ** (7 / 30) - 1) +
          ((1 + this.profitRate * 0.01) ** (7 / 30) - 1) * this.taxRate * 0.01 +
          ((1 + this.profitRate * 0.01) ** (7 / 30) - 1) * this.taxRate * 0.01 * 1.5
        );
      case "Yıllık":
        return (
          ((1 + this.profitRate * 0.01) ** (365 / 30) - 1) +
          ((1 + this.profitRate * 0.01) ** (365 / 30) - 1) * this.taxRate * 0.01 +
          ((1 + this.profitRate * 0.01) ** (365 / 30) - 1) * this.taxRate * 0.01 * 1.5
        );
      default:
        return (
          this.profitRate * 0.01 +
          this.profitRate * 0.01 * this.taxRate * 0.01 +
          this.profitRate * 0.01 * this.taxRate * 0.01 * 1.5
        );
    }
  }

  private calculateCapitalPaid(
    eachPayment: number,
    profitAmount: number,
    kkdf: number,
    bsmv: number
  ): number {
    return Math.round((eachPayment - profitAmount - kkdf - bsmv) * 100) / 100;
  }

  public calculatePayment() {
    if (this.creditAmount && this.installment) {
      const totalRate = this.calculateTotalRate();
      const devided = totalRate * (1 + totalRate) ** this.installment;
      const devider = (1 + totalRate) ** this.installment - 1;

      const cumTotalRate = this.calculateCumulativeTotalRate();
      const cumDevided = cumTotalRate * (1 + cumTotalRate) ** this.installment;
      const cumDevider = (1 + cumTotalRate) ** this.installment - 1;

      const eachInstallmentPayment =
        Math.round(this.creditAmount * (devided / devider) * 100) / 100;

      const cumulativeEachPayment =
        Math.round(this.creditAmount * (cumDevided / cumDevider) * 100) / 100;

      let totalStandingCredit = this.creditAmount;
      let cumulativeTotalStandingCredit = this.creditAmount;

      const interestArray = [];
      const cumulativeInterestArray = [];

      for (let i = 0; i < this.installment; i++) {
        if (i === 0) {
          // simple interest calculation
          const paidAmount = this.calculateCapitalPaid(
            eachInstallmentPayment,
            this.calculateProfit(totalStandingCredit),
            this.calculateKKDF(totalStandingCredit),
            this.calculateBSMV(totalStandingCredit)
          );

          const firstPayment: CalculatedInterest = {
            installmentNumber: 1,
            eachInstalmentAmount: eachInstallmentPayment,
            capitalPaid: paidAmount,
            remainingCapital:
              Math.ceil((totalStandingCredit - paidAmount) * 100) / 100,
            profitAmount: this.calculateProfit(totalStandingCredit),
            kkdf: this.calculateKKDF(totalStandingCredit),
            bsmv: this.calculateBSMV(totalStandingCredit),
          };

          // cumulative interest calculation
          const cumulativePaidAmount = this.calculateCapitalPaid(
            cumulativeEachPayment,
            this.calculateCumulativeProfit(cumulativeTotalStandingCredit),
            this.calculateCumulativeKKDF(cumulativeTotalStandingCredit),
            this.calculateCumulativeBSMV(cumulativeTotalStandingCredit)
          );

          const cumulativeFirstPayment: CalculatedInterest = {
            installmentNumber: 1,
            eachInstalmentAmount: cumulativeEachPayment,
            capitalPaid: cumulativePaidAmount,
            remainingCapital:
              Math.ceil(
                (cumulativeTotalStandingCredit - cumulativePaidAmount) * 100
              ) / 100,
            profitAmount: this.calculateCumulativeProfit(
              cumulativeTotalStandingCredit),
            kkdf: this.calculateCumulativeKKDF(cumulativeTotalStandingCredit),
            bsmv: this.calculateCumulativeBSMV(cumulativeTotalStandingCredit),
          };

          totalStandingCredit =
            Math.ceil((totalStandingCredit - paidAmount) * 100) / 100;

          cumulativeTotalStandingCredit =
            Math.ceil(
              (cumulativeTotalStandingCredit - cumulativePaidAmount) * 100
            ) / 100;

          interestArray.push(firstPayment);
          cumulativeInterestArray.push(cumulativeFirstPayment);
        } else {
          // simple interest calculation
          const paidAmount = this.calculateCapitalPaid(
            eachInstallmentPayment,
            this.calculateProfit(totalStandingCredit),
            this.calculateKKDF(totalStandingCredit),
            this.calculateBSMV(totalStandingCredit)
          );

          const payments: CalculatedInterest = {
            installmentNumber: i + 1,
            eachInstalmentAmount: eachInstallmentPayment,
            capitalPaid: paidAmount,
            remainingCapital:
              Math.ceil((totalStandingCredit - paidAmount) * 100) / 100,
            profitAmount: this.calculateProfit(totalStandingCredit),
            kkdf: this.calculateKKDF(totalStandingCredit),
            bsmv: this.calculateBSMV(totalStandingCredit),
          };

          totalStandingCredit =
            Math.ceil((totalStandingCredit - paidAmount) * 100) / 100;

          interestArray.push(payments);

          // cumulative interest calculation
          const cumulativePaidAmount = this.calculateCapitalPaid(
            cumulativeEachPayment,
            this.calculateCumulativeProfit(cumulativeTotalStandingCredit),
            this.calculateCumulativeKKDF(cumulativeTotalStandingCredit),
            this.calculateCumulativeBSMV(cumulativeTotalStandingCredit)
          );

          const cumulativePayments: CalculatedInterest = {
            installmentNumber: i + 1,
            eachInstalmentAmount: cumulativeEachPayment,
            capitalPaid: cumulativePaidAmount,
            remainingCapital:
              Math.ceil(
                (cumulativeTotalStandingCredit - cumulativePaidAmount) * 100
              ) / 100,
            profitAmount: this.calculateCumulativeProfit(
              cumulativeTotalStandingCredit),
            kkdf: this.calculateCumulativeKKDF(cumulativeTotalStandingCredit),
            bsmv: this.calculateCumulativeBSMV(cumulativeTotalStandingCredit),
          };

          cumulativeTotalStandingCredit =
            Math.ceil(
              (cumulativeTotalStandingCredit - cumulativePaidAmount) * 100
            ) / 100;

          cumulativeInterestArray.push(cumulativePayments);
        }
      }

      const lastInstallment = interestArray[interestArray.length - 1];
      lastInstallment.remainingCapital = 0;
      interestArray[interestArray.length - 1] = lastInstallment;

      const cumulativeLastInstallment = 
      cumulativeInterestArray[cumulativeInterestArray.length - 1];

      cumulativeLastInstallment.capitalPaid =
        Math.round(
          (cumulativeLastInstallment.capitalPaid +
            cumulativeLastInstallment.remainingCapital) * 100
        ) / 100;

      cumulativeLastInstallment.remainingCapital = 0;

      cumulativeInterestArray[cumulativeInterestArray.length - 1] = 
        cumulativeLastInstallment;

      const totalAmount =
        Math.round(eachInstallmentPayment * this.installment * 100) / 100;

      const totalAmountCumulative =
        Math.round(cumulativeEachPayment * this.installment * 100) / 100;

      return {
        cumulativePayments: cumulativeInterestArray,
        simplePayments: interestArray,
        totalAmount,
        totalAmountCumulative,
      };
    } else {
      return {
        cumulativePayments: [],
        simplePayments: [],
        totalAmount: 0,
        totalAmountCumulative: 0,
      };
    }
  }
}
