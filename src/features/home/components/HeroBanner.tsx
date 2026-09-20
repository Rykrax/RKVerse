import React from "react";
import { Sparkles } from "lucide-react";

export const HeroBanner: React.FC = () => {
  return (
    <section className="relative overflow-hidden rounded-3xl p-8 sm:p-12 md:p-14 text-white shadow-[0_10px_35px_rgba(79,70,229,0.15)] bg-gradient-to-r from-[#4f46e5] via-[#2563eb] to-[#06b6d4]">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-medium tracking-wide mb-6">
        <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
        <span>Thư Viện Truyện Tranh Độc Quyền</span>
      </div>

      <div className="max-w-2xl space-y-3">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.15]">
          Khám phá thế giới câu chuyện hấp dẫn và phong phú
        </h1>
        <p className="text-white/80 text-xs sm:text-sm md:text-base leading-relaxed pt-1">
          Trải nghiệm đọc truyện mượt mà với giao diện dịu mắt, cập nhật chương
          mới nhanh nhất cùng cộng đồng mê truyện đông đảo.
        </p>
      </div>
    </section>
  );
};
