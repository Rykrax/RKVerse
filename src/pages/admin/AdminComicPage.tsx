import React, { useState, useEffect, useCallback } from "react";
import { PlusCircle, Eye, Heart, Edit3, Trash2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUserFromToken } from "@/utils/jwt";
import comicApi, { type ComicApiItem } from "@/api/comic";
import { CreateComicModal } from "@/features/admin/components/CreateComicModal";
import { getComicStatusConfig } from "@/utils/comicStatus";

interface AdminComicItem extends ComicApiItem {
  status?: string;
  views?: number;
  likes?: number;
}

export const AdminComicPage: React.FC = () => {
  const navigate = useNavigate();
  const [comics, setComics] = useState<AdminComicItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const user = getUserFromToken();
  const username = user?.username || "translator";

  // Hàm chuyển hướng sang trang chi tiết truyện
  const handleNavigateDetail = (comic: AdminComicItem) => {
    const slug = comic.slug || "truyen";
    navigate(`/comic/${slug}-${comic.id}`);
  };

  const fetchAdminComics = useCallback(async () => {
    try {
      setLoading(true);
      const res = await comicApi.getComics({ size: 20 });
      const items = res?.data?.items || [];

      // Ánh xạ data trả về và bổ sung giá trị mặc định cho thống kê
      const mappedItems: AdminComicItem[] = items.map((c) => ({
        ...c,
        status: c.status || "ONGOING",
        views: (c as any).views ?? 0,
        likes: (c as any).likes ?? 0,
      }));
      setComics(mappedItems);
    } catch (error) {
      console.error("Lỗi khi tải danh sách truyện:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminComics();
  }, [fetchAdminComics]);

  const handleDeleteComic = (id: number, title: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa truyện "${title}" không?`)) {
      setComics((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <main className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-24 pb-16 space-y-8">
      {/* Header trang quản lý */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            Quản Lý Đăng Truyện
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Danh sách các bộ truyện được cập nhật bởi{" "}
            <span className="font-semibold text-indigo-600">{username}</span>
          </p>
        </div>

        {/* Nút Đăng Truyện Mới */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Đăng Truyện Mới</span>
        </button>
      </div>

      {/* Bảng danh sách truyện */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <span className="text-xs text-slate-400 font-medium">
              Đang tải danh sách...
            </span>
          </div>
        ) : comics.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-sm">
            Bạn chưa đăng bộ truyện nào.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              {/* Table Header */}
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                  <th className="py-4 px-6 w-20">Bìa</th>
                  <th className="py-4 px-6 max-w-[240px] sm:max-w-[300px]">
                    Tên truyện
                  </th>
                  <th className="py-4 px-6 max-w-[160px]">Tác giả</th>
                  <th className="py-4 px-6 w-36">Trạng thái</th>
                  <th className="py-4 px-6 w-32">Thống kê</th>
                  <th className="py-4 px-6 text-right w-56">Thao tác</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-slate-100/80 text-sm">
                {comics.map((comic) => {
                  const statusConfig = getComicStatusConfig(comic.status);

                  return (
                    <tr
                      key={comic.id}
                      className="hover:bg-indigo-50/70 transition-colors duration-75 ease-out cursor-default"
                    >
                      {/* 1. Ảnh bìa - Chỉ hover & click được ở đây */}
                      <td className="py-4 px-6 w-20">
                        <div
                          onClick={() => handleNavigateDetail(comic)}
                          title={`Xem chi tiết ${comic.title}`}
                          className="group relative w-12 h-16 rounded-lg overflow-hidden bg-slate-100 border border-slate-200/70 shrink-0 cursor-pointer shadow-xs"
                        >
                          <img
                            src={comic.coverPath}
                            alt={comic.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            loading="lazy"
                          />
                        </div>
                      </td>

                      {/* 2. Tên truyện - Chỉ hiển thị trên 1 dòng duy nhất, quá dài sẽ thành ... */}
                      <td className="py-4 px-6 max-w-[120px] sm:max-w-[320px]">
                        <span
                          onClick={() => handleNavigateDetail(comic)}
                          title={`Xem chi tiết: ${comic.title}`}
                          className="block font-bold text-slate-800 hover:text-indigo-600 cursor-pointer transition-colors truncate"
                        >
                          {comic.title}
                        </span>
                      </td>

                      {/* 3. Tác giả */}
                      <td className="py-4 px-6 max-w-[160px] text-xs text-slate-500 select-none">
                        <span
                          className="block truncate"
                          title={comic.author || "TruyenQQ"}
                        >
                          Tác giả {comic.author || "TruyenQQ"}
                        </span>
                      </td>

                      {/* 4. Trạng thái */}
                      <td className="py-4 px-6 select-none whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.badgeClass}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusConfig.dotClass}`}
                          />
                          <span>{statusConfig.label}</span>
                        </span>
                      </td>

                      {/* 5. Thống kê */}
                      <td className="py-4 px-6 select-none whitespace-nowrap">
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            {comic.views ?? 0}
                          </span>
                          <span className="inline-flex items-center gap-1 text-rose-500">
                            <Heart className="w-3.5 h-3.5 fill-rose-500 shrink-0" />
                            {comic.likes ?? 0}
                          </span>
                        </div>
                      </td>

                      {/* 6. Thao tác */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleNavigateDetail(comic)}
                            className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Quản lý Chương
                          </button>

                          <button
                            type="button"
                            title="Chỉnh sửa"
                            onClick={() =>
                              navigate(`/admin/comics/${comic.id}/edit`)
                            }
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            title="Xóa truyện"
                            onClick={() =>
                              handleDeleteComic(comic.id, comic.title)
                            }
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Popup Thêm Truyện Mới */}
      <CreateComicModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchAdminComics}
      />
    </main>
  );
};

export default AdminComicPage;
