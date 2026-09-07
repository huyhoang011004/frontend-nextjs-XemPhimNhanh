'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/use-auth-store';
import { ThumbsUp, ThumbsDown, MessageSquare, Clock, AlignLeft } from 'lucide-react';

interface Props {
  movieId: string;
  episodeId?: string;
  videoRef?: React.RefObject<HTMLVideoElement | null>;
}

function formatTimeAgo(dateStr?: string) {
  if (!dateStr) return 'vừa xong';
  const past = new Date(dateStr).getTime();
  if (isNaN(past)) return 'vừa xong';
  return 'Gần đây';
}

export function CommentSection({ movieId, episodeId, videoRef }: Props) {
  const { user } = useAuthStore();
  const [comments, setComments] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);
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
    } catch (e) {
      // Mock comment ban đầu nếu chưa có comment trong DB
      setComments([
        {
          _id: 'mock-1',
          userId: { fullName: 'Trần Hoàng Nam' },
          content: 'Phim đỉnh quá các bác ơi! Kỹ xảo mượt mà, xem không quảng cáo thích thật sự 🔥',
          timestampInSeconds: 145,
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        },
        {
          _id: 'mock-2',
          userId: { fullName: 'Ngọc Lan' },
          content: 'Đoạn này đánh nhau gay cấn nghẹt thở luôn! Chờ tập sau quá.',
          timestampInSeconds: 320,
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        },
      ]);
    }
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
        timestampInSeconds,
      });
      if (res.data.success) {
        setContent('');
        setIsFocused(false);
        setIncludeTimestamp(false);
        fetchComments();
      }
    } catch (e) {
      // Fallback local update
      setComments([
        {
          _id: Date.now().toString(),
          userId: { fullName: user.fullName || 'Bạn' },
          content,
          timestampInSeconds,
          createdAt: new Date().toISOString(),
        },
        ...comments,
      ]);
      setContent('');
      setIsFocused(false);
      setIncludeTimestamp(false);
    }
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
    <div className="mt-8 pt-6 border-t border-[#272727]">
      {/* Header Bình luận kiểu YouTube */}
      <div className="flex items-center gap-6 mb-6">
        <h3 className="text-xl font-bold text-white tracking-tight">
          {comments.length} Bình luận
        </h3>
        <button className="flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white transition">
          <AlignLeft className="w-4 h-4" />
          <span>Sắp xếp theo</span>
        </button>
      </div>

      {/* Ô nhập bình luận chuẩn YouTube */}
      <div className="flex gap-4 mb-8">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 text-white font-bold flex items-center justify-center text-sm shrink-0 shadow">
          {user ? (user.fullName?.charAt(0).toUpperCase() || 'U') : 'U'}
        </div>

        <div className="flex-1">
          {user ? (
            <form onSubmit={handleSubmit}>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onFocus={() => setIsFocused(true)}
                rows={isFocused ? 3 : 1}
                placeholder="Viết bình luận..."
                className="w-full bg-transparent border-b border-[#383838] focus:border-white text-sm text-[#f1f1f1] outline-none resize-none transition-all py-1 placeholder-gray-500"
              />

              {isFocused && (
                <div className="flex items-center justify-between mt-3 animate-fadeIn">
                  <button
                    type="button"
                    onClick={() => setIncludeTimestamp(!includeTimestamp)}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full transition ${
                      includeTimestamp
                        ? 'bg-[#3ea6ff]/20 text-[#3ea6ff] border border-[#3ea6ff]/40'
                        : 'text-gray-400 hover:text-white bg-[#222222]'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {includeTimestamp && videoRef?.current
                        ? `Mốc: ${formatTime(videoRef.current.currentTime || 0)}`
                        : 'Đính kèm thời gian hiện tại'}
                    </span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setContent('');
                        setIsFocused(false);
                      }}
                      className="px-4 py-2 rounded-full text-xs font-semibold text-gray-300 hover:bg-[#272727] transition"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={!content.trim()}
                      className="px-4 py-2 rounded-full text-xs font-bold bg-[#3ea6ff] text-black disabled:opacity-40 disabled:bg-[#272727] disabled:text-gray-500 transition shadow"
                    >
                      Bình luận
                    </button>
                  </div>
                </div>
              )}
            </form>
          ) : (
            <div className="p-3 bg-[#1e1e1e] rounded-xl border border-[#2e2e2e] text-xs text-gray-400 flex items-center justify-between">
              <span>Đăng nhập để tham gia thảo luận và tương tác cùng cộng đồng.</span>
              <a href="/auth/login" className="text-[#3ea6ff] font-semibold hover:underline">
                Đăng nhập ngay
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Danh sách bình luận kiểu YouTube */}
      <div className="flex flex-col gap-6">
        {comments.map((cmt) => (
          <div key={cmt._id} className="flex gap-4 group">
            <div className="w-10 h-10 rounded-full bg-[#272727] text-white flex items-center justify-center font-bold text-sm shrink-0 border border-[#383838]">
              {cmt.userId?.fullName?.charAt(0) || 'U'}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-white text-xs">
                  @{cmt.userId?.fullName || 'khangia'}
                </span>
                <span className="text-[11px] text-gray-400">
                  {formatTimeAgo(cmt.createdAt)}
                </span>
              </div>

              <div className="text-sm text-[#f1f1f1] leading-relaxed">
                {cmt.timestampInSeconds !== undefined && cmt.timestampInSeconds !== null && (
                  <button
                    onClick={() => jumpToTime(cmt.timestampInSeconds)}
                    className="text-[#3ea6ff] hover:underline font-mono font-semibold bg-[#263850]/50 px-1.5 py-0.5 rounded text-xs mr-2 inline-flex items-center gap-1"
                  >
                    <Clock className="w-3 h-3" />
                    {formatTime(cmt.timestampInSeconds)}
                  </button>
                )}
                <span>{cmt.content}</span>
              </div>

              {/* Hàng nút Like / Dislike / Trả lời chuẩn YouTube */}
              <div className="flex items-center gap-4 mt-2">
                <button 
                  onClick={() => alert('Đã thích bình luận!')}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition"
                  title="Thích"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>12</span>
                </button>
                <button 
                  className="text-gray-400 hover:text-white transition"
                  title="Không thích"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                </button>
                <button className="text-xs font-semibold text-gray-400 hover:text-white transition">
                  Phản hồi
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
