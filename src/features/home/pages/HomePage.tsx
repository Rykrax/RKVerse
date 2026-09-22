// features/home/pages/HomePage.tsx
import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { HeroBanner } from "@/features/home/components/HeroBanner";
import { CategoryBar } from "@/features/home/components/CategoryBar";
import { FilterToolbar } from "@/features/home/components/FilterToolbar";
import {
  ComicCard,
  type ComicItem,
} from "@/features/home/components/ComicCard";
import { Pagination } from "@/components/ui/Pagination";
import { useNavigate } from "react-router-dom";
import comicApi from "@/features/comic/api";

const CATEGORIES = [
  "Tất cả",
  "Action",
  "Adventure",
  "Anime",
  "Chuyển Sinh",
  "Cổ Đại",
  "Comedy",
  "Comic",
  "Demons",
  "Detective",
  "Doujinshi",
  "Drama",
  "Fantasy",
  "Gender Bender",
  "Harem",
];

const STATUSES = ["Tất cả", "Đang tiến hành", "Hoàn thành", "Tạm ngưng"];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [comics, setComics] = useState<ComicItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Phân trang
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const pageSize = 10;

  // Lọc và sắp xếp
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedStatus, setSelectedStatus] = useState("Tất cả");
  const [selectedSort, setSelectedSort] = useState("newest");

  // Fetch dữ liệu từ API mỗi khi currentPage hoặc bộ lọc thay đổi
  useEffect(() => {
    const fetchComics = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        // Truyền params phân trang lên backend
        // Lưu ý: Nếu Spring Boot của bạn dùng 0-based page thì truyền (currentPage - 1)
        const res = await comicApi.getComics({
          page: currentPage,
          size: pageSize,
        });

        const items = res?.data?.items || [];
        setTotalPages(res?.data?.totalPages || 1);

        const mappedComics: ComicItem[] = items.map((item) => ({
          id: item.id,
          title: item.title,
          slug: item.slug || `comic-${item.id}`,
          author: item.author || "Đang cập nhật",
          image: item.coverPath,
          status: "Đang tiến hành",
          views: 0,
        }));

        setComics(mappedComics);
      } catch (err: any) {
        console.error("Lỗi tải danh sách truyện:", err);
        setErrorMessage(
          err?.response?.data?.message ||
            err?.message ||
            "Không thể tải danh sách truyện lúc này.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchComics();
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Tự động cuộn mượt về đầu danh sách truyện khi đổi trang
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const handleNavigateDetail = (comic: ComicItem) => {
    const safeSlug = comic.slug;
    navigate(`/comic/${safeSlug}-${comic.id}`);
  };

  return (
    <main className="max-w-[1240px] mx-auto px-4 sm:px-6 sm:pt-24 pb-16 space-y-6">
      <HeroBanner />

      <CategoryBar
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <FilterToolbar
        statuses={STATUSES}
        selectedStatus={selectedStatus}
        onSelectStatus={setSelectedStatus}
        selectedSort={selectedSort}
        onSelectSort={setSelectedSort}
      />

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs text-center">
          {errorMessage}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="w-7 h-7 animate-spin text-indigo-600" />
          <span className="text-xs text-slate-400 font-medium">
            Đang tải danh sách truyện...
          </span>
        </div>
      ) : comics.length === 0 ? (
        <div className="py-20 text-center text-slate-400 text-sm">
          Chưa có truyện nào được cập nhật.
        </div>
      ) : (
        <>
          {/* Lưới truyện */}
          <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
            {comics.map((comic) => (
              <ComicCard
                key={comic.id}
                comic={comic}
                onClick={() => handleNavigateDetail(comic)}
              />
            ))}
          </section>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </main>
  );
};

export default HomePage;
