import type { ReactNode } from "react";

export interface ITooltipWrapperProps {
  children: ReactNode;
  label?: string;
}

export function TooltipWrapper(props: ITooltipWrapperProps) {
  return (
    <div className="group relative flex items-center" title={props.label}>
      {props.children}
    </div>
  );
}
