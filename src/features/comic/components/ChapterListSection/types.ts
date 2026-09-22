import type { ChapterItem } from "@/features/chapter";

export interface ChapterListSectionProps {
  chapters: ChapterItem[];
  isAdmin: boolean;
  isSortDesc: boolean;
  onSortChapters: () => void;
  onOpenAddChapterModal: () => void;
  getChapterUrl: (chapterNumber: number) => string;
}
