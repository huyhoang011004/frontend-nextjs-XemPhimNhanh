'use client';

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';

export function Carousel({ children }: { children: React.ReactNode }) {
  const [emblaRef] = useEmblaCarousel({ loop: false, align: 'start', slidesToScroll: 2 });

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex gap-4 py-4 touch-pan-y">
        {children}
      </div>
    </div>
  );
}
