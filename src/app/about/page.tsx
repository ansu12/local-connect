import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | LocalConnect',
  description: 'Learn about our mission to connect you with the best local professionals.',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-extrabold mb-8">About LocalConnect</h1>
      <div className="prose dark:prose-invert max-w-none space-y-6 text-lg leading-relaxed text-muted-foreground">
        <p>
          Welcome to <strong className="text-foreground">LocalConnect</strong>, the premier destination for finding trusted, highly-rated local professionals in your area.
        </p>
        <h2 className="text-2xl font-bold text-foreground mt-8">Our Mission</h2>
        <p>
          Our mission is simple: to bridge the gap between skilled local service providers and the communities that need them. We believe that finding a reliable plumber, electrician, or landscaper shouldn't be a gamble. That's why we've built a comprehensive, programmatic directory that aggregates the best talent in every city across the nation.
        </p>
        <h2 className="text-2xl font-bold text-foreground mt-8">How It Works</h2>
        <p>
          We meticulously gather data, reviews, and ratings from multiple trusted sources across the web. Our proprietary algorithm ranks professionals based on their reliability, experience, and customer satisfaction. When you search for a service in your city on LocalConnect, you are presented with a curated list of the absolute best options available.
        </p>
        <h2 className="text-2xl font-bold text-foreground mt-8">Our Team</h2>
        <p>
          LocalConnect is built by a passionate team of developers, data scientists, and local commerce advocates. We are dedicated to supporting small businesses and helping homeowners make informed decisions.
        </p>
      </div>
    </div>
  );
}
