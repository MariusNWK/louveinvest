"use client";

import { formatEuroPrice } from "my-functions";
import { Button, FieldLabel, Input } from "ui";
import { YieldFixedFeeSelector } from "./YieldFixedFeeSelector";

const PARTS_PRESETS = [1, 10, 50, 100, 250];

export interface IYieldSimulatorFormControlsProps {
  acquisitionPricePerPart: number;
  onAcquisitionPriceChange: (value: number) => void;
  partsCount: number;
  onPartsCountChange: (value: number) => void;
  fixedFolderFeeTtc: number;
  onFixedFolderFeeChange: (value: number) => void;
  defaultFolderFeeTtc: number;
  mandateFolderFeeTtc: number;
  lastExecutionPrice: number;
  lowestSellPrice: number | null;
}

export function YieldSimulatorFormControls(props: IYieldSimulatorFormControlsProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-louve-border bg-louve-surface p-4 lg:col-span-5">
      <div className="flex flex-col gap-1.5">
        <FieldLabel htmlFor="sim-price-input">Prix d&apos;acquisition souhaité par part (hors frais)</FieldLabel>
        <div>
          <Input
            id="sim-price-input"
            type="number"
            size="md"
            min={0.5}
            step={0.01}
            value={props.acquisitionPricePerPart}
            onChange={(event) => props.onAcquisitionPriceChange(Number.parseFloat(event.target.value) || 0)}
            className="pr-14"
            suffix="€ / part"
          />
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          <Button
            variant="chip"
            isActive={props.acquisitionPricePerPart === props.lastExecutionPrice}
            onClick={() => props.onAcquisitionPriceChange(props.lastExecutionPrice)}
          >
            Dernier exécuté ({formatEuroPrice(props.lastExecutionPrice)})
          </Button>
          {props.lowestSellPrice !== null && (
            <Button
              variant="chip"
              isActive={props.acquisitionPricePerPart === props.lowestSellPrice}
              onClick={() => props.onAcquisitionPriceChange(props.lowestSellPrice ?? props.lastExecutionPrice)}
            >
              Meilleure vente ({formatEuroPrice(props.lowestSellPrice)})
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <FieldLabel htmlFor="sim-parts-input">Nombre de parts souhaité</FieldLabel>
        <Input
          id="sim-parts-input"
          type="number"
          size="md"
          min={1}
          step={1}
          value={props.partsCount}
          onChange={(event) => props.onPartsCountChange(Math.max(1, Number.parseInt(event.target.value, 10) || 1))}
        />
        <div className="flex flex-wrap gap-1.5 pt-1">
          {PARTS_PRESETS.map((presetParts) => (
            <Button
              key={presetParts}
              variant="chip"
              isActive={props.partsCount === presetParts}
              onClick={() => props.onPartsCountChange(presetParts)}
            >
              {presetParts} {presetParts === 1 ? "part" : "parts"}
            </Button>
          ))}
        </div>
      </div>

      <YieldFixedFeeSelector
        fixedFolderFeeTtc={props.fixedFolderFeeTtc}
        defaultFolderFeeTtc={props.defaultFolderFeeTtc}
        mandateFolderFeeTtc={props.mandateFolderFeeTtc}
        onFixedFolderFeeChange={props.onFixedFolderFeeChange}
      />
    </div>
  );
}
