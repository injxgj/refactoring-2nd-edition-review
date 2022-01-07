import plays from './plays.json' assert { type: 'json' };
import invoice from './invoices.json' assert { type: 'json' };

import createStatementData from './createStatementData.js';

function statement() {
  return renderPlainText(createStatementData(invoice, plays)); // 필요없어진 인수 제거
}

function renderPlainText(statementData) {
  let result = `청구 내역 (고객명: ${statementData.customer}\n)`;

  // 청구내역을 출력합니다.
  for (let perf of statementData.performances) {
    result += ` ${perf.play.name}: ${formatAsUSD(perf.amount)} (${perf.audience}석)\n`;
  }

  result += `총액: ${formatAsUSD(statementData.totalAmount)}\n`;
  result += `적립 포인트:${statementData.totalVolumeCredits}점\n`;
  return result;
}

function htmlStatement() {
  return renderHtml(createStatementData(invoice, plays));
}

function renderHtml(data) {
  let result = `<h1>청구 내역 (고객명: ${data.customer})</h1>\n`;
  result += '<table>\n';
  result += '<tr><th>연극</th><th>좌석 수</th><th>금액</th></tr>';
  for (let perf of data.performances) {
    result += ` <tr><td>${perf.play.name}</td><td>(${perf.audience}석)</td>`;
    result += `<td>${formatAsUSD(perf.amount)}</td></tr>\n`;
  }
  result += '</table>\n';
  result += `<p>총액: <em>${formatAsUSD(data.totalAmount)}</em></p>\n`;
  result += `<p>적립 포인트: <em>${data.totalVolumeCredits}</em>점</p>\n`;
  return result;
}

function formatAsUSD(aNumber) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(aNumber);
}

const htmlObject = document.createElement('div');
htmlObject.innerHTML = htmlStatement();
document.querySelector('.index').appendChild(htmlObject);
console.log(statement());
