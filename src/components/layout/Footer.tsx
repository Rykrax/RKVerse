import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-slate-100 py-6 text-center text-xs text-slate-500">
      <div className="max-w-6xl mx-auto px-4 space-y-1.5">
        <p className="font-semibold text-slate-700">
          RKVerse App &copy; 2026 - Nền tảng đọc truyện tranh
        </p>
        <p className="text-[11px] text-slate-400">
          React 19 &amp; Tailwind CSS
        </p>
      </div>
    </footer>
  );
};
