'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/use-auth-store';

interface Props {
  movieId: string;
  episodeId?: string;
  videoRef?: React.RefObject<HTMLVideoElement>;
}

export function CommentSection({ movieId, episodeId, videoRef }: Props) {
  const { user } = useAuthStore();
  const [comments, setComments] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [includeTimestamp, setIncludeTimestamp] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [movieId]);

  const fetchComments = async () => {
    try {
      const res = await apiClient.get(`/comments/movie/${movieId}`);
      if (res.data.success) {
        setComments(res.data.data);
      }
    } catch (e) {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    let timestampInSeconds = undefined;
    if (includeTimestamp && videoRef?.current) {
      timestampInSeconds = Math.floor(videoRef.current.currentTime);
    }

    try {
      const res = await apiClient.post('/comments', {
        movieId,
        episodeId,
        content,
        timestampInSeconds
      });
      if (res.data.success) {
        setContent('');
        setIncludeTimestamp(false);
        fetchComments();
      }
    } catch (e) {}
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const jumpToTime = (seconds: number) => {
    if (videoRef?.current) {
      videoRef.current.currentTime = seconds;
      videoRef.current.play();
    }
  };

  return (
    <div className="mt-8 bg-gray-900 border border-gray-800 rounded-lg p-6 shadow-xl">
      <h3 className="text-xl font-bold mb-4">Bình Luận ({comments.length})</h3>
      
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-black border border-gray-700 rounded-lg p-3 text-sm focus:border-blue-500 outline-none resize-none transition"
            rows={3}
            placeholder="Chia sẻ cảm nghĩ của bạn về phim..."
          />
          <div className="flex justify-between items-center mt-3">
            <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer hover:text-white transition">
              <input 
                type="checkbox" 
                checked={includeTimestamp}
                onChange={(e) => setIncludeTimestamp(e.target.checked)}
                className="rounded bg-gray-800 border-gray-700 text-blue-600 focus:ring-blue-600 focus:ring-offset-gray-900" 
              />
              Đính kèm mốc thời gian hiện tại
            </label>
            <button 
              type="submit"
              disabled={!content.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded font-bold shadow transition"
            >
              Gửi bình luận
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-gray-800 rounded text-center text-gray-400 text-sm">
          Vui lòng <a href="/auth/login" className="text-blue-500 font-bold hover:underline">đăng nhập</a> để tham gia bình luận.
        </div>
      )}

      <div className="flex flex-col gap-6">
        {comments.map((cmt) => (
          <div key={cmt._id} className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center font-bold shrink-0">
              {cmt.userId?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-white text-sm">{cmt.userId?.fullName || 'Người dùng'}</span>
                <span className="text-xs text-gray-500">{new Date(cmt.createdAt).toLocaleString('vi-VN')}</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                {cmt.timestampInSeconds !== undefined && cmt.timestampInSeconds !== null && (
                  <button 
                    onClick={() => jumpToTime(cmt.timestampInSeconds)}
                    className="text-blue-500 hover:underline font-bold bg-blue-950 px-1.5 py-0.5 rounded mr-2"
                  >
                    {formatTime(cmt.timestampInSeconds)}
                  </button>
                )}
                {cmt.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
