import Fluvio from "@fluvio/client";

async function main() {
  const fluvio = await Fluvio.connect();
  console.log("✅ Connected to Fluvio!");

  const admin = await fluvio.admin();
  const topics = await admin.listTopic(); // ✅ FIXED here

  console.log("📄 Topics:", topics);
}

main().catch(console.error);
