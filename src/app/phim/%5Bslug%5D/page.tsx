import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  Play, 
  Bell, 
  Share2, 
  Star, 
  Calendar, 
  Film, 
  CheckCircle2, 
  Info,
  ListVideo
} from 'lucide-react';
import { MovieItem } from '@/components/shared/youtube-video-card';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  return {
    title: `Kênh phim: ${title} Full HD Vietsub | XemPhimNhanh`,
    description: `Khám phá toàn bộ danh sách tập, diễn viên và thông tin chi tiết của ${title} trên nền tảng YouTube Dark UI.`,
    openGraph: {
      title: `${title} | PhimNhanh`,
      description: `Xem trọn bộ ${title} miễn phí, chất lượng cao.`,
    },
  };
}

export default async function MovieDetailPage({ params }: Props) {
  const { slug } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  let movie: MovieItem = {
    _id: 'mock-id',
    title: slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    slug,
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80',
    description: 'Bộ phim hấp dẫn với kỹ xảo hoành tráng, âm thanh chân thực và dàn diễn viên xuất sắc. Khám phá toàn bộ các tập phim được cập nhật liên tục.',
    releaseYear: 2026,
    quality: '4K Full HD',
    duration: '45 phút/tập',
    episodeCurrent: 'Tập 24/24 (Hoàn tất)',
    episodeTotal: 24,
    views: 1250000,
    genres: ['Hành Động', 'Huyền Huyễn', 'Anime'],
    type: 'series',
  } as any;

  let episodes: Array<{ name: string; slug: string }> = Array.from({ length: 12 }).map((_, i) => ({
    name: `Tập ${i + 1}`,
    slug: `tap-${i + 1}`,
  }));

  try {
    const [movieRes, epRes] = await Promise.all([
      fetch(`${apiUrl}/movies/${slug}`, { next: { revalidate: 60 } }),
      fetch(`${apiUrl}/episodes/movie/${slug}`, { next: { revalidate: 60 } }),
    ]);

    if (movieRes.ok) {
      const data = await movieRes.json();
      if (data) movie = data;
    }

    if (epRes.ok) {
      const data = await epRes.json();
      if (data && data.length > 0) episodes = data;
    }
  } catch (e) {}

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movie.title,
    image: movie.bannerUrl || movie.posterUrl,
    description: movie.description,
    dateCreated: (movie as any).releaseYear?.toString() || '2026',
  };

  return (
    <div className="w-full min-h-screen pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Banner Kênh Phim (YouTube Channel Art) */}
      <div className="w-full h-44 sm:h-64 md:h-80 bg-gradient-to-t from-black via-transparent to-transparent relative overflow-hidden">
        <img
          src={movie.bannerUrl || movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-black/40 to-black/20" />
      </div>

      {/* Thông tin Kênh Phim Chuẩn YouTube */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 -mt-16 sm:-mt-20 relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 pb-6 border-b border-[#272727]">
          {/* Avatar Kênh Phim Lớn Tròn */}
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-[#0f0f0f] bg-gradient-to-tr from-red-600 to-indigo-600 flex items-center justify-center text-white font-black text-4xl shadow-2xl shrink-0">
            {movie.title.charAt(0).toUpperCase()}
          </div>

          {/* Tiêu đề & Thông tin kênh */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {movie.title}
              </h1>
              <CheckCircle2 className="w-5 h-5 text-[#3ea6ff] fill-[#3ea6ff]/20" />
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs md:text-sm text-gray-400 mt-1.5 font-medium">
              <span>@{movie.slug}</span>
              <span>•</span>
              <span>128 N người đăng ký</span>
              <span>•</span>
              <span>{episodes.length} tập phim</span>
              <span>•</span>
              <span className="text-[#3ea6ff]">{new Intl.NumberFormat('vi-VN').format(movie.views || 1250000)} lượt xem</span>
            </div>

            <p className="text-gray-300 text-xs md:text-sm mt-3 line-clamp-2 max-w-2xl">
              {movie.description}
            </p>

            {/* Cụm nút hành động YouTube */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
              <Link
                href={`/phim/${slug}/tap-1`}
                className="px-6 py-2.5 bg-[#ff0000] hover:bg-red-700 text-white font-bold rounded-full text-sm shadow-lg hover:scale-105 transition-all flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Xem Ngay Tập 1</span>
              </Link>

              <button className="px-5 py-2.5 bg-white hover:bg-gray-200 text-black font-bold rounded-full text-sm transition shadow flex items-center gap-1.5">
                <Bell className="w-4 h-4" />
                <span>Đăng ký theo dõi</span>
              </button>

              <button className="p-2.5 bg-[#272727] hover:bg-[#383838] text-white rounded-full transition shadow">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Thanh Tab Danh Mục Kênh */}
        <div className="flex items-center gap-6 border-b border-[#272727] text-sm font-semibold mt-4">
          <button className="pb-3 border-b-2 border-white text-white flex items-center gap-1.5">
            <ListVideo className="w-4 h-4 text-[#ff0000]" />
            <span>Danh Sách Tập ({episodes.length})</span>
          </button>
          <button className="pb-3 text-gray-400 hover:text-white transition flex items-center gap-1.5">
            <Info className="w-4 h-4" />
            <span>Thông Tin & Giới Thiệu</span>
          </button>
        </div>

        {/* Lưới Danh Sách Các Tập Chuẩn YouTube Video Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
          {episodes.map((ep, idx) => (
            <Link
              key={ep.slug}
              href={`/phim/${slug}/${ep.slug}`}
              className="group flex flex-col gap-2 p-2 rounded-xl hover:bg-[#272727] transition-all cursor-pointer"
            >
              <div className="relative aspect-video rounded-lg overflow-hidden bg-[#1f1f1f] shadow">
                <img
                  src={movie.bannerUrl || movie.posterUrl}
                  alt={ep.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Play className="w-6 h-6 fill-white text-[#ff0000]" />
                </div>
                <div className="absolute bottom-1 right-1 bg-black/85 text-white text-[10px] font-mono px-1 rounded">
                  HD
                </div>
              </div>
              <div className="px-0.5">
                <h4 className="text-white text-xs font-semibold truncate group-hover:text-[#ff0000] transition-colors">
                  {ep.name}
                </h4>
                <p className="text-[11px] text-gray-400 truncate mt-0.5">
                  Tập {idx + 1} • Vietsub
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
