class PerformanceCalculator {
  // 공연료 계산기 클래스
  constructor(aPerformance, aPlay) {
    this.performance = aPerformance;
    this.play = aPlay;
  }

  get amount() {
    // amountFor() 함수의 코드를 계산기 클래스로 복사
    let result = 0;
    switch (
      this.play.type // amountFor() 함수가 매개변수로 받던 정보를 계산기 필드에서 바로 얻기
    ) {
      case "tragedy":
        result = 40000;
        if (this.performance.audience > 30) {
          // amountFor() 함수가 매개변수로 받던 정보를 계산기 필드에서 바로 얻기
          result += 1000 * (this.performance.audience - 30);
        }
        break;
      case "comedy":
        result = 30000;
        if (this.performance.audience > 20) {
          result += 10000 + 500 * (this.performance.audience - 20);
        }
        result += 300 * this.performance.audience;
        break;
      default:
        throw new Error(`알 수 없는 장르: ${playFor(this.performance).type}`);
    }
    return result;
  }

  get volumeCredits() {
    let result = 0;

    result += Math.max(this.performance.audience - 30, 0);
    if ("comedy" === this.play.type)
      result += Math.floor(this.performance.audience / 5);

    return result;
  }
}

export default function createStatementData(invoice, plays) {
  const statementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData);

  return statementData;

  // statementData를 정제하는 util함수들
  function enrichPerformance(aPerformance) {
    const calculator = new PerformanceCalculator(
      aPerformance,
      playFor(aPerformance)
    ); // 공연료 계산기 생성
    const result = Object.assign({}, aPerformance);
    result.play = calculator.play; // playFor 대신 계산기의 play 프로퍼티 이용
    result.amount = calculator.amount; // amountFor 대신 계산기의 amount메서드 이용
    result.volumeCredits = calculator.volumeCredits; // volumeCreditsFor() 대신 계산기의 volumeCredits이용
    return result;
  }
  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }
  function amountFor(aPerformance) {
    return new PerformanceCalculator(aPerformance, playFor(aPerformance))
      .amount;
  }
  function volumeCreditsFor(aPerformance) {
    return new PerformanceCalculator(aPerformance, playFor(aPerformance))
      .volumeCredits;
  }
  function totalVolumeCredits() {
    return statementData.performances.reduce(
      (total, p) => total + p.volumeCredits,
      0
    );
  }
  function totalAmount() {
    return statementData.performances.reduce((total, p) => total + p.amount, 0);
  }
}
