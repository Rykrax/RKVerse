import React, { useState } from "react";
import { Eye, EyeOff, Lock, X } from "lucide-react";
import type { ChangePasswordModalProps } from "./types";

// Regex đồng bộ chính xác từ @Pattern trong Backend DTO
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

export default function ChangePasswordModal({
  isOpen,
  onClose,
  onSubmit,
}: ChangePasswordModalProps) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Kiểm tra để trống (@NotBlank)
    if (!formData.currentPassword.trim()) {
      setError("Mật khẩu hiện tại không được để trống");
      return;
    }

    if (!formData.newPassword.trim()) {
      setError("Mật khẩu không được để trống");
      return;
    }

    // 2. Kiểm tra độ dài (@Size(min = 8, max = 64))
    if (formData.newPassword.length < 8 || formData.newPassword.length > 64) {
      setError("Mật khẩu phải từ 8 đến 64 ký tự");
      return;
    }

    // 3. Kiểm tra độ phức tạp (@Pattern)
    if (!PASSWORD_REGEX.test(formData.newPassword)) {
      setError(
        "Mật khẩu phải chứa ít nhất 1 chữ thường, 1 chữ hoa, 1 số và 1 ký tự đặc biệt (@$!%*?&)",
      );
      return;
    }

    // 4. Kiểm tra để trống trường xác nhận
    if (!formData.confirmPassword.trim()) {
      setError("Xác nhận mật khẩu không được để trống");
      return;
    }

    // 5. Kiểm tra trùng khớp (@AssertTrue)
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      setLoading(true);
      if (onSubmit) {
        await onSubmit({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        });
      }
      handleClose();
    } catch (err: any) {
      setError(err?.message || "Đã có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-800">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg">Đổi Mật Khẩu</h3>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl leading-relaxed">
              {error}
            </div>
          )}

          {/* Mật khẩu hiện tại */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Mật khẩu hiện tại
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Nhập mật khẩu hiện tại"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrent ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Mật khẩu mới */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Mật khẩu mới
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                maxLength={64}
                placeholder="8 - 64 ký tự (hoa, thường, số, ký tự đặc biệt)"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNew ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Xác nhận mật khẩu mới */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Xác nhận mật khẩu mới
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                maxLength={64}
                placeholder="Nhập lại mật khẩu mới"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirm ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl shadow-sm transition-colors"
            >
              {loading ? "Đang cập nhật..." : "Cập nhật"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
