import { cn } from "cn";
import type { ReactNode } from "react";
import { actionSizeClasses, actionVariantClasses, type TActionSize, type TActionVariant } from "./priv/actionStyles";

export type TActionLinkVariant = TActionVariant | "text";

export interface IActionLinkProps {
  href: string;
  children: ReactNode;
  variant?: TActionLinkVariant;
  size?: TActionSize;
  isExternal?: boolean;
  className?: string;
}

const textLinkClasses = "font-medium text-louve-blue underline-offset-2 hover:underline";

export function ActionLink(props: IActionLinkProps) {
  const variant = props.variant ?? "outline";
  const size = props.size ?? (variant === "text" ? "none" : "md");
  const variantClassName =
    variant === "text"
      ? textLinkClasses
      : cn("inline-flex items-center gap-2 transition-colors", actionVariantClasses[variant]);

  return (
    <a
      href={props.href}
      target={props.isExternal ? "_blank" : undefined}
      rel={props.isExternal ? "noreferrer" : undefined}
      className={cn(variantClassName, actionSizeClasses[size], props.className)}
    >
      {props.children}
    </a>
  );
}
