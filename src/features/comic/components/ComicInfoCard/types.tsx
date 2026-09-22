import type { ComicApiItem } from "../../types";

export interface ComicInfoCardProps {
  comic: ComicApiItem;
  isAdmin: boolean;
  isLiked: boolean;
  likeCount: number;
  userRating: number;
  hoverRating: number;
  firstChapterUrl: string;
  latestChapterUrl: string;
  onToggleLike: () => void;
  onDeleteComic: () => void;
  onHoverRating: (val: number) => void;
  onSetRating: (val: number) => void;
}
