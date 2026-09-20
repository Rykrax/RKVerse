import React from "react";

interface ChapterNavigationProps {
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onHome: () => void;
}

export const ChapterNavigation: React.FC<ChapterNavigationProps> = ({
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  onHome,
}) => {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
      {/* Nút Chương trước */}
      <button
        type="button"
        onClick={onPrev}
        disabled={!hasPrev}
        className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition active:scale-95 ${
          hasPrev
            ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700 cursor-pointer"
            : "border border-gray-200 bg-white text-gray-400 cursor-not-allowed opacity-60"
        }`}
      >
        <span>←</span> Chương trước
      </button>

      {/* Nút Trang chủ */}
      <button
        type="button"
        onClick={onHome}
        className="rounded-xl border border-gray-200 bg-white px-5 py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 active:scale-95 cursor-pointer"
      >
        Trang chủ
      </button>

      {/* Nút Chương tiếp */}
      <button
        type="button"
        onClick={onNext}
        disabled={!hasNext}
        className={`flex items-center gap-1.5 rounded-xl px-5 py-2 text-xs font-semibold transition active:scale-95 ${
          hasNext
            ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700 cursor-pointer"
            : "border border-gray-200 bg-white text-gray-400 cursor-not-allowed opacity-60"
        }`}
      >
        Chương tiếp <span>→</span>
      </button>
    </div>
  );
};

export default ChapterNavigation;
