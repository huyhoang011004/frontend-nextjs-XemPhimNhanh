import React from 'react';

export function Carousel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex overflow-x-auto gap-4 py-4 scrollbar-hide">
      {children}
    </div>
  );
}
