'use client';

import React, { useState } from 'react';
import { FilterChips } from '@/components/shared/filter-chips';
import { YoutubeVideoCard, MovieItem } from '@/components/shared/youtube-video-card';
import { Flame, Film, Sparkles } from 'lucide-react';

interface Props {
  initialMovies: MovieItem[];
}

export function YoutubeHomeFeed({ initialMovies }: Props) {
  const [selectedTag, setSelectedTag] = useState('Tất cả');

  // Lọc phim phía client theo Tag đã chọn
  const filteredMovies = React.useMemo(() => {
    if (selectedTag === 'Tất cả') return initialMovies;
    if (selectedTag === 'Phim Bộ') return initialMovies.filter(m => m.type === 'series');
    if (selectedTag === 'Phim Lẻ') return initialMovies.filter(m => m.type === 'single');
    if (selectedTag === 'Thịnh Hành') return [...initialMovies].sort((a, b) => (b.views || 0) - (a.views || 0));
    
    // Lọc theo từ khóa thể loại
    const normalizedTag = selectedTag.toLowerCase();
    return initialMovies.filter(m => 
      m.genres?.some(g => g.toLowerCase().includes(normalizedTag)) ||
      m.title.toLowerCase().includes(normalizedTag)
    );
  }, [selectedTag, initialMovies]);

  return (
    <div className="w-full flex flex-col pb-16">
      {/* Thanh Filter Chips kiểu YouTube dính ở đầu trang */}
      <FilterChips 
        selectedTag={selectedTag} 
        onSelectTag={(tag) => setSelectedTag(tag)} 
      />

      {/* Hero Spotlight Nhỏ Phong Cách YouTube Featured Video */}
      {selectedTag === 'Tất cả' && initialMovies.length > 0 && (
        <div className="px-4 md:px-6 pt-4 pb-2">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-red-950/40 via-[#181818] to-[#121212] border border-[#272727] p-4 md:p-6 flex flex-col md:flex-row items-center gap-6 shadow-xl">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#ff0000] text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-white" /> Phim Nổi Bật Tuần Này
                </span>
                <span className="text-xs text-gray-400 font-medium">Full HD Vietsub</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2 leading-tight">
                {initialMovies[0]?.title}
              </h2>
              <p className="text-gray-300 text-sm md:text-base line-clamp-2 max-w-2xl mb-4">
                Trải nghiệm những pha hành động kịch tính và kỹ xảo đỉnh cao. Cập nhật tập mới nhất hàng ngày không giật lag.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href={`/phim/${initialMovies[0]?.slug}/tap-1`}
                  className="px-6 py-2.5 bg-[#ff0000] hover:bg-red-700 text-white font-bold rounded-full text-sm shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Film className="w-4 h-4" /> Xem Ngay
                </a>
                <a
                  href={`/phim/${initialMovies[0]?.slug}`}
                  className="px-5 py-2.5 bg-[#272727] hover:bg-[#383838] text-gray-200 font-semibold rounded-full text-sm transition"
                >
                  Chi Tiết Phim
                </a>
              </div>
            </div>

            <div className="w-full md:w-80 aspect-video rounded-xl overflow-hidden shadow-2xl border border-[#383838] shrink-0">
              <img
                src={initialMovies[0]?.bannerUrl || initialMovies[0]?.posterUrl}
                alt={initialMovies[0]?.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {/* Lưới Video Grid chuẩn YouTube */}
      <div className="px-4 md:px-6 pt-4">
        {filteredMovies.length === 0 ? (
          <div className="text-center py-20 bg-[#141414] rounded-2xl border border-[#272727] mt-4">
            <Sparkles className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-300 font-semibold text-lg">Không tìm thấy video nào phù hợp</p>
            <p className="text-gray-500 text-sm mt-1">Hãy thử chọn một thẻ danh mục khác ở thanh phía trên.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8">
            {filteredMovies.map((movie) => (
              <YoutubeVideoCard key={movie.slug} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
