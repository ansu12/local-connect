export async function fetchListings(citySlug: string, serviceSlug: string) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  
  if (!apiKey) {
    console.warn("GOOGLE_PLACES_API_KEY is not set. Falling back to mock data.");
    return getMockData(citySlug, serviceSlug);
  }

  // Format the query: e.g. "plumber in austin-tx"
  const query = `${serviceSlug.replace(/-/g, ' ')} in ${citySlug.replace(/-/g, ' ')}`;
  
  try {
    const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        // Request specific fields to save data and money
        "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.priceLevel,places.primaryType",
      },
      body: JSON.stringify({
        textQuery: query,
        maxResultCount: 10,
      }),
    });

    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.places) return [];

    return data.places.map((place: any) => ({
      name: place.displayName?.text || "Unknown Business",
      address: place.formattedAddress || "Address not provided",
      phone: place.nationalPhoneNumber || null,
      website: place.websiteUri || null,
      rating: place.rating || 0,
      reviewCount: place.userRatingCount || 0,
      priceRange: place.priceLevel === 'PRICE_LEVEL_INEXPENSIVE' ? '$' : 
                  place.priceLevel === 'PRICE_LEVEL_MODERATE' ? '$$' : 
                  place.priceLevel === 'PRICE_LEVEL_EXPENSIVE' ? '$$$' : null,
      yearFounded: null, // Google doesn't provide this; enricher agent will find it
      specialties: place.primaryType ? place.primaryType.replace(/_/g, ' ') : "General",
      source: "Google Places API",
    }));

  } catch (error) {
    console.error("Failed to fetch real listings:", error);
    return getMockData(citySlug, serviceSlug); // Safe fallback
  }
}

function getMockData(citySlug: string, serviceSlug: string) {
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
      source: "Mock API",
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
      source: "Mock API",
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
