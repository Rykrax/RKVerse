import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  X,
  UploadCloud,
  FileArchive,
  ArrowUpDown,
  Trash2,
  GripVertical,
  Zap,
  Loader2,
  Maximize2,
} from "lucide-react";
import JSZip from "jszip";
import { convertLargeChapterImages } from "@/utils/imageConverter";

interface UploadedImageItem {
  id: string;
  file: File;
  previewUrl: string;
}

interface AddChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  comicTitle?: string;
  onSubmit?: (data: {
    chapterNumber: string;
    title: string;
    files: File[];
  }) => void;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 KB";
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export const AddChapterModal: React.FC<AddChapterModalProps> = ({
  isOpen,
  onClose,
  comicTitle = "truyện",
  onSubmit,
}) => {
  const [chapterNumber, setChapterNumber] = useState<string>("1");
  const [chapterTitle, setChapterTitle] = useState<string>("");
  const [images, setImages] = useState<UploadedImageItem[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [previewModalImg, setPreviewModalImg] =
    useState<UploadedImageItem | null>(null);

  const [progress, setProgress] = useState<{
    completed: number;
    total: number;
    percent: number;
  }>({
    completed: 0,
    total: 0,
    percent: 0,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef<UploadedImageItem[]>([]);
  imagesRef.current = images;

  // Kéo & thả sắp xếp
  const dragItemIndex = useRef<number | null>(null);
  const dragOverItemIndex = useRef<number | null>(null);

  // Tính dung lượng tổng các trang
  const totalSizeFormatted = useMemo(() => {
    const totalBytes = images.reduce((acc, curr) => acc + curr.file.size, 0);
    if (totalBytes === 0) return "0 KB";
    if (totalBytes < 1024 * 1024) {
      return `${(totalBytes / 1024).toFixed(1)} KB`;
    }
    return `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`;
  }, [images]);

  // Hàm tự động đổi tên file theo số thứ tự hiện tại (001.webp, 002.webp, ...)
  const reindexImages = (items: UploadedImageItem[]): UploadedImageItem[] => {
    return items.map((item, index) => {
      const pageIndexStr = String(index + 1).padStart(3, "0");
      const targetName = `${pageIndexStr}.webp`;

      if (item.file.name === targetName) {
        return item;
      }

      const renamedFile = new File([item.file], targetName, {
        type: item.file.type || "image/webp",
        lastModified: Date.now(),
      });

      return {
        ...item,
        file: renamedFile,
      };
    });
  };

  // Dọn dẹp bộ nhớ Blob & reset toàn bộ state
  const resetForm = () => {
    imagesRef.current.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
    setChapterNumber("1");
    setChapterTitle("");
    setIsProcessing(false);
    setPreviewModalImg(null);
    setProgress({ completed: 0, total: 0, percent: 0 });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Tự động dọn sạch state khi modal đóng lại
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  // Giải phóng URL khi component bị unmount hẳn
  useEffect(() => {
    return () => {
      imagesRef.current.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    };
  }, []);

  // Xử lý khi nhấn nút Đóng hoặc nút Hủy
  const handleClose = () => {
    if (isProcessing) return;
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  // Xử lý tệp khi upload: hỗ trợ ảnh lẻ và file nén .ZIP
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    if (selectedFiles.length === 0) return;

    try {
      setIsProcessing(true);
      setProgress({ completed: 0, total: 0, percent: 0 });

      const rawImageFiles: File[] = [];

      for (const file of selectedFiles) {
        if (file.name.endsWith(".zip") || file.type === "application/zip") {
          const zip = new JSZip();
          const unzipped = await zip.loadAsync(file);

          const entries = Object.keys(unzipped.files).filter((filename) => {
            return (
              !unzipped.files[filename].dir &&
              /\.(jpe?g|png|webp)$/i.test(filename) &&
              !filename.includes("__MACOSX")
            );
          });

          // Sắp xếp tự nhiên tên file trong ZIP trước khi trích xuất
          entries.sort((a, b) =>
            a.localeCompare(b, undefined, {
              numeric: true,
              sensitivity: "base",
            }),
          );

          for (const entryName of entries) {
            const blob = await unzipped.files[entryName].async("blob");
            const cleanName = entryName.split("/").pop() || entryName;
            rawImageFiles.push(
              new File([blob], cleanName, { type: blob.type || "image/jpeg" }),
            );
          }
        } else {
          rawImageFiles.push(file);
        }
      }

      if (rawImageFiles.length === 0) {
        alert("Không tìm thấy tệp ảnh hợp lệ.");
        return;
      }

      // Nén ảnh sang WebP
      const startIndex = images.length + 1;
      const convertedFiles = await convertLargeChapterImages(rawImageFiles, {
        quality: 0.8,
        padDigits: 3,
        startIndex,
        concurrency: 4,
        onProgress: (completed, total, percent) => {
          setProgress({ completed, total, percent });
        },
      });

      const newImageItems: UploadedImageItem[] = convertedFiles.map((file) => ({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        previewUrl: URL.createObjectURL(file),
      }));

      setImages((prev) => reindexImages([...prev, ...newImageItems]));
    } catch (error) {
      console.error("Lỗi khi xử lý file truyện:", error);
      alert("Đã xảy ra lỗi trong quá trình xử lý hoặc nén ảnh!");
    } finally {
      setIsProcessing(false);
      if (e.target) e.target.value = "";
    }
  };

  // Sắp xếp tự nhiên theo tên file và đánh lại index
  const handleSortByName = () => {
    setImages((prev) => {
      const sorted = [...prev].sort((a, b) =>
        a.file.name.localeCompare(b.file.name, undefined, {
          numeric: true,
          sensitivity: "base",
        }),
      );
      return reindexImages(sorted);
    });
  };

  // Xóa toàn bộ ảnh
  const handleClearAll = () => {
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
  };

  // Xóa từng trang và dồn số lại các trang phía sau
  const handleRemoveImage = (indexToRemove: number) => {
    URL.revokeObjectURL(images[indexToRemove].previewUrl);
    setImages((prev) => {
      const filtered = prev.filter((_, idx) => idx !== indexToRemove);
      return reindexImages(filtered);
    });
  };

  // Kéo & Thả (Drag & Drop)
  const handleDragStart = (index: number) => {
    dragItemIndex.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItemIndex.current = index;
  };

  const handleDragEnd = () => {
    if (
      dragItemIndex.current !== null &&
      dragOverItemIndex.current !== null &&
      dragItemIndex.current !== dragOverItemIndex.current
    ) {
      const updatedList = [...images];
      const draggedItem = updatedList.splice(dragItemIndex.current, 1)[0];
      updatedList.splice(dragOverItemIndex.current, 0, draggedItem);

      // Cập nhật lại toàn bộ tên file theo đúng thứ tự mới ngay lập tức
      setImages(reindexImages(updatedList));
    }
    dragItemIndex.current = null;
    dragOverItemIndex.current = null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      alert("Vui lòng tải lên ít nhất một trang truyện!");
      return;
    }

    if (onSubmit) {
      onSubmit({
        chapterNumber,
        title: chapterTitle, // Map sang `title` đúng với DTO Spring Boot
        files: images.map((img) => img.file),
      });
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 sm:p-6">
        <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-white shadow-2xl transition-all overflow-hidden">
          <button
            onClick={handleClose}
            type="button"
            disabled={isProcessing}
            className="absolute right-5 top-5 text-gray-400 hover:text-gray-600 transition-colors z-10 disabled:opacity-50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6 overflow-y-auto space-y-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Thêm Chương Mới
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Truyện:{" "}
                <span className="text-gray-800 font-semibold">
                  {comicTitle}
                </span>
              </p>
            </div>

            <form
              id="add-chapter-form"
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Số chương <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={chapterNumber}
                    onChange={(e) => setChapterNumber(e.target.value)}
                    placeholder="VD: 1 hoặc 1.2"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Tiêu đề chương
                  </label>
                  <input
                    type="text"
                    value={chapterTitle}
                    onChange={(e) => setChapterTitle(e.target.value)}
                    placeholder="VD: Khởi đầu mới..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Danh sách ảnh trang truyện{" "}
                  <span className="text-red-500">*</span>
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
                    onChange={handleFileChange}
                    disabled={isProcessing}
                  />

                  {isProcessing ? (
                    <div className="w-full max-w-sm flex flex-col items-center py-2 text-indigo-600 space-y-2">
                      <Loader2 className="w-8 h-8 animate-spin" />
                      <p className="text-xs font-bold">
                        Đang tối ưu & nén WebP ({progress.completed}/
                        {progress.total} ảnh - {progress.percent}%)
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
                        Hỗ trợ tệp ảnh (.jpg, .png, .webp) hoặc gói .zip chứa
                        toàn bộ chương.
                        <br />
                        Tự động giải nén, sắp xếp thứ tự tự nhiên & nén WebP
                        80%.
                      </p>
                    </>
                  )}
                </div>
              </div>

              {images.length > 0 && (
                <div className="space-y-3 pt-1">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 font-medium text-indigo-600">
                      <span className="font-bold">
                        {images.length} trang ảnh
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-500">
                        ⏱ {totalSizeFormatted}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSortByName}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 font-semibold transition cursor-pointer"
                      >
                        <ArrowUpDown className="w-3.5 h-3.5" />
                        <span>Sắp xếp theo tên</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleClearAll}
                        className="px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 font-semibold transition cursor-pointer"
                      >
                        Xóa tất cả
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-amber-500 font-medium italic">
                    <Zap className="w-3.5 h-3.5" />
                    <span>
                      Kéo và thả thẻ trang để đổi thứ tự, bấm vào kính lúp để
                      phóng to xem chi tiết
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                    {images.map((img, index) => (
                      <div
                        key={img.id}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragEnter={() => handleDragEnter(index)}
                        onDragEnd={handleDragEnd}
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
                              handleRemoveImage(index);
                            }}
                            className="text-gray-400 hover:text-red-500 p-0.5 rounded transition cursor-pointer"
                            title="Xóa trang này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-slate-950/5 border border-slate-100 mb-2 flex items-center justify-center group/thumb">
                          <img
                            src={img.previewUrl}
                            alt={img.file.name}
                            className="w-full h-full object-contain pointer-events-none select-none"
                          />

                          <button
                            type="button"
                            onClick={() => setPreviewModalImg(img)}
                            className="absolute inset-0 bg-black/35 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white text-xs font-semibold cursor-pointer"
                          >
                            <Maximize2 className="w-5 h-5 drop-shadow" />
                            <span>Xem rõ</span>
                          </button>
                        </div>

                        <div className="space-y-0.5">
                          <p
                            className="text-[11px] font-medium text-gray-700 truncate"
                            title={img.file.name}
                          >
                            {img.file.name}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {formatFileSize(img.file.size)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </form>
          </div>

          <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-end gap-3 bg-white">
            <button
              type="button"
              onClick={handleClose}
              disabled={isProcessing}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 cursor-pointer"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              form="add-chapter-form"
              disabled={isProcessing}
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? "Đang nén ảnh..." : "Tạo Chương Mới"}
            </button>
          </div>
        </div>
      </div>

      {previewModalImg && (
        <div
          onClick={() => setPreviewModalImg(null)}
          className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4 cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-full max-h-full flex flex-col items-center cursor-default"
          >
            <button
              type="button"
              onClick={() => setPreviewModalImg(null)}
              className="absolute -top-10 right-0 text-white/80 hover:text-white p-1 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <img
              src={previewModalImg.previewUrl}
              alt={previewModalImg.file.name}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl border border-white/10"
            />

            <p className="mt-3 text-xs text-white/70 font-medium text-center">
              {previewModalImg.file.name} (
              {formatFileSize(previewModalImg.file.size)})
            </p>
          </div>
        </div>
      )}
    </>
  );
};
