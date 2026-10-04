import React from 'react';

export function AdSlot({ id, className = '' }: { id: string; className?: string }) {
  return (
    <div className={`w-full flex flex-col items-center justify-center bg-muted/20 border border-dashed rounded-lg py-6 my-8 ${className}`}>
      <span className="text-[10px] uppercase text-muted-foreground tracking-widest mb-3 font-semibold">Advertisement</span>
      <div 
        id={id}
        className="w-full max-w-[728px] h-[90px] bg-muted/40 flex items-center justify-center text-muted-foreground/60 font-medium rounded shadow-sm"
      >
        Ad Space ({id})
      </div>
    </div>
  );
}
