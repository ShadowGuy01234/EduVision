// File: sendToGroq.ts
import axios from "axios";

export async function analyzeWithGroq(geminiText: string): Promise<string> {
  // Log the API key (length only for security)
  const apiKey = process.env.GROQ_API_KEY;
  
  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama-3.3-70b-versatile", // ✅ updated model
      messages: [
        {
          role: "system",
          content: "You're an AI education assistant. Given classroom visual feedback, provide meaningful analysis like student attention, teacher activity, and content focus.",
        },
        {
          role: "user",
          content: geminiText,
        },
      ],
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );

  return response.data.choices[0].message.content;
}
