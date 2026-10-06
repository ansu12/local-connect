"use client";

import React, { useEffect, useRef, useState } from 'react';

type AdPosition = 'below-hero' | 'mid-listings' | 'above-footer' | 'sidebar';

export function AdSlot({ position, className = '' }: { position: AdPosition; className?: string }) {
  const adRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(position === 'below-hero');
  const adPushed = useRef(false);

  // Ad sizes based on position to prevent CLS
  const styles = {
    'below-hero': 'min-h-[90px] w-full max-w-[728px]',
    'mid-listings': 'min-h-[250px] w-full max-w-[300px]',
    'above-footer': 'min-h-[90px] w-full max-w-[728px]',
    'sidebar': 'min-h-[600px] w-full max-w-[300px]',
  };

  useEffect(() => {
    // Lazy load observer for below-the-fold ads
    if (position === 'below-hero') return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (adRef.current) {
      observer.observe(adRef.current);
    }

    return () => observer.disconnect();
  }, [position]);

  useEffect(() => {
    // Push to Google Adsense if visible and not already pushed
    if (isVisible && !adPushed.current && typeof window !== 'undefined') {
      try {
        (window as any).adsbygoogle = (window as any).adsbygoogle || [];
        (window as any).adsbygoogle.push({});
        adPushed.current = true;
      } catch (e) {
        console.error('AdSense error', e);
      }
    }
  }, [isVisible]);

  return (
    <div 
      className={`w-full flex flex-col items-center justify-center py-4 my-4 ${className}`}
      aria-hidden="true"
    >
      <span className="text-[10px] uppercase text-muted-foreground tracking-widest mb-2 font-semibold">Advertisement</span>
      <div 
        ref={adRef}
        className={`bg-muted/5 flex items-center justify-center ${styles[position]}`}
      >
        {isVisible && (
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', height: '100%' }}
            data-ad-client="ca-pub-0000000000000000" // Placeholder AdSense ID
            data-ad-slot="1234567890" // Placeholder Ad Slot ID
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        )}
      </div>
    </div>
  );
}
