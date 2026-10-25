"use client";

import { cn } from "cn";
import { SIDEBAR_WIDTH_CLOSED, SIDEBAR_WIDTH_OPEN } from "my-variables";
import type { ReactNode } from "react";
import { ChevronLeft } from "react-feather";
import { Badge, Button } from "ui";

export interface ISidebarWrapperProps {
  children: ReactNode;
  isOpen: boolean;
  toggleOpen: () => void;
  logo: ReactNode;
}

export function SidebarWrapper(props: ISidebarWrapperProps) {
  const widthStyle = props.isOpen ? SIDEBAR_WIDTH_OPEN : SIDEBAR_WIDTH_CLOSED;

  return (
    <aside
      style={{ width: `${widthStyle}px` }}
      className="fixed inset-y-0 left-0 z-20 flex flex-col justify-between border-louve-border border-r bg-louve-surface transition-all duration-200 ease-in-out"
    >
      <div className="flex h-16 shrink-0 items-center justify-between border-louve-border-light border-b px-4">
        <div className="flex items-center gap-2.5 overflow-hidden">{props.logo}</div>
        {props.isOpen && <Badge variant="blue">SCPI</Badge>}
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden py-3">{props.children}</div>

      <Button
        variant="nav"
        title={props.isOpen ? "Réduire le menu" : "Ouvrir le menu"}
        onClick={props.toggleOpen}
        className="h-11 w-full shrink-0 border-louve-border-light border-t text-xs"
      >
        <ChevronLeft size={16} className={cn("transition-transform", !props.isOpen && "rotate-180")} />
        {props.isOpen && <span>Réduire</span>}
      </Button>
    </aside>
  );
}
