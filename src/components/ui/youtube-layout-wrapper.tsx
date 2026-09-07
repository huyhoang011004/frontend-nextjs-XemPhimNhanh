'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { YoutubeNavbar } from './youtube-navbar';
import { YoutubeSidebar } from './youtube-sidebar';
import { useSidebarStore } from '@/store/use-sidebar-store';

export function YoutubeLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isExpanded } = useSidebarStore();
  const pathname = usePathname();

  // Trên trang xem video (/phim/[slug]/[episode]), ẩn desktop sidebar để tối đa hóa không gian màn hình chuẩn YouTube Watch Page
  const isWatchPage = pathname.includes('/tap-');

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#f1f1f1] flex flex-col antialiased">
      {/* Top Navbar cố định */}
      <YoutubeNavbar />

      <div className="flex flex-1 pt-14">
        {/* Sidebar điều hướng (Ẩn trên desktop khi ở Watch Page giống hệt YouTube) */}
        {!isWatchPage && <YoutubeSidebar />}

        {/* Nội dung chính cuộn */}
        <main 
          className={`flex-1 min-w-0 transition-all duration-200 ${
            isWatchPage 
              ? 'pl-0' 
              : isExpanded 
                ? 'lg:pl-60' 
                : 'lg:pl-[72px]'
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
