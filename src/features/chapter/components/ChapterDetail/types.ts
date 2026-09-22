export interface ChapterItem {
  id: string | number;
  name: string;
  slug?: string;
}

export interface ChapterUIData {
  id: number;
  name: string;
  comicTitle: string;
  description: string;
  pages: string[];
  prevChapterId?: number | null;
  nextChapterId?: number | null;
}
