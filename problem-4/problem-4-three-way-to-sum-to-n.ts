/**
 * Three different implementations of sum_to_n function
 * Each with different time and space complexity characteristics
 */

// Implementation 1: Iterative approach using a for loop
// Time Complexity: O(n) - linear time as we iterate through n numbers
// Space Complexity: O(1) - constant space, only using a single variable for sum
function sum_to_n_iterative(n: number): number {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
}

// Implementation 2: Mathematical formula approach (Gauss formula)
// Time Complexity: O(1) - constant time, direct calculation
// Space Complexity: O(1) - constant space, no additional variables needed
// This is the most efficient approach for large values of n
function sum_to_n_formula(n: number): number {
    return (n * (n + 1)) / 2;
}

// Implementation 3: Recursive approach
// Time Complexity: O(n) - linear time due to n recursive calls
// Space Complexity: O(n) - linear space due to call stack (each recursive call uses stack space)
// This is the least efficient approach due to function call overhead and stack usage
function sum_to_n_recursive(n: number): number {
    if (n <= 0) {
        return 0;
    }
    if (n === 1) {
        return 1;
    }
    return n + sum_to_n_recursive(n - 1);
}

// Example usage and testing
console.log("Testing sum_to_n implementations with n = 5:");
console.log("Iterative:", sum_to_n_iterative(5)); // Expected: 15
console.log("Formula:", sum_to_n_formula(5));     // Expected: 15
console.log("Recursive:", sum_to_n_recursive(5)); // Expected: 15

console.log("\nTesting with n = 10:");
console.log("Iterative:", sum_to_n_iterative(10)); // Expected: 55
console.log("Formula:", sum_to_n_formula(10));     // Expected: 55
console.log("Recursive:", sum_to_n_recursive(10)); // Expected: 55
