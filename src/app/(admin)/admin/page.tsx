'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'T2', views: 4000 },
  { name: 'T3', views: 3000 },
  { name: 'T4', views: 2000 },
  { name: 'T5', views: 2780 },
  { name: 'T6', views: 1890 },
  { name: 'T7', views: 2390 },
  { name: 'CN', views: 3490 },
];

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-8 w-full">
      <h1 className="text-3xl font-bold">Dashboard Tổng Quan</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tổng Phim', value: '1,234' },
          { label: 'Tổng Tập', value: '5,678' },
          { label: 'Views (Hôm nay)', value: '12,345' },
          { label: 'Tổng Views', value: '1.2M' },
        ].map((stat, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-gray-400 text-sm font-medium">{stat.label}</h3>
            <p className="text-3xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg shadow h-[400px]">
        <h3 className="text-lg font-bold mb-4">Lượt xem 7 ngày qua</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }} />
            <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Broken Links Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-800">
          <h3 className="text-lg font-bold text-red-500">Cảnh Báo Link Lỗi (Broken Links)</h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-950">
            <tr>
              <th className="p-4 font-medium text-gray-400">Phim</th>
              <th className="p-4 font-medium text-gray-400">Tập</th>
              <th className="p-4 font-medium text-gray-400">Lỗi</th>
              <th className="p-4 font-medium text-gray-400">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-800">
              <td className="p-4">Đấu La Đại Lục</td>
              <td className="p-4">Tập 1</td>
              <td className="p-4 text-red-400">Timeout HLS</td>
              <td className="p-4"><button className="text-blue-500 hover:underline">Sửa link</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
