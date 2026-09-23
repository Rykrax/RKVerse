import { ArrowLeft } from "lucide-react";
import type { ProfileHeaderProps } from "./types";

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ onBack }) => {
  return (
    <div className="flex items-center justify-between pb-1">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors font-medium text-xs cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Quay lại</span>
      </button>

      <h1 className="text-xl font-bold text-slate-800 tracking-tight">
        Trang Cá Nhân
      </h1>
    </div>
  );
};
