import { notFound } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import Link from 'next/link';

interface Props {
  params: Promise<{ playlistSlug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { playlistSlug } = await params;
  try {
    const res = await apiClient.get(`/playlists/${playlistSlug}`);
    if (res.data.success && res.data.data) {
      return {
        title: `${res.data.data.title} | WebPhimNhanh`,
        description: res.data.data.description || `Danh sách phát ${res.data.data.title}`,
      };
    }
  } catch (e) {}
  
  return {
    title: 'Playlist không tồn tại',
  };
}

export default async function PublicPlaylistPage({ params }: Props) {
  const { playlistSlug } = await params;
  
  let playlist = null;
  try {
    const res = await apiClient.get(`/playlists/${playlistSlug}`);
    if (res.data.success) {
      playlist = res.data.data;
    }
  } catch (e) {}

  if (!playlist) return notFound();

  return (
    <div className="w-full px-4 md:px-8 py-12 min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-end gap-6 mb-12 bg-gray-900 p-8 rounded-xl border border-gray-800 shadow-2xl">
          <div className="w-48 h-48 bg-gray-800 rounded-lg shadow-lg flex items-center justify-center shrink-0">
            <svg className="w-20 h-20 text-gray-700" fill="currentColor" viewBox="0 0 20 20"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" /></svg>
          </div>
          <div className="flex-1">
            <span className="text-sm font-bold text-blue-500 uppercase tracking-widest">Public Playlist</span>
            <h1 className="text-4xl md:text-5xl font-black mt-2 mb-4">{playlist.title}</h1>
            <p className="text-gray-400 mb-6">{playlist.description}</p>
            <div className="flex gap-4 items-center">
              <span className="text-sm font-medium text-gray-500">{playlist.viewsCount} lượt xem</span>
              <span className="text-sm font-medium text-gray-500">•</span>
              <span className="text-sm font-medium text-gray-500">{playlist.movieIds.length} phim</span>
            </div>
          </div>
          <div>
            <button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-full font-bold shadow-lg shadow-blue-900/20 transition transform hover:scale-105 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
              Phát Tất Cả
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {playlist.movieIds.map((movie: any, idx: number) => (
            <div key={idx} className="group relative rounded-lg overflow-hidden shadow-lg bg-gray-900 border border-gray-800 hover:border-gray-600 transition">
              <Link href={`/phim/${movie.slug}`}>
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img src={movie.posterUrl || 'https://via.placeholder.com/300x450'} alt={movie.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
                </div>
              </Link>
              <div className="p-3">
                <Link href={`/phim/${movie.slug}`} className="font-bold text-sm line-clamp-1 hover:text-blue-500">
                  {movie.title}
                </Link>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded font-medium">{movie.type}</span>
                  <span className="text-xs text-yellow-500 font-bold flex items-center gap-1">
                    ★ {movie.ratingStar > 0 ? movie.ratingStar : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {playlist.movieIds.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            Danh sách phát này chưa có phim nào.
          </div>
        )}
      </div>
    </div>
  );
}
