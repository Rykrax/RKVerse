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

// request
export interface CreateComicRequest {
  title: string;
  slug?: string;
  author?: string;
  description?: string;
  coverImage?: File;
  categoryIds?: number[];
  [key: string]: any;
}

// response
export interface ComicListResponse {
  status: number;
  message: string;
  data: ComicPageData;
}

export interface ComicCreateResponse {
  status: number;
  message: string;
  data: ComicApiItem;
}
