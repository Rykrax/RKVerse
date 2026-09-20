import React from "react";

interface ChapterImageViewerProps {
  pages: string[];
}

export const ChapterImageViewer: React.FC<ChapterImageViewerProps> = ({
  pages,
}) => {
  return (
    <div className="flex w-full flex-col items-center overflow-hidden rounded-xl border border-gray-200/80 bg-white px-2.5 py-3 shadow-[0_0_30px_rgba(0,0,0,0.12)]">
      {pages.map((imgUrl, index) => (
        <img
          key={index}
          src={imgUrl}
          alt={`Trang ${index + 1}`}
          loading="lazy"
          className="pointer-events-none block h-auto w-full select-none"
        />
      ))}
    </div>
  );
};
