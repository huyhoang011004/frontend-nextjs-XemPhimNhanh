'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Share2, 
  Bookmark, 
  Users, 
  Bell, 
  Play, 
  ListVideo,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { VideoPlayer } from '@/components/shared/video-player';
import { CommentSection } from '@/components/shared/comment-section';
import { CompactVideoCard } from '@/components/shared/compact-video-card';
import { MovieItem } from '@/components/shared/youtube-video-card';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/use-auth-store';

interface EpisodeItem {
  name: string;
  slug: string;
  serverData: Array<{
    serverName: string;
    type: string;
    linkM3u8?: string;
    linkIframe?: string;
    link?: string;
  }>;
}

interface Props {
  movie: MovieItem;
  currentEpisode: EpisodeItem;
  allEpisodes: EpisodeItem[];
  relatedMovies: MovieItem[];
}

export function YoutubeWatchView({
  movie,
  currentEpisode,
  allEpisodes,
  relatedMovies,
}: Props) {
  const router = useRouter();
  const { user } = useAuthStore();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Trạng thái Subscribe (Đăng ký kênh)
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(128000);

  // Trạng thái Like / Dislike
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [likesCount, setLikesCount] = useState(movie.views ? Math.floor(movie.views / 25) : 3400);

  // Trạng thái Hộp mô tả mở rộng
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  // Lấy trạng thái follow ban đầu từ backend nếu đã đăng nhập
  useEffect(() => {
    if (user && movie._id) {
      apiClient
        .get(`/user-experience/follow/${movie._id}/status`)
        .then((res) => {
          if (res.data.isFollowing) setIsSubscribed(true);
        })
        .catch(() => {});
    }
  }, [user, movie._id]);

  // Xử lý nút Đăng ký (Subscribe)
  const handleToggleSubscribe = async () => {
    if (!user) {
      alert('Vui lòng đăng nhập để đăng ký theo dõi phim này!');
      return;
    }

    if (movie._id) {
      try {
        const res = await apiClient.post(`/user-experience/follow/${movie._id}`);
        const newState = res.data.isFollowing;
        setIsSubscribed(newState);
        setSubscribersCount((prev) => (newState ? prev + 1 : prev - 1));
      } catch {
        setIsSubscribed(!isSubscribed);
      }
    } else {
      setIsSubscribed(!isSubscribed);
      setSubscribersCount((prev) => (!isSubscribed ? prev + 1 : prev - 1));
    }
  };

  // Xử lý nút Thích (Like)
  const handleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikesCount((prev) => prev - 1);
    } else {
      setIsLiked(true);
      setLikesCount((prev) => prev + 1);
      if (isDisliked) setIsDisliked(false);
      if (user && movie._id) {
        apiClient.post('/ratings', { movieId: movie._id, score: 5 }).catch(() => {});
      }
    }
  };

  // Xử lý nút Không thích (Dislike)
  const handleDislike = () => {
    if (isDisliked) {
      setIsDisliked(false);
    } else {
      setIsDisliked(true);
      if (isLiked) {
        setIsLiked(false);
        setLikesCount((prev) => prev - 1);
      }
      if (user && movie._id) {
        apiClient.post('/ratings', { movieId: movie._id, score: 1 }).catch(() => {});
      }
    }
  };

  // Xử lý Chia sẻ
  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Đã sao chép liên kết tập phim vào bộ nhớ tạm!');
    }
  };

  // Tìm tập tiếp theo
  const currentIndex = allEpisodes.findIndex((ep) => ep.slug === currentEpisode.slug);
  const nextEpisode = currentIndex !== -1 && currentIndex < allEpisodes.length - 1 ? allEpisodes[currentIndex + 1] : null;

  const handleNextEpisode = () => {
    if (nextEpisode) {
      router.push(`/phim/${movie.slug}/${nextEpisode.slug}`);
    }
  };

  const formatViews = (views: number = 0) => {
    return new Intl.NumberFormat('vi-VN').format(views);
  };

  return (
    <div className="w-full px-4 lg:px-8 py-4 max-w-[1720px] mx-auto">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* ================================================= */}
        {/* CỘT TRÁI (70%): VIDEO PLAYER & THÔNG TIN & COMMENT */}
        {/* ================================================= */}
        <div className="flex-1 min-w-0">
          {/* Trình phát Video Player 16:9 */}
          <VideoPlayer
            servers={currentEpisode.serverData}
            movieId={movie._id || 'mock-id'}
            episodeSlug={currentEpisode.slug}
            videoRef={videoRef}
            onNextEpisode={nextEpisode ? handleNextEpisode : undefined}
          />

          {/* Tiêu đề Video */}
          <h1 className="text-xl md:text-2xl font-bold text-white mt-3 leading-snug tracking-tight">
            {movie.title} - {currentEpisode.name} [Full HD Vietsub]
          </h1>

          {/* Hàng Action Bar chuẩn phong cách YouTube */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-3 pb-3 border-b border-[#272727]">
            {/* Bên trái: Avatar phim (Kênh) + Nút Đăng Ký */}
            <div className="flex items-center gap-3">
              <Link href={`/phim/${movie.slug}`}>
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 to-indigo-600 border border-[#383838] flex items-center justify-center text-white font-bold text-sm shadow">
                  {movie.title.charAt(0).toUpperCase()}
                </div>
              </Link>

              <div>
                <Link href={`/phim/${movie.slug}`} className="font-bold text-white text-sm md:text-base hover:text-gray-200 transition">
                  {movie.title}
                </Link>
                <p className="text-xs text-gray-400">
                  {new Intl.NumberFormat('vi-VN').format(subscribersCount)} người đăng ký
                </p>
              </div>

              {/* Nút Đăng ký (Subscribe) chuẩn YouTube */}
              <button
                onClick={handleToggleSubscribe}
                className={`ml-2 px-4 py-2 rounded-full text-xs md:text-sm font-bold transition-all shadow active:scale-95 flex items-center gap-1.5 ${
                  isSubscribed
                    ? 'bg-[#272727] text-white hover:bg-[#383838] border border-[#383838]'
                    : 'bg-white hover:bg-gray-200 text-black'
                }`}
              >
                {isSubscribed ? (
                  <>
                    <Bell className="w-3.5 h-3.5 fill-white text-white" />
                    <span>Đã đăng ký</span>
                  </>
                ) : (
                  <span>Đăng ký</span>
                )}
              </button>
            </div>

            {/* Bên phải: Cụm Pill Like/Dislike, Chia sẻ, Xem chung, Lưu */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Cụm Nút Thích / Không Thích gộp chung chuẩn YouTube */}
              <div className="flex items-center rounded-full bg-[#272727] border border-[#383838] overflow-hidden">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs md:text-sm font-semibold hover:bg-[#383838] transition active:scale-95 ${
                    isLiked ? 'text-[#3ea6ff]' : 'text-gray-200'
                  }`}
                  title="Thích video này"
                >
                  <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-[#3ea6ff]' : ''}`} />
                  <span>{new Intl.NumberFormat('vi-VN').format(likesCount)}</span>
                </button>
                <div className="w-[1px] h-5 bg-[#383838]" />
                <button
                  onClick={handleDislike}
                  className={`px-3 py-2 text-xs md:text-sm hover:bg-[#383838] transition active:scale-95 ${
                    isDisliked ? 'text-white' : 'text-gray-200'
                  }`}
                  title="Không thích video này"
                >
                  <ThumbsDown className={`w-4 h-4 ${isDisliked ? 'fill-white' : ''}`} />
                </button>
              </div>

              {/* Nút Chia sẻ */}
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#272727] hover:bg-[#383838] border border-[#383838] text-gray-200 text-xs md:text-sm font-semibold transition active:scale-95"
                title="Chia sẻ video"
              >
                <Share2 className="w-4 h-4" />
                <span>Chia sẻ</span>
              </button>

              {/* Nút Xem chung (Watch Party) */}
              <Link
                href={`/room?movie=${movie.slug}&ep=${currentEpisode.slug}`}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#272727] hover:bg-[#383838] border border-[#383838] text-gray-200 text-xs md:text-sm font-semibold transition active:scale-95"
                title="Tạo phòng xem phim chung"
              >
                <Users className="w-4 h-4 text-[#3ea6ff]" />
                <span>Xem chung</span>
              </Link>

              {/* Nút Lưu vào Playlist / Xem sau */}
              <button
                onClick={() => alert(`Đã thêm "${movie.title} - ${currentEpisode.name}" vào danh sách Xem sau!`)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#272727] hover:bg-[#383838] border border-[#383838] text-gray-200 text-xs md:text-sm font-semibold transition active:scale-95"
                title="Lưu vào danh sách phát"
              >
                <Bookmark className="w-4 h-4" />
                <span className="hidden md:inline">Lưu</span>
              </button>
            </div>
          </div>

          {/* Hộp Mô Tả Mở Rộng (`Expandable Description Box`) Chuẩn YouTube */}
          <div
            onClick={() => setIsDescExpanded(!isDescExpanded)}
            className="mt-4 p-3.5 bg-[#272727] hover:bg-[#303030] rounded-xl border border-[#383838] cursor-pointer transition text-xs md:text-sm text-[#f1f1f1]"
          >
            <div className="flex items-center gap-2 font-bold text-white mb-2">
              <span>{formatViews(movie.views || 1542000)} lượt xem</span>
              <span>•</span>
              <span>Đã cập nhật gần đây</span>
              <span className="text-[#3ea6ff]">#PhimNhanh #XemPhim #FullHD</span>
            </div>

            <p className={`text-gray-300 leading-relaxed whitespace-pre-line ${!isDescExpanded ? 'line-clamp-2' : ''}`}>
              {movie.description || 'Thưởng thức bộ phim bom tấn với chất lượng hình ảnh sắc nét chuẩn Full HD và âm thanh sống động. Theo dõi trọn bộ tại PhimNhanh.'}
            </p>

            {isDescExpanded && (
              <div className="mt-3 pt-3 border-t border-[#383838] flex flex-col gap-1.5 text-xs text-gray-300">
                <p><strong className="text-white">Thể loại:</strong> {movie.genres?.join(', ') || 'Hành động, Phiêu lưu'}</p>
                <p><strong className="text-white">Chất lượng:</strong> {movie.quality || 'Full HD'}</p>
                <p><strong className="text-white">Thời lượng:</strong> {movie.duration || '45 phút/tập'}</p>
                <p><strong className="text-white">Số tập hiện tại:</strong> {movie.episodeCurrent || 'Tập 1'}</p>
              </div>
            )}

            <div className="mt-2 text-xs font-bold text-gray-400 hover:text-white flex items-center gap-1">
              <span>{isDescExpanded ? 'Ẩn bớt' : '...thêm'}</span>
              {isDescExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </div>
          </div>

          {/* Khu vực Bình Luận Chuẩn YouTube */}
          <CommentSection
            movieId={movie._id || 'mock-id'}
            episodeId={currentEpisode.slug}
            videoRef={videoRef}
          />
        </div>

        {/* ================================================= */}
        {/* CỘT PHẢI (30%): PLAYLIST TẬP PHIM & VIDEO ĐỀ XUẤT */}
        {/* ================================================= */}
        <div className="w-full lg:w-96 xl:w-[420px] shrink-0 flex flex-col gap-6">
          {/* Hộp Playlist Tập Phim Chuẩn YouTube (Playlist Panel) */}
          <div className="bg-[#1e1e1e] border border-[#2e2e2e] rounded-2xl overflow-hidden shadow-xl flex flex-col">
            {/* Header Playlist */}
            <div className="p-3.5 bg-[#252525] border-b border-[#2e2e2e] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ListVideo className="w-5 h-5 text-[#ff0000]" />
                <div>
                  <h3 className="text-sm font-bold text-white line-clamp-1">
                    Danh Sách Tập - {movie.title}
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    Tập {currentIndex !== -1 ? currentIndex + 1 : 1} / {allEpisodes.length} tập
                  </p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold bg-[#ff0000] text-white px-2 py-0.5 rounded">
                Playlist
              </span>
            </div>

            {/* Danh sách cuộn các tập */}
            <div className="max-h-[380px] overflow-y-auto divide-y divide-[#272727] p-1">
              {allEpisodes.map((ep, idx) => {
                const isActive = ep.slug === currentEpisode.slug;
                return (
                  <Link
                    key={ep.slug}
                    href={`/phim/${movie.slug}/${ep.slug}`}
                    className={`flex items-center gap-3 p-2.5 rounded-xl transition ${
                      isActive
                        ? 'bg-[#2b2b2b] border border-[#ff0000]/40'
                        : 'hover:bg-[#252525] text-gray-300'
                    }`}
                  >
                    {/* Icon Play hoặc số thứ tự */}
                    <div className="w-6 text-center text-xs font-bold shrink-0">
                      {isActive ? (
                        <Play className="w-4 h-4 fill-[#ff0000] text-[#ff0000] mx-auto animate-pulse" />
                      ) : (
                        <span className="text-gray-500">{idx + 1}</span>
                      )}
                    </div>

                    {/* Thumbnail nhỏ 16:9 của tập */}
                    <div className="relative w-24 aspect-video rounded-lg overflow-hidden bg-black shrink-0">
                      <img
                        src={movie.bannerUrl || movie.posterUrl}
                        alt={ep.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-0.5 right-0.5 bg-black/80 text-white text-[9px] font-mono px-1 rounded">
                        HD
                      </span>
                    </div>

                    {/* Tên tập & trạng thái */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold truncate ${isActive ? 'text-[#ff0000]' : 'text-white'}`}>
                        {ep.name}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                        {movie.title}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Danh Sách Video Đề Xuất (Recommended Videos) Chuẩn YouTube Sidebar */}
          <div>
            <h3 className="text-base font-bold text-white mb-3">
              Video Đề Xuất Cho Bạn
            </h3>
            <div className="flex flex-col gap-3">
              {relatedMovies.map((relMovie) => (
                <CompactVideoCard key={relMovie.slug} movie={relMovie} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
