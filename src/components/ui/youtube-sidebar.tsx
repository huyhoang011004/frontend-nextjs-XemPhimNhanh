'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Flame, 
  Tv, 
  History, 
  ListVideo, 
  Clock, 
  ThumbsUp, 
  Film, 
  Clapperboard, 
  Sparkles, 
  Ticket, 
  ChevronRight,
  User,
  X
} from 'lucide-react';
import { useSidebarStore } from '@/store/use-sidebar-store';

export function YoutubeSidebar() {
  const pathname = usePathname();
  const { isExpanded, isMobileOpen, closeMobileSidebar } = useSidebarStore();

  const mainLinks = [
    { label: 'Trang chủ', href: '/', icon: Home },
    { label: 'Thịnh hành', href: '/danh-sach/trending', icon: Flame },
    { label: 'Kênh đăng ký', href: '/profile', icon: Tv },
  ];

  const libraryLinks = [
    { label: 'Lịch sử xem', href: '/history', icon: History },
    { label: 'Danh sách phát', href: '/playlist', icon: ListVideo },
    { label: 'Xem sau', href: '/playlist', icon: Clock },
    { label: 'Phim đã thích', href: '/profile', icon: ThumbsUp },
  ];

  const exploreLinks = [
    { label: 'Phim Bộ Hot', href: '/danh-sach/phim-bo', icon: Film },
    { label: 'Phim Lẻ Đỉnh', href: '/danh-sach/phim-le', icon: Clapperboard },
    { label: 'Anime & Hoạt Hình', href: '/danh-sach/anime', icon: Sparkles },
    { label: 'Phim Chiếu Rạp', href: '/danh-sach/chieu-rap', icon: Ticket },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div 
          onClick={closeMobileSidebar}
          className="fixed inset-0 bg-black/60 z-50 lg:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Mobile Sidebar (Drawer) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-[#0f0f0f] z-50 border-r border-[#272727] p-3 flex flex-col transition-transform duration-300 lg:hidden overflow-y-auto ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-3 py-2 border-b border-[#272727] mb-2">
          <span className="font-bold text-white text-lg">Menu</span>
          <button onClick={closeMobileSidebar} className="p-1 rounded-full hover:bg-[#272727] text-gray-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {mainLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMobileSidebar}
                className={`flex items-center gap-4 px-3 py-2.5 rounded-xl font-medium text-sm transition ${
                  active ? 'bg-[#272727] text-white font-semibold' : 'text-gray-300 hover:bg-[#222222] hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-[#ff0000]' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="border-t border-[#272727] my-3" />

          <div className="px-3 py-1 flex items-center gap-1 text-white font-semibold text-sm">
            <span>Bạn</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>

          {libraryLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMobileSidebar}
                className={`flex items-center gap-4 px-3 py-2.5 rounded-xl font-medium text-sm transition ${
                  active ? 'bg-[#272727] text-white font-semibold' : 'text-gray-300 hover:bg-[#222222] hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 text-gray-400" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="border-t border-[#272727] my-3" />

          <div className="px-3 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">
            Khám phá
          </div>

          {exploreLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMobileSidebar}
                className={`flex items-center gap-4 px-3 py-2.5 rounded-xl font-medium text-sm transition ${
                  active ? 'bg-[#272727] text-white font-semibold' : 'text-gray-300 hover:bg-[#222222] hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 text-gray-400" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Desktop Sidebar */}
      {isExpanded ? (
        /* Expanded Desktop Sidebar (240px) */
        <aside className="fixed top-14 left-0 bottom-0 w-60 bg-[#0f0f0f] border-r border-[#272727] p-3 hidden lg:flex flex-col overflow-y-auto z-40">
          <nav className="flex flex-col gap-1">
            {mainLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-4 px-3 py-2.5 rounded-xl font-medium text-sm transition ${
                    active ? 'bg-[#272727] text-white font-semibold' : 'text-gray-300 hover:bg-[#222222] hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? 'text-[#ff0000]' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="border-t border-[#272727] my-3" />

            <Link href="/profile" className="px-3 py-1 flex items-center gap-1 text-white font-semibold text-sm hover:text-[#3ea6ff] transition">
              <span>Bạn</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>

            {libraryLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-4 px-3 py-2.5 rounded-xl font-medium text-sm transition ${
                    active ? 'bg-[#272727] text-white font-semibold' : 'text-gray-300 hover:bg-[#222222] hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 text-gray-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="border-t border-[#272727] my-3" />

            <div className="px-3 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">
              Khám phá
            </div>

            {exploreLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-4 px-3 py-2.5 rounded-xl font-medium text-sm transition ${
                    active ? 'bg-[#272727] text-white font-semibold' : 'text-gray-300 hover:bg-[#222222] hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 text-gray-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="border-t border-[#272727] my-3" />

            <div className="px-3 py-2 text-xs text-gray-500 leading-relaxed">
              © 2026 WebPhimNhanh<br />
              Chuẩn YouTube Dark UI
            </div>
          </nav>
        </aside>
      ) : (
        /* Mini Desktop Sidebar (72px) */
        <aside className="fixed top-14 left-0 bottom-0 w-[72px] bg-[#0f0f0f] border-r border-[#272727] py-3 hidden lg:flex flex-col items-center gap-6 z-40">
          <Link 
            href="/" 
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-[#222222] text-gray-300 hover:text-white w-16"
            title="Trang chủ"
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] text-center font-medium">Trang chủ</span>
          </Link>

          <Link 
            href="/danh-sach/trending" 
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-[#222222] text-gray-300 hover:text-white w-16"
            title="Thịnh hành"
          >
            <Flame className="w-5 h-5" />
            <span className="text-[10px] text-center font-medium">Thịnh hành</span>
          </Link>

          <Link 
            href="/profile" 
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-[#222222] text-gray-300 hover:text-white w-16"
            title="Đăng ký"
          >
            <Tv className="w-5 h-5" />
            <span className="text-[10px] text-center font-medium">Đăng ký</span>
          </Link>

          <Link 
            href="/history" 
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-[#222222] text-gray-300 hover:text-white w-16"
            title="Bạn"
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] text-center font-medium">Bạn</span>
          </Link>
        </aside>
      )}
    </>
  );
}
