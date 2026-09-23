export interface ProfileData {
  username: string;
  email?: string;
  displayName?: string;
  role?: string;
}

export interface UserProfile {
  id?: string;
  displayName: string;
  username: string;
  email: string;
  role: string;
  roleLabel?: string;
}
