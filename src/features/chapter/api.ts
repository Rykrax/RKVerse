// feature/comic/api.ts
import BaseResource from "@/api/BaseResource";
import type {
  ChapterApiItem,
  ChapterCreatePayload,
  ChapterDetailData,
} from "./types";
import type { ApiMessageResponse, ApiResponse } from "@/api/types";

class ChapterResource extends BaseResource {
  constructor() {
    super("");
  }

  /**
   * Lấy danh sách chapter theo comicId
   * GET /comics/:comicId/chapters
   */
  getChapters(
    comicId: string | number,
  ): Promise<ApiResponse<ChapterApiItem[]>> {
    return this.request<ApiResponse<ChapterApiItem[]>>({
      url: `/comics/${comicId}/chapters`,
      method: "get",
    });
  }

  /**
   * Lấy chi tiết nội dung trang ảnh của chapter
   * GET /comics/:comicId/chapters/:chapterId
   */
  getChapterDetail(
    comicId: string | number,
    chapterNumber: string | number,
  ): Promise<ApiResponse<ChapterDetailData>> {
    return this.request<ApiResponse<ChapterDetailData>>({
      url: `/comics/${comicId}/chapters/${chapterNumber}`,
      method: "get",
    });
  }

  createChapter(
    comicId: string | number,
    payload: ChapterCreatePayload,
  ): Promise<ApiMessageResponse> {
    const formData = new FormData();

    formData.append("chapterNumber", String(payload.chapterNumber));

    if (payload.title && payload.title.trim()) {
      formData.append("title", payload.title.trim());
    }

    if (payload.files && payload.files.length > 0) {
      payload.files.forEach((file) => {
        formData.append("files", file);
      });
    }

    return this.request<ApiMessageResponse>({
      url: `/comics/${comicId}/chapters`,
      method: "post",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}

const chapterApi = new ChapterResource();
export default chapterApi;
