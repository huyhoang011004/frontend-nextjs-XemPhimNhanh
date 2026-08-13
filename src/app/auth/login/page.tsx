'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/use-auth-store';
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu ít nhất 6 ký tự'),
});

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [errorMsg, setErrorMsg] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: any) => {
    setErrorMsg('');
    try {
      const res = await apiClient.post('/auth/login', data);
      if (res.data.success) {
        setAuth(res.data.user, res.data.accessToken);
        router.push('/');
      }
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || 'Đăng nhập thất bại');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3001/auth/google';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 p-8 rounded-lg shadow-2xl">
        <h1 className="text-2xl font-bold text-center text-white mb-6">Đăng Nhập</h1>
        
        {errorMsg && <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded mb-4 text-sm">{errorMsg}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-400 mb-1 font-medium">Email</label>
            <input 
              {...register('email')} 
              className="w-full bg-black border border-gray-700 text-white px-4 py-2 rounded outline-none focus:border-blue-500 transition" 
              placeholder="Nhập email" 
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message as string}</p>}
          </div>

          <div>
            <label className="block text-gray-400 mb-1 font-medium">Mật khẩu</label>
            <input 
              type="password"
              {...register('password')} 
              className="w-full bg-black border border-gray-700 text-white px-4 py-2 rounded outline-none focus:border-blue-500 transition" 
              placeholder="Nhập mật khẩu" 
            />
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message as string}</p>}
          </div>

          <button 
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded mt-2 disabled:opacity-50 transition shadow-lg"
          >
            {isSubmitting ? 'Đang đăng nhập...' : 'Đăng Nhập'}
          </button>
        </form>

        <div className="mt-6 border-t border-gray-800 pt-6">
          <button 
            onClick={handleGoogleLogin}
            className="w-full bg-white hover:bg-gray-100 text-black font-bold py-2.5 rounded flex items-center justify-center gap-3 transition shadow"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-5 h-5" />
            Đăng nhập bằng Google
          </button>
        </div>

        <div className="mt-6 text-center text-gray-400 text-sm">
          Chưa có tài khoản? <Link href="/auth/register" className="text-blue-500 hover:underline">Đăng ký ngay</Link>
        </div>
      </div>
    </div>
  );
}
