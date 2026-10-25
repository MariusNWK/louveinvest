"use client";

import { cn } from "cn";
import type { ReactNode } from "react";
import { useState } from "react";
import { Activity, Percent } from "react-feather";
import { Button } from "ui";

export type TEstimationTabKey = "YIELD" | "CONFRONTATION";

export interface IEstimationTabsContainerProps {
  initialTab?: TEstimationTabKey;
  yieldBadgeText: string;
  confrontationBadgeText: string;
  yieldTabContent: ReactNode;
  confrontationTabContent: ReactNode;
}

export function EstimationTabsContainer(props: IEstimationTabsContainerProps) {
  const [activeTab, setActiveTab] = useState<TEstimationTabKey>(props.initialTab ?? "YIELD");

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-3 rounded-2xl border border-louve-border bg-louve-surface p-2 shadow-card sm:grid-cols-2">
        <Button variant="tab" isActive={activeTab === "YIELD"} onClick={() => setActiveTab("YIELD")}>
          <div className="flex flex-col">
            <span className="font-medium text-sm tracking-tight">Rendement frais inclus</span>
            <span className={cn("text-[11px]", activeTab === "YIELD" ? "text-louve-blue-muted" : "text-louve-slate")}>
              Formule officielle &amp; simulateur avec frais fixes
            </span>
          </div>
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 font-medium text-xs",
              activeTab === "YIELD" ? "bg-louve-navy-light text-louve-cyan" : "bg-louve-blue-soft text-louve-blue",
            )}
          >
            <Percent size={12} />
            {props.yieldBadgeText}
          </span>
        </Button>

        <Button variant="tab" isActive={activeTab === "CONFRONTATION"} onClick={() => setActiveTab("CONFRONTATION")}>
          <div className="flex flex-col">
            <span className="font-medium text-sm tracking-tight">Estimation de la prochaine confrontation</span>
            <span
              className={cn(
                "text-[11px]",
                activeTab === "CONFRONTATION" ? "text-louve-blue-muted" : "text-louve-slate",
              )}
            >
              Prix d&apos;équilibre, volume échangeable &amp; courbe
            </span>
          </div>
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 font-medium text-xs",
              activeTab === "CONFRONTATION"
                ? "bg-louve-navy-light text-louve-cyan"
                : "bg-louve-blue-soft text-louve-blue",
            )}
          >
            <Activity size={12} />
            {props.confrontationBadgeText}
          </span>
        </Button>
      </div>

      {activeTab === "YIELD" ? props.yieldTabContent : props.confrontationTabContent}
    </div>
  );
}
