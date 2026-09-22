import React, { useState } from "react";
import { BookOpen, User, Lock, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import authApi from "../api";

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      // 1. Gọi API login
      const res = await authApi.login({
        username,
        password,
      });

      // 2. Lấy accessToken từ res.data (chuẩn ApiResponse<LoginData>)
      const accessToken = res.data?.accessToken;

      if (accessToken) {
        // 3. Lưu accessToken vào localStorage
        localStorage.setItem("accessToken", accessToken);

        // 4. Chuyển hướng sang dashboard
        navigate("/");
      } else {
        setErrorMessage("Không nhận được mã xác thực từ máy chủ.");
      }
    } catch (err: any) {
      // 5. Bắt và hiển thị lỗi từ backend
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản hoặc mật khẩu!";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[390px] bg-white rounded-2xl p-6 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
      {/* Icon đầu trang */}
      <div className="flex justify-center mb-4">
        <div className="w-12 h-12 rounded-xl border border-indigo-200/80 flex items-center justify-center text-indigo-600 bg-indigo-50/30">
          <BookOpen className="w-6 h-6 stroke-[2]" />
        </div>
      </div>

      {/* Tiêu đề & phụ đề */}
      <div className="text-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Chào Mừng Trở Lại
        </h1>
        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed px-2">
          Đăng nhập để đánh giá và tương tác cùng cộng đồng
        </p>
      </div>

      {/* Thông báo lỗi nếu đăng nhập thất bại */}
      {errorMessage && (
        <div className="mb-4 p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg text-center">
          {errorMessage}
        </div>
      )}

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Tên đăng nhập"
          placeholder="Nhập username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          icon={<User className="w-4 h-4 text-slate-400" />}
          disabled={loading}
          required
        />

        <Input
          label="Mật khẩu"
          type="password"
          placeholder="Nhập mật khẩu..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock className="w-4 h-4 text-slate-400" />}
          disabled={loading}
          required
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={loading}
          className="py-2.5 mt-2 gap-1.5 text-sm font-semibold rounded-lg shadow-sm shadow-indigo-500/20 flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Đang xử lý...</span>
            </>
          ) : (
            <>
              <span>Đăng Nhập</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>

      {/* Chuyển sang Đăng ký dùng Link của react-router để tránh reload trang */}
      <div className="mt-6 text-center text-xs text-slate-500">
        Chưa có tài khoản?{" "}
        <Link
          to="/register"
          className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors ml-0.5"
        >
          Đăng ký ngay
        </Link>
      </div>
    </div>
  );
};
