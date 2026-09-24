export interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => Promise<void> | void;
}
