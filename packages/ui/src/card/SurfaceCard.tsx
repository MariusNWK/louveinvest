import { cn } from "cn";
import type { ReactNode } from "react";

export interface ISurfaceCardProps {
  title?: string;
  subtitle?: string;
  headerRight?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function SurfaceCard(props: ISurfaceCardProps) {
  const hasHeader = Boolean(props.title || props.subtitle || props.headerRight);

  return (
    <section
      className={cn(
        "flex flex-col gap-5 rounded-2xl border border-louve-border bg-louve-surface p-6 shadow-card",
        props.className,
      )}
    >
      {hasHeader && (
        <div className="flex flex-wrap items-start justify-between gap-4 border-louve-border-light border-b pb-4">
          <div className="flex flex-col gap-0.5">
            {props.title && <h2 className="font-medium text-louve-navy text-lg tracking-tight">{props.title}</h2>}
            {props.subtitle && <p className="text-louve-slate text-xs">{props.subtitle}</p>}
          </div>
          {props.headerRight && <div className="flex items-center gap-2">{props.headerRight}</div>}
        </div>
      )}
      {props.children}
    </section>
  );
}
