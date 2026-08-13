import { MovieCard } from '@/components/shared/movie-card';
import Link from 'next/link';

export const revalidate = 300; // ISR 300s

interface Props {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: Props) {
  const { category } = await params;
  return {
    title: `Danh sách phim ${category} | WebPhimNhanh`,
    description: `Khám phá danh sách phim ${category} mới nhất và hấp dẫn nhất.`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  const resolvedSearchParams = await searchParams;
  
  const genre = resolvedSearchParams.genre as string;
  const year = resolvedSearchParams.year as string;
  const sort = resolvedSearchParams.sort as string;

  // Mock data fetching
  const newMovies = Array.from({ length: 12 }).map((_, i) => ({
    slug: `phim-${category}-${i}`,
    title: `Phim ${category} ${i + 1}`,
    posterUrl: 'https://via.placeholder.com/300x450',
  }));

  return (
    <div className="px-4 md:px-8 py-8 w-full">
      <h1 className="text-3xl font-bold text-white mb-6 capitalize">
        Phim {category.replace('-', ' ')}
      </h1>
      
      {/* Filter Bar */}
      <div className="flex flex-wrap gap-4 mb-8 bg-card p-4 rounded-lg border border-border items-center">
        <select className="bg-background text-foreground border border-border p-2 rounded min-w-[150px]" defaultValue={genre || ''}>
          <option value="">Tất cả thể loại</option>
          <option value="hanh-dong">Hành Động</option>
          <option value="tinh-cam">Tình Cảm</option>
        </select>
        <select className="bg-background text-foreground border border-border p-2 rounded min-w-[150px]" defaultValue={year || ''}>
          <option value="">Tất cả năm</option>
          <option value="2026">2026</option>
          <option value="2025">2025</option>
        </select>
        <select className="bg-background text-foreground border border-border p-2 rounded min-w-[150px]" defaultValue={sort || ''}>
          <option value="">Mới cập nhật</option>
          <option value="views">Lượt xem nhiều nhất</option>
        </select>
        <button className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition">
          Lọc
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        {newMovies.map((movie) => (
          <MovieCard key={movie.slug} title={movie.title} posterUrl={movie.posterUrl} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2">
        <button className="px-4 py-2 bg-card border border-border rounded text-white hover:bg-gray-800 transition">Trước</button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded font-bold shadow">1</button>
        <button className="px-4 py-2 bg-card border border-border rounded text-white hover:bg-gray-800 transition">2</button>
        <button className="px-4 py-2 bg-card border border-border rounded text-white hover:bg-gray-800 transition">Sau</button>
      </div>
    </div>
  );
}
