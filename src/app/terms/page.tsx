import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | LocalConnect',
  description: 'Terms and conditions for using LocalConnect.',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-extrabold mb-8">Terms of Service</h1>
      <p className="text-muted-foreground mb-8">Last Updated: October 4, 2026</p>
      
      <div className="prose dark:prose-invert max-w-none space-y-6 text-lg leading-relaxed text-muted-foreground">
        <h2 className="text-2xl font-bold text-foreground mt-8">1. Acceptance of Terms</h2>
        <p>By accessing and using LocalConnect, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.</p>

        <h2 className="text-2xl font-bold text-foreground mt-8">2. Use of Service</h2>
        <p>LocalConnect provides a programmatic directory of local service professionals. We do not guarantee the quality, safety, or legality of the services provided by the professionals listed on our site. You agree to use the information provided on LocalConnect at your own risk.</p>
        
        <h2 className="text-2xl font-bold text-foreground mt-8">3. Intellectual Property</h2>
        <p>All content included on this site, such as text, graphics, logos, images, and software, is the property of LocalConnect or its content suppliers and protected by international copyright laws.</p>
        
        <h2 className="text-2xl font-bold text-foreground mt-8">4. Advertisements and Promotions</h2>
        <p>LocalConnect may run advertisements and promotions from third parties on the Site. Your business dealings or correspondence with, or participation in promotions of, advertisers other than LocalConnect, and any terms, conditions, warranties, or representations associated with such dealings, are solely between you and such third party. LocalConnect is not responsible or liable for any loss or damage of any sort incurred as the result of any such dealings or as the result of the presence of third-party advertisers on the Site.</p>

        <h2 className="text-2xl font-bold text-foreground mt-8">5. Modifications to Service</h2>
        <p>LocalConnect reserves the right at any time and from time to time to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice.</p>
      </div>
    </div>
  );
}
