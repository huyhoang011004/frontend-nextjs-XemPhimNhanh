'use client';

import React from 'react';
import Link from 'next/link';

export default function AdminMoviesPage() {
  const movies = [
    { id: 1, title: 'Đấu La Đại Lục', slug: 'dau-la-dai-luc', status: 'Hoàn thành', views: 12000 },
    { id: 2, title: 'Thế Giới Hoàn Mỹ', slug: 'the-gioi-hoan-my', status: 'Đang chiếu', views: 8000 },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý Phim</h1>
        <Link href="/admin/movies/create" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium shadow">
          + Thêm Phim Mới
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-4 p-4 bg-gray-900 border border-gray-800 rounded-lg">
        <input type="text" placeholder="Tìm tên phim..." className="bg-black text-white border border-gray-700 px-4 py-2 rounded w-64" />
        <select className="bg-black text-white border border-gray-700 px-4 py-2 rounded">
          <option>Tất cả thể loại</option>
          <option>Hành động</option>
          <option>Tình cảm</option>
        </select>
        <button className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 hover:bg-gray-700">Lọc</button>
      </div>

      {/* Data Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-950">
            <tr>
              <th className="p-4 text-gray-400 font-medium">Tên Phim</th>
              <th className="p-4 text-gray-400 font-medium">Đường dẫn (Slug)</th>
              <th className="p-4 text-gray-400 font-medium">Trạng Thái</th>
              <th className="p-4 text-gray-400 font-medium">Lượt Xem</th>
              <th className="p-4 text-gray-400 font-medium">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {movies.map(movie => (
              <tr key={movie.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                <td className="p-4 font-bold">{movie.title}</td>
                <td className="p-4 text-gray-400">{movie.slug}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${movie.status === 'Hoàn thành' ? 'bg-green-900 text-green-300' : 'bg-blue-900 text-blue-300'}`}>
                    {movie.status}
                  </span>
                </td>
                <td className="p-4">{movie.views}</td>
                <td className="p-4 flex gap-2">
                  <button className="text-blue-500 hover:underline">Sửa</button>
                  <button className="text-red-500 hover:underline">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
