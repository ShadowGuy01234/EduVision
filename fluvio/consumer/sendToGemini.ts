import { GoogleGenerativeAI, GoogleGenerativeAIError } from "@google/generative-ai";

// Get API key from environment variables only
const geminiApiKey = "AIzaSyDwhdMFJMyAMtICw0iM6glHDCy0KPr0rl4";
if (!geminiApiKey) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}

console.log(`GEMINI API Key loaded: ${geminiApiKey.slice(0, 4)}...${geminiApiKey.slice(-4)} (${geminiApiKey.length} chars)`);

const genAI = new GoogleGenerativeAI(geminiApiKey);

interface ErrorWithDetails {
  status?: number;
  statusText?: string;
  errorDetails?: any[];
  message?: string;
  stack?: string;
}

export async function analyzeImage(base64Image: string): Promise<string> {
  try {
    // Clean up base64 if it includes data URL prefix
    const cleanBase64 = base64Image.replace(/^data:image\/[a-z]+;base64,/, '');

    // Verify base64 is valid
    try {
      Buffer.from(cleanBase64, 'base64').toString('base64');
    } catch (e) {
      throw new Error("Invalid base64 image data");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    console.log("Model connected");

    try {
      const result = await model.generateContent([
        {
          text: `
You are given a base64-encoded image of a classroom. Analyze the image and return the following data in strict JSON format:

{
  "students": [
    {
      "id": 1,
      "facialExpression": "happy | sad | neutral | confused | focused | bored | sleepy",
      "emotionalState": "engaged | distracted | confused | tired | motivated",
      "engagementLevel": 1 to 10 (integer),
      "needsAttention": true or false,
      "notes": "Brief observation about the student's behavior"
    }
  ],
  "classroomSummary": {
    "totalStudents": number of students,
    "averageEngagement": average engagement level (1 to 10),
    "dominantMood": "engaged | distracted | confused | tired | motivated",
    "engagementPercentage": percentage of students with engagementLevel > 6,
    "attentiveCount": number of students with engagementLevel > 6,
    "distractedCount": number of students with engagementLevel <= 6
  }
}

Return only JSON, with no explanations.
          `
        },
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: cleanBase64
          }
        }
      ]);

      console.log("Prompt sent");
      const response = await result.response;
      console.log("Response received");
      return response.text();
    } catch (apiError) {
      console.error("Gemini API Error:", apiError);
      const err = apiError as ErrorWithDetails;

      if (err.status === 400) {
        console.error("Bad Request. Check if your base64 image is properly formatted and not too large.");
      }

      // Log all error details
      console.error(JSON.stringify({
        message: err.message,
        status: err.status,
        statusText: err.statusText,
        errorDetails: err.errorDetails,
      }, null, 2));

      throw new Error(`Gemini API error: ${err.message || 'Unknown error'}`);
    }
  } catch (error) {
    const err = error as Error;
    console.error("Error in analyzeImage function:", err.message);
    console.error(err.stack);
    throw err;
  }
}
