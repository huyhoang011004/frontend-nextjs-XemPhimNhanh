'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MoreVertical, Bookmark, Share2, Play } from 'lucide-react';

export interface MovieItem {
  _id?: string;
  slug: string;
  title: string;
  originTitle?: string;
  posterUrl: string;
  bannerUrl?: string;
  description?: string;
  episodeCurrent?: string;
  episodeTotal?: number;
  duration?: string;
  quality?: string;
  views?: number;
  genres?: string[];
  createdAt?: string;
  updatedAt?: string;
  type?: string;
}

interface Props {
  movie: MovieItem;
}

function formatViews(views: number = 0) {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)} Tr lượt xem`;
  if (views >= 1000) return `${Math.floor(views / 1000)} N lượt xem`;
  return `${views} lượt xem`;
}

function formatTimeAgo(dateStr?: string) {
  if (!dateStr) return 'Mới cập nhật';
  const past = new Date(dateStr).getTime();
  if (isNaN(past)) return 'Mới cập nhật';
  return 'Gần đây';
}

export function YoutubeVideoCard({ movie }: Props) {
  const [showMenu, setShowMenu] = useState(false);

  // Ưu tiên bannerUrl (ngang 16:9), nếu không có dùng posterUrl
  const imageSrc = movie.bannerUrl || movie.posterUrl || 'https://via.placeholder.com/640x360';

  // Badge góc dưới phải: ưu tiên số tập hoặc thời lượng hoặc chất lượng
  const badgeText = movie.episodeCurrent || movie.duration || movie.quality || 'Full HD';

  return (
    <div className="flex flex-col gap-3 group relative cursor-pointer select-none">
      {/* Khung Thumbnail tỷ lệ 16:9 bo góc tròn */}
      <Link href={`/phim/${movie.slug}/tap-1`} className="relative aspect-video rounded-xl overflow-hidden bg-[#1f1f1f] shadow-sm group-hover:shadow-lg transition-all duration-200">
        <img
          src={imageSrc}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Nút Play hiển thị khi hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
          <div className="w-12 h-12 rounded-full bg-black/70 flex items-center justify-center text-white backdrop-blur-sm border border-white/20 shadow-xl group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 fill-white ml-0.5 text-[#ff0000]" />
          </div>
        </div>

        {/* Badge thời lượng / tập phim ở góc dưới bên phải chuẩn YouTube */}
        <div className="absolute bottom-2 right-2 bg-black/85 text-white text-[11px] font-semibold font-mono px-1.5 py-0.5 rounded backdrop-blur-sm shadow">
          {badgeText}
        </div>

        {/* Badge chất lượng / thể loại góc trên bên trái */}
        {movie.quality && (
          <div className="absolute top-2 left-2 bg-[#ff0000]/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow uppercase">
            {movie.quality}
          </div>
        )}
      </Link>

      {/* Thông tin video bên dưới Thumbnail */}
      <div className="flex gap-3 items-start px-0.5">
        {/* Avatar kênh / Thể loại phim (Tròn) */}
        <Link href={`/phim/${movie.slug}`} className="shrink-0" title={movie.title}>
          <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 border border-[#383838] flex items-center justify-center text-white font-bold text-xs shadow">
            {movie.title.charAt(0).toUpperCase()}
          </div>
        </Link>

        {/* Nội dung text */}
        <div className="flex-1 min-w-0">
          <Link href={`/phim/${movie.slug}/tap-1`} className="block">
            <h3 
              className="text-[#f1f1f1] group-hover:text-white font-semibold text-sm leading-snug line-clamp-2"
              title={movie.title}
            >
              {movie.title}
            </h3>
          </Link>

          <Link 
            href={`/phim/${movie.slug}`}
            className="text-xs text-[#aaaaaa] hover:text-white mt-1 block truncate transition-colors"
          >
            {movie.genres?.slice(0, 2).join(' • ') || (movie.type === 'series' ? 'Phim Bộ' : 'Phim Lẻ')}
          </Link>

          <div className="text-xs text-[#aaaaaa] flex items-center gap-1 mt-0.5">
            <span>{formatViews(movie.views || 0)}</span>
            <span>•</span>
            <span>{formatTimeAgo(movie.updatedAt || movie.createdAt)}</span>
          </div>
        </div>

        {/* Nút menu 3 chấm */}
        <div className="relative shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 rounded-full text-transparent group-hover:text-[#aaaaaa] hover:!text-white hover:bg-[#272727] transition-all"
            aria-label="Tùy chọn khác"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div 
              className="absolute right-0 bottom-full mb-2 w-48 bg-[#282828] border border-[#383838] rounded-xl shadow-2xl py-1.5 z-40 text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => {
                  setShowMenu(false);
                  alert(`Đã lưu "${movie.title}" vào Xem sau!`);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-gray-200 hover:bg-[#383838] transition text-left"
              >
                <Bookmark className="w-4 h-4" />
                <span>Lưu vào Xem sau</span>
              </button>
              <button 
                onClick={() => {
                  setShowMenu(false);
                  if (typeof navigator !== 'undefined' && navigator.clipboard) {
                    navigator.clipboard.writeText(`${window.location.origin}/phim/${movie.slug}`);
                    alert('Đã sao chép liên kết phim vào bộ nhớ tạm!');
                  }
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-gray-200 hover:bg-[#383838] transition text-left"
              >
                <Share2 className="w-4 h-4" />
                <span>Chia sẻ phim</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
