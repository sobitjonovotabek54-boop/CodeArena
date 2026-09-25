import { cn } from "@/lib/utils";

// Backend seed_db.py dagi SHOP_ITEMS bilan mos bo'lishi kerak.
// Reyting/profil API faqat item_id qaytaradi, shuning uchun ranglar shu yerda saqlanadi.
export const FRAME_STYLES: Record<string, { borderColor: string; boxShadow: string }> = {
  frame_neon_cyan: { borderColor: "#06b6d4", boxShadow: "0 0 15px #06b6d4" },
  frame_gold_crown: { borderColor: "#eab308", boxShadow: "0 0 20px #eab308" },
  frame_matrix_green: { borderColor: "#22c55e", boxShadow: "0 0 15px #22c55e" },
  frame_flame_phoenix: { borderColor: "#ef4444", boxShadow: "0 0 25px #f97316" },
};

export const TITLE_STYLES: Record<string, { label: string; color: string }> = {
  title_python_ninja: { label: "Python Ninja", color: "#38bdf8" },
  title_bug_hunter: { label: "Bug Hunter", color: "#a855f7" },
  title_code_wizard: { label: "Code Wizard", color: "#f59e0b" },
  title_grand_champion: { label: "Grand Champion", color: "#ec4899" },
};

export function FramedAvatar({
  src,
  name,
  frame,
  size = 40,
  className,
}: {
  src?: string;
  name: string;
  frame?: string;
  size?: number;
  className?: string;
}) {
  const style = frame ? FRAME_STYLES[frame] : undefined;
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-blurple font-bold text-snow",
        style ? "border-[3px]" : "border border-dim-grey/50",
        className
      )}
      style={{ width: size, height: size, fontSize: size * 0.4, ...style }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        name.charAt(0).toUpperCase()
      )}
    </div>
  );
}

export function TitleBadge({ title, className }: { title?: string; className?: string }) {
  const style = title ? TITLE_STYLES[title] : undefined;
  if (!style) return null;
  return (
    <span
      className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold", className)}
      style={{ color: style.color, backgroundColor: `${style.color}22`, border: `1px solid ${style.color}55` }}
    >
      {style.label}
    </span>
  );
}
