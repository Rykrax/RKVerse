import React, { useState, useRef, useMemo, useEffect } from "react";
import { X, ArrowUpDown, Zap } from "lucide-react";
import JSZip from "jszip";
import { convertLargeChapterImages } from "@/utils/imageConverter";
import type {
  UploadedImageItem,
  AddChapterModalProps,
  ProgressState,
} from "../../types";
import { DropzoneUploader } from "./DropzoneUploader";
import { ImageCardItem } from "./ImageCardItem";
import { ImagePreviewModal } from "./ImagePreviewModal";
import {} from "process";

export const AddChapterModal: React.FC<AddChapterModalProps> = ({
  isOpen,
  onClose,
  comicTitle = "truyện",
  onSubmit,
}) => {
  const [chapterNumber, setChapterNumber] = useState<string>("1");
  const [title, setChapterTitle] = useState<string>("");
  const [images, setImages] = useState<UploadedImageItem[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [previewModalImg, setPreviewModalImg] =
    useState<UploadedImageItem | null>(null);

  const [progress, setProgress] = useState<ProgressState>({
    completed: 0,
    total: 0,
    percent: 0,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef<UploadedImageItem[]>([]);
  imagesRef.current = images;

  const dragItemIndex = useRef<number | null>(null);
  const dragOverItemIndex = useRef<number | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const totalSizeFormatted = useMemo(() => {
    const totalBytes = images.reduce((acc, curr) => acc + curr.file.size, 0);
    return formatFileSize(totalBytes);
  }, [images]);

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

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    };
  }, []);

  const handleClose = () => {
    if (isProcessing) return;
    resetForm();
    onClose();
  };

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

  const handleClearAll = () => {
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    URL.revokeObjectURL(images[indexToRemove].previewUrl);
    setImages((prev) => {
      const filtered = prev.filter((_, idx) => idx !== indexToRemove);
      return reindexImages(filtered);
    });
  };

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
        title,
        files: images.map((img) => img.file),
      });
    }
  };

  if (!isOpen) return null;

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
                    placeholder="1"
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
                    value={title}
                    onChange={(e) => setChapterTitle(e.target.value)}
                    placeholder="VD: Khởi đầu mới..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <DropzoneUploader
                isProcessing={isProcessing}
                progress={progress}
                fileInputRef={fileInputRef}
                onFileChange={handleFileChange}
              />

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
                      <ImageCardItem
                        key={img.id}
                        item={img}
                        index={index}
                        formatFileSize={formatFileSize}
                        onDragStart={handleDragStart}
                        onDragEnter={handleDragEnter}
                        onDragEnd={handleDragEnd}
                        onRemove={handleRemoveImage}
                        onPreview={setPreviewModalImg}
                      />
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

      <ImagePreviewModal
        image={previewModalImg}
        onClose={() => setPreviewModalImg(null)}
        formatFileSize={formatFileSize}
      />
    </>
  );
};
