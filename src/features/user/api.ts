// features/profile/api.ts
import BaseResource from "@/api/BaseResource";
import type { ApiResponse } from "@/api/types";
import type { ProfileData } from "./types";

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
}

const userApi = new UserResource();
export default userApi;
