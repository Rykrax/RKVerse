// payload
export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  password: string;
  confirmPassword: string;
}

// data
export interface LoginData {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterData {
  username: string;
}
