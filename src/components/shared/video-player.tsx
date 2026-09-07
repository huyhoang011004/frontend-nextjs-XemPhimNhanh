'use client';

import React, { useEffect, useRef, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import Hls from 'hls.js';
import { Server, Sun, Moon, SkipForward, AlertCircle } from 'lucide-react';

interface ServerLink {
  serverName: string;
  linkM3u8?: string;
  linkIframe?: string;
  link?: string;
  type: string;
}

interface Props {
  servers: ServerLink[];
  movieId?: string;
  episodeSlug?: string;
  videoRef?: React.RefObject<HTMLVideoElement | null>;
  onNextEpisode?: () => void;
}

export function VideoPlayer({ servers, movieId, episodeSlug, videoRef: externalRef, onNextEpisode }: Props) {
  const internalRef = useRef<HTMLVideoElement>(null);
  const activeVideoRef = externalRef || internalRef;
  const [currentServerIndex, setCurrentServerIndex] = useState(0);
  const [isLightOff, setIsLightOff] = useState(false);
  const [hasError, setHasError] = useState(false);
  const lastSyncTime = useRef(0);

  // Ghi nhận lượt xem khi tải Player
  useEffect(() => {
    if (movieId && episodeSlug) {
      apiClient.post('/analytics/view', { movieId, episodeSlug }).catch(() => {});
    }
  }, [movieId, episodeSlug]);

  const activeServer = servers[currentServerIndex] || servers[0];

  useEffect(() => {
    if (!activeServer) return;

    const streamUrl = activeServer.linkM3u8 || (activeServer.type === 'hls' ? activeServer.link : undefined);

    if (activeServer.type === 'hls' && streamUrl && activeVideoRef.current) {
      if (Hls.isSupported()) {
        const hls = new Hls({ debug: false, enableWorker: true });
        hls.loadSource(streamUrl);
        hls.attachMedia(activeVideoRef.current);

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            console.error('[HLS Error]:', data);
            setHasError(true);
            if (currentServerIndex < servers.length - 1) {
              setCurrentServerIndex((prev) => prev + 1);
            }
          }
        });

        return () => {
          hls.destroy();
        };
      } else if (activeVideoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        // Native Safari HLS
        activeVideoRef.current.src = streamUrl;
      }
    }
  }, [activeServer, currentServerIndex, servers.length, activeVideoRef]);

  const iframeUrl = activeServer?.linkIframe || (activeServer?.type === 'iframe' ? activeServer?.link : undefined);

  return (
    <div className="w-full relative select-none">
      {/* Hiệu ứng Tắt đèn (Theater Mode Overlay) */}
      {isLightOff && (
        <div 
          onClick={() => setIsLightOff(false)}
          className="fixed inset-0 bg-black/95 z-40 transition-opacity duration-300 backdrop-blur-sm cursor-pointer" 
        />
      )}

      {/* Khung Video 16:9 sắc nét chuẩn YouTube Player */}
      <div 
        className={`relative transition-all duration-300 w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-[#272727] ${
          isLightOff ? 'z-50 shadow-[0_0_80px_rgba(0,0,0,0.9)] max-w-6xl mx-auto' : ''
        }`}
      >
        {activeServer?.type === 'iframe' && iframeUrl ? (
          <iframe
            src={iframeUrl}
            className="w-full h-full aspect-video border-0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        ) : (
          <video
            ref={activeVideoRef as React.RefObject<HTMLVideoElement>}
            className="w-full h-full object-contain"
            controls
            autoPlay
            playsInline
            onTimeUpdate={(e) => {
              const video = e.target as HTMLVideoElement;
              const currentTime = video.currentTime;

              // Đồng bộ tiến độ xem mỗi 10 giây
              if (currentTime - lastSyncTime.current > 10 && movieId && episodeSlug) {
                lastSyncTime.current = currentTime;
                apiClient
                  .post('/user-experience/history', {
                    movieId,
                    episodeSlug,
                    durationPlayed: Math.floor(currentTime),
                    totalDuration: Math.floor(video.duration || 0),
                  })
                  .catch(() => {});
              }
            }}
          />
        )}

        {/* Thông báo lỗi server fallback */}
        {hasError && (
          <div className="absolute top-4 left-4 bg-red-600/90 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-md shadow">
            <AlertCircle className="w-4 h-4" />
            <span>Server gặp sự cố, tự động chuyển server dự phòng...</span>
          </div>
        )}
      </div>

      {/* Thanh điều khiển phụ dưới Video Player */}
      <div 
        className={`mt-3 flex flex-wrap gap-3 items-center justify-between bg-[#1f1f1f] p-3 rounded-xl border border-[#272727] transition-all ${
          isLightOff ? 'relative z-50 max-w-6xl mx-auto' : ''
        }`}
      >
        {/* Chọn Server phát */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <span className="text-xs text-gray-400 font-semibold flex items-center gap-1 shrink-0 mr-1">
            <Server className="w-3.5 h-3.5 text-[#3ea6ff]" /> Nguồn phát:
          </span>
          {servers.map((srv, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentServerIndex(idx);
                setHasError(false);
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition active:scale-95 ${
                currentServerIndex === idx
                  ? 'bg-[#ff0000] text-white shadow'
                  : 'bg-[#2b2b2b] text-gray-300 hover:bg-[#383838] hover:text-white'
              }`}
            >
              {srv.serverName || `Server ${idx + 1}`}
            </button>
          ))}
        </div>

        {/* Nút Tắt đèn & Tập kế tiếp */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsLightOff(!isLightOff)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2b2b2b] hover:bg-[#383838] text-gray-300 hover:text-white text-xs font-medium transition active:scale-95"
          >
            {isLightOff ? <Sun className="w-3.5 h-3.5 text-yellow-400" /> : <Moon className="w-3.5 h-3.5" />}
            <span>{isLightOff ? 'Bật đèn' : 'Tắt đèn'}</span>
          </button>

          {onNextEpisode && (
            <button
              onClick={onNextEpisode}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white hover:bg-gray-200 text-black text-xs font-bold transition shadow active:scale-95"
            >
              <span>Tập tiếp</span>
              <SkipForward className="w-3.5 h-3.5 fill-black" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
