import { cn } from "cn";
import type { ReactNode } from "react";

export interface IKpiCardProps {
  label: string;
  value: string;
  unit?: string;
  secondaryText?: string;
  badge?: ReactNode;
  highlighted?: boolean;
  icon?: ReactNode;
}

export function KpiCard(props: IKpiCardProps) {
  const isHighlighted = Boolean(props.highlighted);

  return (
    <div
      className={cn(
        "flex flex-col justify-between gap-3 rounded-2xl border p-5 transition-all",
        isHighlighted
          ? "border-louve-navy-light bg-gradient-to-br from-louve-navy to-louve-navy-light text-louve-surface shadow-md"
          : "border-louve-border bg-louve-surface text-louve-navy shadow-card",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "font-medium text-xs uppercase tracking-wider",
            isHighlighted ? "text-louve-blue-muted" : "text-louve-slate",
          )}
        >
          {props.label}
        </span>
        {props.icon && (
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg",
              isHighlighted ? "bg-louve-surface/10 text-louve-cyan" : "bg-louve-blue-soft text-louve-blue",
            )}
          >
            {props.icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="font-medium text-2xl tracking-tight md:text-3xl">{props.value}</span>
        {props.unit && (
          <span className={cn("font-normal text-sm", isHighlighted ? "text-louve-blue-border" : "text-louve-slate")}>
            {props.unit}
          </span>
        )}
      </div>

      {(props.secondaryText || props.badge) && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          {props.secondaryText && (
            <span className={cn("text-xs", isHighlighted ? "text-louve-blue-border/90" : "text-louve-slate")}>
              {props.secondaryText}
            </span>
          )}
          {props.badge}
        </div>
      )}
    </div>
  );
}
