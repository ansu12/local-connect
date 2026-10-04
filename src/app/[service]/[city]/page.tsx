import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { Metadata } from "next";
import { SchemaOrg } from "@/components/SchemaOrg";
import Image from "next/image";
import dynamic from "next/dynamic";
import React from "react";
import { AdSlot } from "@/components/AdSlot";

const ReviewCarousel = dynamic(
  () => import('@/components/ReviewCarousel').then((mod) => mod.ReviewCarousel),
  { ssr: false, loading: () => <div className="h-32 flex items-center justify-center text-muted-foreground animate-pulse">Loading reviews...</div> }
);

export async function generateStaticParams() {
  const cities = await prisma.city.findMany();
  const services = await prisma.service.findMany();

  const params = [];
  for (const city of cities) {
    for (const service of services) {
      params.push({
        city: city.slug,
        service: service.slug,
      });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ service: string; city: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  
  const city = await prisma.city.findUnique({ where: { slug: resolvedParams.city } });
  const service = await prisma.service.findUnique({ where: { slug: resolvedParams.service } });

  if (!city || !service) {
    return { title: 'Not Found' };
  }

  const title = `Top 10 ${service.name} in ${city.name} - LocalConnect`;
  const description = `Looking for a ${service.name} in ${city.name}? Compare ratings, prices, and reviews for the best local pros.`;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.localconnect.com';
  const url = `${baseUrl}/${service.slug}/${city.slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'LocalConnect',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`,
          width: 1200,
          height: 630,
          alt: title,
        }
      ]
    },
  };
}

