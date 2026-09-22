import React from "react";
import { UploadCloud, FileArchive, Loader2 } from "lucide-react";
import type { ProgressState } from "./types";

interface DropzoneUploaderProps {
  isProcessing: boolean;
  progress: ProgressState;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DropzoneUploader: React.FC<DropzoneUploaderProps> = ({
  isProcessing,
  progress,
  fileInputRef,
  onFileChange,
}) => {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
        Danh sách ảnh trang truyện <span className="text-red-500">*</span>
      </label>

      <div
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/20 px-6 py-6 text-center transition-colors ${
          isProcessing
            ? "opacity-80 cursor-not-allowed"
            : "hover:border-indigo-400 hover:bg-indigo-50/40 cursor-pointer"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,.zip,application/zip"
          className="hidden"
          onChange={onFileChange}
          disabled={isProcessing}
        />

        {isProcessing ? (
          <div className="w-full max-w-sm flex flex-col items-center py-2 text-indigo-600 space-y-2">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-xs font-bold">
              Đang tối ưu & nén WebP ({progress.completed}/{progress.total} ảnh
              - {progress.percent}%)
            </p>
            <div className="w-full bg-indigo-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-600 h-full transition-all duration-200 rounded-full"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-1.5 text-indigo-600 mb-1.5">
              <UploadCloud className="w-6 h-6 stroke-[2.2]" />
              <FileArchive className="w-5 h-5 stroke-[2.2]" />
            </div>

            <p className="text-xs font-bold text-indigo-600">
              Tải lên các trang ảnh hoặc File nén .ZIP
            </p>

            <p className="mt-1 text-[11px] text-gray-400 leading-relaxed max-w-sm">
              Hỗ trợ tệp ảnh (.jpg, .png, .webp) hoặc gói .zip chứa toàn bộ
              chương.
              <br />
              Tự động giải nén, sắp xếp thứ tự tự nhiên & nén WebP 80%.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
