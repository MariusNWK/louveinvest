import { cn } from "cn";
import type { ReactNode } from "react";

export type TBadgeVariant = "blue" | "navy" | "cyan" | "emerald" | "amber" | "slate";

export interface IBadgeProps {
  children: ReactNode;
  variant?: TBadgeVariant;
  className?: string;
}

const variantClassesRecord: Record<TBadgeVariant, string> = {
  blue: "border-louve-blue-border bg-louve-blue-soft text-louve-blue",
  navy: "border-louve-navy-light bg-louve-navy text-louve-surface",
  cyan: "border-louve-blue-muted bg-louve-cyan/60 text-louve-navy",
  emerald: "border-success-200 bg-success-50 text-success-700",
  amber: "border-warning-200 bg-warning-50 text-warning-700",
  slate: "border-louve-border bg-louve-border-light text-louve-slate",
};

export function Badge(props: IBadgeProps) {
  const variant = props.variant ?? "blue";
  const variantClassName = variantClassesRecord[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-medium text-xs tracking-tight",
        variantClassName,
        props.className,
      )}
    >
      {props.children}
    </span>
  );
}
