import * as fs from 'fs';
import { join } from 'path';

type Report = {
  data: number[];
};

function parseReports(data: String): Report[] {
  // split by newlines
  const rows: string[] = data.split(/[\r\n]+/);

  const reports: Report[] = [];
  rows.forEach((row, i) => {
    // spit to item
    const reportData: number[] = row.split(/[ ]+/).map((s) => +s);
    reports[i] = { data: reportData };
  });
  return reports;
}

function isReportSafe(report: Report): boolean {
  const isIncreasing = (a: number, b: number) => a < b;
  if (report.data.length < 2) {
    return false;
  }

  let isAscending = undefined;
  for (let i = 1; i < report.data.length; i++) {
    const a = report.data[i - 1];
    const b = report.data[i];
    if (a === b || Math.abs(a - b) > 3) {
      return false;
    }
    if (isAscending === undefined) {
      isAscending = isIncreasing(a, b);
    } else if (isAscending !== isIncreasing(a, b)) {
      return false;
    }
  }

  return true;
}

function dampenProblem(report: Report): Report {
  if (isReportSafe(report)) {
    return report;
  }
  // try to fix report
  for (let i = 0; i < report.data.length; i++) {
    const newData = report.data.slice();
    newData.splice(i, 1);
    const newReport = { data: newData };
    if (isReportSafe(newReport)) {
      return newReport;
    }
  }
  // return original report as failure (this report will fail evaluation)
  return report;
}

function countSafeReports(reports: Report[], reportPreparingFn?: (report: Report) => Report) {
  let numSafeReports = 0;
  reports.forEach((report) => {
    const preparedReport = reportPreparingFn ? reportPreparingFn(report) : report;
    if (isReportSafe(preparedReport)) {
      numSafeReports++;
    }
  });
  return numSafeReports;
}

const data = fs.readFileSync(join(__dirname, '/data.txt'), 'utf8');
const reports = parseReports(data);
const numSafeReports = countSafeReports(reports, dampenProblem);

console.log(`Found ${reports.length} reports`);
console.log(`Number of safe reports: ${numSafeReports}`);
