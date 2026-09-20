import React, { type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  fullWidth = false,
  className = "",
  onClick, // 1. Phải khai báo nhận onClick ở đây
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const variants = {
    primary:
      "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200 active:scale-[0.99]",
    outline:
      "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700",
    ghost: "text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/50",
  };

  return (
    <button
      type="button"
      onClick={onClick} // 2. BẮT BUỘC PHẢI TRUYỀN VÀO THẺ BUTTON NÀY
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
