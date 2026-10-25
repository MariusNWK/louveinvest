import { cn } from "cn";
import type { ReactNode } from "react";

export interface ICardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle(props: ICardTitleProps) {
  return <h3 className={cn("font-medium text-louve-navy text-sm", props.className)}>{props.children}</h3>;
}
