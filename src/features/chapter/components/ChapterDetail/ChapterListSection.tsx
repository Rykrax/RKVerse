import React from "react";
import type { ChapterItem } from "./types";

interface ChapterListSectionProps {
  comicTitle: string;
  currentChapterId: string | number;
  chapters: ChapterItem[];
  onSelectChapter: (chapter: ChapterItem) => void;
  onViewAll?: () => void;
}

export const ChapterListSection: React.FC<ChapterListSectionProps> = ({
  currentChapterId,
  chapters,
  onSelectChapter,
  onViewAll,
}) => {
  return (
    <div
      id="chapter-list-section"
      className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
    >
      <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
        <h3 className="text-sm font-bold text-gray-800">
          Danh sách chương ({chapters.length})
        </h3>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-xs font-medium text-blue-600 hover:underline"
          >
            Xem tất cả →
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 text-xs">
        {chapters.map((chap) => {
          const isCurrent = chap.id === currentChapterId;
          return (
            <button
              key={chap.id}
              onClick={() => onSelectChapter(chap)}
              className={`truncate rounded-xl px-3 py-2.5 text-left font-medium transition border ${
                isCurrent
                  ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm font-semibold"
                  : "border-gray-100 bg-gray-50/70 text-gray-700 hover:border-gray-200 hover:bg-gray-100"
              }`}
            >
              {chap.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
