import { Pencil } from "lucide-react";
import type { ProfileDetailItemProps } from "./types";

export const ProfileDetailItem: React.FC<ProfileDetailItemProps> = ({
  icon: Icon,
  label,
  value,
  onEdit,
  isEditable = false,
}) => {
  return (
    <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all shadow-xs">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
          {Icon && <Icon className="w-3.5 h-3.5 text-blue-500" />}
          <span>{label}</span>
        </div>

        {isEditable && (
          <button
            onClick={onEdit}
            className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
          >
            <Pencil className="w-3 h-3" />
            <span>Chỉnh sửa</span>
          </button>
        )}
      </div>

      <div className="text-slate-800 font-semibold text-sm pl-5">
        {value || (
          <span className="text-slate-400 font-normal">Chưa cập nhật</span>
        )}
      </div>
    </div>
  );
};
