// src/features/home/components/ComicCard.tsx
import React, { useState } from "react";
import { User, Eye } from "lucide-react";

// Đường dẫn ảnh mặc định đặt trong thư mục public/assets/
const DEFAULT_COVER = "/assets/default-cover.webp";

export interface ComicItem {
  id: string | number;
  title: string;
  slug: string;
  author?: string;
  image?: string | null;
  status?: string;
  views?: number;
}

interface ComicCardProps {
  comic: ComicItem;
  onClick?: (id: string | number) => void;
}

export const ComicCard: React.FC<ComicCardProps> = ({ comic, onClick }) => {
  const views = comic.views ?? 0;
  const status = comic.status || "Đang tiến hành";

  // Khởi tạo state bằng ảnh của comic nếu có, ngược lại dùng DEFAULT_COVER
  const [imgSrc, setImgSrc] = useState<string>(
    comic.image?.trim() ? comic.image : DEFAULT_COVER,
  );

  return (
    <div
      onClick={() => onClick?.(comic.id)}
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-200 flex flex-col"
    >
      {/* Ảnh bìa */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100">
        <img
          src={imgSrc}
          alt={comic.title}
          onError={() => setImgSrc(DEFAULT_COVER)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {/* Badge trạng thái */}
        <div className="absolute top-2.5 left-2.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/95 backdrop-blur-sm text-emerald-600 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {status}
          </span>
        </div>
      </div>

      {/* Thông tin truyện */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          {/* Tên truyện */}
          <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
            {comic.title}
          </h3>

          {/* Tên tác giả (nếu có) */}
          {comic.author && (
            <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-400">
              <User className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{comic.author}</span>
            </div>
          )}
        </div>

        {/* Lượt xem (Views) */}
        <div className="pt-1 flex items-center text-[11px] text-slate-400 font-medium">
          <span className="inline-flex items-center gap-1 text-slate-500 text-[11px]">
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {views >= 1000 ? `${(views / 1000).toFixed(1)}k` : views} lượt xem
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
