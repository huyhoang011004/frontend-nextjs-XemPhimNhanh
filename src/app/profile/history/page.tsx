'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import Link from 'next/link';
import { useAuthStore } from '@/store/use-auth-store';

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchHistory();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      const res = await apiClient.get('/user-experience/history');
      if (res.data.success) {
        // Sắp xếp theo watchedAt mới nhất
        const sorted = res.data.history.sort((a: any, b: any) => new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime());
        setHistory(sorted);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (!user) return <div className="text-gray-400">Vui lòng đăng nhập để xem lịch sử.</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Lịch Sử Xem Phim</h1>
      
      {history.length === 0 ? (
        <p className="text-gray-400">Bạn chưa xem bộ phim nào.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {history.map((item, idx) => {
            const movie = item.movieId;
            if (!movie) return null;
            const progress = item.totalDuration ? (item.duration / item.totalDuration) * 100 : 0;
            
            return (
              <div key={idx} className="flex gap-4 bg-black p-4 rounded-lg border border-gray-800 hover:border-gray-700 transition shadow">
                <Link href={`/phim/${movie.slug}/${item.episodeSlug}`}>
                  <div className="w-24 h-36 bg-gray-900 rounded overflow-hidden relative">
                    <img src={movie.posterUrl || 'https://via.placeholder.com/150'} alt={movie.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                    </div>
                  </div>
                </Link>
                
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <Link href={`/phim/${movie.slug}/${item.episodeSlug}`} className="text-xl font-bold hover:text-blue-500 line-clamp-1 transition">
                      {movie.title}
                    </Link>
                    <p className="text-blue-400 font-medium text-sm mt-1">Tập đang xem: {item.episodeSlug}</p>
                    <p className="text-gray-500 text-xs mt-2">Xem lần cuối: {new Date(item.watchedAt).toLocaleString('vi-VN')}</p>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-1 font-medium">
                      <span>{formatTime(item.duration || 0)}</span>
                      <span>{formatTime(item.totalDuration || 0)}</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
