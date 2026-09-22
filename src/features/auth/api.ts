// src/api/auth.ts
import BaseResource from "@/api/BaseResource";
import type { ApiResponse } from "@/api/types";
import type {
  LoginData,
  LoginPayload,
  RegisterData,
  RegisterPayload,
} from "./types";

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
