import axios from "axios";
import * as fs from "fs";
import * as path from "path";

export async function analyzeWithGroq(geminiText: string): Promise<string> {
  const apiKey = "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";

  const fullPrompt = `
You are a teaching assistant analyzing classroom engagement and emotional data.

Below is JSON-formatted data representing individual student observations and a classroom summary from an AI model analyzing a classroom image:

${geminiText}

Using this data, generate a structured teacher feedback report in **strict JSON format** with the following fields:

{
  "overallSummary": "Brief summary of the overall classroom engagement and dominant mood",
  "averageEngagement": average engagement level of the class (number between 1 and 10),
  "dominantMood": "engaged | distracted | confused | tired | motivated",
  "remarks": "General remarks on the classroom atmosphere and teaching outcomes",
  "attentionNeeded": [
    {
      "id": student ID (integer),
      "reason": "Short explanation why this student needs attention"
    }
  ],
  "teachingStrategySuggestions": [
    "Suggestion 1",
    "Suggestion 2",
    "Suggestion 3 (optional)"
  ],
  "followUpRecommendations": [
    {
      "id": student ID (integer),
      "emotionalState": "e.g., sad, tired, bored",
      "recommendation": "Suggested follow-up action"
    }
  ],
  "teachingEffectivenessAssessment": "Short assessment of the teacher's effectiveness",
  "individualStudentInsights": [
    {
      "id": student ID (integer),
      "engagementLevel": integer (1 to 10),
      "emotionalState": "e.g., engaged, distracted, confused, tired, motivated",
      "remarks": "Brief observation or insight on the student's current state"
    }
  ]
}

Return **only the JSON like output but don't put the backticks for the markdown**, with **no additional text, explanation, or formatting also no markdown formatting**
`;

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "You're an AI education assistant. Given visual feedback from a classroom, your job is to analyze student engagement and emotions with high accuracy. Ensure students are identified from left to right, IDs starting from 1, and the total number of students is counted with utmost care. Always respond in strict JSON format only, without any explanations or additional text."
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

    console.log("Response received from Groq API");
    let responseContent = response.data.choices[0].message.content;

    // Remove ALL markdown formatting patterns - more aggressive cleaning
    responseContent = responseContent
      .replace(/```(?:json)?\s*/g, "") // Remove opening code blocks with or without language spec
      .replace(/```\s*/g, "")          // Remove closing code blocks
      .replace(/^\s*```/gm, "")        // Remove any markdown at line starts
      .replace(/^```json\s*/gm, "")    // Remove json code block markers specifically
      .trim();                         // Trim any whitespace

    console.log("Cleaned response content:", responseContent.substring(0, 100) + "...");

    // Create the directory with absolute path
    const currentDir = process.cwd();
    console.log("Current working directory:", currentDir);
    
    let logsDir = path.join(currentDir, "class_logs");
    if (!fs.existsSync(logsDir)) {
      try {
        fs.mkdirSync(logsDir, { recursive: true });
        console.log(`Created class_logs directory at: ${logsDir}`);
      } catch (dirError) {
        console.error(`Failed to create directory at ${logsDir}:`, dirError);
        // Create in tmp directory as fallback
        logsDir = "/tmp/class_logs";
        fs.mkdirSync(logsDir, { recursive: true });
        console.log(`Created fallback class_logs directory at: ${logsDir}`);
      }
    } else {
      console.log(`Using existing class_logs directory at: ${logsDir}`);
    }

    // Generate a timestamped filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `classroom-analysis-${timestamp}.json`;
    const filePath = path.join(logsDir, filename);

    // Validate and save the response
    try {
      // Check if it's valid JSON before parsing
      const jsonResponse = JSON.parse(responseContent);
      console.log("Valid JSON response received");
      fs.writeFileSync(filePath, JSON.stringify(jsonResponse, null, 2));
      console.log(`Analysis saved to: ${filePath}`);
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError);
      console.log("Saving raw response instead");
      // For raw responses, perform additional cleaning
      const cleanedContent = responseContent
        .replace(/```(?:json)?/g, "")  // Remove any remaining markdown
        .trim();
      fs.writeFileSync(filePath, cleanedContent);
      console.log(`Raw response saved to: ${filePath}`);
    }

    return responseContent;
  } catch (error: any) {
    console.error("Error during API call or file operation:", error);

    if (error.response) {
      console.error("API error response:", error.response.data);
      console.error("Status code:", error.response.status);
    } else if (error.request) {
      console.error("No response received from API");
    }

    throw error;
  }
}