import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function SkeletonLoader({ className }: { className?: string }) {
  return (
    <Skeleton className={`w-full h-64 rounded-lg ${className || ''}`} />
  );
}
