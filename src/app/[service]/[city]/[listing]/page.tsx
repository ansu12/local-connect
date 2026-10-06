import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MascotState } from "@/components/MascotState";

export async function generateStaticParams() {
  const listings = await prisma.listing.findMany({
    include: { city: true, service: true }
  });
  
  return listings.map((l) => ({
    service: l.service.slug,
    city: l.city.slug,
    listing: l.slug,
  }));
}

export default async function ListingDetailPage({ params }: { params: Promise<{ service: string; city: string; listing: string }> }) {
  const resolvedParams = await params;
  
  const listing = await prisma.listing.findUnique({
    where: { slug: resolvedParams.listing },
    include: {
      city: true,
      service: true,
      reviews: true,
    }
  });

  // Verify URL hierarchy is correct
  if (!listing || listing.city.slug !== resolvedParams.city || listing.service.slug !== resolvedParams.service) {
    notFound();
  }

  const specialtiesList = listing.specialties.split(',').filter(Boolean);

  return (
    <div className="w-full">
      <section className="bg-primary/5 py-16 px-4">
        <div className="container mx-auto">
          <Badge className="mb-4 text-sm font-semibold px-4 py-1">Top Rated {listing.service.name}</Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
            {listing.name}
          </h1>
          <p className="text-xl text-muted-foreground mt-4 max-w-2xl">
            {listing.address} • Serving {listing.city.name} since {listing.yearFounded}
          </p>
          <div className="flex items-center gap-4 mt-6">
            <Badge variant="outline" className="bg-primary/10 text-primary font-bold text-lg px-4 py-2">
              ★ {listing.rating.toFixed(1)} ({listing.reviewCount} Reviews)
            </Badge>
            <span className="font-semibold text-lg text-green-600 bg-green-100 px-4 py-2 rounded-full border border-green-200">
              Verdict Score: {listing.verdictScore}/100
            </span>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-8">
          
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">About {listing.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                {listing.name} is a premier {listing.service.category.toLowerCase()} business located in the heart of {listing.city.name}, {listing.city.stateAbbr}. 
                Founded in {listing.yearFounded}, they have built a reputation for excellence.
              </p>
              
              <h3 className="font-bold text-lg mt-6">Specialties</h3>
              <div className="flex gap-2 flex-wrap">
                {specialtiesList.length > 0 ? specialtiesList.map(s => (
                  <Badge key={s} variant="secondary" className="px-3 py-1 text-sm">{s.trim()}</Badge>
                )) : <span className="text-muted-foreground italic">General services</span>}
              </div>
            </CardContent>
          </Card>

          {listing.reviews.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Customer Reviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {listing.reviews.map(review => (
                  <div key={review.id} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold">{review.author}</span>
                      <span className="text-yellow-500 font-bold">★ {review.rating.toFixed(1)}</span>
                    </div>
                    <p className="text-muted-foreground italic">"{review.text}"</p>
                    <span className="text-xs text-muted-foreground mt-2 block">{new Date(review.date).toLocaleDateString()}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : (
            <MascotState type="empty" title="No Reviews Yet" description="Be the first to leave a review!" />
          )}
          
        </div>

        <div className="space-y-6">
          <Card className="sticky top-24 border-primary/20 shadow-lg">
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle>Contact Business</CardTitle>
              <CardDescription>Get a free quote today.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div>
                <span className="text-sm font-semibold text-muted-foreground block mb-1">Phone Number</span>
                <span className="text-xl font-bold">{listing.phone || "Contact via Website"}</span>
              </div>
              
              {listing.website && (
                <div>
                  <span className="text-sm font-semibold text-muted-foreground block mb-1">Website</span>
                  <a href={listing.website} target="_blank" rel="nofollow noopener noreferrer" className="text-primary hover:underline break-all">
                    {listing.website}
                  </a>
                </div>
              )}

              <div className="pt-4">
                <Button className="w-full text-lg h-14 font-bold">Request a Quote</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
