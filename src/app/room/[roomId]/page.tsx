'use client';

import React, { useEffect, useState, useRef, use } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/use-auth-store';

export default function WatchPartyPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params);
  const { user } = useAuthStore();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [membersCount, setMembersCount] = useState(0);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Fake Player Ref
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!user) return; // Bắt buộc đăng nhập
    const s = io(process.env.NEXT_PUBLIC_API_URL + '/watch-party', {
      transports: ['websocket'],
    });

    s.on('connect', () => {
      s.emit('join-room', { roomId }, (response: any) => {
        if (response?.data) {
          setMembersCount(response.data.totalMembers);
        }
      });
    });

    s.on('user-joined', (data) => {
      setMembersCount(data.totalMembers);
      addSystemMessage('Một người dùng vừa tham gia phòng.');
    });

    s.on('user-left', (data) => {
      setMembersCount(data.totalMembers);
      addSystemMessage('Một người dùng đã rời phòng.');
    });

    s.on('sync-play', () => {
      setIsPlaying(true);
      addSystemMessage('Host đã tiếp tục phát.');
    });

    s.on('sync-pause', () => {
      setIsPlaying(false);
      addSystemMessage('Host đã tạm dừng.');
    });

    s.on('new-message', (data) => {
      setChatMessages(prev => [...prev, { type: 'user', ...data }]);
    });

    setSocket(s);

    return () => {
      s.emit('leave-room', { roomId });
      s.disconnect();
    };
  }, [roomId, user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const addSystemMessage = (msg: string) => {
    setChatMessages(prev => [...prev, { type: 'system', message: msg, timestamp: new Date() }]);
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !socket) return;
    
    const msgData = { roomId, message: messageInput, sender: user?.fullName || 'Ẩn danh' };
    socket.emit('chat-message', msgData);
    setChatMessages(prev => [...prev, { type: 'user', ...msgData, timestamp: new Date() }]);
    setMessageInput('');
  };

  const handlePlayToggle = () => {
    const newState = !isPlaying;
    setIsPlaying(newState);
    if (socket) {
      if (newState) socket.emit('player-play', { roomId, time: 0 });
      else socket.emit('player-pause', { roomId, time: 0 });
    }
  };

  if (!user) return <div className="p-8 text-center bg-black text-white min-h-screen">Vui lòng đăng nhập để tham gia Xem Chung.</div>;

  return (
    <div className="w-full h-screen bg-black text-white flex flex-col md:flex-row overflow-hidden">
      {/* Video Area */}
      <div className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Phòng Xem Chung: {roomId}</h1>
          <div className="bg-red-600 px-3 py-1 rounded-full text-sm font-bold animate-pulse">
            LIVE
          </div>
        </div>
        
        <div className="w-full aspect-video bg-gray-900 border border-gray-800 rounded-lg flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
          {/* Mock Video Player */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {isPlaying ? (
              <div className="text-6xl animate-bounce">🎬</div>
            ) : (
              <div className="text-6xl text-gray-600">⏸</div>
            )}
          </div>
          <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center gap-4">
            <button 
              onClick={handlePlayToggle}
              className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center font-bold transition transform hover:scale-105"
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
            <div className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden">
              <div className="w-1/3 h-full bg-blue-500"></div>
            </div>
            <span className="text-xs font-medium">Đang phát (Host Only)</span>
          </div>
        </div>
      </div>

      {/* Chat & Members Area */}
      <div className="w-full md:w-96 bg-gray-950 border-l border-gray-900 flex flex-col h-[50vh] md:h-full shrink-0">
        <div className="p-4 border-b border-gray-900 flex justify-between items-center bg-gray-900/50">
          <h2 className="font-bold">Trò Chuyện</h2>
          <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-800 px-2 py-1 rounded">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            {membersCount} online
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {chatMessages.map((msg, idx) => (
            <div key={idx} className={`text-sm ${msg.type === 'system' ? 'text-center' : ''}`}>
              {msg.type === 'system' ? (
                <span className="text-xs text-gray-500 italic bg-gray-900 px-3 py-1 rounded-full">{msg.message}</span>
              ) : (
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-blue-400 mb-0.5">{msg.sender}</span>
                  <span className="bg-gray-800 text-gray-200 px-3 py-2 rounded-lg rounded-tl-none w-fit max-w-[90%] break-words">
                    {msg.message}
                  </span>
                </div>
              )}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        
        <form onSubmit={sendMessage} className="p-4 border-t border-gray-900 bg-gray-900/50">
          <div className="flex gap-2">
            <input 
              type="text" 
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Gửi tin nhắn..." 
              className="flex-1 bg-black border border-gray-800 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 transition"
            />
            <button 
              type="submit"
              disabled={!messageInput.trim()}
              className="bg-blue-600 disabled:bg-gray-800 text-white px-4 py-2 rounded font-bold transition hover:bg-blue-700"
            >
              Gửi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
