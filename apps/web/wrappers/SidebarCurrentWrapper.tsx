"use client";

import { cn } from "cn";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { TooltipWrapper } from "ui";

export interface ISidebarCurrentWrapperProps {
  href?: string;
  label?: string;
  children: ReactNode;
  isOpen: boolean;
}

export function SidebarCurrentWrapper(props: ISidebarCurrentWrapperProps) {
  const pathname = usePathname();

  let isActive = false;
  if (props.href && !props.href.startsWith("http")) {
    if (props.href === "/") {
      isActive = pathname === "/";
    } else {
      isActive = pathname === props.href || Boolean(pathname?.startsWith(`${props.href}/`));
    }
  }

  const content = (
    <div
      className={cn(
        "flex h-10 items-center gap-3 rounded-xl px-3 transition-colors",
        isActive
          ? "bg-louve-blue-soft font-medium text-louve-blue"
          : "text-louve-slate hover:bg-louve-bg hover:text-louve-navy",
        !props.isOpen && "justify-center px-0",
      )}
    >
      {props.children}
    </div>
  );

  if (props.isOpen) {
    return content;
  }

  return <TooltipWrapper label={props.label}>{content}</TooltipWrapper>;
}
