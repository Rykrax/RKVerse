import React, { useState } from "react";
import { BookOpen, User, Lock, ArrowRight, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import authApi from "../../../api/auth"; // Điều chỉnh lại path import authApi cho khớp với project

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không khớp!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.register({
        username: username.trim(),
        password,
        confirmPassword,
      });

      // Nếu backend trả về status 200/201 kèm data
      if (response) {
        // Chuyển sang trang đăng nhập và truyền state để trang login có thể hiển thị thông báo chào mừng
        navigate("/login", {
          state: {
            message: "Đăng ký tài khoản thành công! Vui lòng đăng nhập.",
            username: username.trim(),
          },
        });
      }
    } catch (err: any) {
      // Bắt message từ backend (axios error format hoặc message tùy chỉnh)
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Đăng ký thất bại. Vui lòng thử lại sau!";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
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
      <div className="text-center mb-5">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Đăng Ký Tài Khoản
        </h1>
        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed px-2">
          Tạo tài khoản để trải nghiệm đầy đủ tính năng của RKVerse
        </p>
      </div>

      {/* Thông báo lỗi */}
      {errorMessage && (
        <div className="mb-3.5 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs text-center font-medium">
          {errorMessage}
        </div>
      )}

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <Input
          label="Tên người dùng"
          placeholder="Nhập username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          icon={<User className="w-4 h-4 text-slate-400" />}
          disabled={isLoading}
          required
        />

        <Input
          label="Mật khẩu"
          type="password"
          placeholder="Nhập mật khẩu..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock className="w-4 h-4 text-slate-400" />}
          disabled={isLoading}
          required
        />

        <Input
          label="Xác nhận mật khẩu"
          type="password"
          placeholder="Nhập lại mật khẩu..."
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          icon={<Lock className="w-4 h-4 text-slate-400" />}
          disabled={isLoading}
          required
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={isLoading}
          className="py-2.5 mt-2 gap-1.5 text-sm font-semibold rounded-lg shadow-sm shadow-indigo-500/20 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Đang xử lý...</span>
            </>
          ) : (
            <>
              <span>Tạo Tài Khoản</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>

      {/* Quay lại Đăng nhập */}
      <div className="mt-5 text-center text-xs text-slate-500">
        Đã có tài khoản?{" "}
        <Link
          to="/login"
          className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors ml-0.5"
        >
          Đăng nhập ngay
        </Link>
      </div>
    </div>
  );
};
