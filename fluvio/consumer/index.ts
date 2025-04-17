// consumer/index.ts
import dotenv from "dotenv";
dotenv.config();

import Fluvio, { Offset, Record } from "@fluvio/client";
import { analyzeImage } from "./sendToGemini";
import { analyzeWithGroq } from "./sendToGroq";

(async () => {
  const fluvio = await Fluvio.connect();
  const consumer = await fluvio.partitionConsumer("screen-stream", 0);

  console.log("connection established");

  await consumer.stream(Offset.FromEnd(), async (record: Record) => {
    const base64Data = record.valueString();
    console.log("conversion completed");
    const geminiText = await analyzeImage(base64Data);
    console.log("Gemini response successfull");
    const groqResponse = await analyzeWithGroq(geminiText);
    console.log("✅ Groq says:", groqResponse);
  });
})().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});