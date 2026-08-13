import React from 'react';

export function Sidebar() {
  return (
    <aside className="w-64 h-full min-h-screen bg-card p-4 border-r border-border hidden md:block">
      <nav className="flex flex-col gap-2">
        <a href="#" className="p-2 hover:bg-gray-800 rounded text-white font-medium">Trang Chủ</a>
        <a href="#" className="p-2 hover:bg-gray-800 rounded text-white font-medium">Phim Mới</a>
        <a href="#" className="p-2 hover:bg-gray-800 rounded text-white font-medium">Thể Loại</a>
      </nav>
    </aside>
  );
}
