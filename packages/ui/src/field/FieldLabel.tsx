import { cn } from "cn";
import type { ReactNode } from "react";

export interface IFieldLabelProps {
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}

export function FieldLabel(props: IFieldLabelProps) {
  return (
    <label htmlFor={props.htmlFor} className={cn("font-medium text-louve-navy text-xs", props.className)}>
      {props.children}
    </label>
  );
}
