import { notFound } from 'next/navigation';
import { YoutubeWatchView } from '@/components/watch/youtube-watch-view';
import { MovieItem } from '@/components/shared/youtube-video-card';

interface Props {
  params: Promise<{ slug: string; episode: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug, episode } = await params;
  const readableEp = episode.replace('-', ' ').toUpperCase();
  return {
    title: `Xem phim ${slug} - ${readableEp} Full HD Vietsub | XemPhimNhanh`,
    description: `Thưởng thức ${readableEp} bộ phim ${slug} chất lượng cao chuẩn Full HD, không quảng cáo giật lag trên giao diện YouTube Dark UI.`,
    openGraph: {
      title: `${slug} - ${readableEp} | PhimNhanh`,
      description: `Xem ngay tập phim ${readableEp} với phụ đề chuẩn và hình ảnh sắc nét.`,
    },
  };
}

export default async function WatchPage({ params }: Props) {
  const { slug, episode } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // 1. Khởi tạo dữ liệu mặc định chuẩn cho phim
  let movie: MovieItem = {
    _id: 'mock-movie-id',
    title: slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    slug,
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80',
    description: 'Một bộ phim bom tấn đỉnh cao với kỹ xảo ấn tượng và cốt truyện kịch tính.',
    views: 1450000,
    genres: ['Hành Động', 'Huyền Huyễn', 'Anime'],
    quality: 'Full HD',
    duration: '45 phút/tập',
    episodeCurrent: 'Tập 24/24',
    type: 'series',
  };

  // 2. Khởi tạo danh sách 12 tập mẫu
  let allEpisodes = Array.from({ length: 12 }).map((_, i) => ({
    name: `Tập ${i + 1}`,
    slug: `tap-${i + 1}`,
    serverData: [
      {
        serverName: 'VIP 1 (HLS)',
        type: 'hls',
        linkM3u8: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
      },
      {
        serverName: 'Dự phòng (Iframe)',
        type: 'iframe',
        linkIframe: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      },
    ],
  }));

  // 3. Khởi tạo danh sách phim liên quan đề xuất (Recommended)
  let relatedMovies: MovieItem[] = [
    {
      slug: 'chien-binh-bao-den',
      title: 'Chiến Binh Báo Đen: Wakanda Bất Diệt',
      posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80',
      views: 890000,
      duration: '161 phút',
      episodeCurrent: 'FHD',
      genres: ['Hành Động', 'Viễn Tưởng'],
      type: 'single',
    },
    {
      slug: 'thon-phe-tinh-khong',
      title: 'Thôn Phệ Tinh Không - Bản Hoạt Hình 4K',
      posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
      views: 2150000,
      duration: '20 phút/tập',
      episodeCurrent: 'Tập 112',
      genres: ['Anime', 'Khoa Học'],
      type: 'series',
    },
    {
      slug: 'avatar-dong-chay-cua-nuoc',
      title: 'Avatar 2: Dòng Chảy Của Nước',
      posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
      views: 3450000,
      duration: '192 phút',
      episodeCurrent: '4K',
      genres: ['Viễn Tưởng', 'Phiêu Lưu'],
      type: 'single',
    },
    {
      slug: 'oppenheimer',
      title: 'Oppenheimer - Kẻ Kiến Tạo Hủy Diệt',
      posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1200&auto=format&fit=crop&q=80',
      views: 1820000,
      duration: '180 phút',
      episodeCurrent: 'Bản Đẹp',
      genres: ['Lịch Sử', 'Tâm Lý'],
      type: 'single',
    },
  ];

  // 4. Gọi API backend lấy dữ liệu thực tế (SSR)
  try {
    const [movieRes, episodesRes, relatedRes] = await Promise.all([
      fetch(`${apiUrl}/movies/${slug}`, { cache: 'no-store' }),
      fetch(`${apiUrl}/episodes/movie/${slug}`, { cache: 'no-store' }),
      fetch(`${apiUrl}/movies/${slug}/related`, { cache: 'no-store' }),
    ]);

    if (movieRes.ok) {
      const data = await movieRes.json();
      if (data) movie = data;
    }

    if (episodesRes.ok) {
      const data = await episodesRes.json();
      if (data && data.length > 0) allEpisodes = data;
    }

    if (relatedRes.ok) {
      const data = await relatedRes.json();
      if (data && data.length > 0) relatedMovies = data;
    }
  } catch (e) {
    // Tự động sử dụng mock data fallback khi backend offline
  }

  // 5. Xác định tập phim hiện tại
  const currentEpisode =
    allEpisodes.find((ep) => ep.slug === episode) || allEpisodes[0];

  // 6. Dữ liệu có cấu trúc JSON-LD VideoObject cho SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: `${movie.title} - ${currentEpisode.name}`,
    description: `Xem tập phim ${currentEpisode.name} của ${movie.title} chất lượng cao trên PhimNhanh`,
    thumbnailUrl: movie.bannerUrl || movie.posterUrl,
    uploadDate: new Date().toISOString(),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <YoutubeWatchView
        movie={movie}
        currentEpisode={currentEpisode}
        allEpisodes={allEpisodes}
        relatedMovies={relatedMovies}
      />
    </>
  );
}
