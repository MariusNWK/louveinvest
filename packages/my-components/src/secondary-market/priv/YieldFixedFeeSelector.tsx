"use client";

import { formatEuroPrice } from "my-functions";
import { Button, FieldLabel, Input } from "ui";

export interface IYieldFixedFeeSelectorProps {
  fixedFolderFeeTtc: number;
  defaultFolderFeeTtc: number;
  mandateFolderFeeTtc: number;
  onFixedFolderFeeChange: (value: number) => void;
}

export function YieldFixedFeeSelector(props: IYieldFixedFeeSelectorProps) {
  const fixedFeePresets = [
    { label: `${formatEuroPrice(props.defaultFolderFeeTtc)} TTC (BTI 2T 2026)`, value: props.defaultFolderFeeTtc },
    {
      label: `${formatEuroPrice(props.mandateFolderFeeTtc)} TTC (${formatEuroPrice(props.mandateFolderFeeTtc / 1.2)} HT - Mandat d'achat)`,
      value: props.mandateFolderFeeTtc,
    },
    { label: "0 € (Confrontation stricte hors gré à gré)", value: 0 },
  ];

  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel htmlFor="sim-fixed-fee-input">
        Forfait de frais fixes par dossier (sélecteur ou saisie libre TTC)
      </FieldLabel>
      <div className="flex flex-col gap-1.5">
        {fixedFeePresets.map((preset) => (
          <Button
            key={preset.label}
            variant="chip"
            size="none"
            isActive={props.fixedFolderFeeTtc === preset.value}
            onClick={() => props.onFixedFolderFeeChange(preset.value)}
            className="flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-left text-[11px]"
          >
            <span>{preset.label}</span>
            <span>{formatEuroPrice(preset.value)}</span>
          </Button>
        ))}
      </div>
      <div className="pt-1">
        <Input
          id="sim-fixed-fee-input"
          type="number"
          size="sm"
          min={0}
          step={1}
          value={props.fixedFolderFeeTtc}
          onChange={(event) => props.onFixedFolderFeeChange(Math.max(0, Number.parseFloat(event.target.value) || 0))}
          className="pr-24"
          suffix="€ TTC libre"
        />
      </div>
    </div>
  );
}
