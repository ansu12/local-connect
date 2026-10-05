import Link from 'next/link';
import { ReactNode } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { VariantProps } from 'class-variance-authority';

type AffiliateLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: VariantProps<typeof buttonVariants>['variant'];
};

export function AffiliateLink({ href, children, className, variant = 'default' }: AffiliateLinkProps) {
  return (
    <Link 
      href={href}
      target="_blank"
      rel="sponsored nofollow"
      className={cn(buttonVariants({ variant }), className)}
    >
      {children}
    </Link>
  );
}
