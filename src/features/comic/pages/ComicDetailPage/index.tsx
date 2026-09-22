import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { getUserFromToken } from "@/utils/jwt";
import type { ComicApiItem } from "../../types";
import { AddChapterModal, type ChapterItem } from "@/features/chapter";
import comicApi from "../../api";
import { ComicInfoCard } from "../../components/ComicInfoCard/index";
import { ChapterListSection } from "../../components/ChapterListSection";
import chapterApi from "@/features/chapter/api";

export const ComicDetailPage: React.FC = () => {
  const { id, slugWithId } = useParams<{ id?: string; slugWithId?: string }>();
  const [isAddChapterOpen, setIsAddChapterOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const comicId = useMemo(() => {
    const rawParam = slugWithId || id || "";
    if (!rawParam) return null;

    if (/^\d+$/.test(rawParam)) {
      return Number(rawParam);
    }

    const match = rawParam.match(/-(\d+)$/);
    if (match && match[1]) {
      return Number(match[1]);
    }

    return null;
  }, [id, slugWithId]);

  const user = getUserFromToken();
  const rawRoles = user?.roles || user?.role || [];
  const userRoles = useMemo(() => {
    return Array.isArray(rawRoles)
      ? rawRoles.map((r) => String(r).toUpperCase())
      : [String(rawRoles).toUpperCase()];
  }, [rawRoles]);

  const isAdmin = userRoles.some(
    (role) =>
      role === "ROLE_ADMIN" ||
      role === "ADMIN" ||
      role === "ROLE_TRANSLATOR" ||
      role === "TRANSLATOR",
  );

  const [comic, setComic] = useState<ComicApiItem | null>(null);
  const [chapters, setChapters] = useState<ChapterItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [userRating, setUserRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [isSortDesc, setIsSortDesc] = useState<boolean>(true);

  const fetchComicAndChapters = useCallback(async () => {
    if (!comicId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const [comicRes, chapterRes] = await Promise.all([
        comicApi.getComic(comicId),
        chapterApi.getChapters(comicId),
      ]);

      const comicData: any =
        (comicRes as any)?.data?.data || (comicRes as any)?.data || comicRes;

      if (comicData) {
        setComic(comicData);
        setLikeCount(comicData.likes ?? 0);
      }

      const chapterDataWrapper: any = (chapterRes as any)?.data || chapterRes;
      const rawChapterList: any =
        chapterDataWrapper?.data?.items ||
        chapterDataWrapper?.items ||
        chapterDataWrapper?.data ||
        (Array.isArray(chapterDataWrapper) ? chapterDataWrapper : []);

      if (Array.isArray(rawChapterList)) {
        const mappedChapters: ChapterItem[] = rawChapterList.map((ch: any) => ({
          id: ch.id,
          chapterNumber: ch.chapterNumber ?? ch.id,
          totalPages: ch.totalPages ?? 0,
          title: ch.title || `Chương ${ch.chapterNumber ?? ch.id}`,
          createdAt: ch.createdAt
            ? new Date(ch.createdAt).toLocaleDateString("vi-VN")
            : `${ch.totalPages || 0} trang`,
        }));

        setChapters(mappedChapters);
      } else {
        setChapters([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải thông tin truyện và chương:", error);
    } finally {
      setLoading(false);
    }
  }, [comicId]);

  useEffect(() => {
    fetchComicAndChapters();
  }, [fetchComicAndChapters]);

  const handleCreateChapter = async (data: {
    chapterNumber: string;
    title: string;
    files: File[];
  }) => {
    if (!comicId) {
      alert("Không tìm thấy ID bộ truyện!");
      return;
    }

    try {
      await chapterApi.createChapter(comicId, {
        chapterNumber: data.chapterNumber,
        title: data.title,
        files: data.files,
      });

      alert("Thêm chương mới thành công!");
      setIsAddChapterOpen(false);
      await fetchComicAndChapters();
    } catch (error) {
      console.error("Lỗi khi thêm chương:", error);
      alert("Thêm chương thất bại!");
    }
  };

  const handleToggleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? Math.max(0, prev - 1) : prev + 1));
  };

  const handleSortChapters = () => {
    setIsSortDesc(!isSortDesc);
    setChapters((prev) => [...prev].reverse());
  };

  const handleDeleteComic = async () => {
    if (!comic) return;
    if (
      window.confirm(`Bạn có chắc chắn muốn xóa bộ truyện "${comic.title}"?`)
    ) {
      try {
        await comicApi.deleteComic(comic.id);
        navigate("/admin/comics");
      } catch (err) {
        console.error("Lỗi khi xóa truyện:", err);
        alert("Xóa truyện thất bại, vui lòng thử lại sau!");
      }
    }
  };

  const getChapterUrl = (chapterNumber: number) => {
    if (!comic || chapterNumber === undefined || chapterNumber === null)
      return "#";
    const slug = comic.slug || "truyen";
    return `/comic/${slug}-${comic.id}/chapters/chapter-${chapterNumber}`;
  };

  // Lấy ID của chapter đầu tiên và mới nhất thay vì number
  const firstChapterId =
    chapters.length > 0 ? chapters[chapters.length - 1].id : null;
  const latestChapterId = chapters.length > 0 ? chapters[0].id : null;
  //   console.log(firstChapterId, latestChapterId);

  if (loading) {
    return (
      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-16 pb-20 flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        <span className="text-sm font-medium text-slate-400">
          Đang tải thông tin truyện...
        </span>
      </main>
    );
  }

  if (!comic) {
    return (
      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-32 pb-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-700">
          Không tìm thấy bộ truyện yêu cầu
        </h2>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors cursor-pointer"
        >
          Quay lại
        </button>
      </main>
    );
  }

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-6 space-y-6">
      <ComicInfoCard
        comic={comic}
        isAdmin={isAdmin}
        isLiked={isLiked}
        likeCount={likeCount}
        userRating={userRating}
        hoverRating={hoverRating}
        firstChapterUrl={firstChapterId ? getChapterUrl(firstChapterId) : "#"}
        latestChapterUrl={
          latestChapterId ? getChapterUrl(latestChapterId) : "#"
        }
        onToggleLike={handleToggleLike}
        onDeleteComic={handleDeleteComic}
        onHoverRating={setHoverRating}
        onSetRating={setUserRating}
      />

      <ChapterListSection
        chapters={chapters}
        isAdmin={isAdmin}
        isSortDesc={isSortDesc}
        onSortChapters={handleSortChapters}
        onOpenAddChapterModal={() => setIsAddChapterOpen(true)}
        getChapterUrl={getChapterUrl}
      />

      <AddChapterModal
        isOpen={isAddChapterOpen}
        comicTitle={comic.title}
        onClose={() => setIsAddChapterOpen(false)}
        onSubmit={handleCreateChapter}
      />
    </div>
  );
};

export default ComicDetailPage;
