import type { ElementType, ReactNode } from "react";

export interface IMenuItem {
  title: string;
  subtitle?: string;
  href: string;
  icon: ReactNode;
  newTab?: boolean;
}

export type TMenuArray = IMenuItem;

export interface ICurrentCompProps {
  href?: string;
  label?: string;
  children: ReactNode;
  isOpen: boolean;
}

export type TCurrentComp = ElementType<ICurrentCompProps>;
