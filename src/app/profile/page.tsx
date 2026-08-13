'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/use-auth-store';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout'); // Gửi API logout để xóa refresh cookie
    } catch (e) {
      console.log('Logout error', e);
    }
    logout();
    router.push('/auth/login');
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Hồ Sơ Cá Nhân</h1>
          <p className="text-gray-400">Quản lý thông tin và tài khoản của bạn</p>
        </div>
        <button 
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded font-bold transition shadow"
        >
          Đăng xuất
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block text-gray-400 mb-2 font-medium">Họ Tên</label>
          <input 
            type="text" 
            defaultValue={user.fullName} 
            className="w-full bg-black border border-gray-700 px-4 py-2 rounded outline-none focus:border-blue-500 transition"
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-2 font-medium">Email</label>
          <input 
            type="email" 
            value={user.email} 
            disabled 
            className="w-full bg-gray-800 text-gray-500 border border-gray-700 px-4 py-2 rounded cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-2 font-medium">Quyền hạn (Role)</label>
          <input 
            type="text" 
            value={user.role === 'ADMIN' ? 'Quản trị viên' : 'Thành viên'} 
            disabled 
            className="w-full bg-gray-800 text-gray-500 border border-gray-700 px-4 py-2 rounded cursor-not-allowed"
          />
        </div>
      </div>

      <div className="mt-8 border-t border-gray-800 pt-8">
        <button className="bg-blue-600 hover:bg-blue-700 px-8 py-2.5 rounded font-bold shadow-lg transition transform hover:scale-105">
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
}
