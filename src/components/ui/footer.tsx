import React from 'react';

export function Footer() {
  return (
    <footer className="w-full py-6 bg-card text-center text-sm text-gray-400 mt-auto border-t border-border">
      <p>&copy; {new Date().getFullYear()} WebPhimNhanh. All rights reserved.</p>
    </footer>
  );
}
