'use client';

import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';

export default function AdminEpisodesPage() {
  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      serverData: [{ serverName: 'VIP 1 (HLS)', type: 'hls', linkM3u8: '' }],
    }
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'serverData' });

  const onSubmit = (data: any) => {
    console.log('Submitting Episode:', data);
    alert('Đã lưu dữ liệu tập phim!');
  };

  return (
    <div className="max-w-4xl w-full">
      <h1 className="text-2xl font-bold mb-6">Quản lý Tập phim & Links</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-900 border border-gray-800 p-6 rounded-lg shadow flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 mb-2">Chọn Phim (Slug)</label>
            <input type="text" className="w-full bg-black text-white border border-gray-700 px-4 py-2 rounded" defaultValue="dau-la-dai-luc" />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Tên Tập Phim (Ví dụ: Tập 1)</label>
            <input type="text" className="w-full bg-black text-white border border-gray-700 px-4 py-2 rounded" defaultValue="Tập 1" />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-gray-400">Danh Sách Nguồn Phát (Servers)</label>
            <button 
              type="button" 
              onClick={() => append({ serverName: '', type: 'hls', linkM3u8: '' })}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm font-medium"
            >
              + Thêm Server Mới
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-4 items-center bg-black p-4 rounded border border-gray-700">
                <input 
                  {...register(`serverData.${index}.serverName`)} 
                  placeholder="Tên server (VIP 1...)" 
                  className="bg-gray-900 text-white border border-gray-700 px-3 py-2 rounded w-1/4"
                />
                <select 
                  {...register(`serverData.${index}.type`)} 
                  className="bg-gray-900 text-white border border-gray-700 px-3 py-2 rounded w-1/4"
                >
                  <option value="hls">HLS (.m3u8)</option>
                  <option value="iframe">Iframe (Embed)</option>
                  <option value="mp4">MP4</option>
                </select>
                <input 
                  {...register(`serverData.${index}.linkM3u8`)} 
                  placeholder="Đường dẫn (URL)" 
                  className="bg-gray-900 text-white border border-gray-700 px-3 py-2 rounded flex-1"
                />
                <button 
                  type="button" 
                  onClick={() => remove(index)} 
                  className="text-red-500 hover:text-red-400 font-bold px-3 py-2 bg-gray-800 rounded"
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-800 mt-2">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded shadow">
            Lưu Tập Phim
          </button>
        </div>
      </form>
    </div>
  );
}
