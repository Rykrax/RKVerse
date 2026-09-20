import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface PaginationProps {
  currentPage: number; // 1-based index (trang hiện tại, ví dụ 1, 2, 3...)
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  //   if (totalPages <= 1) return null;

  // Tính toán dải trang hiển thị (tối đa 5 trang xung quanh trang hiện tại)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);

      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages) {
        if (end < totalPages - 1) pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1.5 pt-6 pb-2">
      {/* Về trang đầu */}
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(1)}
        className="w-9 h-9 rounded-xl border border-slate-200/80 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-indigo-600 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-500 transition-colors shadow-xs"
        title="Trang đầu"
      >
        <ChevronsLeft className="w-4 h-4" />
      </button>

      {/* Trang trước */}
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="w-9 h-9 rounded-xl border border-slate-200/80 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-indigo-600 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-500 transition-colors shadow-xs"
        title="Trang trước"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Danh sách các số trang */}
      {getPageNumbers().map((page, index) => {
        if (page === "...") {
          return (
            <span
              key={`dots-${index}`}
              className="w-9 h-9 flex items-center justify-center text-slate-400 text-xs font-semibold select-none"
            >
              ...
            </span>
          );
        }

        const isActive = page === currentPage;
        return (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(Number(page))}
            className={`w-9 h-9 rounded-xl text-xs font-bold transition-all shadow-xs ${
              isActive
                ? "bg-indigo-600 text-white shadow-indigo-500/20"
                : "border border-slate-200/80 bg-white text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
            }`}
          >
            {page}
          </button>
        );
      })}

      {/* Trang kế tiếp */}
      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="w-9 h-9 rounded-xl border border-slate-200/80 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-indigo-600 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-500 transition-colors shadow-xs"
        title="Trang sau"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Đến trang cuối */}
      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(totalPages)}
        className="w-9 h-9 rounded-xl border border-slate-200/80 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-indigo-600 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-500 transition-colors shadow-xs"
        title="Trang cuối"
      >
        <ChevronsRight className="w-4 h-4" />
      </button>
    </div>
  );
};
