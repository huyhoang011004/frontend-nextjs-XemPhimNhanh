import React from 'react';
import Link from 'next/link';
import { Search, Film, Play, Sparkles } from 'lucide-react';
import { MovieItem } from '@/components/shared/youtube-video-card';

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: Props) {
  const { q } = await searchParams;
  return {
    title: `Tìm kiếm: "${q || ''}" | XemPhimNhanh`,
    description: `Kết quả tìm kiếm phim với từ khóa "${q || ''}" trên giao diện YouTube Dark UI.`,
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q || '';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  let results: MovieItem[] = [];

  try {
    const res = await fetch(`${apiUrl}/movies?q=${encodeURIComponent(query)}&limit=20`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      results = data.items || [];
    }
  } catch (e) {}

  // Mock fallback nếu backend chưa trả về dữ liệu
  if (results.length === 0 && query) {
    results = [
      {
        slug: 'dau-la-dai-luc-2',
        title: `Đấu La Đại Lục: Tuyệt Thế Đường Môn (${query})`,
        posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
        bannerUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80',
        description: 'Đường Môn suy tàn, một thế hệ nhân tài mới nổi lên. Liệu Hoắc Vũ Hạo có thể tái sinh vinh quang cho tông môn đã từng vang danh thiên hạ?',
        quality: '4K',
        duration: '22 phút/tập',
        episodeCurrent: 'Tập 48/52',
        views: 1420000,
        genres: ['Hành Động', 'Huyền Huyễn', 'Anime'],
        type: 'series',
      },
      {
        slug: 'black-panther-wakanda-forever',
        title: `Chiến Binh Báo Đen: Wakanda Bất Diệt (${query})`,
        posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
        bannerUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80',
        description: 'Vương quốc Wakanda phải đứng lên chống lại mối đe dọa mới từ vương quốc dưới lòng đại dương Talokan sau sự ra đi của Vua T\'Challa.',
        quality: 'Full HD',
        duration: '161 phút',
        episodeCurrent: 'Bản Đẹp',
        views: 890000,
        genres: ['Hành Động', 'Viễn Tưởng'],
        type: 'single',
      },
    ];
  }

  const formatViews = (views: number = 0) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)} Tr`;
    if (views >= 1000) return `${Math.floor(views / 1000)} N`;
    return `${views}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 pb-20">
      {/* Tiêu đề kết quả tìm kiếm */}
      <div className="flex items-center gap-2 mb-6 pb-3 border-b border-[#272727]">
        <Search className="w-5 h-5 text-[#ff0000]" />
        <h1 className="text-lg md:text-xl font-bold text-white">
          Kết quả tìm kiếm cho: <span className="text-[#3ea6ff]">"{query}"</span>
        </h1>
        <span className="text-xs text-gray-400 ml-auto">({results.length} kết quả)</span>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-24 bg-[#181818] rounded-2xl border border-[#272727]">
          <Sparkles className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white">Không tìm thấy kết quả nào</h2>
          <p className="text-gray-400 text-sm mt-1">Hãy thử tìm kiếm với từ khóa khác như "Đấu La", "Avatar", "Conan"...</p>
        </div>
      ) : (
        /* Danh sách kết quả dạng Card Hàng Ngang Lớn Chuẩn YouTube Search */
        <div className="flex flex-col gap-5">
          {results.map((movie) => (
            <Link
              key={movie.slug}
              href={`/phim/${movie.slug}/tap-1`}
              className="flex flex-col sm:flex-row gap-4 p-2 rounded-2xl hover:bg-[#272727]/40 transition group cursor-pointer"
            >
              {/* Thumbnail 16:9 lớn */}
              <div className="relative w-full sm:w-80 md:w-96 aspect-video rounded-xl overflow-hidden bg-[#1f1f1f] shrink-0 shadow-md">
                <img
                  src={movie.bannerUrl || movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-black/70 flex items-center justify-center text-white backdrop-blur-sm border border-white/20">
                    <Play className="w-5 h-5 fill-white text-[#ff0000] ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/85 text-white text-xs font-mono font-semibold px-2 py-0.5 rounded shadow">
                  {movie.episodeCurrent || movie.duration || 'Full HD'}
                </div>
              </div>

              {/* Thông tin video chi tiết */}
              <div className="flex-1 min-w-0 flex flex-col justify-start py-1">
                <h3 className="text-base sm:text-lg font-bold text-[#f1f1f1] group-hover:text-white line-clamp-2 leading-snug">
                  {movie.title}
                </h3>

                <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                  <span>{formatViews(movie.views || 0)} lượt xem</span>
                  <span>•</span>
                  <span>{movie.type === 'series' ? 'Phim Bộ' : 'Phim Lẻ'}</span>
                  {movie.quality && (
                    <span className="bg-[#ff0000]/90 text-white text-[10px] font-bold px-1.5 py-0.2 rounded">
                      {movie.quality}
                    </span>
                  )}
                </div>

                {/* Kênh / Tác giả */}
                <div className="flex items-center gap-2 my-2.5">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-red-600 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
                    {movie.title.charAt(0)}
                  </div>
                  <span className="text-xs text-gray-300 hover:text-white font-medium truncate">
                    {movie.genres?.slice(0, 3).join(' • ') || 'Phim Nhanh Official'}
                  </span>
                </div>

                <p className="text-xs md:text-sm text-gray-400 line-clamp-2 leading-relaxed">
                  {movie.description || 'Thưởng thức bộ phim với chất lượng cao nhất tại PhimNhanh.'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
