'use client';

import React from 'react';
import Link from 'next/link';
import { MovieItem } from './youtube-video-card';

interface Props {
  movie: MovieItem;
}

export function CompactVideoCard({ movie }: Props) {
  const formatViews = (views: number = 0) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)} Tr`;
    if (views >= 1000) return `${Math.floor(views / 1000)} N`;
    return `${views}`;
  };

  const imageSrc = movie.bannerUrl || movie.posterUrl || 'https://via.placeholder.com/320x180';
  const badgeText = movie.episodeCurrent || movie.duration || 'FHD';

  return (
    <Link 
      href={`/phim/${movie.slug}/tap-1`}
      className="flex gap-2 group cursor-pointer select-none rounded-lg p-1 hover:bg-[#272727]/50 transition-colors"
    >
      {/* Thumbnail 16:9 nhỏ gọn (168px) */}
      <div className="relative w-40 sm:w-44 aspect-video rounded-lg overflow-hidden bg-[#1f1f1f] shrink-0">
        <img
          src={imageSrc}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />
        <div className="absolute bottom-1 right-1 bg-black/85 text-white text-[10px] font-semibold font-mono px-1 py-0.2 rounded shadow">
          {badgeText}
        </div>
      </div>

      {/* Thông tin video bên phải */}
      <div className="flex-1 min-w-0 pr-1 flex flex-col justify-start">
        <h4 
          className="text-[#f1f1f1] group-hover:text-white text-sm font-semibold line-clamp-2 leading-snug"
          title={movie.title}
        >
          {movie.title}
        </h4>

        <p className="text-[12px] text-[#aaaaaa] mt-1 truncate">
          {movie.genres?.slice(0, 2).join(', ') || 'Phim Nhanh'}
        </p>

        <div className="text-[12px] text-[#aaaaaa] flex items-center gap-1 mt-0.5">
          <span>{formatViews(movie.views || 0)} lượt xem</span>
          <span>•</span>
          <span>{movie.type === 'series' ? 'Phim bộ' : 'Phim lẻ'}</span>
        </div>
      </div>
    </Link>
  );
}
