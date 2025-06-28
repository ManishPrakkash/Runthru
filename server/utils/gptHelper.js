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
You're an AI developer assistant. Suggest improvements for the following ${language} code:
- Improve readability
- Optimize performance if needed
- Suggest clean coding practices

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
You're an AI debugger.

Analyze the following ${language} code:
- Identify any syntax or logic errors
- Explain what the bugs are
- Suggest corrections briefly

Code:
${code}
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
};
