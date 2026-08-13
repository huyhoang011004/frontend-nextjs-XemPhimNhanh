'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/use-auth-store';

interface Props {
  movieId: string;
  initialRating?: number;
  ratingCount?: number;
}

export function MovieRating({ movieId, initialRating = 0, ratingCount = 0 }: Props) {
  const { user } = useAuthStore();
  const [hover, setHover] = useState(0);
  const [rating, setRating] = useState(initialRating);
  const [totalCount, setTotalCount] = useState(ratingCount);
  const [hasRated, setHasRated] = useState(false);

  useEffect(() => {
    if (user) {
      apiClient.get(`/ratings/movie/${movieId}/me`).then(res => {
        if (res.data.success && res.data.data) {
          setRating(res.data.data.score);
          setHasRated(true);
        }
      }).catch(e => console.error(e));
    }
  }, [user, movieId]);

  const handleRate = async (score: number) => {
    if (!user) {
      alert("Vui lòng đăng nhập để đánh giá phim!");
      return;
    }
    
    setRating(score);
    if (!hasRated) setTotalCount(prev => prev + 1);
    setHasRated(true);

    try {
      await apiClient.post('/ratings', { movieId, score });
    } catch (e) {
      console.error(e);
      alert("Lỗi khi gửi đánh giá.");
    }
  };

  return (
    <div className="flex items-center gap-4 bg-gray-900 p-4 rounded-lg border border-gray-800 w-fit mt-4">
      <div className="flex flex-col">
        <span className="text-sm text-gray-400">Đánh giá của bạn</span>
        <div className="flex gap-1 mt-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => handleRate(star)}
              className={`text-2xl transition-colors ${
                (hover || rating) >= star ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]' : 'text-gray-600'
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <div className="border-l border-gray-700 pl-4">
        <div className="text-2xl font-bold text-white">{rating.toFixed(1)} <span className="text-sm text-gray-500 font-normal">/ 5</span></div>
        <div className="text-xs text-gray-400">{totalCount} lượt đánh giá</div>
      </div>
    </div>
  );
}
