// consumer/index.ts
import dotenv from "dotenv";
dotenv.config();

import Fluvio, { Offset, Record } from "@fluvio/client";
import { analyzeImage } from "./sendToGemini";
import { analyzeWithGroq } from "./sendToGroq";
import { storeClassroomLog } from "../src/functions/classroom";

(async () => {
  const fluvio = await Fluvio.connect();
  const consumer = await fluvio.partitionConsumer("screen-stream", 0);

  console.log("connection established");

  await consumer.stream(Offset.FromEnd(), async (record: Record) => {
    try {
      const base64Data = record.valueString();
      console.log("conversion completed");

      // Get analysis from Gemini
      const geminiText = await analyzeImage(base64Data);
      console.log("Gemini response successful");

      // Get additional analysis from Groq
      const groqResponse = await analyzeWithGroq(geminiText);
      console.log("✅ Groq says:", groqResponse);

      // Combine the analyses
      const analysisData = {
        overallSummary: typeof groqResponse === "string" ? groqResponse : "",
        geminiAnalysis: geminiText,
        timestamp: new Date().toISOString(),
        averageEngagement: 7.2, // You might want to extract this from the analysis
        dominantMood: "engaged", // You might want to extract this from the analysis
        teachingStrategySuggestions: [],
        individualStudentInsights: [],
      };

      // Store in Firebase
      const result = await storeClassroomLog(analysisData);
      console.log("✅ Stored in Firebase with ID:", result.id);
    } catch (error) {
      console.error("Error processing record:", error);
    }
  });
})().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
