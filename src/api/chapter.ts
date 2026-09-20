// src/api/comic.ts
import BaseResource from "./BaseResource";

export interface ChapterApiResponse {
  id: number;
  comicId: number;
  chapterNumber: number;
  title: string | null;
  status?: string;
  uploadStatus?: string;
  storagePath?: string;
  totalPages: number;
  views?: number;
}

// Sửa lại data thành mảng ChapterApiResponse[]
export interface ChapterListResponse {
  status: number;
  message: string;
  data: ChapterApiResponse[];
}

export interface ChapterDetailData {
  id: number;
  comicId: number;
  chapterNumber: number;
  title: string | null;
  totalPages: number;
  pages: string[];
  prevChapterId: number | null;
  nextChapterId: number | null;
}

export interface ChapterDetailResponse {
  status: number;
  message: string;
  data: ChapterDetailData;
}

export interface ChapterCreateRequest {
  title?: string;
  chapterNumber: number | string;
  files: File[];
}

export interface ChapterCreateResponse {
  status: number;
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
  getChapters(comicId: string | number): Promise<ChapterListResponse> {
    return this.request<ChapterListResponse>({
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
  ): Promise<ChapterDetailResponse> {
    return this.request<ChapterDetailResponse>({
      url: `/comics/${comicId}/chapters/${chapterNumber}`,
      method: "get",
    });
  }

  createChapter(
    comicId: string | number,
    payload: ChapterCreateRequest,
  ): Promise<ChapterCreateResponse> {
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

    return this.request<ChapterCreateResponse>({
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
