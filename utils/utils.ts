export function sum(nums: number[]): number {
    return nums.reduce((acc, x) => x + acc);
}

export function product(nums: number[]): number {
    return nums.reduce((acc, x) => x * acc);
}