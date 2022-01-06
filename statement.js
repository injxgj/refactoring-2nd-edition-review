import plays from './plays.json';
import invoices from './invoices.json';

function statement() {
  let totalAmount = 0;
  let volumeCredits = 0;

  let result = `청구 내역 (고객명: ${invoices.customer}\n)`;

  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }

  function amountFor(aPerformance) {
    let result = 0;
    switch (playFor(aPerformance).type) {
      case 'tragedy':
        result = 40000;
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30);
        }
        break;
      case 'comedy':
        result = 30000;
        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 20);
        }
        result += 300 * aPerformance.audience;
        break;
      default:
        throw new Error(`알 수 없는 장르: ${playFor(aPerformance).type}`);
    }
    return result;
  }

  function volumeCreditsFor(aPerformance) {
    let result = 0; //

    result += Math.max(aPerformance.audience - 30, 0);
    if ('comedy' === playFor(aPerformance).type) result += Math.floor(aPerformance.audience / 5);

    return result;
  }

  function formatAsUSD(aNumber) {
    // 임시 변수를 질의 함수로 바꾸기
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(aNumber);
  }

  for (let perf of invoices.performances) {
    let thisAmount = amountFor(perf);

    volumeCredits += volumeCreditsFor(perf);

    result += ` ${playFor(perf).name}: ${formatAsUSD(thisAmount / 100)} (${perf.audience}석)\n`;
    totalAmount += thisAmount;
  }
  result += `총액: ${formatAsUSD(totalAmount / 100)}\n`; // 임시 변수를 질의 함수로 바꾸기
  result += `적립 포인트:${volumeCredits}점\n`;
  return result;
}

// console.log(statement(JSON.parse(invoices), JSON.parse(plays)));
console.log(statement());
