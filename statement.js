import plays from './plays.json';
import invoice from './invoices.json';

import createStatementData from './createStatementData.js';

function statement() {
  return renderPlainText(createStatementData(invoice, plays)); // 필요없어진 인수 제거
}

function renderPlainText(statementData) {
  let result = `청구 내역 (고객명: ${statementData.customer}\n)`;

  function volumeCreditsFor(aPerformance) {
    let result = 0; //

    result += Math.max(aPerformance.audience - 30, 0);
    if ('comedy' === aPerformance.play.type) result += Math.floor(aPerformance.audience / 5);

    return result;
  }

  function formatAsUSD(aNumber) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(aNumber);
  }

  // 청구내역을 출력합니다.
  for (let perf of statementData.performances) {
    result += ` ${perf.play.name}: ${formatAsUSD(perf.amount)} (${perf.audience}석)\n`;
  }

  result += `총액: ${formatAsUSD(statementData.totalAmount)}\n`;
  result += `적립 포인트:${statementData.totalVolumeCredits}점\n`;
  return result;
}

console.log(statement());
