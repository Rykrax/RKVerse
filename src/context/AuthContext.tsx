import authApi from "@/features/auth/api";
import userApi from "@/features/user/api";
import type { ProfileData } from "@/features/user/types";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface AuthContextType {
  user: ProfileData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (fields: Partial<ProfileData>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCurrentUser = async () => {
    try {
      const response = await userApi.getProfile();
      const data = response.data || response;
      setUser(data);
    } catch (error) {
      console.error("Phiên đăng nhập không hợp lệ:", error);
      localStorage.removeItem("accessToken");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      fetchCurrentUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (token: string) => {
    localStorage.setItem("accessToken", token);
    setIsLoading(true);
    await fetchCurrentUser();
  };

  // Xử lý khi đăng xuất
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.warn("Lỗi đăng xuất phía server:", error);
    } finally {
      localStorage.removeItem("accessToken");
      setUser(null);
    }
  };

  const updateUser = (fields: Partial<ProfileData>) => {
    setUser((prev) => (prev ? { ...prev, ...fields } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được sử dụng bên trong <AuthProvider>");
  }
  return context;
};
