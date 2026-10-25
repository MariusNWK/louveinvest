import { cn } from "cn";
import type { ReactNode } from "react";

export type TSelectVariant = "default" | "muted";

export interface ISelectProps {
  ariaLabel: string;
  defaultValue?: string;
  children: ReactNode;
  variant?: TSelectVariant;
  className?: string;
}

const selectVariantClasses: Record<TSelectVariant, string> = {
  default: "text-louve-navy",
  muted: "text-louve-slate",
};

export function Select(props: ISelectProps) {
  const variant = props.variant ?? "default";

  return (
    <select
      aria-label={props.ariaLabel}
      defaultValue={props.defaultValue}
      className={cn(
        "cursor-pointer rounded-xl border border-louve-border bg-louve-bg px-3 py-1.5 font-medium text-xs outline-none transition-colors hover:border-louve-border-strong focus:border-louve-blue",
        selectVariantClasses[variant],
        props.className,
      )}
    >
      {props.children}
    </select>
  );
}
