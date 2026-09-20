import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";

export const ALL_CATEGORIES = [
  "Action",
  "Adventure",
  "Anime",
  "Chuyển Sinh",
  "Cổ Đại",
  "Comedy",
  "Comic",
  "Demons",
  "Detective",
  "Doujinshi",
  "Drama",
  "Fantasy",
  "Gender Bender",
  "Harem",
  "Historical",
  "Horror",
  "Huyền Huyễn",
  "Isekai",
  "Josei",
  "Mafia",
  "Magic",
  "Manga",
  "Manhua",
  "Manhwa",
  "Martial Arts",
  "Military",
  "Mystery",
  "Ngôn Tình",
  "One shot",
  "Psychological",
  "Romance",
  "School Life",
  "Sci-fi",
  "Seinen",
  "Shoujo",
  "Shoujo Ai",
  "Shounen",
  "Shounen Ai",
  "Slice of life",
  "Sports",
  "Supernatural",
  "Tragedy",
  "Trọng Sinh",
  "Truyện Màu",
  "Webtoon",
  "Xuyên Không",
];

interface CategorySelectorProps {
  selectedCategories: string[];
  onChange: (categories: string[]) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategories,
  onChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = useMemo(() => {
    return ALL_CATEGORIES.filter((cat) =>
      cat.toLowerCase().includes(searchTerm.trim().toLowerCase()),
    );
  }, [searchTerm]);

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      onChange(selectedCategories.filter((c) => c !== cat));
    } else {
      onChange([...selectedCategories, cat]);
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-700">
          Thể loại truyện ({selectedCategories.length} đã chọn)
        </label>

        {/* Search input nhỏ góc phải */}
        <div className="relative flex items-center w-40">
          <Search className="absolute left-2.5 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm thể loại..."
            className="w-full pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:bg-white"
          />
        </div>
      </div>

      {/* Vùng chọn badge cuộn dọc */}
      <div className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-2xl max-h-36 overflow-y-auto flex flex-wrap gap-1.5 scrollbar-thin">
        {filteredCategories.length === 0 ? (
          <span className="text-xs text-slate-400 py-2 w-full text-center">
            Không tìm thấy thể loại phù hợp
          </span>
        ) : (
          filteredCategories.map((cat) => {
            const isSelected = selectedCategories.includes(cat);
            return (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-xs shadow-indigo-500/20"
                    : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100/70"
                }`}
              >
                {cat}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
