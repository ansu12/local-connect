import React from 'react';

type SchemaOrgProps = {
  city: any;
  service: any;
  listings: any[];
};

export function SchemaOrg({ city, service, listings }: SchemaOrgProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.localconnect.com';
  
  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": service.name,
        "item": `${baseUrl}/${service.slug}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": city.name,
        "item": `${baseUrl}/${service.slug}/${city.slug}`
      }
    ]
  };

  const localBusinesses = listings.map((listing, index) => ({
    "@type": "LocalBusiness",
    "name": listing.name,
    "image": `${baseUrl}/images/placeholder.jpg`,
    "@id": `${baseUrl}/${service.slug}/${city.slug}/${listing.slug}`,
    "url": `${baseUrl}/${service.slug}/${city.slug}/${listing.slug}`,
    "telephone": listing.phone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": listing.address,
      "addressLocality": city.name,
      "addressRegion": city.stateAbbr,
      "addressCountry": "US"
    },
    "aggregateRating": listing.reviewCount > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": listing.rating,
      "reviewCount": listing.reviewCount
    } : undefined
  }));

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": localBusinesses.map((business, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": business
    }))
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `How much does a ${service.name} cost in ${city.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The cost of a ${service.name} in ${city.name} varies depending on the specific requirements, but generally ranges based on local market rates for ${city.state}. We recommend getting quotes from our verified professionals.`
        }
      },
      {
        "@type": "Question",
        "name": `How do I find the best ${service.name} in ${city.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `You can browse our directory of ${listings.length} verified ${service.name} professionals in ${city.name}. Look at ratings, reviews, and years of experience to make your choice.`
        }
      },
      {
        "@type": "Question",
        "name": `Are these ${service.name}s licensed in ${city.state}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes, we strive to list 100% verified local pros who comply with ${city.stateAbbr} state licensing requirements for ${service.category}. Always verify their current status before hiring.`
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
    </>
  );
}
