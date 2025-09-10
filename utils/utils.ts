/**
 * sums a list of numbers
 * @param nums list of numbers to sum
 * @returns sum of the list of numbers
 */
export function sum(nums: number[]): number {
  return nums.reduce((acc, x) => x + acc, 0);
}

/**
 * finds the product of a list of numbers
 * @param nums list of numbers to find the product of
 * @returns product of the list of numbers
 */
export function product(nums: number[]): number {
  return nums.reduce((acc, x) => x * acc, 1);
}

/**
 * swaps the rows and columns of a two-dimensional list
 * 
 * [ [ 1, 2 ], [ 3, 4 ] ] => [ [ 1, 3 ], [ 2, 4 ] ]
 * @param xss two-dimensional list to transpose
 * @returns transposition of the two-dimensional list
 */
export function transpose<T>(xss: T[][]): T[][] {
  if (!xss.length) {
    return [];
  }
  const result: T[][] = [];
  for (let i = 0; i < xss[0].length; i++) {
    const row: T[] = [];
    for (let x = 0; x < xss.length; x++) {
      row.push(xss[x][i]);
    }
    result.push(row);
  }
  return result;
}

/**
 * combines the two lists into one list of tuples containing paired values from the two lists
 * 
 * if the lengths of the lists don't match, the result will have the same length as the smaller list
 * @param xs first list
 * @param ys second list
 * @returns list of pairs of values from xs and ys
 */
export function zip<A, B>(xs: A[], ys: B[]): [A, B][] {
  const result: [A, B][] = [];
  for (let i = 0; i < xs.length && i < ys.length; i++) {
    result.push([xs[i], ys[i]]);
  }
  return result;
}

/**
 * combines the two lists into one list by pairing values from the two lists and applying the function
 * 
 * if the lengths of the lists don't match, the result will have the same length as the smaller list
 * @param xs first list
 * @param ys second list
 * @param f function to zip with
 * @returns list of function results
 */
export function zipWith<A, B, C>(xs: A[], ys: B[], f: (a: A, b: B) => C): C[] {
  const result: C[] = [];
  for (let i = 0; i < xs.length && i < ys.length; i++) {
    result.push(f(xs[i], ys[i]));
  }
  return result;
}

/**
 * counts the number of times a predicate is true for the elements of a list
 * @param xs list to test on
 * @param predicate predicate to test
 * @returns number of times predicate returns true for the elements of xs
 */
export function count<T>(xs: T[], predicate: (x: T) => boolean): number {
  let n = 0;
  for (const x of xs) {
    if (predicate(x)) {
      n++;
    }
  }
  return n;
}

/**
 * accumulates a list into a single value. this function works similarly to the reduce function for lists, but can reduce to a different type
 * @param xs list to fold (reduce)
 * @param f reducer function
 * @param initialValue value to start with
 * @returns initial value if xs is empty, otherwise the result of the reduction
 */
export function fold<A, B>(xs: A[], f: (acc: B, elem: A) => B, initialValue: B): B {
  let acc = initialValue;
  for (const x of xs) {
    acc = f(acc, x);
  }
  return acc;
}

/**
 * removes duplicates from a list
 * @param xs list to remove duplicates from
 * @returns new list with duplicates removed
 */
export function distinct<A>(xs: A[]): A[] {
  return [...new Set(xs)];
}

/**
 * returns the greatest common denominator of two numbers
 * @param x first number
 * @param y second number
 * @returns greatest common denominator between x and y
 */
export function gcd(x: number, y: number): number {
  if (y === 0) {
    return x;
  }
  return gcd(y, x % y);
}