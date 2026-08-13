import React from 'react';
import Link from 'next/link';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-8 py-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-gray-900 border border-gray-800 rounded-lg p-4 h-fit shrink-0">
          <nav className="flex flex-col gap-2">
            <Link href="/profile" className="px-4 py-2 hover:bg-gray-800 rounded font-medium transition">Thông Tin Chung</Link>
            <Link href="/profile/watchlist" className="px-4 py-2 hover:bg-gray-800 rounded font-medium transition">Phim Đã Theo Dõi</Link>
            <Link href="/profile/history" className="px-4 py-2 hover:bg-gray-800 rounded font-medium transition">Lịch Sử Xem</Link>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 bg-gray-900 border border-gray-800 rounded-lg p-8 shadow-xl">
          {children}
        </main>
      </div>
    </div>
  );
}
