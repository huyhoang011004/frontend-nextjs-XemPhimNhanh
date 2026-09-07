'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { History, Trash2, PauseCircle, Search, Play, Clock, Sparkles } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/use-auth-store';

interface HistoryItem {
  movieId: {
    _id: string;
    title: string;
    slug: string;
    posterUrl: string;
    bannerUrl?: string;
    duration?: string;
  };
  episodeSlug: string;
  duration: number; // số giây đã xem
  totalDuration?: number; // tổng số giây
  watchedAt?: string;
}

export default function HistoryPage() {
  const { user } = useAuthStore();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchHistory, setSearchHistory] = useState('');

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    if (user) {
      try {
        const res = await apiClient.get('/user-experience/history');
        if (res.data.success) {
          setHistory(res.data.history || []);
        }
      } catch (e) {}
    } else {
      // Mock history cho khách
      setHistory([
        {
          movieId: {
            _id: '1',
            title: 'Đấu La Đại Lục - Phần 2: Tuyệt Thế Đường Môn',
            slug: 'dau-la-dai-luc-2',
            posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
            bannerUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80',
            duration: '22 phút',
          },
          episodeSlug: 'tap-48',
          duration: 950,
          totalDuration: 1320,
          watchedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
        {
          movieId: {
            _id: '2',
            title: 'Chiến Binh Báo Đen: Wakanda Bất Diệt',
            slug: 'black-panther-wakanda-forever',
            posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
            bannerUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80',
            duration: '161 phút',
          },
          episodeSlug: 'tap-1',
          duration: 4800,
          totalDuration: 9660,
          watchedAt: new Date(Date.now() - 3600000 * 26).toISOString(),
        },
      ]);
    }
    setLoading(false);
  };

  const handleClearHistory = () => {
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử xem không?')) {
      setHistory([]);
      alert('Đã xóa toàn bộ nhật ký xem video!');
    }
  };

  const filteredHistory = history.filter((item) =>
    item.movieId?.title?.toLowerCase().includes(searchHistory.toLowerCase())
  );

  const formatProgress = (duration: number = 0, total: number = 100) => {
    if (!total || total === 0) return 30;
    return Math.min(100, Math.round((duration / total) * 100));
  };

  const formatTime = (seconds: number = 0) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 pb-20">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* CỘT TRÁI: DANH SÁCH VIDEO ĐÃ XEM KÈM THANH TIẾN ĐỘ ĐỎ */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-6 pb-2 border-b border-[#272727]">
            <History className="w-5 h-5 text-[#ff0000]" />
            <h1 className="text-xl font-bold text-white tracking-tight">
              Nhật Ký Xem Video
            </h1>
          </div>

          {filteredHistory.length === 0 ? (
            <div className="text-center py-20 bg-[#161616] rounded-2xl border border-[#272727]">
              <Sparkles className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">Chưa có video nào trong nhật ký</h3>
              <p className="text-xs text-gray-400 mt-1">Các video bạn xem sẽ được lưu lại tại đây.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredHistory.map((item, idx) => {
                const percent = formatProgress(item.duration, item.totalDuration);
                return (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row gap-4 p-2 rounded-2xl hover:bg-[#272727]/50 transition group"
                  >
                    {/* Thumbnail kèm Progress Bar màu đỏ YouTube */}
                    <Link
                      href={`/phim/${item.movieId?.slug}/${item.episodeSlug || 'tap-1'}`}
                      className="relative w-full sm:w-60 aspect-video rounded-xl overflow-hidden bg-[#1f1f1f] shrink-0 shadow"
                    >
                      <img
                        src={item.movieId?.bannerUrl || item.movieId?.posterUrl}
                        alt={item.movieId?.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Play className="w-8 h-8 fill-white text-[#ff0000]" />
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/85 text-white text-[10px] font-mono px-1.5 py-0.5 rounded shadow">
                        {item.episodeSlug?.toUpperCase() || 'TẬP 1'}
                      </div>

                      {/* Thanh Tiến Độ Màu Đỏ Chuẩn YouTube (Progress Bar) */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                        <div
                          className="h-full bg-[#ff0000]"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </Link>

                    {/* Thông tin video */}
                    <div className="flex-1 min-w-0 flex flex-col justify-start">
                      <Link
                        href={`/phim/${item.movieId?.slug}/${item.episodeSlug || 'tap-1'}`}
                        className="text-sm sm:text-base font-semibold text-[#f1f1f1] group-hover:text-white line-clamp-2 leading-snug"
                      >
                        {item.movieId?.title} - {item.episodeSlug?.replace('-', ' ').toUpperCase()}
                      </Link>

                      <p className="text-xs text-gray-400 mt-1">
                        Đã xem: <strong className="text-[#3ea6ff] font-mono">{formatTime(item.duration)}</strong> / {formatTime(item.totalDuration || 1200)} ({percent}%)
                      </p>

                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Đã xem gần đây</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* CỘT PHẢI: BẢNG ĐIỀU KHIỂN NHẬT KÝ KIỂU YOUTUBE */}
        <div className="w-full lg:w-72 shrink-0 flex flex-col gap-4">
          <div className="p-4 bg-[#1e1e1e] border border-[#2e2e2e] rounded-2xl shadow-xl flex flex-col gap-4">
            <h3 className="text-sm font-bold text-white border-b border-[#2e2e2e] pb-2">
              Quản Lý Lịch Sử
            </h3>

            {/* Ô tìm kiếm trong lịch sử */}
            <div className="relative">
              <input
                type="text"
                value={searchHistory}
                onChange={(e) => setSearchHistory(e.target.value)}
                placeholder="Tìm trong lịch sử..."
                className="w-full px-3 py-2 pl-8 bg-[#121212] border border-[#383838] rounded-xl text-xs text-white outline-none focus:border-[#3ea6ff]"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Nút Xóa tất cả */}
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-200 hover:bg-[#272727] hover:text-red-400 transition text-left"
            >
              <Trash2 className="w-4 h-4" />
              <span>Xóa toàn bộ nhật ký xem</span>
            </button>

            {/* Nút Tạm dừng */}
            <button
              onClick={() => alert('Đã tạm dừng lưu nhật ký xem video!')}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-200 hover:bg-[#272727] transition text-left"
            >
              <PauseCircle className="w-4 h-4" />
              <span>Tạm dừng nhật ký xem</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
