// src/api/comic.ts
import BaseResource from "./BaseResource";
import { toFormData } from "@/utils/formData"; // Import hàm toFormData đã viết ở utils

export interface ComicApiItem {
  id: number;
  title: string;
  slug: string;
  author?: string;
  coverPath: string;
  description?: string;
  views?: number;
  status?: string;
}

export interface ComicPageData {
  items: ComicApiItem[];
  last: boolean;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ComicListResponse {
  status: number;
  message: string;
  data: ComicPageData;
}

export interface CreateComicRequest {
  title: string;
  slug?: string;
  author?: string;
  description?: string;
  coverImage?: File;
  categoryIds?: number[];
  [key: string]: any;
}

export interface ComicCreateResponse {
  status: number;
  message: string;
  data: ComicApiItem;
}

class ComicResource extends BaseResource {
  constructor() {
    super("comics");
  }

  getComics(params?: Record<string, any>): Promise<ComicListResponse> {
    return this.list<ComicListResponse>(params);
  }

  getComic(id: string | number): Promise<ComicApiItem> {
    return this.get<ComicApiItem>(id);
  }

  createComic(
    payload: CreateComicRequest | FormData,
  ): Promise<ComicCreateResponse> {
    const formData =
      payload instanceof FormData ? payload : toFormData(payload);
    return this.create<ComicCreateResponse, FormData>(formData);
  }

  deleteComic(id: string | number): Promise<void> {
    return this.request<void>({
      url: `/comics/${id}`,
      method: "delete",
    });
  }
}

const comicApi = new ComicResource();
export default comicApi;
