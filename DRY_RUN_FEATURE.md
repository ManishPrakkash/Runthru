# Dry Run Feature Documentation

## Overview

The Dry Run feature is a comprehensive code analysis tool that provides step-by-step visualization and voice explanation of algorithm execution. It's designed to help users understand how their code works by showing the internal state at each step of execution.

## Features

### 1. Algorithm Detection
The system automatically detects different types of algorithms:
- **Dynamic Programming**: Detects DP problems with memoization, tabulation, and recursive solutions
- **Array Traversal**: Simple array operations and loops
- **Binary Search**: Binary search algorithms
- **Sorting**: Various sorting algorithms
- **Graph Algorithms**: Graph traversal and pathfinding
- **Tree Algorithms**: Tree traversal and manipulation

### 2. Visual Representation
- **Dynamic Programming**: Shows DP table state with highlighted cells being computed
- **Array Traversal**: Displays array with current position highlighting
- **Binary Search**: Shows search boundaries and middle element
- **Sorting**: Visualizes comparison and swapping operations
- **Variables Panel**: Shows current values of all relevant variables

### 3. Interactive Controls
- **Play/Pause**: Auto-play through all steps
- **Previous/Next**: Manual step navigation
- **Reset**: Return to the beginning
- **Speed Control**: Adjust playback speed (Fast/Normal/Slow)

### 4. Voice Explanation
- Step-by-step audio narration of each operation
- Clear explanation of what's happening at each step
- Synchronized with visual representation

## How to Use

### 1. Upload or Enter Code
- Paste your code in the code editor
- Or upload a code file using the upload button

### 2. Click "Dry Run" Button
- The system will analyze your code
- Generate step-by-step execution data
- Create visual representation
- Generate voice explanation

### 3. Interact with Visualization
- Use the control buttons to navigate through steps
- Watch the visual representation update
- Listen to the audio explanation
- Observe variable changes

## Supported Languages

- **Python**: Full support for all algorithm types
- **JavaScript**: Full support for all algorithm types
- **C++**: Full support for all algorithm types

## Example Use Cases

### Dynamic Programming
```python
def fibonacci(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fibonacci(n-1, memo) + fibonacci(n-2, memo)
    return memo[n]
```
The system will show:
- Memoization table updates
- Recursive call stack
- Variable state changes

### Array Traversal
```python
def arraySum(arr):
    total = 0
    for i in range(len(arr)):
        total += arr[i]
    return total
```
The system will show:
- Current array position
- Running sum updates
- Loop variable changes

### Binary Search
```python
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
```
The system will show:
- Search boundaries
- Middle element calculation
- Boundary updates

## Technical Implementation

### Backend
- **AI Analysis**: Uses Gemini API to analyze code and generate step data
- **JSON Format**: Structured data format for visualization
- **TTS Integration**: Text-to-speech for audio explanations
- **Error Handling**: Fallback visualizations for unsupported code

### Frontend
- **P5.js Canvas**: Interactive visualization rendering
- **React State Management**: Step navigation and playback control
- **Responsive Design**: Works on different screen sizes
- **Dark Mode Support**: Theme-aware visualizations

### Data Structure
```json
{
  "type": "algorithm_type",
  "title": "Algorithm Name",
  "description": "Brief description",
  "input": [sample data],
  "steps": [
    {
      "step": 1,
      "description": "Step description",
      "variables": {"var1": "value1"},
      "arrays": [[array state]],
      "highlight": [indices to highlight],
      "operation": "operation being performed"
    }
  ],
  "output": "expected output",
  "complexity": "Time: O(n), Space: O(n)"
}
```

## Error Handling

### Fallback Scenarios
- **Unsupported Code**: Basic array traversal visualization
- **Parse Errors**: Graceful degradation with error messages
- **TTS Failures**: Silent failure with visual-only mode
- **Network Issues**: Offline-friendly with cached examples

### User Feedback
- Clear error messages
- Loading states
- Progress indicators
- Helpful suggestions

## Performance Considerations

### Optimization
- Lazy loading of visualization data
- Efficient canvas rendering
- Audio file caching
- Minimal API calls

### Scalability
- Modular algorithm detection
- Extensible visualization types
- Configurable step generation
- Memory-efficient data structures

## Future Enhancements

### Planned Features
- **More Algorithm Types**: Graph algorithms, tree traversal
- **Custom Input**: User-defined test cases
- **Export Options**: Save visualizations as videos
- **Collaboration**: Share dry runs with others
- **Mobile Support**: Touch-friendly controls

### Advanced Features
- **Real-time Execution**: Live code execution
- **Debugging Integration**: Breakpoint support
- **Performance Analysis**: Time/space complexity visualization
- **Code Optimization**: Automatic improvement suggestions

## Troubleshooting

### Common Issues
1. **No Visualization**: Check if code is supported algorithm type
2. **Audio Not Playing**: Ensure browser supports audio playback
3. **Slow Performance**: Try smaller input sizes
4. **Parse Errors**: Check code syntax and formatting

### Support
- Check the examples in `server/examples/dp_examples.txt`
- Review error messages in browser console
- Ensure all dependencies are installed
- Verify API keys are configured correctly 