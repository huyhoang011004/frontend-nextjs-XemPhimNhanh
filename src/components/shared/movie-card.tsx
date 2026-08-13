import React from 'react';

export function MovieCard({ title, posterUrl }: { title: string, posterUrl: string }) {
  return (
    <div className="flex flex-col bg-card border border-border rounded-lg overflow-hidden shadow hover:shadow-lg transition-all cursor-pointer hover:scale-105">
      <img src={posterUrl} alt={title} className="w-full h-64 object-cover" />
      <div className="p-4">
        <h3 className="font-semibold text-white truncate text-sm">{title}</h3>
      </div>
    </div>
  );
}
