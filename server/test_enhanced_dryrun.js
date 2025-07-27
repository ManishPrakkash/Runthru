// Enhanced test script for dry run functionality
const gptHelper = require('./utils/gptHelper');

async function testEnhancedDryRun() {
  console.log('🧪 Testing Enhanced Dry Run Feature...\n');

  // Test 1: Array Sum with detailed steps
  console.log('Test 1: Array Sum (Detailed Steps)');
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
    console.log('Total Steps:', result1.steps.length);
    console.log('Steps with Audio:', result1.steps.filter(s => s.audioDescription).length);
    console.log('Sample Step:', result1.steps[0]);
    console.log('---\n');
  } catch (error) {
    console.log('❌ Array Sum Test Failed:', error.message);
  }

  // Test 2: Dynamic Programming - Fibonacci
  console.log('Test 2: Fibonacci with Memoization (Detailed Steps)');
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
    console.log('Total Steps:', result2.steps.length);
    console.log('Steps with Audio:', result2.steps.filter(s => s.audioDescription).length);
    console.log('Sample Step:', result2.steps[0]);
    console.log('---\n');
  } catch (error) {
    console.log('❌ Fibonacci Test Failed:', error.message);
  }

  // Test 3: Binary Search with detailed steps
  console.log('Test 3: Binary Search (Detailed Steps)');
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
    console.log('Total Steps:', result3.steps.length);
    console.log('Steps with Audio:', result3.steps.filter(s => s.audioDescription).length);
    console.log('Sample Step:', result3.steps[0]);
    console.log('---\n');
  } catch (error) {
    console.log('❌ Binary Search Test Failed:', error.message);
  }

  // Test 4: Bubble Sort with detailed steps
  console.log('Test 4: Bubble Sort (Detailed Steps)');
  const bubbleSortCode = `
def bubbleSort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

print(bubbleSort([64, 34, 25, 12, 22, 11, 90]))
  `;

  try {
    const result4 = await gptHelper.generateDryRunSteps(bubbleSortCode, 'Python');
    console.log('✅ Bubble Sort Test Passed');
    console.log('Type:', result4.type);
    console.log('Title:', result4.title);
    console.log('Total Steps:', result4.steps.length);
    console.log('Steps with Audio:', result4.steps.filter(s => s.audioDescription).length);
    console.log('Sample Step:', result4.steps[0]);
    console.log('---\n');
  } catch (error) {
    console.log('❌ Bubble Sort Test Failed:', error.message);
  }

  console.log('🎉 Enhanced Dry Run Testing Complete!');
  console.log('\n📊 Summary:');
  console.log('- All tests should generate 8+ detailed steps');
  console.log('- Each step should have audioDescription');
  console.log('- Visualizations should be clean and detailed');
  console.log('- Audio should play automatically for each step');
}

// Run the test if this file is executed directly
if (require.main === module) {
  testEnhancedDryRun().catch(console.error);
}

module.exports = { testEnhancedDryRun }; 