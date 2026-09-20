import React from "react";
import { X } from "lucide-react";
import type { UploadedImageItem } from "../../types";

interface ImagePreviewModalProps {
  image: UploadedImageItem | null;
  onClose: () => void;
  formatFileSize: (bytes: number) => string;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  image,
  onClose,
  formatFileSize,
}) => {
  if (!image) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4 cursor-zoom-out"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-full max-h-full flex flex-col items-center cursor-default"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/80 hover:text-white p-1 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        <img
          src={image.previewUrl}
          alt={image.file.name}
          className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl border border-white/10"
        />

        <p className="mt-3 text-xs text-white/70 font-medium text-center">
          {image.file.name} ({formatFileSize(image.file.size)})
        </p>
      </div>
    </div>
  );
};
