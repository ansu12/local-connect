import { PrismaClient } from "@prisma/client";
import { fetchListings, enrichListing } from "../src/lib/data-source";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting data sync...");

  const cities = await prisma.city.findMany();
  const services = await prisma.service.findMany();

  for (const city of cities) {
    for (const service of services) {
      console.log(`Fetching listings for ${service.name} in ${city.name}...`);
      
      const rawListings = await fetchListings(city.slug, service.slug);

      for (const raw of rawListings) {
        const verdictScore = enrichListing(raw);
        const slug = `${raw.name.toLowerCase().replace(/ /g, "-")}-${city.slug}`;

        await prisma.listing.upsert({
          where: { slug },
          update: {
            rating: raw.rating,
            reviewCount: raw.reviewCount,
            verdictScore: verdictScore,
            lastVerifiedAt: new Date(),
          },
          create: {
            name: raw.name,
            slug,
            cityId: city.id,
            serviceId: service.id,
            address: raw.address,
            phone: raw.phone,
            website: raw.website,
            rating: raw.rating,
            reviewCount: raw.reviewCount,
            priceRange: raw.priceRange,
            yearFounded: raw.yearFounded,
            specialties: raw.specialties,
            source: raw.source,
            verdictScore: verdictScore,
            lastVerifiedAt: new Date(),
          },
        });
      }
    }
  }

  console.log("Data sync completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
