'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Review = {
  id: string;
  author: string;
  rating: number;
  text: string;
};

export function ReviewCarousel({ reviews }: { reviews: Review[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!reviews || reviews.length === 0) return null;

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const currentReview = reviews[currentIndex];

  return (
    <div className="relative w-full max-w-lg mx-auto mt-8">
      <Card className="bg-card shadow-sm border-primary/10">
        <CardContent className="p-6 text-center space-y-4">
          <div className="flex justify-center space-x-1 text-primary">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < currentReview.rating ? 'text-primary' : 'text-muted'}>
                ★
              </span>
            ))}
          </div>
          <p className="text-muted-foreground italic">"{currentReview.text}"</p>
          <p className="font-semibold text-foreground">- {currentReview.author}</p>
        </CardContent>
      </Card>
      
      <div className="flex justify-between items-center mt-4">
        <Button variant="outline" size="sm" onClick={prev} aria-label="Previous Review">
          Previous
        </Button>
        <span className="text-xs text-muted-foreground">
          {currentIndex + 1} of {reviews.length}
        </span>
        <Button variant="outline" size="sm" onClick={next} aria-label="Next Review">
          Next
        </Button>
      </div>
    </div>
  );
}
