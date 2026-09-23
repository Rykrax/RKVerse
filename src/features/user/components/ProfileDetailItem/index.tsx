import React, { useState, useEffect } from "react";
import { Pencil, Loader2 } from "lucide-react";

export interface ProfileDetailItemProps {
  icon?: React.ElementType;
  label: string;
  value?: string | null;
  isEditable?: boolean;
  onEdit?: (newValue: string) => Promise<void> | void;
}

export const ProfileDetailItem: React.FC<ProfileDetailItemProps> = ({
  icon: Icon,
  label,
  value,
  isEditable = false,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");
  const [saving, setSaving] = useState(false);

  // Đồng bộ lại input khi prop value thay đổi
  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const handleOpenEdit = () => {
    setInputValue(value || "");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setInputValue(value || "");
    setIsEditing(false);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || inputValue.trim() === value) {
      setIsEditing(false);
      return;
    }

    try {
      setSaving(true);
      if (onEdit) {
        await onEdit(inputValue.trim());
      }
      setIsEditing(false);
    } catch (error) {
      // Giữ nguyên input để user thử lại nếu lỗi
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-slate-100 bg-white/80 hover:border-slate-200 transition-all shadow-[0_2px_8px_rgb(0,0,0,0.02)]">
      {/* Tiêu đề mục */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-slate-500 text-xs sm:text-sm font-medium">
          {Icon && <Icon className="w-4 h-4 text-indigo-500 shrink-0" />}
          <span>{label}</span>
        </div>

        {/* Nút chỉnh sửa (chỉ hiện khi chưa bật chế độ sửa) */}
        {isEditable && !isEditing && (
          <button
            type="button"
            onClick={handleOpenEdit}
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Chỉnh sửa</span>
          </button>
        )}
      </div>

      {/* Nội dung hiển thị hoặc Form chỉnh sửa */}
      {isEditing ? (
        <form onSubmit={handleSave} className="flex items-center gap-2.5">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={saving}
            autoFocus
            className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
            placeholder="Nhập tên hiển thị..."
          />

          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center justify-center min-w-[54px] cursor-pointer"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Lưu"}
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={handleCancel}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-600 text-xs font-semibold rounded-xl transition-all cursor-pointer"
          >
            Hủy
          </button>
        </form>
      ) : (
        <div className="text-slate-900 font-bold text-sm sm:text-base tracking-tight">
          {value || (
            <span className="text-slate-400 font-normal">Chưa cập nhật</span>
          )}
        </div>
      )}
    </div>
  );
};
