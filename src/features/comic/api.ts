// src/api/comic.ts
import BaseResource from "@/api/BaseResource";
import { toFormData } from "@/utils/formData";
import type {
  ComicApiItem,
  ComicCreateResponse,
  ComicListResponse,
  CreateComicRequest,
} from "./types";

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
