"use client";

import { SIDEBAR_WIDTH_CLOSED, SIDEBAR_WIDTH_OPEN } from "my-variables";
import type { ReactNode } from "react";

export interface IContainerWrapperProps {
  isOpen: boolean;
  children: ReactNode;
}

export function ContainerWrapper(props: IContainerWrapperProps) {
  const marginLeft = props.isOpen ? SIDEBAR_WIDTH_OPEN : SIDEBAR_WIDTH_CLOSED;

  return (
    <div
      style={{ marginLeft: `${marginLeft}px` }}
      className="flex min-h-screen flex-col bg-louve-bg transition-all duration-200 ease-in-out"
    >
      {props.children}
    </div>
  );
}
