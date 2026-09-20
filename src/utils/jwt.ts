// src/utils/jwt.ts
export interface UserProfile {
  id?: string | number;
  sub?: string;
  username?: string;
  roles?: string[] | string;
  role?: string;
  [key: string]: unknown;
}

export const getUserFromToken = (): UserProfile | null => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );

    const decoded = JSON.parse(jsonPayload);
    // Chuẩn hóa tên hiển thị: Spring Security thường lưu username vào claim 'sub'
    return {
      ...decoded,
      username: decoded.username || decoded.sub || "user",
    };
  } catch (error) {
    console.error("Failed to decode accessToken", error);
    return null;
  }
};
