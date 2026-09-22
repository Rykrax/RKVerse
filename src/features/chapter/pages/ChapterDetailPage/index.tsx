import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import chapterApi, {
//   type ChapterDetailData as ApiChapterDetail,
//   type ChapterApiResponse,
// } from "@/api/chapter";
import {
  ChapterInfo,
  ChapterNavigation,
  ChapterImageViewer,
  ChapterListSection,
  type ChapterUIData,
  type ChapterItem,
} from "@/features/chapter/components/ChapterDetail";
// import type {
//   ChapterItem,
//   ChapterDetailData,
// } from "@/features/chapter/components/ChapterDetail";
import type { ChapterApiItem, ChapterDetailData } from "../../types";
import chapterApi from "../../api";

export const ChapterDetailPage: React.FC = () => {
  const { comicId: rawComicId, chapterSlug } = useParams<{
    comicId: string;
    chapterSlug: string;
  }>();
  const navigate = useNavigate();

  // TÁCH LẤY ID SỐ TỪ SLUG: "dan-da-dan-1" -> 1
  const numericComicId = useMemo(() => {
    if (!rawComicId) return null;
    if (/^\d+$/.test(rawComicId)) return Number(rawComicId);

    const match = rawComicId.match(/-(\d+)$/);
    if (match && match[1]) return Number(match[1]);

    return null;
  }, [rawComicId]);

  // 2. Lấy số chương: "chapter-1.2" -> "1.2", hoặc nếu người dùng gõ thẳng "1.2" vẫn nhận đúng
  const currentChapterNumber = useMemo(() => {
    if (!chapterSlug) return null;
    return chapterSlug.replace(/^chapter-/, "");
  }, [chapterSlug]);

  const [currentChapter, setCurrentChapter] =
    useState<ChapterDetailData | null>(null);
  const [chapters, setChapters] = useState<ChapterApiItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!numericComicId || !currentChapterNumber) {
      if (!numericComicId) {
        setError(`Không tìm thấy ID truyện hợp lệ từ URL: "${rawComicId}"`);
      }
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Gọi API với numericComicId và currentChapterNumber
        const [detailRes, listRes] = await Promise.all([
          chapterApi.getChapterDetail(numericComicId, currentChapterNumber),
          chapterApi.getChapters(numericComicId),
        ]);

        setCurrentChapter(detailRes.data);

        const listData = Array.isArray(listRes.data)
          ? listRes.data
          : (listRes as any).data?.items || (listRes as any).items || [];
        setChapters(listData);
      } catch (err: any) {
        console.error("Lỗi khi tải dữ liệu chương:", err);
        const beMsg = err?.response?.data?.message || err?.message;
        setError(beMsg || "Không thể tải nội dung chương truyện");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [numericComicId, currentChapterNumber, rawComicId]);

  const formattedChapterData: ChapterUIData | null = useMemo(() => {
    if (!currentChapter) return null;
    const name = currentChapter.title
      ? `Chương ${currentChapter.chapterNumber}: ${currentChapter.title}`
      : `Chương ${currentChapter.chapterNumber}`;

    return {
      id: currentChapter.id,
      name,
      comicTitle: `Truyện #${currentChapter.comicId}`,
      description: `Bản dịch chất lượng cao • Tổng số ${currentChapter.totalPages} trang`,
      pages: currentChapter.pages || [],
    };
  }, [currentChapter]);

  const formattedChapterList: ChapterItem[] = useMemo(() => {
    return chapters.map((chap) => ({
      id: chap.id,
      name: chap.title
        ? `Chương ${chap.chapterNumber}: ${chap.title}`
        : `Chương ${chap.chapterNumber}`,
    }));
  }, [chapters]);

  // Điều hướng chương theo chapterNumber
  const handlePrev = () => {
    if (!currentChapter?.prevChapterId) return;
    const prevChap = chapters.find(
      (c) => c.id === currentChapter.prevChapterId,
    );
    if (prevChap) {
      navigate(
        `/comic/${rawComicId}/chapters/chapter-${prevChap.chapterNumber}`,
      );
    }
  };

  const handleNext = () => {
    if (!currentChapter?.nextChapterId) return;
    const nextChap = chapters.find(
      (c) => c.id === currentChapter.nextChapterId,
    );
    if (nextChap) {
      navigate(
        `/comic/${rawComicId}/chapters/chapter-${nextChap.chapterNumber}`,
      );
    }
  };

  const handleHome = () => {
    navigate(`/comic/${rawComicId}`);
  };

  const handleSelectChapter = (chapItem: ChapterItem) => {
    const selectedChap = chapters.find((c) => c.id === chapItem.id);
    if (selectedChap) {
      navigate(
        `/comic/${rawComicId}/chapters/chapter-${selectedChap.chapterNumber}`,
      );
    }
  };

  const scrollToChapterList = () => {
    document
      .getElementById("chapter-list-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9fa] text-gray-600">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
          <span>Đang tải chương truyện...</span>
        </div>
      </div>
    );
  }

  if (error || !formattedChapterData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8f9fa] px-4 text-center text-gray-700">
        <p className="max-w-xl text-base font-medium text-red-500">
          {error || "Không tìm thấy nội dung chương truyện."}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 cursor-pointer"
        >
          Quay lại
        </button>
      </div>
    );
  }

  const hasPrev = Boolean(currentChapter?.prevChapterId);
  const hasNext = Boolean(currentChapter?.nextChapterId);

  return (
    <div className="relative flex min-h-screen justify-center bg-[#f8f9fa] px-4 py-8 text-gray-800">
      <main className="flex w-full max-w-4xl flex-col gap-5">
        <ChapterInfo
          comicTitle={formattedChapterData.comicTitle}
          chapterName={formattedChapterData.name}
          description={formattedChapterData.description}
          onViewChapterList={scrollToChapterList}
        />

        <ChapterNavigation
          hasPrev={hasPrev}
          hasNext={hasNext}
          onPrev={handlePrev}
          onNext={handleNext}
          onHome={handleHome}
        />

        <ChapterImageViewer pages={formattedChapterData.pages} />

        <ChapterNavigation
          hasPrev={hasPrev}
          hasNext={hasNext}
          onPrev={handlePrev}
          onNext={handleNext}
          onHome={handleHome}
        />

        <div id="chapter-list-section">
          <ChapterListSection
            comicTitle={formattedChapterData.comicTitle}
            currentChapterId={formattedChapterData.id}
            chapters={formattedChapterList}
            onSelectChapter={handleSelectChapter}
            onViewAll={handleHome}
          />
        </div>
      </main>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-md transition hover:bg-gray-50 active:scale-95 cursor-pointer"
        aria-label="Back to top"
      >
        ↑
      </button>
    </div>
  );
};

export default ChapterDetailPage;
