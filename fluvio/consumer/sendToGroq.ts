// File: sendToGroq.ts
import axios from "axios";

export async function analyzeWithGroq(geminiText: string): Promise<string> {
  // Log the API key (length only for security)
  const apiKey = "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";

  // Structured feedback prompt
  const fullPrompt = `
You are a teaching assistant analyzing classroom engagement and emotional data.

Below is JSON-formatted data representing individual student observations and a classroom summary from an AI model analyzing a classroom image:

${geminiText}

Using this data, generate a clear and concise teacher feedback report that includes:

1. **Overall Summary**: Summarize the overall classroom engagement level and the dominant emotional state or mood.
2. **Attention Needed**: Identify which students (by ID) may need additional attention or support, and briefly explain why.
3. **Teaching Strategy Suggestions**: Suggest 2–3 specific teaching adjustments or strategies based on observed engagement patterns to improve attention and participation.
4. **Follow-up Recommendations**: Recommend follow-up actions for any students showing concerning emotional states (e.g., sadness, stress, boredom).
5. **Teaching Effectiveness Assessment**: Provide a brief assessment of the teacher’s effectiveness based on student engagement and mood indicators.

Format the output as a concise, professional, and actionable teacher feedback report. Avoid repeating the raw JSON data. Focus on insights and suggestions only.
`;

  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You're an AI education assistant. Given classroom visual feedback, provide meaningful analysis like student attention, teacher activity, and content focus.",
        },
        {
          role: "user",
          content: fullPrompt,
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
