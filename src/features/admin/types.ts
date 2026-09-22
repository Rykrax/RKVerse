//request
export interface LoginPayload {
  username: string;
  password?: string;
  [key: string]: unknown;
}

export interface RegisterPayload {
  username: string;
  password: string;
  confirmPassword: string;
}

// response
export interface LoginData {
  accessToken: string;
  tokenType?: string;
  expiresIn?: number;
  user?: {
    id: string | number;
    username: string;
    roles?: string[];
    [key: string]: unknown;
  };
}

export interface RegisterData {
  username: string;
}
