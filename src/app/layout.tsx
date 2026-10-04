import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "LocalConnect",
  description: "Your trusted directory for local professionals.",
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
        
        <footer className="border-t py-6 bg-muted/40 mt-auto">
          <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} LocalConnect. All rights reserved.
            </p>
            <nav className="flex gap-4 text-sm text-muted-foreground" aria-label="Footer Navigation">
              <Link href="/privacy" className="hover:text-foreground" aria-label="Privacy Policy">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground" aria-label="Terms of Service">Terms</Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
