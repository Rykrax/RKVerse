import React from "react";
import { Filter, Clock, Eye, Star, type LucideIcon } from "lucide-react";

export interface SortOption {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const DEFAULT_SORT_OPTIONS: SortOption[] = [
  { id: "newest", label: "Mới nhất", icon: Clock },
  { id: "views", label: "Xem nhiều", icon: Eye },
  { id: "rating", label: "Đánh giá cao", icon: Star },
];

interface FilterToolbarProps {
  statuses: string[];
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
  selectedSort: string;
  onSelectSort: (sortId: string) => void;
  sortOptions?: SortOption[];
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  statuses,
  selectedStatus,
  onSelectStatus,
  selectedSort,
  onSelectSort,
  sortOptions = DEFAULT_SORT_OPTIONS,
}) => {
  return (
    <section className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] px-5 py-3.5 flex flex-wrap items-center justify-between gap-4">
      {/* Bộ lọc trạng thái */}
      <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mr-1">
          <Filter className="w-3.5 h-3.5" />
          <span>Lọc:</span>
        </div>
        {statuses.map((status) => {
          const isActive = selectedStatus === status;
          return (
            <button
              key={status}
              type="button"
              onClick={() => onSelectStatus(status)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/10"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100/60"
              }`}
            >
              {status}
            </button>
          );
        })}
      </div>

      {/* Sắp xếp */}
      <div className="flex items-center gap-2 sm:gap-3 ml-auto">
        <span className="text-xs text-slate-400 font-medium">Sắp xếp:</span>
        {sortOptions.map((sort) => {
          const Icon = sort.icon;
          const isActive = selectedSort === sort.id;
          return (
            <button
              key={sort.id}
              type="button"
              onClick={() => onSelectSort(sort.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? "border border-indigo-200 bg-indigo-50/50 text-indigo-600 font-semibold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{sort.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
