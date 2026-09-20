export interface ChapterItem {
  id: number;
  chapterNumber: number;
  totalPages: number;
  title: string;
  createdAt: string;
}

export interface UploadedImageItem {
  id: string;
  file: File;
  previewUrl: string;
}

export interface ProgressState {
  completed: number;
  total: number;
  percent: number;
}

export interface AddChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  comicTitle?: string;
  onSubmit?: (data: {
    chapterNumber: string;
    title: string;
    files: File[];
  }) => void;
}

export interface ChapterListSectionProps {
  chapters: ChapterItem[];
  isAdmin: boolean;
  isSortDesc: boolean;
  onSortChapters: () => void;
  onOpenAddChapterModal: () => void;
  getChapterUrl: (chapterNumber: number) => string;
}
