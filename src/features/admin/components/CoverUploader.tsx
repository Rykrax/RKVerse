import React, { useRef, useState } from "react";
import { Upload, ImageIcon } from "lucide-react";

interface CoverUploaderProps {
  onFileSelect: (file: File | null) => void;
}

export const CoverUploader: React.FC<CoverUploaderProps> = ({
  onFileSelect,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      onFileSelect(file);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-slate-700 block">
        Ảnh bìa truyện <span className="text-rose-500">*</span>
      </label>

      <div className="flex items-center gap-4">
        {/* Khung preview */}
        <div className="w-20 h-28 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden flex flex-col items-center justify-center text-slate-400 shrink-0">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview bìa"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-1 text-[10px]">
              <ImageIcon className="w-5 h-5 text-slate-300" />
              <span>Chưa chọn ảnh</span>
            </div>
          )}
        </div>

        {/* Nút upload & Ghi chú */}
        <div className="space-y-1.5 flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-600 text-xs font-semibold transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Chọn Tệp Ảnh Bìa</span>
          </button>
          <p className="text-[11px] text-slate-400 leading-snug">
            Tự động tối ưu dung lượng & resize trên trình duyệt (giúp không tốn
            CPU/RAM server).
          </p>
        </div>
      </div>
    </div>
  );
};
