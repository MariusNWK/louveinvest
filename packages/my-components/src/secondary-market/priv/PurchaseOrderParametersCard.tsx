"use client";

import { cn } from "cn";
import { useFormContext, useWatch } from "form/interfaces";
import { formatEuroPrice, formatExactPercentage } from "my-functions";
import type { IPurchasePricePreset, TPurchaseEmailFormData } from "my-zod";
import { Button, CardTitle, FormNumberInput } from "ui";

const PARTS_QUICK_PRESETS = [1, 10, 25, 50, 100];

export interface IPurchaseOrderParametersCardProps {
  pricePresets: IPurchasePricePreset[];
  proportionalFeeRatePercent: number;
}

export function PurchaseOrderParametersCard(props: IPurchaseOrderParametersCardProps) {
  const formMethods = useFormContext<TPurchaseEmailFormData>();
  const currentPartsCount = useWatch<TPurchaseEmailFormData, "partsCount">({ name: "partsCount" });
  const currentMaxPrice = useWatch<TPurchaseEmailFormData, "maxPricePerPart">({ name: "maxPricePerPart" });

  const safeMaxPrice = typeof currentMaxPrice === "number" && currentMaxPrice > 0 ? currentMaxPrice : 0;
  const buyerPricePerPart = safeMaxPrice * (1 + props.proportionalFeeRatePercent / 100);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-louve-border bg-louve-bg/60 p-4 sm:p-5">
      <div className="flex items-center gap-2.5 border-louve-border border-b pb-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-louve-blue-soft font-medium text-louve-blue text-xs">
          2
        </div>
        <div className="flex flex-col">
          <CardTitle>Paramètres de l&apos;ordre d&apos;achat</CardTitle>
          <p className="text-louve-slate text-xs">Volume de parts souhaité et prix maximum par part (net vendeur)</p>
        </div>
      </div>

      <FormNumberInput<TPurchaseEmailFormData>
        name="partsCount"
        label="Nombre de parts souhaité"
        placeholder="Ex. 10"
        required
        min={1}
        step={1}
        suffix="parts"
        description="Nombre entier ≥ 1"
        childrenAfterInput={
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            {PARTS_QUICK_PRESETS.map((presetCount) => (
              <Button
                key={presetCount}
                variant="chip"
                isActive={currentPartsCount === presetCount}
                onClick={() =>
                  formMethods.setValue("partsCount", presetCount, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                className={currentPartsCount !== presetCount ? "bg-louve-surface" : undefined}
              >
                {presetCount} {presetCount === 1 ? "part" : "parts"}
              </Button>
            ))}
          </div>
        }
      />

      <FormNumberInput<TPurchaseEmailFormData>
        name="maxPricePerPart"
        label="Prix maximum proposé par part (hors frais / net vendeur)"
        placeholder="Ex. 101.00"
        required
        min={0.5}
        step={0.01}
        suffix="€ / part"
        description={`Soit ${formatEuroPrice(buyerPricePerPart)} acquéreur (+${formatExactPercentage(props.proportionalFeeRatePercent)})`}
        childrenAfterInput={
          <div className="flex flex-col gap-1.5 pt-1">
            <span className="font-medium text-louve-slate text-[11px]">
              Aide à la saisie rapide (appliquer un prix de marché en un clic) :
            </span>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {props.pricePresets.map((preset) => {
                const isSelected = Math.abs(safeMaxPrice - preset.price) < 0.005;
                return (
                  <Button
                    key={preset.id}
                    variant="choice"
                    size="none"
                    isActive={isSelected}
                    onClick={() =>
                      formMethods.setValue("maxPricePerPart", preset.price, {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }
                    className="flex flex-col items-start gap-0.5 rounded-xl px-3 py-2 text-left"
                  >
                    <span className="font-medium text-louve-navy text-xs">{formatEuroPrice(preset.price)}</span>
                    <span
                      className={cn("font-medium text-[11px]", isSelected ? "text-louve-blue" : "text-louve-slate")}
                    >
                      {preset.label}
                    </span>
                    <span className="text-louve-slate-mid text-[10px]">{preset.sublabel}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        }
      />
    </div>
  );
}
