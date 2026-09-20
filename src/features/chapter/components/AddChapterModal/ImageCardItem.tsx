import React from "react";
import { GripVertical, Trash2, Maximize2 } from "lucide-react";
import type { UploadedImageItem } from "../../types";

interface ImageCardItemProps {
  item: UploadedImageItem;
  index: number;
  formatFileSize: (bytes: number) => string;
  onDragStart: (index: number) => void;
  onDragEnter: (index: number) => void;
  onDragEnd: () => void;
  onRemove: (index: number) => void;
  onPreview: (item: UploadedImageItem) => void;
}

export const ImageCardItem: React.FC<ImageCardItemProps> = ({
  item,
  index,
  formatFileSize,
  onDragStart,
  onDragEnter,
  onDragEnd,
  onRemove,
  onPreview,
}) => {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(index)}
      onDragEnter={() => onDragEnter(index)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
      className="group relative flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-2.5 shadow-2xs hover:shadow-md hover:border-indigo-400 transition cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-center justify-between mb-2 text-xs text-gray-600">
        <div className="flex items-center gap-1 font-semibold">
          <GripVertical className="w-3.5 h-3.5 text-gray-400" />
          <span>Trang {index + 1}</span>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(index);
          }}
          className="text-gray-400 hover:text-red-500 p-0.5 rounded transition cursor-pointer"
          title="Xóa trang này"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-slate-950/5 border border-slate-100 mb-2 flex items-center justify-center group/thumb">
        <img
          src={item.previewUrl}
          alt={item.file.name}
          className="w-full h-full object-contain pointer-events-none select-none"
        />

        <button
          type="button"
          onClick={() => onPreview(item)}
          className="absolute inset-0 bg-black/35 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white text-xs font-semibold cursor-pointer"
        >
          <Maximize2 className="w-5 h-5 drop-shadow" />
          <span>Xem rõ</span>
        </button>
      </div>

      <div className="space-y-0.5">
        <p
          className="text-[11px] font-medium text-gray-700 truncate"
          title={item.file.name}
        >
          {item.file.name}
        </p>
        <p className="text-[10px] text-gray-400">
          {formatFileSize(item.file.size)}
        </p>
      </div>
    </div>
  );
};