export default async function ServiceCityPage({ params }: { params: Promise<{ service: string; city: string }> }) {
  const resolvedParams = await params;
  
  const city = await prisma.city.findUnique({
    where: { slug: resolvedParams.city },
    include: {
      nearbyCities: true,
    }
  });

  const service = await prisma.service.findUnique({
    where: { slug: resolvedParams.service },
  });

  if (!city || !service) {
    notFound();
  }

  const listings = await prisma.listing.findMany({
    where: {
      cityId: city.id,
      serviceId: service.id,
    },
    orderBy: {
      rating: 'desc',
    },
    include: {
      reviews: {
        take: 5,
        orderBy: { rating: 'desc' },
      },
    },
  });

  // 4. FAQ Data
  const faqs = [
    {
      question: `How much does a ${service.name} cost in ${city.name}?`,
      answer: `The cost of a ${service.name} in ${city.name} varies depending on the specific requirements, but generally ranges based on local market rates for ${city.state}. We recommend getting quotes from our verified professionals.`
    },
    {
      question: `How do I find the best ${service.name} in ${city.name}?`,
      answer: `You can browse our directory of ${listings.length} verified ${service.name} professionals in ${city.name}. Look at ratings, reviews, and years of experience to make your choice.`
    },
    {
      question: `Are these ${service.name}s licensed in ${city.state}?`,
      answer: `Yes, we strive to list 100% verified local pros who comply with ${city.stateAbbr} state licensing requirements for ${service.category}. Always verify their current status before hiring.`
    }
  ];

  return (
    <div className="w-full">
      {/* 1. Hero */}
      <section className="bg-primary/5 py-20 px-4">
        <div className="container mx-auto text-center space-y-6">
          <Badge variant="secondary" className="mb-4 text-sm font-semibold px-4 py-1">100% Verified Local Pros</Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
            Find the Best {service.name} in {city.name}, {city.stateAbbr}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {service.description} Compare top-rated local experts and get the job done right.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4">
        <AdSlot id="ad-below-hero" />
      </div>

      {/* 2. Local Stats */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-8 text-center md:text-left">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Serving the vibrant community of <span className="font-semibold text-foreground">{city.name}</span> (Population: {city.population?.toLocaleString()}). 
            With a median income of ${city.medianIncome?.toLocaleString()}, residents demand high-quality {service.category.toLowerCase()}. 
            We've found <span className="font-bold text-primary">{listings.length} top-rated professionals</span> ready to help.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 grid md:grid-cols-3 gap-12">
        {/* 3. Listings Grid */}
        <div className="md:col-span-2 space-y-8">
          <h2 className="text-3xl font-bold">Top {service.name}s in {city.name}</h2>
          
          <div className="grid gap-6">
            {listings.map((listing, index) => (
              <React.Fragment key={listing.id}>
                <Card className="overflow-hidden transition-all hover:shadow-md">
                  <CardHeader className="pb-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-start gap-4">
                      <Image
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(listing.name)}&background=random`}
                        alt={`${listing.name} logo`}
                        width={48}
                        height={48}
                        sizes="48px"
                        priority={index < 3}
                        className="rounded-full shadow-sm"
                      />
                      <div>
                        <CardTitle className="text-xl">
                          <Link href={`/${service.slug}/${city.slug}/${listing.slug}`} className="hover:text-primary transition-colors" aria-label={`View ${listing.name} profile`}>
                            {listing.name}
                          </Link>
                        </CardTitle>
                        <CardDescription className="mt-1">{listing.address}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-primary/10 text-primary font-bold text-sm shrink-0">
                      ★ {listing.rating.toFixed(1)} ({listing.reviewCount})
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {listing.specialties.split(',').map((spec) => (
                      <Badge key={spec} variant="secondary" className="font-normal">{spec.trim()}</Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-x-6 gap-y-2">
                    <span>Price: <strong className="text-foreground">{listing.priceRange}</strong></span>
                    <span>Founded: <strong className="text-foreground">{listing.yearFounded}</strong></span>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/30 pt-4 border-t flex flex-wrap justify-between items-center gap-4">
                  <span className="text-sm font-medium">{listing.phone}</span>
                  <Button asChild>
                    <Link href={`/${service.slug}/${city.slug}/${listing.slug}`} aria-label={`View profile for ${listing.name}`}>View Profile</Link>
                  </Button>
                </CardFooter>
              </Card>
              {index === 2 && <AdSlot id="ad-in-feed" />}
              </React.Fragment>
            ))}
            
            {listings.length === 0 && (
              <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
                <p className="text-muted-foreground">No listings found for this category in {city.name}.</p>
              </div>
            )}
          </div>

          {/* Reviews Section */}
          {listings.some(l => l.reviews.length > 0) && (
            <section className="mt-12">
              <h3 className="text-2xl font-bold mb-4">What Locals Are Saying</h3>
              <ReviewCarousel 
                reviews={listings.flatMap(l => l.reviews).sort((a, b) => b.rating - a.rating).slice(0, 10)} 
              />
            </section>
          )}

          {/* 4. Local FAQ Section */}
          <section className="mt-16 space-y-6">
            <h3 className="text-2xl font-bold">Frequently Asked Questions</h3>
            
            <SchemaOrg city={city} service={service} listings={listings} />

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border rounded-lg p-6 bg-card transition-colors hover:border-primary/50">
                  <h4 className="font-semibold text-lg mb-2">{faq.question}</h4>
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* 6. CTA Form */}
          <Card className="border-primary/20 shadow-lg sticky top-24">
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle>Request a Quote</CardTitle>
              <CardDescription>Get matched with top {service.name}s in {city.name}.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="quote-description">What do you need done?</label>
                <Input id="quote-description" placeholder="Brief description of the job..." aria-label="Job description" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="quote-name">Your Name</label>
                <Input id="quote-name" placeholder="John Doe" aria-label="Your Name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="quote-contact">Phone or Email</label>
                <Input id="quote-contact" placeholder="Contact info" aria-label="Contact info" />
              </div>
              <Button className="w-full font-bold text-md h-12 mt-2" aria-label="Get Free Quotes">Get Free Quotes</Button>
            </CardContent>
          </Card>

          {/* 5. Internal Linking */}
          {city.nearbyCities && city.nearbyCities.length > 0 && (
            <div className="space-y-4 pt-4">
              <h3 className="font-semibold text-lg border-b pb-2">Also Serving Nearby</h3>
              <ul className="space-y-3">
                {city.nearbyCities.slice(0, 3).map((nearby) => (
                  <li key={nearby.id}>
                    <Link 
                      href={`/${service.slug}/${nearby.slug}`}
                      className="text-primary hover:underline flex items-center gap-2 group"
                      aria-label={`View ${service.name}s in ${nearby.name}`}
                    >
                      <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span> 
                      {service.name}s in {nearby.name}, {nearby.stateAbbr}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      
      <div className="container mx-auto px-4 pb-12">
        <AdSlot id="ad-above-footer" />
      </div>
    </div>
  );
}
