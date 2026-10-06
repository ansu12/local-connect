import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";

export default async function Home() {
  const services = await prisma.service.findMany({
    include: {
      _count: {
        select: { listings: true }
      }
    }
  });

  const cities = await prisma.city.findMany({
    take: 12,
    orderBy: { population: 'desc' }
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary/5 py-24 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Find the Best Local Professionals
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Compare ratings, reviews, and prices for thousands of local contractors, plumbers, and electricians in your area.
        </p>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4 container mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center">Browse by Service</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <Link 
              key={service.id} 
              href={`/${service.slug}`}
              className="group p-6 rounded-xl border bg-card hover:border-primary transition-colors flex flex-col items-center text-center shadow-sm"
            >
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{service.name}</h3>
              <p className="text-sm text-muted-foreground mt-2">{service._count.listings} professionals</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Cities Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">Popular Cities</h2>
          <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
            {cities.map((city) => (
              <Link 
                key={city.id} 
                href={`/plumber/${city.slug}`} // Demoing plumber route for quick access
                className={buttonVariants({ variant: "outline" })}
              >
                {city.name}, {city.stateAbbr}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
