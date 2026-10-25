"use client";

import type { ReactNode } from "react";
import { SnackbarContext } from "./SnackbarContext";

export interface IProvidersProps {
  children: ReactNode;
}

export function Providers(props: IProvidersProps) {
  return <SnackbarContext>{props.children}</SnackbarContext>;
}
