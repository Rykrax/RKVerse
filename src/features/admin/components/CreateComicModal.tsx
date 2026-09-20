import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { CategorySelector } from "./CategorySelector";
import { CoverUploader } from "./CoverUploader";
import comicApi from "@/api/comic";
import { convertCoverImage } from "@/utils/imageConverter";

interface CreateComicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CreateComicModal: React.FC<CreateComicModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState<"ONGOING" | "COMPLETED" | "PAUSED">(
    "ONGOING",
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatusText, setSubmitStatusText] = useState("");

  if (!isOpen) return null;

  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setStatus("ONGOING");
    setSelectedCategories([]);
    setDescription("");
    setCoverFile(null);
    setSubmitStatusText("");
  };

  const handleClose = () => {
    if (isSubmitting) return;
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Vui lòng nhập tên truyện!");
      return;
    }
    if (!coverFile) {
      alert("Vui lòng tải lên ảnh bìa truyện!");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitStatusText("Đang tối ưu ảnh bìa...");

      // 1. Tự động resize và convert sang cover.webp (chất lượng 85%, chiều rộng max 1200px)
      const webpCover = await convertCoverImage(coverFile, {
        quality: 0.85,
        maxWidth: 1200,
      });

      setSubmitStatusText("Đang lưu truyện...");

      // 2. Gửi request qua comicApi.createComic (khớp với MultipartFile coverImage của Java Record)
      await comicApi.createComic({
        title: title.trim(),
        author: author.trim() || undefined,
        description: description.trim() || undefined,
        status,
        coverImage: webpCover,
      });

      // 3. Giữ modal và đợi 1.8s để Backend xử lý async lưu ảnh vào ổ đĩa/cloud
      setSubmitStatusText("Đang hoàn tất xử lý ảnh...");
      await new Promise((resolve) => setTimeout(resolve, 1800));

      resetForm();
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error("Lỗi khi tạo truyện:", error);
      alert(error?.response?.data?.message || "Có lỗi xảy ra khi tạo truyện!");
    } finally {
      setIsSubmitting(false);
      setSubmitStatusText("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-800">
            Thêm Truyện Mới
          </h2>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-4"
        >
          {/* Tên truyện */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Tên truyện <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              disabled={isSubmitting}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: One Piece, Solo Leveling..."
              className="w-full px-4 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all disabled:opacity-60"
            />
          </div>

          {/* Tác giả & Trạng thái */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Tác giả
              </label>
              <input
                type="text"
                disabled={isSubmitting}
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Tên tác giả..."
                className="w-full px-4 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white disabled:opacity-60"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Trạng thái
              </label>
              <select
                value={status}
                disabled={isSubmitting}
                onChange={(e) =>
                  setStatus(
                    e.target.value as "ONGOING" | "COMPLETED" | "PAUSED",
                  )
                }
                className="w-full px-3.5 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white disabled:opacity-60"
              >
                <option value="ONGOING">Đang tiến hành</option>
                <option value="COMPLETED">Hoàn thành</option>
                <option value="PAUSED">Tạm ngưng</option>
              </select>
            </div>
          </div>

          {/* Component chọn thể loại */}
          <CategorySelector
            selectedCategories={selectedCategories}
            onChange={setSelectedCategories}
          />

          {/* Mô tả truyện */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Mô tả truyện
            </label>
            <textarea
              rows={3}
              disabled={isSubmitting}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Giới thiệu vắn tắt nội dung truyện..."
              className="w-full px-4 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white resize-none disabled:opacity-60"
            />
          </div>

          {/* Component tải ảnh bìa */}
          <CoverUploader onFileSelect={setCoverFile} />

          {/* Modal Footer Actions */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <span className="text-xs text-indigo-600 font-medium animate-pulse">
              {submitStatusText}
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                Hủy Bỏ
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-indigo-600/20 disabled:opacity-50 transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                {isSubmitting && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                )}
                <span>{isSubmitting ? "Đang xử lý..." : "Tạo Truyện Mới"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
