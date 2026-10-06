export async function fetchListings(citySlug: string, serviceSlug: string) {
  // Simulates fetching from an external API like Google Places or Yelp
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Return mock raw listings
  return [
    {
      name: `Elite ${serviceSlug} of ${citySlug}`,
      address: `100 Central Ave, ${citySlug}`,
      phone: `555-0199`,
      website: `https://www.elite-${serviceSlug}-${citySlug}.com`,
      rating: 4.7,
      reviewCount: 42,
      priceRange: "$$",
      yearFounded: 2015,
      specialties: "Commercial,Residential",
      source: "API",
    },
    {
      name: `Budget ${serviceSlug} ${citySlug}`,
      address: `200 Market St, ${citySlug}`,
      phone: `555-0188`,
      website: `https://www.budget-${serviceSlug}-${citySlug}.com`,
      rating: 4.2,
      reviewCount: 15,
      priceRange: "$",
      yearFounded: 2020,
      specialties: "Residential",
      source: "API",
    }
  ];
}

export function enrichListing(listing: any): number {
  // Calculates a "Verdict Score" using a weighted formula (rating, review count, completeness of profile)
  
  const ratingWeight = 0.5;
  const reviewCountWeight = 0.3;
  const completenessWeight = 0.2;

  // Normalize rating (0-5 to 0-100)
  const normalizedRating = (listing.rating / 5) * 100;

  // Normalize review count (assume 100+ is max score)
  const normalizedReviewCount = Math.min((listing.reviewCount / 100) * 100, 100);

  // Calculate completeness (address, phone, website, yearFounded, specialties)
  let completenessFields = 0;
  const totalFields = 5;
  if (listing.address) completenessFields++;
  if (listing.phone) completenessFields++;
  if (listing.website) completenessFields++;
  if (listing.yearFounded) completenessFields++;
  if (listing.specialties) completenessFields++;

  const normalizedCompleteness = (completenessFields / totalFields) * 100;

  const verdictScore = 
    (normalizedRating * ratingWeight) + 
    (normalizedReviewCount * reviewCountWeight) + 
    (normalizedCompleteness * completenessWeight);

  return Number(verdictScore.toFixed(1));
}
