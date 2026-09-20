import React, { useRef } from "react";
import { Layers, ChevronLeft, ChevronRight } from "lucide-react";

interface CategoryBarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -220 : 220;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-4 sm:p-5">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-3.5">
        <Layers className="w-4 h-4 text-indigo-500" />
        <span>Khám phá theo Thể loại:</span>
      </div>

      <div className="relative flex items-center group">
        <button
          type="button"
          onClick={() => handleScroll("left")}
          className="hidden group-hover:flex absolute -left-2 z-10 w-7 h-7 rounded-full bg-white shadow-md border border-slate-100 items-center justify-center text-slate-500 hover:text-indigo-600 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div
          ref={scrollRef}
          className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 w-full"
        >
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/20"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-100"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => handleScroll("right")}
          className="hidden group-hover:flex absolute -right-2 z-10 w-7 h-7 rounded-full bg-white shadow-md border border-slate-100 items-center justify-center text-slate-500 hover:text-indigo-600 transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
