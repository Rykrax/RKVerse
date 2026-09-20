// src/api/auth.ts (hoặc src/api/AuthResource.ts)
import BaseResource from "./BaseResource";

// 1. Định nghĩa kiểu dữ liệu cho Request payload
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

// 2. Định nghĩa cấu trúc phản hồi từ Backend Spring Boot
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

export interface ApiResponse<T> {
  code?: number;
  message?: string;
  data: T;
}

// 3. Khai báo AuthResource kế thừa BaseResource
class AuthResource extends BaseResource {
  constructor() {
    super("auth");
  }

  /**
   * Đăng nhập hệ thống
   * @param data Payload đăng nhập (username, password)
   */
  login(data: LoginPayload): Promise<ApiResponse<LoginData>> {
    return this.request<ApiResponse<LoginData>>({
      url: `/${this.uri}/login`,
      method: "post",
      data,
    });
  }

  register(data: RegisterPayload): Promise<ApiResponse<RegisterData>> {
    return this.request<ApiResponse<RegisterData>>({
      url: `/${this.uri}/register`,
      method: "post",
      data,
    });
  }

  /**
   * Đăng xuất hệ thống (xóa cookie refreshToken ở backend)
   */
  logout(): Promise<ApiResponse<void>> {
    return this.request<ApiResponse<void>>({
      url: `/${this.uri}/logout`,
      method: "post",
    });
  }

  /**
   * Lấy thông tin tài khoản hiện tại
   */
  getCurrentUser<T = unknown>(): Promise<ApiResponse<T>> {
    return this.request<ApiResponse<T>>({
      url: `/${this.uri}/me`,
      method: "get",
    });
  }
}

const authApi = new AuthResource();
export default authApi;
