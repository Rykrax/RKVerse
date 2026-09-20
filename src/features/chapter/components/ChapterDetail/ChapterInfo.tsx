import React from "react";

interface ChapterInfoProps {
  comicTitle: string;
  chapterName: string;
  description: string;
  onViewChapterList?: () => void;
}

export const ChapterInfo: React.FC<ChapterInfoProps> = ({
  comicTitle,
  chapterName,
  description,
  onViewChapterList,
}) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-600 hover:underline cursor-pointer">
        {comicTitle} • Đọc truyện tranh online
      </div>
      <h1 className="mb-2 text-2xl font-bold text-gray-800">
        {comicTitle} {chapterName}
      </h1>
      <p className="mb-3 text-sm text-gray-500 leading-relaxed">
        Bạn đang đọc{" "}
        <span className="font-medium text-gray-700">
          {comicTitle} {chapterName}
        </span>
        . Xem{" "}
        <button
          onClick={onViewChapterList}
          type="button"
          className="font-medium text-blue-600 underline hover:text-blue-700"
        >
          danh sách chương
        </button>{" "}
        để chọn chương khác.
      </p>
      {description && (
        <div className="rounded-xl bg-gray-50 p-3.5 text-xs text-gray-600 leading-relaxed border border-gray-100/80">
          {description}
        </div>
      )}
    </div>
  );
};
