'use client';

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  selectedTag?: string;
  onSelectTag?: (tag: string) => void;
}

const DEFAULT_TAGS = [
  'Tất cả',
  'Phim Mới Cập Nhật',
  'Phim Bộ',
  'Phim Lẻ',
  'Hành Động',
  'Hàn Quốc',
  'Trung Quốc',
  'Cổ Trang',
  'Anime & Manga',
  'Kinh Dị',
  'Viễn Tưởng',
  'Hài Hước',
  'Tình Cảm',
  'Đã xem gần đây',
];

export function FilterChips({ selectedTag = 'Tất cả', onSelectTag }: Props) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -250 : 250;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-14 bg-[#0f0f0f]/95 backdrop-blur-md z-30 py-3 border-b border-[#272727] flex items-center relative group">
      {/* Nút cuộn trái */}
      <button
        onClick={() => scroll('left')}
        className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-[#0f0f0f] border border-[#272727] hover:bg-[#272727] text-white shadow-md shrink-0 ml-1 mr-2"
        aria-label="Cuộn sang trái"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Danh sách các Pill Tags */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-3 overflow-x-auto no-scrollbar scroll-smooth px-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {DEFAULT_TAGS.map((tag) => {
          const isSelected = selectedTag === tag;
          return (
            <button
              key={tag}
              onClick={() => onSelectTag && onSelectTag(tag)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all select-none active:scale-95 ${
                isSelected
                  ? 'bg-white text-black font-semibold shadow'
                  : 'bg-[#272727] text-[#f1f1f1] hover:bg-[#383838]'
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>

      {/* Nút cuộn phải */}
      <button
        onClick={() => scroll('right')}
        className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-[#0f0f0f] border border-[#272727] hover:bg-[#272727] text-white shadow-md shrink-0 mr-1 ml-2"
        aria-label="Cuộn sang phải"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
