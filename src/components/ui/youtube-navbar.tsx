'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Menu, 
  Search, 
  Mic, 
  Play, 
  Users, 
  User as UserIcon, 
  LogOut, 
  History, 
  Bookmark,
  X
} from 'lucide-react';
import { useSidebarStore } from '@/store/use-sidebar-store';
import { useAuthStore } from '@/store/use-auth-store';
import { NotificationBell } from '@/components/shared/notification-bell';

import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function YoutubeNavbar() {
  const router = useRouter();
  const { toggleSidebar, toggleMobileSidebar } = useSidebarStore();
  const { user, logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleMenuClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      toggleMobileSidebar();
    } else {
      toggleSidebar();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-background border-b border-border z-50 flex items-center justify-between px-4">
      {/* Góc trái: Nút Hamburger Menu và Logo YouTube Phim */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleMenuClick}
          className="rounded-full hover:bg-accent text-foreground transition active:scale-95"
          aria-label="Mở menu điều hướng"
        >
          <Menu className="w-5 h-5 text-foreground" />
        </Button>

        <Link href="/" className="flex items-center gap-1.5 select-none group">
          <div className="w-8 h-6 bg-[var(--yt-red)] rounded-md flex items-center justify-center shadow group-hover:scale-105 transition-transform">
            <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
          </div>
          <div className="flex items-center">
            <span className="text-lg font-bold text-foreground tracking-tight font-sans">
              Phim<span className="text-[var(--yt-red)]">Nhanh</span>
            </span>
            <span className="text-[10px] text-muted-foreground font-semibold ml-1 self-start">
              VN
            </span>
          </div>
        </Link>
      </div>

      {/* Ở giữa: Thanh tìm kiếm chuẩn phong cách YouTube */}
      <div className="flex-1 max-w-2xl mx-4 hidden sm:flex items-center justify-center">
        <form onSubmit={handleSearch} className="flex items-center w-full max-w-xl">
          <div className="relative flex-1 flex items-center">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm phim, diễn viên, thể loại..."
              className="w-full h-10 px-4 bg-background border-border focus-visible:ring-1 focus-visible:ring-[var(--yt-blue)] focus-visible:border-[var(--yt-blue)] rounded-l-full rounded-r-none text-foreground text-sm shadow-none"
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setSearchQuery('')}
                className="absolute right-1 w-8 h-8 rounded-full text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          <Button
            type="submit"
            variant="outline"
            className="h-10 px-6 bg-[var(--yt-surface)] hover:bg-[var(--yt-hover)] border-l-0 rounded-r-full rounded-l-none text-muted-foreground hover:text-foreground transition flex items-center justify-center shadow-none"
            title="Tìm kiếm"
          >
            <Search className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={() => alert('Tìm kiếm bằng giọng nói đang được kết nối...')}
            className="ml-2 w-10 h-10 rounded-full bg-[var(--yt-surface)] hover:bg-[var(--yt-hover)] flex items-center justify-center text-foreground transition shrink-0"
            title="Tìm kiếm bằng giọng nói"
          >
            <Mic className="w-4 h-4" />
          </Button>
        </form>
      </div>

      {/* Góc phải: Xem chung, Chuông thông báo & Profile / Đăng nhập */}
      <div className="flex items-center gap-2">
        {/* Nút tìm kiếm cho màn hình nhỏ */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            const query = prompt('Nhập tên phim cần tìm:');
            if (query) router.push(`/search?q=${encodeURIComponent(query)}`);
          }}
          className="sm:hidden rounded-full hover:bg-accent text-foreground"
        >
          <Search className="w-5 h-5" />
        </Button>

        {/* Nút Phòng xem chung (Watch Party) */}
        <Link 
          href="/room"
          className={`${buttonVariants({ variant: 'ghost' })} hidden md:flex items-center gap-1.5 rounded-full hover:bg-accent text-foreground`}
          title="Tạo phòng xem phim chung"
        >
          <Users className="w-4 h-4 text-[var(--yt-blue)]" />
          <span>Xem Chung</span>
        </Link>

        {/* Chuông thông báo */}
        <div className="relative">
          <NotificationBell />
        </div>

        {/* Avatar người dùng hoặc nút Đăng nhập chuẩn YouTube */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 text-white font-bold flex items-center justify-center text-sm shadow hover:opacity-90 transition outline-none cursor-pointer"
            >
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card border-border rounded-xl shadow-lg z-50">
              <div className="px-4 py-2 border-b border-border">
                <p className="font-semibold text-foreground truncate">{user.fullName || 'Người dùng'}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
              <DropdownMenuItem onClick={() => router.push('/profile')} className="cursor-pointer py-2.5 flex items-center gap-3">
                <UserIcon className="w-4 h-4 text-muted-foreground" />
                <span>Kênh của bạn</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/history')} className="cursor-pointer py-2.5 flex items-center gap-3">
                <History className="w-4 h-4 text-muted-foreground" />
                <span>Lịch sử xem</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/playlist')} className="cursor-pointer py-2.5 flex items-center gap-3">
                <Bookmark className="w-4 h-4 text-muted-foreground" />
                <span>Danh sách phát</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem 
                onClick={() => logout()} 
                className="flex items-center gap-3 text-destructive focus:text-destructive cursor-pointer py-2.5"
              >
                <LogOut className="w-4 h-4" />
                <span>Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/auth/login" passHref legacyBehavior>
            <Button
              variant="outline"
              className="rounded-full border-[var(--yt-blue)] text-[var(--yt-blue)] hover:bg-[var(--yt-blue)]/10"
            >
              <UserIcon className="w-4 h-4 mr-2" />
              Đăng nhập
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
