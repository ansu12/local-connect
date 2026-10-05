import Image from 'next/image';
import { ReactNode } from 'react';

type MascotStateProps = {
  type: 'loading' | 'empty' | 'error' | 'success';
  title: string;
  description: ReactNode;
};

export function MascotState({ type, title, description }: MascotStateProps) {
  const imageMap = {
    loading: '/images/mascots/loading.jpg',
    empty: '/images/mascots/empty.jpg',
    error: '/images/mascots/error.jpg',
    success: '/images/mascots/success.jpg',
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 space-y-4 animate-in fade-in zoom-in duration-500">
      <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg bg-background">
        <Image
          src={imageMap[type]}
          alt={`${type} mascot`}
          fill
          className="object-cover"
        />
      </div>
      <h3 className="text-2xl font-bold tracking-tight text-foreground">{title}</h3>
      <div className="text-muted-foreground max-w-md">{description}</div>
    </div>
  );
}
