// File: sendToGemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

// Log the Gemini API key (length only for security)
const geminiApiKey = process.env.GEMINI_API_KEY || "AIzaSyDwhdMFJMyAMtICw0iM6glHDCy0KPr0rl4";
console.log(`GEMINI API Key loaded: ${geminiApiKey ? `${geminiApiKey.slice(0, 4)}...${geminiApiKey.slice(-4)} (${geminiApiKey.length} chars)` : 'undefined'}`);

const genAI = new GoogleGenerativeAI(geminiApiKey);

export async function analyzeImage(base64Image: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  console.log("model connected");

  const result = await model.generateContent([
    { text: "Analyze the following classroom image. Tell what the teacher is showing, how attentive students look, and extract key visual details." },
    { inlineData: { mimeType: "image/jpeg", data: base64Image } },
  ]);
  console.log("prompt sent");

  const response = await result.response;
  console.log("response received");
  return response.text(); // ⬅️ this is the text you'll send to Groq
}
