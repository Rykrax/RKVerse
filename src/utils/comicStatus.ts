// src/utils/comicStatus.ts

export type ComicStatusType = "ONGOING" | "COMPLETED" | "PAUSED";

export interface StatusConfig {
  label: string;
  badgeClass: string;
  dotClass: string;
}

export const COMIC_STATUS_MAP: Record<ComicStatusType, StatusConfig> = {
  ONGOING: {
    label: "Đang tiến hành",
    badgeClass: "bg-emerald-50 text-emerald-600 border-emerald-200/50",
    dotClass: "bg-emerald-500",
  },
  COMPLETED: {
    label: "Hoàn thành",
    badgeClass: "bg-blue-50 text-blue-600 border-blue-200/50",
    dotClass: "bg-blue-500",
  },
  PAUSED: {
    label: "Tạm ngưng",
    badgeClass: "bg-amber-50 text-amber-600 border-amber-200/50",
    dotClass: "bg-amber-500",
  },
};

export const getComicStatusConfig = (status?: string): StatusConfig => {
  if (!status) return COMIC_STATUS_MAP.ONGOING;
  const upperStatus = status.toUpperCase() as ComicStatusType;
  return COMIC_STATUS_MAP[upperStatus] || COMIC_STATUS_MAP.ONGOING;
};
