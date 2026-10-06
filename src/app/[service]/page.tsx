import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export async function generateStaticParams() {
  const services = await prisma.service.findMany();
  return services.map((s) => ({ service: s.slug }));
}

export default async function ServiceHubPage({ params }: { params: Promise<{ service: string }> }) {
  const resolvedParams = await params;
  const service = await prisma.service.findUnique({
    where: { slug: resolvedParams.service },
  });

  if (!service) notFound();

  // Get all cities that have listings for this service
  const citiesWithService = await prisma.city.findMany({
    where: {
      listings: {
        some: { serviceId: service.id }
      }
    },
    include: {
      _count: {
        select: { listings: { where: { serviceId: service.id } } }
      }
    },
    orderBy: { population: 'desc' }
  });

  return (
    <div className="w-full">
      <section className="bg-primary/5 py-20 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
          Top-Rated {service.name}s
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mt-4">
          {service.description} Select a city below to find the best local professionals near you.
        </p>
      </section>

      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Browse by City</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {citiesWithService.map((city) => (
            <Link key={city.id} href={`/${service.slug}/${city.slug}`}>
              <Card className="hover:shadow-md transition-shadow hover:border-primary cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-xl">{city.name}, {city.stateAbbr}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary">{city._count.listings} Pros Available</Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
