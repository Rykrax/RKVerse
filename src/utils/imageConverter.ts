// src/utils/imageConverter.ts

export interface BaseConvertOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export interface ChapterConvertOptions extends BaseConvertOptions {
  padDigits?: number;
  startIndex?: number;
  /** Giới hạn số lượng ảnh xử lý cùng một lúc (mặc định: 4 để tránh nghẽn UI/RAM) */
  concurrency?: number;
  /** Callback nhận tiến trình để vẽ thanh Progress Bar */
  onProgress?: (completed: number, total: number, percent: number) => void;
}

/**
 * Xử lý convert 1 ảnh đơn lẻ với cơ chế dọn dẹp RAM triệt để
 */
export const convertSingleCanvas = (
  file: File,
  targetName: string,
  options: BaseConvertOptions = {},
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;
      if (options.maxWidth && width > options.maxWidth) {
        height = Math.round((height * options.maxWidth) / width);
        width = options.maxWidth;
      }
      if (options.maxHeight && height > options.maxHeight) {
        width = Math.round((width * options.maxHeight) / height);
        height = options.maxHeight;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Không thể khởi tạo Canvas context"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          // Giải phóng bộ nhớ Canvas ngay lập tức
          canvas.width = 0;
          canvas.height = 0;

          if (!blob) {
            reject(new Error(`Lỗi nén ảnh: ${file.name}`));
            return;
          }

          const webpFile = new File([blob], `${targetName}.webp`, {
            type: "image/webp",
            lastModified: Date.now(),
          });

          resolve(webpFile);
        },
        "image/webp",
        options.quality ?? 0.85,
      );
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      reject(err);
    };

    img.src = objectUrl;
  });
};

/**
 * Chuyên dùng cho ảnh bìa (Cover): tự động nén WebP và đặt tên là "cover.webp"
 */
export const convertCoverImage = (
  file: File,
  options: BaseConvertOptions = {},
): Promise<File> => {
  return convertSingleCanvas(file, "cover", options);
};

/**
 * Convert danh sách ảnh lớn (~100 ảnh) với cơ chế Worker Queue kiểm soát tải
 */
export const convertLargeChapterImages = async (
  files: File[] | FileList,
  options: ChapterConvertOptions = {},
): Promise<File[]> => {
  const {
    concurrency = 4,
    padDigits = 3,
    startIndex = 1,
    onProgress,
    ...baseOptions
  } = options;

  const fileList = Array.from(files);
  const total = fileList.length;
  const results: File[] = new Array(total);

  let currentIndex = 0;
  let completedCount = 0;

  // Hàm worker xử lý tuần tự từng task trong hàng đợi
  const worker = async (): Promise<void> => {
    while (currentIndex < total) {
      const taskIndex = currentIndex++;
      const currentFile = fileList[taskIndex];
      const pageNumber = String(startIndex + taskIndex).padStart(
        padDigits,
        "0",
      );

      try {
        const convertedFile = await convertSingleCanvas(
          currentFile,
          pageNumber,
          baseOptions,
        );
        // Đặt đúng vị trí gốc để giữ nguyên thứ tự trang truyện
        results[taskIndex] = convertedFile;
      } catch (error) {
        console.error(`Lỗi tại trang ${pageNumber}:`, error);
        throw error;
      } finally {
        completedCount++;
        if (onProgress) {
          const percent = Math.round((completedCount / total) * 100);
          onProgress(completedCount, total, percent);
        }
      }
    }
  };

  // Khởi chạy đồng thời số lượng worker tối đa (mặc định 4 worker chạy song song)
  const activeWorkers = Array.from(
    { length: Math.min(concurrency, total) },
    () => worker(),
  );

  await Promise.all(activeWorkers);
  return results;
};
