import type { LucideIcon } from "lucide-react";

export interface ProfileDetailItemProps {
  icon?: LucideIcon;
  label: string;
  value?: string;
  onEdit?: () => void;
  isEditable?: boolean;
}
