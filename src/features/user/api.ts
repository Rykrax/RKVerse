// features/profile/api.ts
import BaseResource from "@/api/BaseResource";
import type { ApiResponse } from "@/api/types";
import type {
  changeDisplayNamePayload,
  changePasswordPayload,
  ProfileData,
} from "./types";

class UserResource extends BaseResource {
  constructor() {
    super("users");
  }

  getProfile(): Promise<ApiResponse<ProfileData>> {
    return this.request<ApiResponse<ProfileData>>({
      url: `/${this.uri}/me`,
      method: "get",
    });
  }

  changeDisplayName(
    payload: changeDisplayNamePayload,
  ): Promise<ApiResponse<void>> {
    return this.request<ApiResponse<void>>({
      url: `${this.uri}/me`,
      method: "patch",
      data: payload,
    });
  }

  changePassword(payload: changePasswordPayload): Promise<ApiResponse<void>> {
    return this.request<ApiResponse<void>>({
      url: `${this.uri}/password`,
      method: "patch",
      data: payload,
    });
  }
}

const userApi = new UserResource();
export default userApi;
