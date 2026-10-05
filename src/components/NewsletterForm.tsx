"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    // Simulate API call to Resend or other newsletter service
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1000);
  };

  if (status === 'success') {
    return (
      <div className="text-sm font-medium text-primary bg-primary/10 p-3 rounded-md border border-primary/20 text-center animate-in fade-in duration-300">
        Thanks for subscribing! Check your inbox soon.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col sm:flex-row items-center gap-2">
      <Input 
        type="email" 
        placeholder="Email address" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required 
        aria-label="Email address for newsletter"
        className="bg-background flex-1"
      />
      <Button type="submit" disabled={status === 'loading'} className="w-full sm:w-auto">
        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
      </Button>
    </form>
  );
}
