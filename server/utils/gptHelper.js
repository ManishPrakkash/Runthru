const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load the API key from environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelayMs: 1000,
  backoffMultiplier: 2,
};

// Helper function to retry API calls with exponential backoff
async function retryWithBackoff(fn, context = '') {
  let lastError;
  
  for (let attempt = 1; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
    try {
      console.log(`🔄 API attempt ${attempt}/${RETRY_CONFIG.maxRetries}${context ? ` for ${context}` : ''}`);
      return await fn();
    } catch (error) {
      lastError = error;
      console.error(`❌ Attempt ${attempt} failed:`, error.message);
      
      // Check if error is retryable
      const isRetryable = 
        error.message.includes('fetch failed') ||
        error.message.includes('timeout') ||
        error.message.includes('503') ||
        error.message.includes('429'); // Rate limiting
      
      if (attempt < RETRY_CONFIG.maxRetries && isRetryable) {
        const delayMs = RETRY_CONFIG.initialDelayMs * Math.pow(RETRY_CONFIG.backoffMultiplier, attempt - 1);
        console.log(`⏳ Retrying in ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      } else if (!isRetryable) {
        console.error('⚠️ Non-retryable error, failing immediately');
        break;
      }
    }
  }
  
  throw new Error(`API call failed after ${RETRY_CONFIG.maxRetries} attempts: ${lastError?.message}`);
}

// Clean and user-friendly explanation prompt
exports.getExplanation = async (code, language) => {
  try {
    return await retryWithBackoff(async () => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
You are a helpful AI that explains code to beginners in a simple way.

Explain the following ${language} code with the following rules:
- Use short bullet points (max 4–5)
- Focus on what the code **does logically**, not on libraries or boilerplate
- Avoid lengthy technical jargon
- End with a simple input/output example if relevant

Code:
${code}
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
    }, 'getExplanation');
  } catch (error) {
    console.error('❌ Error in getExplanation:', error.message);
    return createFallbackExplanation(code);
  }
};

// Helper function to get AI refactoring suggestions
exports.getRefactoringSuggestions = async (code, language) => {
  try {
    return await retryWithBackoff(async () => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
You are a competitive programming expert.

Analyze the following ${language} code and follow this output format:

----------------------------------------------------
🧠 Original Time Complexity: O(?)
🧠 Original Space Complexity: O(?)

✅ Key Observations (Short points):
- Focus on real inefficiencies, not styling
- DO NOT mention style improvements like avoiding 'using namespace std;'
- Skip obvious/subjective suggestions unless they improve performance

⚠️ IF AND ONLY IF the code's logic or complexity can be **significantly improved**:
- Show the improved code
- Provide new time & space complexity

❌ If the logic and complexity are already optimal:
- Do NOT return new code
- Just return complexity + observations

DO NOT guess complexity if not clear — just say "Depends on input size or logic
also dont print the prompt in the output".
----------------------------------------------------

Code:
${code}
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
};

// Helper function to get AI debugging assistance
exports.getDebuggingAssistance = async (code, language) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
You're a helpful AI coding teacher and debugger.

Your task:
1. First, check if the following ${language} code has any syntax or logical errors.
2. If there is an error:
   - Print the corrected code first (in plain text without backticks).
   - Explain what was wrong in 2–3 bullet points (short and simple).
3. If there is no error:
   - Say "✅ No errors found."
   - Suggest 1–2 short improvements or best practices.

Code:
${code}

Important:
- Do NOT wrap the output in markdown backticks or code blocks.
- Keep it short and clean, like a teacher explaining to a student.
- Use newlines to separate sections clearly.
`;
  const result = await model.generateContent(prompt);
  return result.response.text();
};

// Enhanced dry run generation for dynamic programming
exports.generateDryRunSteps = async (code, language) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
You are an expert programming instructor specializing in algorithm visualization. Analyze the following ${language} code and create a detailed step-by-step dry run visualization.

For the given code, provide a comprehensive analysis with MANY detailed steps in this exact JSON format:

{
  "type": "algorithm_type",
  "title": "Algorithm Name",
  "description": "Brief description of what the algorithm does",
  "input": [sample input data],
  "steps": [
    {
      "step": 1,
      "description": "Detailed description of what's happening in this step",
      "audioDescription": "Clear audio narration for this specific step",
      "variables": {"var1": "value1", "var2": "value2"},
      "arrays": [[current array state]],
      "highlight": [indices to highlight],
      "operation": "specific operation being performed",
      "codeLine": "which line of code is being executed"
    }
  ],
  "output": "expected output",
  "complexity": "Time: O(n), Space: O(n)"
}

IMPORTANT REQUIREMENTS:
1. Generate AT LEAST 8-15 detailed steps for any algorithm
2. Each step should represent a single logical operation
3. For loops: create separate steps for each iteration
4. For conditionals: create steps for condition checking and branch execution
5. For function calls: create steps for parameter passing and return values
6. For variable assignments: create separate steps for each assignment
7. Make audioDescription conversational and educational
8. Include codeLine to show which line is being executed
9. Make variables and arrays change realistically between steps
10. Use highlight array to show which elements are being processed

Algorithm types to detect:
- "dynamicProgramming" for DP problems (look for memoization, tabulation, recursive with overlapping subproblems)
- "arrayTraversal" for simple array operations
- "binarySearch" for binary search algorithms
- "sorting" for sorting algorithms
- "graph" for graph algorithms
- "tree" for tree algorithms

For dynamic programming specifically:
- Show the DP table state at each step
- Highlight which cells are being computed
- Show the recurrence relation being applied
- Include variables like i, j, dp[i][j], etc.
- Create steps for each cell computation

For array traversal:
- Show current position in array
- Highlight current element being processed
- Show relevant variables
- Create steps for each iteration

For binary search:
- Show search boundaries
- Show middle element calculation
- Show comparison results
- Show boundary updates

Code to analyze:
${code}

Important: Return ONLY valid JSON, no additional text or explanations. Ensure the JSON is properly formatted and parseable. Generate MANY detailed steps (8-15 minimum) with realistic variable changes.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Try to parse the JSON response
    let dryRunData;
    try {
      dryRunData = JSON.parse(response);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', response);
      // Fallback to basic visualization
      return createFallbackDryRun(code);
    }

    // Validate and enhance the dry run data
    return enhanceDryRunData(dryRunData, code);
    
  } catch (error) {
    console.error('Error generating dry run steps:', error);
    return createFallbackDryRun(code);
  }
};

function enhanceDryRunData(dryRunData, code) {
  // Ensure all required fields are present
  const enhanced = {
    type: dryRunData.type || 'arrayTraversal',
    title: dryRunData.title || 'Code Analysis',
    description: dryRunData.description || 'Step-by-step execution of the code',
    input: dryRunData.input || [1, 2, 3, 4, 5],
    steps: dryRunData.steps || [],
    output: dryRunData.output || 'Result',
    complexity: dryRunData.complexity || 'Time: O(n), Space: O(1)',
    currentStepIndex: 0
  };

  // Add step numbers and ensure all required fields
  enhanced.steps = enhanced.steps.map((step, index) => ({
    step: step.step || index + 1,
    description: step.description || `Step ${index + 1}`,
    audioDescription: step.audioDescription || step.description || `Step ${index + 1}`,
    variables: step.variables || {},
    arrays: step.arrays || [enhanced.input],
    highlight: step.highlight || [],
    operation: step.operation || 'Processing',
    codeLine: step.codeLine || `Line ${index + 1}`
  }));

  // Ensure we have enough steps (minimum 8)
  if (enhanced.steps.length < 8) {
    enhanced.steps = generateDetailedSteps(enhanced.steps, enhanced.input, enhanced.type);
  }

  return enhanced;
}

function generateDetailedSteps(basicSteps, input, type) {
  const detailedSteps = [];
  let stepNumber = 1;

  // Add initialization steps
  detailedSteps.push({
    step: stepNumber++,
    description: 'Initialize variables and prepare for execution',
    audioDescription: 'Let\'s start by initializing our variables and preparing for the algorithm execution.',
    variables: { i: 0, total: 0 },
    arrays: [input],
    highlight: [],
    operation: 'Initialization',
    codeLine: 'Variable initialization'
  });

  // Add detailed steps based on algorithm type
  if (type === 'arrayTraversal') {
    for (let i = 0; i < input.length; i++) {
      const runningTotal = input.slice(0, i + 1).reduce((a, b) => a + b, 0);
      detailedSteps.push({
        step: stepNumber++,
        description: `Process element at index ${i} with value ${input[i]}`,
        audioDescription: `Now we're processing the element at position ${i}, which has the value ${input[i]}. We add this to our running total.`,
        variables: { i: i, total: runningTotal },
        arrays: [input],
        highlight: [i],
        operation: 'Array element processing',
        codeLine: `Processing element at index ${i}`
      });
    }
  } else if (type === 'dynamicProgramming') {
    // Create a more realistic DP table progression
    const dpTable = Array(input.length).fill(0).map(() => Array(input.length).fill(0));
    
    for (let i = 0; i < Math.min(input.length, 5); i++) {
      for (let j = 0; j < Math.min(input.length, 5); j++) {
        dpTable[i][j] = Math.floor(Math.random() * 10) + 1; // Random values for demo
        detailedSteps.push({
          step: stepNumber++,
          description: `Compute DP value for subproblem (${i}, ${j})`,
          audioDescription: `We're now computing the dynamic programming value for subproblem at position (${i}, ${j}).`,
          variables: { i: i, j: j, 'dp[i][j]': dpTable[i][j] },
          arrays: [dpTable.map(row => [...row])], // Deep copy
          highlight: [`${i},${j}`],
          operation: 'DP computation',
          codeLine: `Computing dp[${i}][${j}]`
        });
      }
    }
  } else if (type === 'binarySearch') {
    const target = 7; // Example target
    let left = 0, right = input.length - 1;
    
    for (let iteration = 0; iteration < 3; iteration++) {
      const mid = Math.floor((left + right) / 2);
      detailedSteps.push({
        step: stepNumber++,
        description: `Calculate middle element at index ${mid}`,
        audioDescription: `We calculate the middle element at index ${mid}, which is ${input[mid]}.`,
        variables: { left: left, right: right, mid: mid, target: target },
        arrays: [input],
        highlight: [`mid:${mid}`, `left:${left}`, `right:${right}`],
        operation: 'Binary search iteration',
        codeLine: `mid = (left + right) // 2`
      });
      
      if (input[mid] === target) {
        detailedSteps.push({
          step: stepNumber++,
          description: `Target found at index ${mid}`,
          audioDescription: `Great! We found our target value ${target} at index ${mid}.`,
          variables: { left: left, right: right, mid: mid, target: target, result: mid },
          arrays: [input],
          highlight: [`mid:${mid}`],
          operation: 'Target found',
          codeLine: `if arr[mid] == target: return mid`
        });
        break;
      } else if (input[mid] < target) {
        left = mid + 1;
        detailedSteps.push({
          step: stepNumber++,
          description: `Target is greater, move left boundary to ${left}`,
          audioDescription: `Since ${input[mid]} is less than our target ${target}, we move the left boundary to ${left}.`,
          variables: { left: left, right: right, mid: mid, target: target },
          arrays: [input],
          highlight: [`left:${left}`, `right:${right}`],
          operation: 'Update left boundary',
          codeLine: `left = mid + 1`
        });
      } else {
        right = mid - 1;
        detailedSteps.push({
          step: stepNumber++,
          description: `Target is smaller, move right boundary to ${right}`,
          audioDescription: `Since ${input[mid]} is greater than our target ${target}, we move the right boundary to ${right}.`,
          variables: { left: left, right: right, mid: mid, target: target },
          arrays: [input],
          highlight: [`left:${left}`, `right:${right}`],
          operation: 'Update right boundary',
          codeLine: `right = mid - 1`
        });
      }
    }
  }

  // Add final result step
  detailedSteps.push({
    step: stepNumber++,
    description: 'Algorithm completed, returning final result',
    audioDescription: 'The algorithm has completed its execution and we have our final result.',
    variables: { result: 'Final result' },
    arrays: [input],
    highlight: [],
    operation: 'Completion',
    codeLine: 'Return result'
  });

  return detailedSteps;
}

function createFallbackDryRun(code) {
  // Create a detailed fallback visualization
  const input = [10, 20, 30, 40, 50];
  const steps = [];
  let stepNumber = 1;

  // Initialization
  steps.push({
    step: stepNumber++,
    description: 'Initialize variables and start execution',
    audioDescription: 'Let\'s begin by initializing our variables. We start with index i set to zero and total sum set to zero.',
    variables: { i: 0, total: 0 },
    arrays: [input],
    highlight: [0],
    operation: 'Initialization',
    codeLine: 'Initialize variables'
  });

  // Process each element
  for (let i = 0; i < input.length; i++) {
    const runningTotal = input.slice(0, i + 1).reduce((a, b) => a + b, 0);
    steps.push({
      step: stepNumber++,
      description: `Process element at index ${i} with value ${input[i]}`,
      audioDescription: `Now we're at index ${i}, processing the value ${input[i]}. We add this to our running total.`,
      variables: { i: i, total: runningTotal },
      arrays: [input],
      highlight: [i],
      operation: 'Element processing',
      codeLine: `Process element ${i}`
    });
  }

  // Final result
  steps.push({
    step: stepNumber++,
    description: 'Algorithm completed, returning final sum',
    audioDescription: 'We have completed processing all elements. The final sum is calculated and ready to be returned.',
    variables: { i: input.length, total: input.reduce((a, b) => a + b, 0) },
    arrays: [input],
    highlight: [],
    operation: 'Completion',
    codeLine: 'Return result'
  });

  return {
    type: 'arrayTraversal',
    title: 'Code Execution Analysis',
    description: 'Detailed step-by-step execution of the code',
    input: input,
    steps: steps,
    output: input.reduce((a, b) => a + b, 0).toString(),
    complexity: 'Time: O(n), Space: O(1)',
    currentStepIndex: 0
  };
}
