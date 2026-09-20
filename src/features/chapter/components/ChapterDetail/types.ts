export interface ChapterItem {
  id: string | number;
  name: string;
  slug?: string;
}

export interface ChapterDetailData {
  id: string | number;
  name: string;
  comicTitle: string;
  description: string;
  pages: string[];
  totalChapters?: number;
}
