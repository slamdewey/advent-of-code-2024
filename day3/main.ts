import * as fs from 'fs';
import { join } from 'path';

const regex = /mul\((\d+),(\d+)\)/g;

type OperationCall = {
  params: number[];
};

function parseOperations(data: string): OperationCall[] {
  const matches = data.matchAll(regex);
  const operations: OperationCall[] = [];
  for (let match of matches) {
    const op = {
      params: [+match[1], +match[2]],
    };
    operations.push(op);
  }
  return operations;
}

function findSum(operations: OperationCall[]) {
  let total = 0;
  for (let operation of operations) {
    total += operation.params[0] * operation.params[1];
  }
  return total;
}

const data = fs.readFileSync(join(__dirname, '/data.txt'), 'utf8');
const operations = parseOperations(data);
const sum = findSum(operations);

console.log(`Found ${operations.length} operations`);
console.log(`Sum: ${sum}`);
