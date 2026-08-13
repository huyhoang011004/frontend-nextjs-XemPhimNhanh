'use client';

import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

interface ServerLink {
  serverName: string;
  linkM3u8?: string;
  linkIframe?: string;
  type: string;
}

interface Props {
  servers: ServerLink[];
  movieId?: string;
  episodeSlug?: string;
}

export function VideoPlayer({ servers, movieId, episodeSlug }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentServerIndex, setCurrentServerIndex] = useState(0);
  const [isLightOff, setIsLightOff] = useState(false);
  const lastSyncTime = useRef(0);
  
  // Tạm mock store và api client cho logic (đáng lẽ import từ lib)
  // import { useAuthStore } from '@/store/use-auth-store';
  // import { apiClient } from '@/lib/api-client';

  const activeServer = servers[currentServerIndex] || servers[0];

  useEffect(() => {
    if (!activeServer || activeServer.type === 'iframe') return;
    
    if (activeServer.type === 'hls' && activeServer.linkM3u8 && Hls.isSupported() && videoRef.current) {
      const hls = new Hls({
        debug: false,
        enableWorker: true,
      });
      hls.loadSource(activeServer.linkM3u8);
      hls.attachMedia(videoRef.current);
      
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          console.error('[HLS Error]:', data);
          // Fallback logic
          if (currentServerIndex < servers.length - 1) {
            console.log('Chuyển sang server dự phòng do lỗi kết nối...');
            setCurrentServerIndex(prev => prev + 1);
          }
        }
      });

      return () => {
        hls.destroy();
      };
    } else if (videoRef.current && activeServer.linkM3u8) {
      // Native HLS fallback (Safari)
      videoRef.current.src = activeServer.linkM3u8;
    }
  }, [activeServer, currentServerIndex, servers.length]);

  return (
    <div className="w-full relative z-20">
      {/* Light Off Overlay */}
      {isLightOff && (
        <div className="fixed inset-0 bg-black/95 z-40 transition-colors duration-300" />
      )}

      <div className={`relative transition-all duration-300 ${isLightOff ? 'z-50 max-w-5xl mx-auto mt-12 shadow-[0_0_50px_rgba(0,0,0,1)]' : 'w-full bg-black aspect-video rounded-lg overflow-hidden border border-border shadow-lg'}`}>
        {activeServer.type === 'iframe' && activeServer.linkIframe ? (
          <iframe 
            src={activeServer.linkIframe} 
            className="w-full h-full aspect-video" 
            allowFullScreen 
            frameBorder="0"
          />
        ) : (
          <video 
            ref={videoRef} 
            className="w-full h-full" 
            controls 
            autoPlay 
            onTimeUpdate={(e) => {
              const video = e.target as HTMLVideoElement;
              const currentTime = video.currentTime;
              
              // Debounce 10s
              if (currentTime - lastSyncTime.current > 10 && movieId && episodeSlug) {
                lastSyncTime.current = currentTime;
                
                // Gọi API lưu tiến độ ngầm (Fire and forget)
                // if (user) {
                //   apiClient.post('/user-experience/history', { movieId, episodeSlug, durationPlayed: currentTime, totalDuration: video.duration }).catch(e=>e);
                // } else {
                //   localStorage.setItem(`history_${movieId}`, JSON.stringify({ episodeSlug, duration: currentTime, totalDuration: video.duration }));
                // }
                console.log('Đã lưu tiến độ xem phim (Mock Sync):', currentTime, 'giây');
              }
            }}
          />
        )}
      </div>

      <div className={`mt-4 flex flex-wrap gap-4 items-center justify-between bg-card p-4 rounded-lg border border-border transition-all duration-300 ${isLightOff ? 'relative z-50 max-w-5xl mx-auto' : ''}`}>
        <div className="flex gap-2">
          {servers.map((srv, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentServerIndex(idx)}
              className={`px-4 py-2 rounded font-medium text-sm transition ${
                currentServerIndex === idx 
                  ? 'bg-blue-600 text-white shadow' 
                  : 'bg-background text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {srv.serverName}
            </button>
          ))}
        </div>
        
        <div className="flex gap-4 items-center">
          <button 
            onClick={() => setIsLightOff(!isLightOff)}
            className="text-gray-300 hover:text-white flex items-center gap-2 font-medium"
          >
            {isLightOff ? '💡 Bật đèn' : '🌙 Tắt đèn'}
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-bold shadow-lg transition-transform hover:scale-105">
            Tập Tiếp Theo
          </button>
        </div>
      </div>
    </div>
  );
}
