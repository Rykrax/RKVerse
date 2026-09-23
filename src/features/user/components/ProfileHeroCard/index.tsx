import type { ProfileHeroCardProps } from "./types";

export const ProfileHeroCard: React.FC<ProfileHeroCardProps> = ({
  displayName,
  username,
  roleLabel,
}) => {
  const initial = displayName ? displayName.charAt(0).toUpperCase() : "T";

  return (
    <div className="bg-gradient-to-r from-blue-50/70 via-emerald-50/20 to-teal-50/30 rounded-2xl p-5 border border-slate-100 flex items-center gap-4 shadow-xs">
      <div className="w-16 h-16 rounded-full border-[2.5px] border-cyan-400 bg-white flex items-center justify-center shadow-inner shrink-0">
        <span className="text-xl font-bold text-blue-600 select-none">
          {initial}
        </span>
      </div>

      <div className="flex flex-col gap-0.5">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          {displayName}
        </h2>
        <span className="text-slate-400 font-medium text-xs">@{username}</span>

        <div className="mt-1">
          <span className="inline-block bg-amber-100/90 text-amber-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-amber-200/80">
            {roleLabel}
          </span>
        </div>
      </div>
    </div>
  );
};
