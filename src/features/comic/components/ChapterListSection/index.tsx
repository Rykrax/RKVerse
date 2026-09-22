import React from "react";
import { BookOpen, ArrowUpDown, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ChapterListSectionProps } from "./types";

export const ChapterListSection: React.FC<ChapterListSectionProps> = ({
  chapters,
  isAdmin,
  isSortDesc,
  onSortChapters,
  onOpenAddChapterModal,
  getChapterUrl,
}) => {
  const navigate = useNavigate();

  return (
    <section className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg sm:text-xl font-black text-slate-800">
            Danh Sách Chương ({chapters.length})
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSortChapters}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-xs font-semibold text-slate-600 transition-colors cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{isSortDesc ? "Mới nhất trước" : "Cũ nhất trước"}</span>
          </button>

          {isAdmin && (
            <button
              type="button"
              onClick={onOpenAddChapterModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shadow-xs shadow-indigo-600/20 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Thêm Chương Mới</span>
            </button>
          )}
        </div>
      </div>

      {chapters.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-xs sm:text-sm">
          Truyện hiện chưa có chương nào được đăng tải.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {chapters.map((chap) => (
            <div
              key={chap.id}
              onClick={() => navigate(getChapterUrl(chap.chapterNumber))}
              className="group cursor-pointer p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-indigo-50/40 hover:border-indigo-100 transition-all flex flex-col justify-between gap-1"
            >
              <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                {chap.title}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                {chap.createdAt}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
