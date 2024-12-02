import * as fs from 'fs';
import { join } from 'path';
import { SignificantLocation } from './types';

const locationIdData = fs.readFileSync(join(__dirname, '/data.txt'), 'utf8');

function parseLocationLists(data: string): SignificantLocation[][] {
  // split by newlines
  const rows: string[] = data.split(/[\r\n]+/);

  const locationLists: SignificantLocation[][] = [];
  rows.forEach((row, rowIndex) => {
    // spit to item
    const locationIds: string[] = row.split(/[ ]+/);
    locationIds.forEach((id, columnIndex) => {
      if (!locationLists[columnIndex]) {
        locationLists[columnIndex] = [];
      }
      locationLists[columnIndex][rowIndex] = { id: +id };
    });
  });
  return locationLists;
}

function calculateDifferenceBetweenLocationLists(a: SignificantLocation[], b: SignificantLocation[]): number {
  if (a.length != b.length) {
    return -1;
  }
  let totalDifference = 0;
  a.forEach((locationA, i) => {
    const locationB = b[i];
    totalDifference += Math.abs(locationA.id - locationB.id);
  });
  return totalDifference;
}

const locationLists = parseLocationLists(locationIdData);
const listA = locationLists[0].sort((a, b) => a.id - b.id);
const listB = locationLists[1].sort((a, b) => a.id - b.id);
const diff = calculateDifferenceBetweenLocationLists(listA, listB);
console.log(listA, listB);
console.log(diff);
