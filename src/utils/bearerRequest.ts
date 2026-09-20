// src/api/axiosClient.ts
import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from "axios";

// 1. Khởi tạo instance Axios
const axiosClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_BACKEND_URL ||
    "http://localhost:8080/api/v1",
  timeout: 30000,
  withCredentials: true, // Nhận và gửi HttpOnly Cookie chứa refreshToken
  // Đã bỏ Content-Type mặc định ở đây để tránh đè FormData
});

// Interface quản lý Promise trong hàng đợi
interface QueueItem {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

// 2. Biến cờ & Hàng đợi ngăn chặn Race Condition
let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 3. Đồng bộ Refresh Token giữa các Tab bằng BroadcastChannel
const authChannel =
  typeof window !== "undefined" && "BroadcastChannel" in window
    ? new BroadcastChannel("auth_channel")
    : null;

if (authChannel) {
  authChannel.onmessage = (event: MessageEvent) => {
    if (event.data?.type === "TOKEN_REFRESHED") {
      const newToken = event.data.accessToken as string;
      isRefreshing = false;
      axiosClient.defaults.headers.common["Authorization"] =
        `Bearer ${newToken}`;
      processQueue(null, newToken);
    } else if (event.data?.type === "LOGOUT") {
      handleLogout(false);
    }
  };
}

// 4. Request Interceptor: Tự động đính kèm accessToken & Xử lý Content-Type linh hoạt
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      if (config.headers.set) {
        config.headers.set("Authorization", `Bearer ${token}`);
      } else {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }

    // Xử lý Content-Type chuẩn xác
    if (config.data instanceof FormData) {
      // Nếu là FormData: Xóa Content-Type để trình duyệt tự động chèn boundary
      if (config.headers.delete) {
        config.headers.delete("Content-Type");
      } else {
        delete config.headers["Content-Type"];
      }
    } else if (!config.headers["Content-Type"]) {
      // Nếu là object JSON thông thường và chưa có header: Mặc định là application/json
      if (config.headers.set) {
        config.headers.set("Content-Type", "application/json");
      } else {
        config.headers["Content-Type"] = "application/json";
      }
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// 5. Response Interceptor: Bắt lỗi 401, xếp hàng đợi và gọi refresh token
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Trả trực tiếp payload data để component không cần chấm .data hai lần
    return response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    // Chặn vòng lặp: Tuyệt đối không retry các endpoint auth
    const isAuthRoute =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/refresh-token");

    // Khi gặp lỗi 401 và chưa từng retry
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !isAuthRoute
    ) {
      // Trường hợp A: Đang có một request đi trước nhận nhiệm vụ refresh token
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest._retry = true;
            if (originalRequest.headers?.set) {
              originalRequest.headers.set("Authorization", `Bearer ${token}`);
            } else {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
            }
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      // Trường hợp B: Request đầu tiên đứng ra lock cờ và gọi refresh
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          `${axiosClient.defaults.baseURL}/auth/refresh-token`,
          {},
          {
            withCredentials: true,
          },
        );

        const newAccessToken: string =
          response.data?.data?.accessToken || response.data?.accessToken;

        if (!newAccessToken) {
          throw new Error("Máy chủ không trả về accessToken mới.");
        }

        localStorage.setItem("accessToken", newAccessToken);

        axiosClient.defaults.headers.common["Authorization"] =
          `Bearer ${newAccessToken}`;

        if (authChannel) {
          authChannel.postMessage({
            type: "TOKEN_REFRESHED",
            accessToken: newAccessToken,
          });
        }

        processQueue(null, newAccessToken);

        if (originalRequest.headers?.set) {
          originalRequest.headers.set(
            "Authorization",
            `Bearer ${newAccessToken}`,
          );
        } else {
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        }

        return axiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        handleLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error.response?.data || error);
  },
);

// 6. Hàm xử lý Logout đồng bộ
const handleLogout = (broadcast = true) => {
  localStorage.removeItem("accessToken");

  if (broadcast && authChannel) {
    authChannel.postMessage({ type: "LOGOUT" });
  }

  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

export default axiosClient;
