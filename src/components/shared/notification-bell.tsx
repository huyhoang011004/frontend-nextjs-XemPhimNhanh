'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/use-auth-store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function NotificationBell() {
  const { user } = useAuthStore();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 60000); 
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const res = await apiClient.get('/notifications/unread-count');
      if (res.data.success) {
        setUnreadCount(res.data.count);
      }
    } catch (e) {}
  };

  const fetchNotifications = async () => {
    try {
      const res = await apiClient.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.data);
      }
    } catch (e) {}
  };

  const handleToggle = () => {
    if (!isOpen) {
      fetchNotifications();
    }
    setIsOpen(!isOpen);
  };

  const handleMarkAsRead = async (id: string, url: string) => {
    try {
      await apiClient.patch(`/notifications/${id}/read`);
      setUnreadCount(prev => Math.max(0, prev - 1));
      setIsOpen(false);
      if (url) {
        router.push(url);
      }
    } catch (e) {}
  };

  const handleMarkAllAsRead = async () => {
    try {
      await apiClient.patch('/notifications/read-all');
      setUnreadCount(0);
      fetchNotifications();
    } catch (e) {}
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button 
        onClick={handleToggle}
        className="relative p-2 text-gray-400 hover:text-white transition"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-gray-900">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-gray-900 border border-gray-800 rounded-lg shadow-2xl z-50 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-800">
              <h3 className="font-bold text-lg text-white">Thông báo</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-blue-500 hover:underline font-medium"
                >
                  Đánh dấu đã đọc
                </button>
              )}
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">
                  Không có thông báo nào.
                </div>
              ) : (
                notifications.map(notif => (
                  <div 
                    key={notif._id}
                    onClick={() => handleMarkAsRead(notif._id, notif.targetUrl)}
                    className={`p-4 border-b border-gray-800/50 cursor-pointer transition hover:bg-gray-800 ${notif.isRead ? 'opacity-60' : 'bg-gray-800/20'}`}
                  >
                    <h4 className={`text-sm ${notif.isRead ? 'text-gray-300' : 'text-white font-bold'}`}>{notif.title}</h4>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{notif.message}</p>
                    <p className="text-[10px] text-gray-500 mt-2">{new Date(notif.createdAt).toLocaleString('vi-VN')}</p>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-2 border-t border-gray-800 text-center">
              <Link href="/profile" className="text-xs text-gray-400 hover:text-white" onClick={() => setIsOpen(false)}>Xem tất cả</Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
