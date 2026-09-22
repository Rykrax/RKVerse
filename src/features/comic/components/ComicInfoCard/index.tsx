import React from "react";
import {
  User,
  Calendar,
  Edit3,
  Trash2,
  Star,
  Eye,
  Bookmark,
  Heart,
  BookOpen,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getComicStatusConfig } from "@/utils/comicStatus";
import type { ComicInfoCardProps } from "./types";

export const ComicInfoCard: React.FC<ComicInfoCardProps> = ({
  comic,
  isAdmin,
  isLiked,
  likeCount,
  userRating,
  hoverRating,
  firstChapterUrl,
  latestChapterUrl,
  onToggleLike,
  onDeleteComic,
  onHoverRating,
  onSetRating,
}) => {
  const navigate = useNavigate();
  const statusConfig = getComicStatusConfig(comic.status);

  return (
    <section className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-6 sm:p-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Cover Image */}
        <div className="w-full md:w-64 shrink-0">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md border border-slate-100 bg-slate-50">
            <img
              src={comic.coverPath}
              alt={comic.title}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80";
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur shadow-sm bg-white/95 border ${statusConfig.badgeClass}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full animate-pulse ${statusConfig.dotClass}`}
                />
                {statusConfig.label}
              </span>
            </div>
          </div>
        </div>

        {/* Info & Metadata */}
        <div className="flex-1 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight leading-tight">
                {comic.title}
              </h1>

              {isAdmin && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    title="Chỉnh sửa truyện"
                    onClick={() => navigate(`/admin/comics/${comic.id}/edit`)}
                    className="w-8 h-8 rounded-xl border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/50 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    title="Xóa truyện"
                    onClick={onDeleteComic}
                    className="w-8 h-8 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  Tác giả:{" "}
                  <strong className="text-slate-700 font-semibold">
                    {comic.author || "Đang cập nhật"}
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  Ngày tạo:{" "}
                  {(comic as any).createdAt
                    ? new Date((comic as any).createdAt).toLocaleDateString(
                        "vi-VN",
                      )
                    : "Chưa cập nhật"}
                </span>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-100 text-xs sm:text-[13px] text-slate-600 leading-relaxed max-h-48 overflow-y-auto pr-3 whitespace-pre-line text-justify">
              {comic.description ||
                "Chưa có tóm tắt nội dung cho bộ truyện này."}
            </div>
          </div>

          {/* Stats & Actions */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  ĐÁNH GIÁ TRUNG BÌNH
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-slate-700">
                    {((comic as any).rating ?? 5.0).toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="h-8 w-px bg-slate-200/80" />

              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  LƯỢT XEM
                </span>
                <div className="flex items-center gap-1.5 mt-0.5 text-slate-700 font-bold text-sm">
                  <Eye className="w-4 h-4 text-slate-400" />
                  <span>{comic.views ?? 0}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-xs cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5 text-slate-500" />
                <span>+ Thêm Vào Tủ Sách</span>
                <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
              </button>

              <button
                type="button"
                onClick={onToggleLike}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-semibold transition-colors shadow-xs cursor-pointer ${
                  isLiked
                    ? "border-rose-200 bg-rose-50 text-rose-600"
                    : "border-rose-100 bg-rose-50/50 hover:bg-rose-50 text-rose-500"
                }`}
              >
                <Heart
                  className={`w-3.5 h-3.5 ${isLiked ? "fill-current" : ""}`}
                />
                <span>Yêu Thích ({likeCount})</span>
              </button>

              <button
                type="button"
                disabled={firstChapterUrl === "#"}
                onClick={() => navigate(firstChapterUrl)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold transition-colors shadow-xs shadow-indigo-600/20 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Đọc Từ Đầu</span>
              </button>

              <button
                type="button"
                disabled={latestChapterUrl === "#"}
                onClick={() => navigate(latestChapterUrl)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold transition-colors shadow-xs shadow-emerald-600/20 cursor-pointer"
              >
                <span>Chương Mới Nhất</span>
              </button>
            </div>
          </div>

          {/* Rating */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span className="font-medium">Đánh giá của bạn:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => onHoverRating(star)}
                  onMouseLeave={() => onHoverRating(0)}
                  onClick={() => onSetRating(star)}
                  className="p-0.5 transition-transform hover:scale-110 cursor-pointer"
                >
                  <Star
                    className={`w-4 h-4 ${
                      star <= (hoverRating || userRating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-300 fill-transparent"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-1 text-slate-500 font-semibold text-xs">
                {userRating > 0 ? `${userRating}.0` : "0.0"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
