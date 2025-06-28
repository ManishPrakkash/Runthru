// server/testGeminiConnection.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ GEMINI_API_KEY is missing in your .env file!");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function testGemini() {
  try {
    console.log("🌐 Testing Gemini API with model: gemini-1.5-flash");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "Explain what a 'for loop' is in programming.";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("\n✅ Gemini API response (trimmed):");
    console.log(text.slice(0, 300) + '...');
    console.log("\n🎉 Gemini API is working with your API key!");
  } catch (error) {
    console.error("\n❌ Gemini API Test FAILED");
    console.error("Error:", error.message);
    if (error.response?.data) {
      console.error("Details:", error.response.data);
    }
  }
}

testGemini();
