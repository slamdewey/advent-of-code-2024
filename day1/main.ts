import * as fs from 'fs';
import { join } from 'path';

type SignificantLocation = {
  id: number;
};

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

function calculateDifference(listA: SignificantLocation[], listB: SignificantLocation[]): number {
  const a = listA.slice().sort((a, b) => a.id - b.id);
  const b = listB.slice().sort((a, b) => a.id - b.id);
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

function calculateSimilarityScore(a: SignificantLocation[], b: SignificantLocation[]): number {
  const frequenciesB: number[] = [];
  b.forEach((location) => {
    const id = location.id;
    if (!frequenciesB[id]) {
      frequenciesB[id] = 0;
    }
    frequenciesB[id] += 1;
  });

  let similarityScore = 0;
  a.forEach((location) => {
    const id = location.id;
    if (!frequenciesB[id]) {
      return;
    }
    similarityScore += id * frequenciesB[id];
  });

  return similarityScore;
}

const locationIdData = fs.readFileSync(join(__dirname, '/data.txt'), 'utf8');
const locationLists = parseLocationLists(locationIdData);
const diff = calculateDifference(locationLists[0], locationLists[1]);
const similarityScore = calculateSimilarityScore(locationLists[0], locationLists[1]);

console.log(`Found ${locationLists.length} lists`);
locationLists.forEach((list, i) => {
  console.log(`List ${i}: ${list.length} items`);
});
console.log('\nResults:');
console.log(`Total difference: ${diff}`);
console.log(`Similarity score: ${similarityScore}`);
