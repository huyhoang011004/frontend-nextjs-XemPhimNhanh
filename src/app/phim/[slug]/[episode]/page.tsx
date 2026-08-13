import { notFound } from 'next/navigation';
import { VideoPlayer } from '@/components/shared/video-player';
import Link from 'next/link';

interface Props {
  params: Promise<{ slug: string; episode: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug, episode } = await params;
  return {
    title: `Xem phim ${slug} - ${episode} Full HD | WebPhimNhanh`,
    description: `Thưởng thức tập ${episode} phim ${slug} chất lượng cao, không giật lag.`,
  };
}

export default async function WatchPage({ params }: Props) {
  const { slug, episode } = await params;

  // Mock data
  const mockMovie = {
    title: `Đấu La Đại Lục`,
    slug: slug,
  };

  const mockEpisode = {
    name: episode.replace('-', ' ').toUpperCase(), // VD: 'tap-1' -> 'TAP 1'
    slug: episode,
    serverData: [
      { serverName: 'VIP 1 (HLS)', type: 'hls', linkM3u8: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
      { serverName: 'Dự phòng (Iframe)', type: 'iframe', linkIframe: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    ]
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: `${mockMovie.title} - ${mockEpisode.name}`,
    description: `Xem tập phim ${mockEpisode.name} của ${mockMovie.title}`,
    thumbnailUrl: 'https://via.placeholder.com/1200x630',
    uploadDate: new Date().toISOString(),
  };

  return (
    <div className="w-full px-4 md:px-8 py-8 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="text-gray-400 mb-6 flex gap-2 items-center text-sm font-medium">
          <Link href="/" className="hover:text-white transition">Trang chủ</Link> 
          <span>/</span>
          <Link href={`/phim/${slug}`} className="hover:text-white transition truncate max-w-[200px]">{mockMovie.title}</Link>
          <span>/</span>
          <span className="text-white">{mockEpisode.name}</span>
        </div>

        <VideoPlayer 
          servers={mockEpisode.serverData} 
          movieId="mock-movie-id-123" 
          episodeSlug={mockEpisode.slug} 
        />
      </div>
    </div>
  );
}
