import { GoogleGenAI } from "@google/genai";
import { ActionType } from '../types';

const getPrompt = (action: ActionType, code: string): string => {
  switch (action) {
    case ActionType.Explain:
      return `Explain the following code snippet. Provide a clear, line-by-line explanation. Format the output as clean, readable text. Use markdown for code blocks if you need to reference parts of the code.\n\nCode:\n---\n${code}\n---`;
    case ActionType.Refactor:
      return `Refactor the following code snippet to improve its readability, performance, and maintainability. Provide the refactored code inside a single markdown code block and then explain the key changes you made below it.\n\nCode:\n---\n${code}\n---`;
    case ActionType.Debug:
      return `Debug the following code snippet. Identify any potential bugs, errors, or logical issues. Suggest fixes and provide the corrected code inside a single markdown code block. Explain the bugs and your solutions.\n\nCode:\n---\n${code}\n---`;
    default:
      throw new Error("Unknown action type.");
  }
};

export const processCode = async (code: string, action: ActionType): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = getPrompt(action, code);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error processing code with Gemini API:", error);
    // Re-throw the error so the calling function's catch block can handle it.
    if (error instanceof Error) {
        throw new Error(`Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while contacting the Gemini API.");
  }
};