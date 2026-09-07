import { YoutubeVideoCard, MovieItem } from '@/components/shared/youtube-video-card';
import Link from 'next/link';
import { Flame, SlidersHorizontal, Film } from 'lucide-react';

export const revalidate = 300; // ISR 300s

interface Props {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: Props) {
  const { category } = await params;
  const title = category === 'trending' ? 'Phim Thịnh Hành' : `Danh sách phim ${category.replace('-', ' ')}`;
  return {
    title: `${title} Full HD | XemPhimNhanh`,
    description: `Khám phá các bộ phim ${title} hay nhất, cập nhật liên tục với chất lượng cao trên giao diện YouTube Dark UI.`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  const resolvedSearchParams = await searchParams;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const genre = resolvedSearchParams.genre as string;
  const sort = (resolvedSearchParams.sort as string) || (category === 'trending' ? 'trending' : 'newest');

  // Khởi tạo danh sách mẫu fallback phong phú
  let movies: MovieItem[] = Array.from({ length: 12 }).map((_, i) => ({
    slug: `phim-${category}-${i + 1}`,
    title: `${category === 'trending' ? 'Thịnh Hành' : 'Phim ' + category.replace('-', ' ').toUpperCase()} Số ${i + 1}`,
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80',
    views: 850000 + i * 45000,
    quality: 'Full HD',
    episodeCurrent: `Tập ${i + 1}/24`,
    duration: '45 phút',
    genres: ['Hành Động', 'Phiêu Lưu'],
    type: category === 'phim-bo' ? 'series' : 'single',
    updatedAt: new Date(Date.now() - i * 3600000 * 6).toISOString(),
  }));

  // Gọi API Backend lấy danh sách phim
  try {
    let queryParams = `limit=24&sort=${sort}`;
    if (category === 'phim-bo') queryParams += '&type=series';
    if (category === 'phim-le') queryParams += '&type=single';
    if (genre) queryParams += `&genres=${encodeURIComponent(genre)}`;

    const res = await fetch(`${apiUrl}/movies?${queryParams}`, {
      next: { revalidate: 300 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        movies = data.items;
      }
    }
  } catch (e) {}

  const readableTitle =
    category === 'trending'
      ? 'Phim Thịnh Hành & Được Xem Nhiều Nhất'
      : category === 'phim-bo'
      ? 'Tuyển Tập Phim Bộ Hot'
      : category === 'phim-le'
      ? 'Kho Phim Lẻ Đỉnh Cao'
      : category === 'anime'
      ? 'Anime & Hoạt Hình Nhật Bản'
      : `Phim ${category.replace('-', ' ')}`;

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-20 max-w-[1720px] mx-auto">
      {/* Tiêu đề danh mục kiểu YouTube Trending / Category */}
      <div className="flex items-center justify-between pb-4 border-b border-[#272727] mb-6">
        <div className="flex items-center gap-3">
          {category === 'trending' ? (
            <div className="w-10 h-10 rounded-full bg-[#ff0000] flex items-center justify-center text-white shadow">
              <Flame className="w-6 h-6 fill-white" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#272727] flex items-center justify-center text-[#3ea6ff]">
              <Film className="w-6 h-6" />
            </div>
          )}
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white capitalize tracking-tight">
              {readableTitle}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Cập nhật liên tục các tập mới nhất với chất lượng Full HD
            </p>
          </div>
        </div>
      </div>

      {/* Thanh Pill Filters chọn nhanh */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <Link
          href={`/danh-sach/${category}?sort=trending`}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
            sort === 'trending' ? 'bg-white text-black' : 'bg-[#272727] text-gray-300 hover:bg-[#383838]'
          }`}
        >
          Thịnh hành nhất
        </Link>
        <Link
          href={`/danh-sach/${category}?sort=newest`}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
            sort === 'newest' ? 'bg-white text-black' : 'bg-[#272727] text-gray-300 hover:bg-[#383838]'
          }`}
        >
          Mới cập nhật
        </Link>
        <Link
          href={`/danh-sach/${category}?sort=rating`}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
            sort === 'rating' ? 'bg-white text-black' : 'bg-[#272727] text-gray-300 hover:bg-[#383838]'
          }`}
        >
          Đánh giá cao
        </Link>
      </div>

      {/* Lưới Video Card 16:9 Chuẩn YouTube */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8">
        {movies.map((movie) => (
          <YoutubeVideoCard key={movie.slug} movie={movie} />
        ))}
      </div>
    </div>
  );
}
