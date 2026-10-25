"use client";

import { cn } from "cn";
import { Button, Input } from "ui";
import { INTERVAL_PRESETS } from "./intervalPresets";

export interface IYieldIntervalControlBarProps {
  minPrice: number;
  maxPrice: number;
  onMinPriceChange: (value: number) => void;
  onMaxPriceChange: (value: number) => void;
}

export function YieldIntervalControlBar(props: IYieldIntervalControlBarProps) {
  const minPrice = props.minPrice;
  const maxPrice = props.maxPrice;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-1.5">
        {INTERVAL_PRESETS.map((preset) => {
          const isSelected = minPrice === preset.min && maxPrice === preset.max;
          return (
            <Button
              key={preset.id}
              variant={isSelected ? "primary" : "secondary"}
              size="none"
              onClick={() => {
                props.onMinPriceChange(preset.min);
                props.onMaxPriceChange(preset.max);
              }}
              className={cn(
                "rounded-lg px-2.5 py-1.5 text-xs",
                !isSelected && "border-louve-border bg-louve-surface text-louve-slate hover:border-louve-border-strong",
              )}
            >
              {preset.label}
            </Button>
          );
        })}
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span className="text-louve-slate">Intervalle net vendeur (€) :</span>
        <Input
          type="number"
          size="xs"
          min={5}
          max={maxPrice - 2}
          value={minPrice}
          onChange={(event) => props.onMinPriceChange(Math.max(5, Number.parseFloat(event.target.value) || 5))}
          className="w-16 px-2 py-1"
        />
        <span className="text-louve-slate">–</span>
        <Input
          type="number"
          size="xs"
          min={minPrice + 2}
          max={150}
          value={maxPrice}
          onChange={(event) =>
            props.onMaxPriceChange(Math.max(minPrice + 2, Number.parseFloat(event.target.value) || 40))
          }
          className="w-16 px-2 py-1"
        />
      </div>
    </div>
  );
}
