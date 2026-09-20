import React from "react";
import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  icon,
  className = "",
  required,
  ...props
}) => {
  return (
    <div className="w-full text-left space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold text-slate-700">
          {label}{" "}
          {required && <span className="text-red-500 font-bold">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center justify-center">
            {icon}
          </div>
        )}
        <input
          required={required}
          className={`w-full py-2.5 pr-3.5 text-sm rounded-lg border border-slate-200 bg-slate-50/50 text-slate-800 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 ${
            icon ? "pl-10" : "pl-3.5"
          } ${className}`}
          {...props}
        />
      </div>
    </div>
  );
};
