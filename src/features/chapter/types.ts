export interface ChapterItem {
  id: number;
  chapterNumber: number;
  totalPages: number;
  title: string;
  createdAt: string;
}

export interface ChapterApiItem {
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

export interface ChapterCreatePayload {
  title?: string;
  chapterNumber: number | string;
  files: File[];
}
