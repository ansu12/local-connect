import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.localconnect.com';

  const cities = await prisma.city.findMany();
  const services = await prisma.service.findMany();
  const listings = await prisma.listing.findMany({
    include: {
      city: true,
      service: true,
    }
  });

  const sitemapEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    }
  ];

  for (const city of cities) {
    for (const service of services) {
      sitemapEntries.push({
        url: `${baseUrl}/${service.slug}/${city.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  for (const listing of listings) {
    sitemapEntries.push({
      url: `${baseUrl}/${listing.service.slug}/${listing.city.slug}/${listing.slug}`,
      lastModified: listing.lastVerifiedAt || new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  }

  return sitemapEntries;
}
