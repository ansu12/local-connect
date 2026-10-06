import { City, Service, Listing } from "@prisma/client";

// National Averages Config
export const NATIONAL_AVERAGES = {
  rating: 4.2,
  priceRange: "$$",
  percent24_7: 20, // 20%
};

// Simple helper to format price range
function getAveragePrice(listings: Listing[]) {
  if (listings.length === 0) return "$$";
  let totalLength = 0;
  for (const l of listings) {
    totalLength += l.priceRange ? l.priceRange.length : 2;
  }
  const avg = Math.round(totalLength / listings.length);
  return "$".repeat(Math.max(1, Math.min(avg, 4)));
}

export function generateLocalInsight(city: City, service: Service, listings: Listing[]): string {
  if (listings.length === 0) {
    return `We are currently gathering data on ${service.category.toLowerCase()} professionals in ${city.name}, ${city.stateAbbr}. Check back soon for local insights.`;
  }

  // 1. Calculate aggregate stats
  const totalListings = listings.length;
  
  let totalRating = 0;
  let emergencyCount = 0;

  for (const listing of listings) {
    totalRating += listing.rating;
    // Check if specialties include 24/7 or Emergency
    const specs = listing.specialties.toLowerCase();
    if (specs.includes('24/7') || specs.includes('emergency')) {
      emergencyCount++;
    }
  }

  const avgRating = totalRating / totalListings;
  const percent24_7 = (emergencyCount / totalListings) * 100;
  const avgPrice = getAveragePrice(listings);

  // 2. Compare to national averages
  const ratingDiff = avgRating - NATIONAL_AVERAGES.rating;
  const ratingCompareStr = ratingDiff > 0 
    ? `${((ratingDiff / NATIONAL_AVERAGES.rating) * 100).toFixed(0)}% above the national average`
    : ratingDiff < 0 
      ? `slightly below the national average of ${NATIONAL_AVERAGES.rating}`
      : `right in line with the national average`;

  const emergencyCompareStr = percent24_7 > NATIONAL_AVERAGES.percent24_7
    ? `a higher rate than most ${city.state} cities`
    : `consistent with industry norms`;

  // 3. Generate varied sentence structures based on a pseudo-random seed (city.id length)
  const seed = city.id.length % 3;

  const populationStr = city.population ? ` serving a population of ${(city.population / 1000).toFixed(0)}k` : "";

  if (seed === 0) {
    return `${city.name}'s ${service.name.toLowerCase()} market is notably competitive, with ${totalListings} verified professionals${populationStr}. The average rating of ${avgRating.toFixed(1)} stars is ${ratingCompareStr}, and ${percent24_7.toFixed(0)}% of local pros offer 24/7 emergency service — ${emergencyCompareStr}.`;
  } else if (seed === 1) {
    return `When it comes to ${service.category.toLowerCase()} in ${city.name}, residents have access to ${totalListings} top-tier experts. Averaging ${avgRating.toFixed(1)} stars (${ratingCompareStr}), the local market is strong. Furthermore, ${percent24_7.toFixed(0)}% of these businesses provide round-the-clock emergency support, which is ${emergencyCompareStr}.`;
  } else {
    return `The ${service.name.toLowerCase()} industry in ${city.name} features ${totalListings} local companies${populationStr}. With a typical price point of ${avgPrice} and an impressive average rating of ${avgRating.toFixed(1)} stars, the area sits ${ratingCompareStr}. Notably, ${percent24_7.toFixed(0)}% are equipped for 24/7 emergencies (${emergencyCompareStr}).`;
  }
}
