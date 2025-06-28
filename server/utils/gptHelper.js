const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load the API key from environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Clean and user-friendly explanation prompt
exports.getExplanation = async (code, language) => {
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
};

// Helper function to get AI refactoring suggestions
exports.getRefactoringSuggestions = async (code, language) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
You are a competitive programming expert.

Analyze the following ${language} code and follow this output format:

----------------------------------------------------
🧠 Original Time Complexity: O(?)
🧠 Original Space Complexity: O(?)

✅ Key Observations (Short points only):
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
