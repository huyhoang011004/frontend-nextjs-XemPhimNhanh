import { SkeletonLoader } from '@/components/shared/skeleton-loader';

export default function Loading() {
  return (
    <div className="flex flex-col gap-8 pb-12 w-full">
      <div className="w-full h-[50vh] bg-gray-900 animate-pulse"></div>
      
      <section className="px-4 md:px-8">
        <div className="h-8 w-48 bg-gray-800 animate-pulse rounded mb-4"></div>
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="min-w-[200px] flex-1">
              <SkeletonLoader />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
