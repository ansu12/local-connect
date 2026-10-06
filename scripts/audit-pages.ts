import { PrismaClient } from "@prisma/client";
import { google } from "googleapis";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();
const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.localconnect.com";

async function getGSCData() {
  console.log("Authenticating with Google Search Console API...");
  
  // Assumes a service account JSON is available, similar to the indexing API
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
  });

  const searchconsole = google.searchconsole({ version: "v1", auth });
  
  // Calculate date range for last 90 days
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 90);
  
  const startStr = startDate.toISOString().split("T")[0];
  const endStr = endDate.toISOString().split("T")[0];
  
  console.log(`Fetching GSC data from ${startStr} to ${endStr}...`);
  
  try {
    const response = await searchconsole.searchanalytics.query({
      siteUrl: SITE_URL,
      requestBody: {
        startDate: startStr,
        endDate: endStr,
        dimensions: ["page"],
        rowLimit: 25000
      }
    });
    
    return response.data.rows || [];
  } catch (error) {
    console.warn("Could not fetch GSC Data. Returning empty analytics (falling back to DB audit only).", (error as Error).message);
    return [];
  }
}

async function auditPages() {
  const gscRows = await getGSCData();
  
  // Map GSC data for quick lookup
  const urlStats = new Map();
  for (const row of gscRows) {
    if (row.keys && row.keys[0]) {
      urlStats.set(row.keys[0], {
        clicks: row.clicks || 0,
        impressions: row.impressions || 0
      });
    }
  }

  const cities = await prisma.city.findMany({
    include: {
      _count: {
        select: { listings: true }
      }
    }
  });
  
  const services = await prisma.service.findMany();
  const listings = await prisma.listing.findMany({
    include: { city: true, service: true }
  });

  const candidates: Array<{url: string, type: string, city: string, service: string, reason: string, action: string}> = [];

  // Generate expected URLs
  for (const service of services) {
    for (const city of cities) {
      const cityUrl = `${SITE_URL}/${service.slug}/${city.slug}`;
      const stats = urlStats.get(cityUrl) || { clicks: 0, impressions: 0 };
      
      const cityListingsCount = await prisma.listing.count({
        where: { cityId: city.id, serviceId: service.id }
      });

      // 2 & 3. Zero impressions, zero clicks, or no internal links (0 listings)
      if (stats.impressions === 0 && stats.clicks === 0) {
        if (cityListingsCount === 0) {
          candidates.push({
            url: cityUrl,
            type: "City Hub",
            city: city.name,
            service: service.name,
            reason: "Zero traffic & No listings (thin content)",
            action: "Delete" // 404 it
          });
        } else if (cityListingsCount < 3) {
          candidates.push({
            url: cityUrl,
            type: "City Hub",
            city: city.name,
            service: service.name,
            reason: "Zero traffic & low inventory",
            action: "Improve" // Add more listings via enricher
          });
        }
      }
    }
  }

  for (const listing of listings) {
    const listingUrl = `${SITE_URL}/${listing.service.slug}/${listing.city.slug}/${listing.slug}`;
    const stats = urlStats.get(listingUrl) || { clicks: 0, impressions: 0 };
    
    if (stats.impressions === 0 && stats.clicks === 0) {
      // Evaluate if we should keep it
      if (listing.verdictScore < 20 || !listing.website) {
        candidates.push({
          url: listingUrl,
          type: "Listing Page",
          city: listing.city.name,
          service: listing.service.name,
          reason: "Zero traffic & Low verdict score",
          action: "Merge" // Redirect to parent City Hub
        });
      }
    }
  }

  // 4. Output a CSV
  console.log(`Identified ${candidates.length} prune candidates.`);
  
  const csvHeaders = ["URL", "Page Type", "City", "Service", "Reason", "Recommended Action"];
  const csvRows = candidates.map(c => 
    `"${c.url}","${c.type}","${c.city}","${c.service}","${c.reason}","${c.action}"`
  );
  
  const csvContent = [csvHeaders.join(","), ...csvRows].join("\n");
  const outputPath = path.join(process.cwd(), "prune-candidates.csv");
  
  fs.writeFileSync(outputPath, csvContent);
  console.log(`Report generated successfully: ${outputPath}`);
}

auditPages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
