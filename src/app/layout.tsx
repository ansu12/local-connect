import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { GoogleAnalytics } from '@next/third-parties/google';
import { NewsletterForm } from "@/components/NewsletterForm";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "LocalConnect",
  description: "Your trusted directory for local professionals.",
  verification: {
    google: "YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <header className="border-b bg-background sticky top-0 z-10">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-tight text-primary" aria-label="LocalConnect Home">
              <Link href="/">LocalConnect</Link>
            </h1>
            <nav className="hidden md:flex gap-4" aria-label="Main Navigation">
              <Link href="/" className="text-sm font-medium hover:underline underline-offset-4" aria-label="Directory">Directory</Link>
              <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4" aria-label="About Us">About</Link>
              <Link href="/contact" className="text-sm font-medium hover:underline underline-offset-4" aria-label="Contact Us">Contact</Link>
            </nav>
          </div>
        </header>
        
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        
        <footer className="border-t py-12 bg-muted/40 mt-auto">
          <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="flex flex-col gap-4 max-w-xs">
              <h3 className="font-bold text-lg">LocalConnect</h3>
              <p className="text-sm text-muted-foreground">
                Your trusted directory for finding the best local professionals in your city.
              </p>
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} LocalConnect. All rights reserved.
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
              <h4 className="font-semibold">Newsletter</h4>
              <p className="text-sm text-muted-foreground">Subscribe to get the latest updates and tips.</p>
              <NewsletterForm />
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="font-semibold">Legal</h4>
              <nav className="flex flex-col gap-2 text-sm text-muted-foreground" aria-label="Footer Navigation">
                <Link href="/privacy" className="hover:text-foreground" aria-label="Privacy Policy">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-foreground" aria-label="Terms of Service">Terms of Service</Link>
              </nav>
            </div>
          </div>
        </footer>
      </body>
      <GoogleAnalytics gaId="G-XYZ" />
    </html>
  );
}
