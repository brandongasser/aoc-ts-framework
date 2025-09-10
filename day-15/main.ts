import { readFileSync } from 'fs';
import { parse } from './parser';
import { part1 } from './part-1';
import { part2 } from './part-2';

function main() {
  const input = readFileSync('inputs/day-15.txt').toString();
  try {
    const startTime = Date.now();
    const part1Input = parse(input, 1);
    const part1Answer = part1(part1Input);
    const endTime = Date.now();
    console.log(`Day 15 Part 1 Answer: ${part1Answer}`);
    console.log(`Day 15 Part 1 Run Time: ${endTime - startTime}ms`);
  } catch (e: any) {
    if (e.message !== 'Not Implemented') {
      console.log(e);
    }
  }
  try {
    const startTime = Date.now();
    const part2Input = parse(input, 2);
    const part2Answer = part2(part2Input);
    const endTime = Date.now();
    console.log(`Day 15 Part 2 Answer: ${part2Answer}`);
    console.log(`Day 15 Part 2 Run Time: ${endTime - startTime}ms`);
  } catch (e: any) {
    if (e.message !== 'Not Implemented') {
      console.log(e);
    }
  }
}

main();