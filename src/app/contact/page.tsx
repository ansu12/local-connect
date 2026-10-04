import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Contact Us | LocalConnect',
  description: 'Get in touch with the LocalConnect team.',
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <h1 className="text-4xl font-extrabold mb-8 text-center">Contact Us</h1>
      <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
        Have a question, feedback, or need support? We'd love to hear from you. Fill out the form below or reach out via mail.
      </p>

      <div className="grid md:grid-cols-2 gap-12">
        <Card>
          <CardHeader>
            <CardTitle>Send us a Message</CardTitle>
            <CardDescription>We typically respond within 24 hours.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="name">Name</label>
              <Input id="name" placeholder="Your Name" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">Email</label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="message">Message</label>
              <textarea 
                id="message" 
                className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" 
                placeholder="How can we help?"
              ></textarea>
            </div>
            <Button className="w-full">Send Message</Button>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Corporate Office</h3>
            <p className="text-muted-foreground leading-relaxed">
              LocalConnect Inc.<br />
              P.O. Box 12345<br />
              San Francisco, CA 94104<br />
              United States
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">Email</h3>
            <p className="text-muted-foreground">
              <a href="mailto:support@localconnect.com" className="hover:text-primary transition-colors">support@localconnect.com</a><br />
              <a href="mailto:partnerships@localconnect.com" className="hover:text-primary transition-colors">partnerships@localconnect.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
