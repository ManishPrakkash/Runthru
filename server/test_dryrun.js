// Test script for dry run functionality
const gptHelper = require('./utils/gptHelper');

async function testDryRun() {
  console.log('🧪 Testing Dry Run Feature...\n');

  // Test 1: Simple array sum
  console.log('Test 1: Array Sum');
  const arraySumCode = `
def arraySum(arr):
    total = 0
    for i in range(len(arr)):
        total += arr[i]
    return total

print(arraySum([1, 2, 3, 4, 5]))
  `;

  try {
    const result1 = await gptHelper.generateDryRunSteps(arraySumCode, 'Python');
    console.log('✅ Array Sum Test Passed');
    console.log('Type:', result1.type);
    console.log('Title:', result1.title);
    console.log('Steps:', result1.steps.length);
    console.log('---\n');
  } catch (error) {
    console.log('❌ Array Sum Test Failed:', error.message);
  }

  // Test 2: Dynamic Programming - Fibonacci
  console.log('Test 2: Fibonacci with Memoization');
  const fibonacciCode = `
def fibonacci(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fibonacci(n-1, memo) + fibonacci(n-2, memo)
    return memo[n]

print(fibonacci(6))
  `;

  try {
    const result2 = await gptHelper.generateDryRunSteps(fibonacciCode, 'Python');
    console.log('✅ Fibonacci Test Passed');
    console.log('Type:', result2.type);
    console.log('Title:', result2.title);
    console.log('Steps:', result2.steps.length);
    console.log('---\n');
  } catch (error) {
    console.log('❌ Fibonacci Test Failed:', error.message);
  }

  // Test 3: Binary Search
  console.log('Test 3: Binary Search');
  const binarySearchCode = `
def binarySearch(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

print(binarySearch([1, 3, 5, 7, 9, 11], 7))
  `;

  try {
    const result3 = await gptHelper.generateDryRunSteps(binarySearchCode, 'Python');
    console.log('✅ Binary Search Test Passed');
    console.log('Type:', result3.type);
    console.log('Title:', result3.title);
    console.log('Steps:', result3.steps.length);
    console.log('---\n');
  } catch (error) {
    console.log('❌ Binary Search Test Failed:', error.message);
  }

  console.log('🎉 Dry Run Testing Complete!');
}

// Run the test if this file is executed directly
if (require.main === module) {
  testDryRun().catch(console.error);
}

module.exports = { testDryRun }; 