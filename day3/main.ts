import * as fs from 'fs';
import { join } from 'path';

const regex = /do\(\)|don't\(\)|mul\((\d+),(\d+)\)/g;

type OperationCall = {
  name: 'do' | "don't" | 'mul';
  params?: any[];
};

function parseOperations(data: string): OperationCall[] {
  const matches = data.matchAll(regex);
  const operations: OperationCall[] = [];
  for (let match of matches) {
    switch (match[0]) {
      case 'do()':
      case "don't()":
        operations.push({
          name: match[0].substring(0, match[0].indexOf('(')) as 'do' | "don't",
        });
        break;
      default:
        if (match[0].startsWith('mul')) {
          operations.push({
            name: 'mul',
            params: [+match[1], +match[2]],
          });
        }
        break;
    }
  }
  return operations;
}

function findSum(operations: OperationCall[]) {
  let enabled = 1;
  let total = 0;
  for (let operation of operations) {
    switch (operation.name) {
      case 'do':
        enabled = 1;
        break;
      case "don't":
        enabled = 0;
        break;
      case 'mul':
        if (!operation.params || operation.params.length < 2) {
          throw new Error('Tried to process invalid operation');
        }
        total += operation.params[0] * operation.params[1] * enabled;
        break;
    }
  }
  return total;
}

const data = fs.readFileSync(join(__dirname, '/data.txt'), 'utf8');
const operations = parseOperations(data);
const sum = findSum(operations);

console.log(`Found ${operations.length} operations`);
console.log(`Sum: ${sum}`);
