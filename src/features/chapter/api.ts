// feature/comic/api.ts
import BaseResource from "@/api/BaseResource";
import type {
  ChapterApiItem,
  ChapterCreatePayload,
  ChapterDetailData,
} from "./types";
import type { ApiMessageResponse, ApiResponse } from "@/api/types";

// Định nghĩa kiểu dữ liệu trả về cho API start session đọc
export interface ViewStartResponse {
  eligible: boolean;
  readToken: string | null;
  message: string;
}

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
   * GET /comics/:comicId/chapters/:chapterNumber
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

  /**
   * Tạo chapter mới (Multipart/Form-Data)
   * POST /comics/:comicId/chapters
   */
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
      // Đặt timeout 3 phút cho riêng request tải ảnh lên để tránh client tự hủy
      timeout: 180000,
    });
  }

  /**
   * 1. Khởi tạo phiên đọc cho chapter và nhận readToken (kiểm tra cooldown 5 phút)
   * POST /api/v1/chapters/:chapterId/views/start
   */
  startReadingView(
    chapterId: string | number,
  ): Promise<ApiResponse<ViewStartResponse>> {
    return this.request<ApiResponse<ViewStartResponse>>({
      url: `/chapters/${chapterId}/views/start`,
      method: "post",
    });
  }

  /**
   * 2. Xác nhận đọc đủ 15 giây để tăng view cho Chapter & Comic
   * POST /api/v1/chapters/:chapterId/views/confirm
   */
  confirmReadingView(
    chapterId: string | number,
    readToken: string,
  ): Promise<ApiResponse<void>> {
    return this.request<ApiResponse<void>>({
      url: `/chapters/${chapterId}/views/confirm`,
      method: "post",
      data: { readToken },
    });
  }
}

const chapterApi = new ChapterResource();
export default chapterApi;
