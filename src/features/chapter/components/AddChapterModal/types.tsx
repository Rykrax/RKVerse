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
