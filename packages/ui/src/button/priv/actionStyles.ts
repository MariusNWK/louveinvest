export type TActionVariant = "primary" | "secondary" | "outline" | "ghost" | "onDark";

export type TActionSize = "xs" | "sm" | "md" | "lg" | "none";

export const actionVariantClasses: Record<TActionVariant, string> = {
  primary: "border border-transparent bg-louve-blue font-medium text-louve-surface shadow-xs hover:bg-louve-blue-hover",
  secondary: "border border-louve-blue-border bg-louve-surface font-medium text-louve-navy hover:bg-louve-blue-soft/60",
  outline: "border border-louve-blue-border bg-louve-surface font-medium text-louve-blue hover:bg-louve-blue-soft/60",
  ghost: "bg-transparent font-medium text-louve-slate hover:bg-louve-blue-soft hover:text-louve-navy",
  onDark:
    "border border-louve-navy-light bg-louve-navy-light/60 font-medium text-louve-blue-border hover:bg-louve-navy-light",
};

export const actionSizeClasses: Record<TActionSize, string> = {
  xs: "rounded-md px-2 py-0.5 text-[11px]",
  sm: "rounded-lg px-2.5 py-1 text-[11px]",
  md: "rounded-xl px-3.5 py-2 text-xs",
  lg: "rounded-xl px-4 py-3",
  none: "",
};
