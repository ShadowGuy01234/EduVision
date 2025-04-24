import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

// Get API key from environment variables only
const geminiApiKey = "AIzaSyDwhdMFJMyAMtICw0iM6glHDCy0KPr0rl4";
const imgurClientId = "a3b3214f69c42f1";

if (!geminiApiKey) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}

console.log(
  `GEMINI API Key loaded: ${geminiApiKey.slice(0, 4)}...${geminiApiKey.slice(
    -4
  )} (${geminiApiKey.length} chars)`
);

const genAI = new GoogleGenerativeAI(geminiApiKey);

interface ErrorWithDetails {
  status?: number;
  statusText?: string;
  errorDetails?: any[];
  message?: string;
  stack?: string;
}

async function uploadToImgur(base64Image: string): Promise<string> {
  // Clean up base64 if it includes data URL prefix
  const cleanBase64 = base64Image.replace(/^data:image\/[a-z]+;base64,/, "");

  try {
    const response = await axios.post(
      "https://api.imgur.com/3/image",
      { image: cleanBase64, type: "base64" },
      { headers: { Authorization: `Client-ID ${imgurClientId}` } }
    );

    console.log("Image uploaded to Imgur");
    return response.data.data.link;
  } catch (error) {
    console.error("Imgur upload error:", error);
    throw new Error("Failed to upload image to Imgur");
  }
}

async function fetchImageAsBase64(imageUrl: string): Promise<string> {
  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const base64 = Buffer.from(response.data, "binary").toString("base64");
    return base64;
  } catch (error) {
    console.error("Error fetching image:", error);
    throw new Error("Failed to fetch image from URL");
  }
}

export async function analyzeImage(base64Image: string): Promise<string> {
  try {
    // Clean up base64 if it includes data URL prefix
    const cleanBase64 = base64Image.replace(/^data:image\/[a-z]+;base64,/, "");

    // Verify base64 is valid
    try {
      Buffer.from(cleanBase64, "base64").toString("base64");
    } catch (e) {
      throw new Error("Invalid base64 image data");
    }

    // Upload to Imgur first
    const imageUrl = await uploadToImgur(cleanBase64);
    console.log("Image URL:", imageUrl);

    // Fetch the image back as base64 to use with Gemini
    // const imageBase64 = await fetchImageAsBase64(imageUrl);

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    console.log("Model connected");

    try {
      const result = await model.generateContent([
        {
          text: `
          Analyze this classroom image (${imageUrl}). Students in the image are in a classroom setting. 
          Identify students from left to right, assigning IDs starting from 1 for the leftmost student.
          Count the number of students with utmost care and accuracy.
          Return the following data in strict JSON format:
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

          `,
        },
      ]);

      console.log("Prompt sent");
      const response = await result.response;
      console.log("Response received");
      return response.text();
    } catch (apiError) {
      console.error("Gemini API Error:", apiError);
      const err = apiError as ErrorWithDetails;

      if (err.status === 400) {
        console.error(
          "Bad Request. Check if your prompt is properly formatted."
        );
      }

      // Log all error details
      console.error(
        JSON.stringify(
          {
            message: err.message,
            status: err.status,
            statusText: err.statusText,
            errorDetails: err.errorDetails,
          },
          null,
          2
        )
      );

      throw new Error(`Gemini API error: ${err.message || "Unknown error"}`);
    }
  } catch (error) {
    const err = error as Error;
    console.error("Error in analyzeImage function:", err.message);
    console.error(err.stack);
    throw err;
  }
}
