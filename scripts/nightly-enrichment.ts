import { PrismaClient } from "@prisma/client";
import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();
// Initialize Gemini SDK. Assumes GEMINI_API_KEY is set in .env
const ai = new GoogleGenAI({});

async function getSystemPrompt() {
  const skillPath = path.join(process.cwd(), ".agents", "skills", "listing-enricher", "SKILL.md");
  const content = fs.readFileSync(skillPath, "utf-8");
  // Extract just the System Prompt section
  const promptMatch = content.match(/# System Prompt\n\n([\s\S]*)/);
  return promptMatch ? promptMatch[1] : "You are a meticulous local business researcher.";
}

async function enrichListing(listing: any, systemPrompt: string) {
  try {
    const prompt = `Research the following business:\nName: ${listing.name}\nAddress: ${listing.address}\nWebsite: ${listing.website || 'N/A'}\n\nReturn ONLY a JSON object as requested.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        temperature: 0.2
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (err) {
    console.error(`Failed to enrich listing ${listing.id}:`, err);
    return null;
  }
}

async function main() {
  console.log("Starting Nightly Enrichment...");
  
  const systemPrompt = await getSystemPrompt();
  
  // Calculate date 7 days ago
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // 1. Query for listings older than 7 days or never enriched
  const listingsToEnrich = await prisma.listing.findMany({
    where: {
      OR: [
        { lastEnrichedAt: null },
        { lastEnrichedAt: { lt: sevenDaysAgo } }
      ]
    }
  });

  console.log(`Found ${listingsToEnrich.length} listings to enrich.`);
  
  if (listingsToEnrich.length === 0) return;

  const resultsLog = [];
  const BATCH_SIZE = 20;

  // 2. Process in batches of 20
  for (let i = 0; i < listingsToEnrich.length; i += BATCH_SIZE) {
    const batch = listingsToEnrich.slice(i, i + BATCH_SIZE);
    console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1}...`);

    // 3. Spawn enrichment "subagents" concurrently
    const enrichedResults = await Promise.all(
      batch.map(async (listing) => {
        const enrichedData = await enrichListing(listing, systemPrompt);
        if (enrichedData) {
          // 4. Update the database
          await prisma.listing.update({
            where: { id: listing.id },
            data: {
              specialties: enrichedData.specialties ? enrichedData.specialties.join(",") : listing.specialties,
              lastEnrichedAt: new Date()
            }
          });
          return { id: listing.id, status: 'success', data: enrichedData };
        }
        return { id: listing.id, status: 'failed' };
      })
    );
    
    resultsLog.push(...enrichedResults);
  }

  // 5. Write summary log
  const logDir = path.join(process.cwd(), "logs");
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
  
  const dateStr = new Date().toISOString().split('T')[0];
  const logFile = path.join(logDir, `nightly-enrichment-${dateStr}.json`);
  
  fs.writeFileSync(logFile, JSON.stringify({
    timestamp: new Date().toISOString(),
    totalProcessed: listingsToEnrich.length,
    results: resultsLog
  }, null, 2));

  console.log(`Enrichment complete. Log saved to ${logFile}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
