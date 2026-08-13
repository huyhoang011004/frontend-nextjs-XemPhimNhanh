'use client';

import React from 'react';

export default function IndexingSettingsPage() {
  return (
    <div className="max-w-3xl w-full">
      <h1 className="text-2xl font-bold mb-6">Cấu Hình Google Indexing (SEO)</h1>

      <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg shadow mb-8">
        <h2 className="text-lg font-bold mb-4">Gửi URL thủ công</h2>
        <p className="text-gray-400 mb-4">Nhập URL phim hoặc tập phim để kích hoạt luồng BullMQ gọi Google Indexing API.</p>
        
        <div className="flex gap-4">
          <input 
            type="text" 
            placeholder="Ví dụ: https://phimnhanh.com/phim/dau-la-dai-luc" 
            className="flex-1 bg-black text-white border border-gray-700 px-4 py-2 rounded outline-none focus:border-blue-500"
          />
          <button 
            onClick={() => alert('Đã đẩy sự kiện Trigger Indexing vào BullMQ Queue!')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-bold shadow"
          >
            Gửi Yêu Cầu Index
          </button>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-800">
          <h3 className="text-lg font-bold text-gray-300">Nhật Ký Index Gần Đây</h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-950">
            <tr>
              <th className="p-4 text-gray-400 font-medium">Thời gian</th>
              <th className="p-4 text-gray-400 font-medium">URL</th>
              <th className="p-4 text-gray-400 font-medium">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-800">
              <td className="p-4 text-sm">Vài giây trước</td>
              <td className="p-4 text-sm font-medium">/phim/dau-la-dai-luc/tap-1</td>
              <td className="p-4 text-sm text-green-400 font-bold">Thành công (Đã gửi Google)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
