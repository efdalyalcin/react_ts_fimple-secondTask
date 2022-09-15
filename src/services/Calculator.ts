interface CalculatorType {
  creditAmount: number;
  installment: number;
  profitRate: number;
  installmentPeriod: string;
  taxRate: number;
}

export class Calculator implements CalculatorType{
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
    taxRate: number,
  ) {
    this.creditAmount = creditAmount;
    this.installment = installment;
    this.profitRate = profitRate;
    this.installmentPeriod = installmentPeriod;
    this.taxRate = taxRate;
  }

  private calculateBSMV(): number {
    switch (this.installmentPeriod) {
      case "Haftalık":
        return (
          Math.round(this.creditAmount * this.profitRate * 0.01 
            * this.taxRate * 0.01 * 100 * (7/30)) / 100
        );
      case "Yıllık":
        return (
          Math.round(this.creditAmount * this.profitRate * 0.01 
            * this.taxRate * 0.01 * 100 * (365/30)) / 100
        );
      default:
        return Math.round(this.creditAmount * this.profitRate * 0.01 
          * this.taxRate * 0.01 * 100) / 100;
    }
  }

  private calculateKKDF(): number {
    switch (this.installmentPeriod) {
      case "Haftalık":
        return (
          Math.round(this.creditAmount * this.profitRate * 0.01 
            * this.taxRate * 0.01 * 1.5 * 100 * (7/30)) / 100
        );
      case "Yıllık":
        return (
          Math.round(this.creditAmount * this.profitRate * 0.01 
            * this.taxRate * 0.01 * 1.5 * 100 * (365/30)) / 100
        );
      default:
        return Math.round(this.creditAmount * this.profitRate * 0.01 
          * this.taxRate * 0.01 * 1.5 * 100) / 100;
    }
  }

  private calculateProfit(): number {
    switch (this.installmentPeriod) {
      case "Haftalık":
        return (
          Math.round(this.creditAmount * this.profitRate *
            0.01 * (7 / 30) * 100) / 100
        );
      case "Yıllık":
        return (
          Math.round(this.creditAmount * this.profitRate * 
            0.01 * (365 / 30) * 100) /
          100
        );
      default:
        return (
          Math.round(this.creditAmount * this.profitRate * 
            0.01 * 100) / 100
        );
    }
  }

  private calculateSimpleProfit(): number {
    switch (this.installmentPeriod) {
      case "Haftalık":
        return (
          Math.round(this.creditAmount * this.profitRate *
            0.01 * (7 / 30) / this.installment * 100) / 100
        );
      case "Yıllık":
        return (
          Math.round(this.creditAmount * this.profitRate * 
            0.01 * (365 / 30) / this.installment * 100) / 100
        );
      default:
        return (
          Math.round(this.creditAmount * this.profitRate * 
            0.01 / this.installment * 100) / 100
        );
    }
  }

  private calculateTotalRate() : number {
    switch (this.installmentPeriod) {
      case "Haftalık":
        return (
          this.profitRate * 0.01 * (7/30) +
          this.profitRate * 0.01 * this.taxRate * 0.01 * (7/30)+
          this.profitRate * 0.01 * this.taxRate * 0.01 * 1.5 * (7/30)
        );
      case "Yıllık":
        return (
          this.profitRate * 0.01 * (365/30) +
          this.profitRate * 0.01 * this.taxRate * 0.01 * (365/30)+
          this.profitRate * 0.01 * this.taxRate * 0.01 * 1.5 * (365/30)
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
  
      const eachInstallmentPayment =
        Math.round(this.creditAmount * (devided / devider) * 100) / 100;

      const simpleEachPayment = (
        Math.round(((this.creditAmount * this.calculateTotalRate()) + 
          this.creditAmount) / this.installment * 100) / 100
      );
  
      let totalStandingCredit = this.creditAmount;
      let simpleTotalStandingCredit = this.creditAmount;

      const cumulativeArr = [];
      const simpleArr = []; 
  
      for (let i = 0; i < this.installment; i++) {
        if (i === 0) {
          // cumulative interest calculation
          const paidAmount = this.calculateCapitalPaid(
            eachInstallmentPayment,
            this.calculateProfit(),
            this.calculateKKDF(),
            this.calculateBSMV()
          );
  
          const firstPayment: CalculatedInterest = {
            installmentNumber: 1,
            eachInstalmentAmount: eachInstallmentPayment,
            capitalPaid: paidAmount,
            remainingCapital: Math.ceil((this.creditAmount - paidAmount) * 100) / 100,
            profitAmount: this.calculateProfit(),
            kkdf: this.calculateKKDF(),
            bsmv: this.calculateBSMV(),
          };

          // simple interest calculation
          const simplePaidAmount = this.calculateCapitalPaid(
            simpleEachPayment,
            (this.calculateProfit() / this.installment),
            this.calculateKKDF(),
            this.calculateBSMV()
          );

          const simpleFirstPayment: CalculatedInterest = {
            installmentNumber: 1,
            eachInstalmentAmount: simpleEachPayment,
            capitalPaid: simplePaidAmount,
            remainingCapital: Math.ceil(
              (this.creditAmount - simplePaidAmount) * 100) / 100,
            profitAmount: this.calculateSimpleProfit(),
            kkdf: this.calculateKKDF(),
            bsmv: this.calculateBSMV(),
          };
          totalStandingCredit = 
            Math.ceil((this.creditAmount - paidAmount) * 100) / 100;
          simpleTotalStandingCredit = 
            Math.ceil((this.creditAmount - simplePaidAmount) * 100) / 100;

          cumulativeArr.push(firstPayment);
          simpleArr.push(simpleFirstPayment)
        } else {
          // cumulative interest calculation
          const paidAmount = this.calculateCapitalPaid(
            eachInstallmentPayment,
            this.calculateProfit(),
            this.calculateKKDF(),
            this.calculateBSMV()
          );
  
          const payments: CalculatedInterest = {
            installmentNumber: i + 1,
            eachInstalmentAmount: eachInstallmentPayment,
            capitalPaid: paidAmount,
            remainingCapital:
              Math.ceil((totalStandingCredit - paidAmount) * 100) / 100,
            profitAmount: this.calculateProfit(),
            kkdf: this.calculateKKDF(),
            bsmv: this.calculateBSMV(),
          };
  
          totalStandingCredit =
            Math.ceil((totalStandingCredit - paidAmount) * 100) / 100;
          cumulativeArr.push(payments);

          // simple interest calculation
          const simplePaidAmount = this.calculateCapitalPaid(
            simpleEachPayment,
            this.calculateSimpleProfit(),
            this.calculateKKDF(),
            this.calculateBSMV()
          );

          const simplePayments: CalculatedInterest = {
            installmentNumber: i + 1,
            eachInstalmentAmount: simpleEachPayment,
            capitalPaid: simplePaidAmount,
            remainingCapital: Math.ceil(
              (simpleTotalStandingCredit - simplePaidAmount) * 100) / 100,
            profitAmount: this.calculateSimpleProfit(),
            kkdf: this.calculateKKDF(),
            bsmv: this.calculateBSMV(),
          };

          simpleTotalStandingCredit = Math.ceil(
            (simpleTotalStandingCredit - simplePaidAmount) * 100) / 100;

          simpleArr.push(simplePayments);
        }
      }
  
      const lastInstallment = cumulativeArr[cumulativeArr.length - 1];
      lastInstallment.remainingCapital = 0;
      cumulativeArr[cumulativeArr.length - 1] = lastInstallment;

      const simpleLastInstallment = simpleArr[simpleArr.length - 1];
      simpleLastInstallment.capitalPaid = Math.round(
        (simpleLastInstallment.capitalPaid + simpleLastInstallment.remainingCapital) *
        100) / 100;
      simpleLastInstallment.remainingCapital = 0;
      simpleArr[simpleArr.length - 1] = simpleLastInstallment;

      const totalAmountSimple = Math.round(
        (simpleEachPayment * (this.installment - 1) +
         simpleLastInstallment.capitalPaid) * 100
      ) / 100;
      const totalAmountCumulative = Math.round(
        eachInstallmentPayment * this.installment * 100
      ) / 100;

      return {
        cumulativePayments: cumulativeArr,
        simplePayments: simpleArr,
        totalAmountSimple,
        totalAmountCumulative,
      }
    } else {
      return {
        cumulativePayments: [],
        simplePayments: [],
        totalAmountSimple: 0,
        totalAmountCumulative: 0,
      };
    }
  }
}