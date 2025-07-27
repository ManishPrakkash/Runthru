// Test script to verify visualizer data structure
const gptHelper = require('./utils/gptHelper');

async function testVisualizerData() {
  console.log('🧪 Testing Visualizer Data Structure...\n');

  // Test 1: Simple array sum
  console.log('Test 1: Array Sum - Visualizer Data');
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
    console.log('✅ Array Sum Visualizer Test Passed');
    console.log('Total Steps:', result1.steps.length);
    console.log('Step 1:', JSON.stringify(result1.steps[0], null, 2));
    console.log('Step 2:', JSON.stringify(result1.steps[1], null, 2));
    console.log('Step 3:', JSON.stringify(result1.steps[2], null, 2));
    console.log('Variables change between steps:', 
      result1.steps[0].variables, '->', 
      result1.steps[1].variables, '->', 
      result1.steps[2].variables
    );
    console.log('---\n');
  } catch (error) {
    console.log('❌ Array Sum Visualizer Test Failed:', error.message);
  }

  // Test 2: Binary Search
  console.log('Test 2: Binary Search - Visualizer Data');
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
    const result2 = await gptHelper.generateDryRunSteps(binarySearchCode, 'Python');
    console.log('✅ Binary Search Visualizer Test Passed');
    console.log('Total Steps:', result2.steps.length);
    console.log('Step 1:', JSON.stringify(result2.steps[0], null, 2));
    console.log('Step 2:', JSON.stringify(result2.steps[1], null, 2));
    console.log('Highlight arrays:', 
      result2.steps[0].highlight, '->', 
      result2.steps[1].highlight
    );
    console.log('---\n');
  } catch (error) {
    console.log('❌ Binary Search Visualizer Test Failed:', error.message);
  }

  console.log('🎉 Visualizer Data Testing Complete!');
  console.log('\n📊 Expected Results:');
  console.log('- Each step should have different variables');
  console.log('- Arrays should change between steps');
  console.log('- Highlight arrays should show current elements');
  console.log('- Audio descriptions should be unique per step');
}

// Run the test if this file is executed directly
if (require.main === module) {
  testVisualizerData().catch(console.error);
}

module.exports = { testVisualizerData }; 