import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Create 5 Cities
  const citiesData = [
    { name: "Springfield", state: "Illinois", stateAbbr: "IL", slug: "springfield-il", population: 114394, medianIncome: 55000 },
    { name: "Shelbyville", state: "Illinois", stateAbbr: "IL", slug: "shelbyville-il", population: 45000, medianIncome: 50000 },
    { name: "Capital City", state: "Illinois", stateAbbr: "IL", slug: "capital-city-il", population: 2000000, medianIncome: 75000 },
    { name: "Ogdenville", state: "Illinois", stateAbbr: "IL", slug: "ogdenville-il", population: 20000, medianIncome: 48000 },
    { name: "North Haverbrook", state: "Illinois", stateAbbr: "IL", slug: "north-haverbrook-il", population: 15000, medianIncome: 45000 },
  ];

  const createdCities = await Promise.all(
    citiesData.map((c) => prisma.city.upsert({ where: { slug: c.slug }, update: {}, create: c }))
  );

  // Link Springfield and Shelbyville as nearby
  await prisma.city.update({
    where: { slug: "springfield-il" },
    data: { nearbyCities: { connect: { slug: "shelbyville-il" } } }
  });

  // 2. Create 5 Services
  const servicesData = [
    { name: "Plumber", slug: "plumber", category: "Home Services", description: "Expert plumbing services for residential and commercial needs." },
    { name: "Electrician", slug: "electrician", category: "Home Services", description: "Licensed electricians for repairs, wiring, and installations." },
    { name: "Landscaper", slug: "landscaper", category: "Outdoor", description: "Lawn care, landscaping, and garden maintenance." },
    { name: "HVAC Technician", slug: "hvac", category: "Home Services", description: "Heating, ventilation, and air conditioning services." },
    { name: "Pest Control", slug: "pest-control", category: "Maintenance", description: "Exterminators and pest control services." },
  ];

  const createdServices = await Promise.all(
    servicesData.map((s) => prisma.service.upsert({ where: { slug: s.slug }, update: {}, create: s }))
  );

  // 3. Create 20 Listings
  console.log("Creating listings...");
  
  const companyPrefixes = ["Acme", "Superior", "Elite", "Pro", "Reliable", "City", "Metro", "Express"];
  let listingIndex = 0;

  for (const city of createdCities) {
    for (const service of createdServices) {
      if (listingIndex >= 20) break; // Limit to 20 total
      
      const prefix = companyPrefixes[listingIndex % companyPrefixes.length];
      const name = `${prefix} ${service.name}s of ${city.name}`;
      const slug = `${name.toLowerCase().replace(/ /g, "-")}-${city.slug}`;

      await prisma.listing.upsert({
        where: { slug },
        update: {},
        create: {
          name,
          slug,
          cityId: city.id,
          serviceId: service.id,
          address: `${100 + listingIndex} Main St, ${city.name}, ${city.stateAbbr}`,
          phone: `555-01${listingIndex.toString().padStart(2, "0")}`,
          website: `https://www.${slug}.example.com`,
          rating: Number((Math.random() * 2 + 3).toFixed(1)), // Rating between 3.0 and 5.0
          reviewCount: Math.floor(Math.random() * 100) + 1,
          priceRange: "$$",
          yearFounded: 1990 + Math.floor(Math.random() * 30),
          lastVerifiedAt: new Date(),
          specialties: "Residential,Commercial,Emergency Services",
          source: "Manual",
          reviews: {
            create: [
              { author: "John Doe", rating: 5, text: "Great service, highly recommend!" },
              { author: "Jane Smith", rating: 4, text: "Good work, but slightly expensive." }
            ]
          }
        }
      });
      listingIndex++;
    }
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
