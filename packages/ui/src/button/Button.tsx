import { cn } from "cn";
import type { ReactNode } from "react";
import { actionSizeClasses, actionVariantClasses, type TActionSize, type TActionVariant } from "./priv/actionStyles";

export type TButtonToggleVariant = "tab" | "chip" | "choice";

export type TButtonPlainVariant = "nav" | "icon";

export type TButtonVariant = TActionVariant | TButtonToggleVariant | TButtonPlainVariant;

export type TButtonSize = TActionSize;

export interface IButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: TButtonVariant;
  size?: TButtonSize;
  isActive?: boolean;
  type?: "button" | "submit";
  className?: string;
  title?: string;
  ariaLabel?: string;
}

interface IToggleClasses {
  base: string;
  active: string;
  inactive: string;
}

const toggleVariantClasses: Record<TButtonToggleVariant, IToggleClasses> = {
  chip: {
    base: "inline-flex items-center border font-medium transition-colors",
    active: "border-louve-blue bg-louve-blue-soft text-louve-blue",
    inactive: "border-louve-border bg-louve-bg text-louve-slate hover:border-louve-border-strong",
  },
  choice: {
    base: "flex items-center justify-between gap-2 border text-left transition-all",
    active: "border-louve-blue bg-louve-blue-soft text-louve-navy shadow-2xs",
    inactive: "border-louve-border bg-louve-surface text-louve-slate hover:border-louve-border-strong",
  },
  tab: {
    base: "flex items-center justify-between gap-3 text-left transition-all",
    active: "bg-louve-navy text-louve-surface shadow-sm",
    inactive: "bg-transparent text-louve-slate hover:bg-louve-bg hover:text-louve-navy",
  },
};

const plainVariantClasses: Record<TButtonPlainVariant, string> = {
  nav: "flex items-center justify-center gap-2 text-louve-slate transition-colors hover:bg-louve-blue-soft hover:text-louve-blue",
  icon: "rounded-lg p-1 opacity-70 transition-opacity hover:opacity-100",
};

const defaultSizeByVariant: Record<TButtonVariant, TButtonSize> = {
  primary: "md",
  secondary: "md",
  outline: "md",
  ghost: "md",
  onDark: "md",
  chip: "sm",
  tab: "lg",
  choice: "none",
  nav: "none",
  icon: "none",
};

function getVariantClassName(variant: TButtonVariant, isActive: boolean): string {
  if (variant === "nav" || variant === "icon") {
    return plainVariantClasses[variant];
  }
  if (variant === "tab" || variant === "chip" || variant === "choice") {
    const toggleClasses = toggleVariantClasses[variant];
    return cn(toggleClasses.base, isActive ? toggleClasses.active : toggleClasses.inactive);
  }
  return cn("inline-flex items-center justify-center gap-2 transition-colors", actionVariantClasses[variant]);
}

export function Button(props: IButtonProps) {
  const variant = props.variant ?? "primary";
  const size = props.size ?? defaultSizeByVariant[variant];

  return (
    <button
      type={props.type ?? "button"}
      title={props.title}
      aria-label={props.ariaLabel}
      disabled={props.disabled}
      onClick={props.onClick}
      className={cn(
        "disabled:cursor-not-allowed disabled:opacity-50",
        getVariantClassName(variant, Boolean(props.isActive)),
        actionSizeClasses[size],
        props.className,
      )}
    >
      {props.children}
    </button>
  );
}
