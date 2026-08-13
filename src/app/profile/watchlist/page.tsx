'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import Link from 'next/link';
import { useAuthStore } from '@/store/use-auth-store';

export default function WatchlistPage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchWatchlist();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchWatchlist = async () => {
    try {
      const res = await apiClient.get('/user-experience/followed');
      if (res.data.success) {
        setMovies(res.data.movies);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const unfollow = async (movieId: string) => {
    try {
      await apiClient.post(`/user-experience/follow/${movieId}`);
      setMovies(movies.filter(m => m._id !== movieId));
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (!user) return <div className="text-gray-400">Vui lòng đăng nhập để xem tủ phim.</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Phim Đã Theo Dõi</h1>
      
      {movies.length === 0 ? (
        <p className="text-gray-400">Bạn chưa theo dõi bộ phim nào.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map(movie => (
            <div key={movie._id} className="group relative rounded overflow-hidden shadow-lg bg-black">
              <Link href={`/phim/${movie.slug}`}>
                <img src={movie.posterUrl} alt={movie.title} className="w-full h-64 object-cover group-hover:opacity-80 transition" />
              </Link>
              <div className="p-3">
                <Link href={`/phim/${movie.slug}`} className="font-bold text-sm line-clamp-1 hover:text-blue-500">
                  {movie.title}
                </Link>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded">{movie.type}</span>
                  <button 
                    onClick={() => unfollow(movie._id)}
                    className="text-xs text-red-500 hover:underline font-medium"
                  >
                    Bỏ theo dõi
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
