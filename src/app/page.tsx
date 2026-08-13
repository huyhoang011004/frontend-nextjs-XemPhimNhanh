import { MovieCard } from '@/components/shared/movie-card';
import { Carousel } from '@/components/shared/carousel';

export const revalidate = 60; // ISR 60s

export default async function HomePage() {
  // Mock dữ liệu giao diện
  const newMovies = Array.from({ length: 10 }).map((_, i) => ({
    slug: `phim-moi-${i}`,
    title: `Phim Mới Cập Nhật ${i + 1}`,
    posterUrl: 'https://via.placeholder.com/300x450',
  }));

  return (
    <div className="flex flex-col gap-8 pb-12 w-full">
      <section className="w-full h-[50vh] bg-gray-900 flex items-center justify-center text-white relative">
        <h1 className="text-4xl font-bold z-10">Hero Carousel Banner (Embla)</h1>
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </section>

      <section className="px-4 md:px-8">
        <h2 className="text-2xl font-bold mb-4 text-white">Phim Mới Cập Nhật</h2>
        <Carousel>
          {newMovies.map((movie) => (
            <div key={movie.slug} className="min-w-[200px]">
              <MovieCard title={movie.title} posterUrl={movie.posterUrl} />
            </div>
          ))}
        </Carousel>
      </section>

      <section className="px-4 md:px-8">
        <h2 className="text-2xl font-bold mb-4 text-white">Phim Bộ Hot</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {newMovies.slice(0, 6).map((movie) => (
            <MovieCard key={movie.slug} title={movie.title} posterUrl={movie.posterUrl} />
          ))}
        </div>
      </section>
    </div>
  );
}
