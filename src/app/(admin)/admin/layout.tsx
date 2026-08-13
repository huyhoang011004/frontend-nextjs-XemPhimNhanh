import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Admin Dashboard | WebPhimNhanh',
  description: 'Hệ thống quản trị',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-900 text-white font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-950 border-r border-gray-800 p-6 flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-blue-500">Admin Panel</h1>
        <nav className="flex flex-col gap-2">
          <Link href="/admin" className="px-4 py-2 hover:bg-gray-800 rounded">Dashboard</Link>
          <Link href="/admin/movies" className="px-4 py-2 hover:bg-gray-800 rounded">Quản lý Phim</Link>
          <Link href="/admin/episodes" className="px-4 py-2 hover:bg-gray-800 rounded">Quản lý Tập phim</Link>
          <Link href="/admin/settings/indexing" className="px-4 py-2 hover:bg-gray-800 rounded">Google Indexing</Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-gray-950 border-b border-gray-800 px-8 flex items-center justify-between">
          <h2 className="text-lg font-medium">Xin chào, Admin</h2>
          <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-bold">Đăng xuất</button>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-8 overflow-auto bg-black">
          {children}
        </div>
      </main>
    </div>
  );
}
