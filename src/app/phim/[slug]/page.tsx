import { notFound } from 'next/navigation';
import Link from 'next/link';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return {
    title: `Xem phim ${slug} HD Vietsub | WebPhimNhanh`,
    description: `Nội dung phim ${slug} chi tiết.`,
    openGraph: {
      title: `Phim ${slug}`,
      images: ['https://via.placeholder.com/1200x630'],
    }
  };
}

export default async function MovieDetailPage({ params }: Props) {
  const { slug } = await params;

  // Mock dữ liệu
  const movie = {
    title: `Đấu La Đại Lục (${slug})`,
    slug,
    description: 'Một bộ phim rất hay với những pha hành động nghẹt thở.',
    releaseYear: 2026,
    posterUrl: 'https://via.placeholder.com/300x450',
    bannerUrl: 'https://via.placeholder.com/1200x400',
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movie.title,
    image: movie.posterUrl,
    description: movie.description,
    dateCreated: movie.releaseYear.toString(),
  };

  return (
    <div className="w-full pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Banner */}
      <div 
        className="w-full h-[40vh] md:h-[60vh] bg-cover bg-center relative"
        style={{ backgroundImage: `url(${movie.bannerUrl})` }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="px-4 md:px-8 -mt-32 relative z-10 flex flex-col md:flex-row gap-8">
        <img src={movie.posterUrl} alt={movie.title} className="w-48 h-72 md:w-64 md:h-96 rounded-lg shadow-xl border-4 border-card object-cover" />
        <div className="pt-8 md:pt-32 text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{movie.title}</h1>
          <p className="text-gray-300 max-w-2xl text-lg mb-6">{movie.description}</p>
          <div className="flex gap-4 items-center">
            <span className="px-3 py-1 bg-gray-800 rounded text-sm text-gray-300 border border-border">Năm: {movie.releaseYear}</span>
            <span className="px-3 py-1 bg-gray-800 rounded text-sm text-gray-300 border border-border">HD Vietsub</span>
          </div>
          <Link href={`/phim/${slug}/tap-1`} className="inline-block mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105">
            Xem Phim
          </Link>
        </div>
      </div>

      <div className="px-4 md:px-8 mt-12 bg-card p-6 mx-4 md:mx-8 rounded-lg border border-border">
        <h2 className="text-2xl font-bold text-white mb-4">Danh Sách Tập</h2>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <Link 
              key={i} 
              href={`/phim/${slug}/tap-${i+1}`}
              className="bg-background border border-border text-gray-300 px-4 py-2 rounded hover:bg-blue-600 hover:text-white transition"
            >
              Tập {i + 1}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
