import type { ChapterItem } from "../../types";

export interface ChapterListSectionProps {
  chapters: ChapterItem[];
  isAdmin: boolean;
  isSortDesc: boolean;
  onSortChapters: () => void;
  onOpenAddChapterModal: () => void;
  getChapterUrl: (chapterNumber: number) => string;
}
