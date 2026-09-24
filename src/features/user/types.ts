export interface ProfileData {
  id: number | string;
  username: string;
  email?: string;
  displayName?: string;
  roles?: string[];
}

export interface UserProfile {
  id?: string;
  displayName: string;
  username: string;
  email: string;
  role: string;
  roleLabel?: string;
}

export interface changeDisplayNamePayload {
  displayName: string;
}

export interface changePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
