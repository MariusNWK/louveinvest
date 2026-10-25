"use client";

import { cn } from "cn";
import { buildYieldCurvePoints, formatEuroPrice } from "my-functions";
import type { IScpiWithMarketRelations } from "my-zod";
import { useState } from "react";
import { BarChart2 } from "react-feather";
import { Badge, Button, CardTitle } from "ui";
import { YieldCurveBarsCanvas } from "./YieldCurveBarsCanvas";
import { YieldIntervalControlBar } from "./YieldIntervalControlBar";

export interface IYieldByExecutionPriceChartProps {
  scpi: IScpiWithMarketRelations;
  estimatedSellerPrice: number | null;
}

export function YieldByExecutionPriceChart(props: IYieldByExecutionPriceChartProps) {
  const scpi = props.scpi;
  const [minPrice, setMinPrice] = useState<number>(18);
  const [maxPrice, setMaxPrice] = useState<number>(36);
  const [showFixedFeesOverlay, setShowFixedFeesOverlay] = useState<boolean>(true);

  const curvePoints = buildYieldCurvePoints({
    scpi,
    minPrice,
    maxPrice,
    stepsCount: 11,
    estimatedSellerPrice: props.estimatedSellerPrice,
    partsCountForFixedFee: 50,
    fixedFolderFeeTtc: scpi.fixedFolderFeeTtc,
  });

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-louve-blue-border bg-louve-bg p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-louve-border border-b pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-louve-blue-soft text-louve-blue">
            <BarChart2 size={15} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle>Sensibilité du rendement selon le prix</CardTitle>
              <Badge variant="blue">Bonus — Intervalle paramétrable</Badge>
            </div>
            <p className="text-louve-slate text-xs">
              Base dividende {scpi.dividendYear} ({formatEuroPrice(scpi.previousYearDividend)} / part) par prix net
              vendeur.
            </p>
          </div>
        </div>
        <Button
          variant="chip"
          size="none"
          isActive={showFixedFeesOverlay}
          onClick={() => setShowFixedFeesOverlay((prev) => !prev)}
          className={cn(
            "rounded-xl px-3 py-1.5 text-xs",
            !showFixedFeesOverlay && "border-louve-border-strong bg-louve-surface",
          )}
        >
          {showFixedFeesOverlay
            ? `✓ Comparaison frais fixes (${formatEuroPrice(scpi.fixedFolderFeeTtc)} / 50 p.) active`
            : "+ Afficher impact frais fixes"}
        </Button>
      </div>
      <YieldIntervalControlBar
        minPrice={minPrice}
        maxPrice={maxPrice}
        onMinPriceChange={setMinPrice}
        onMaxPriceChange={setMaxPrice}
      />
      <YieldCurveBarsCanvas
        points={curvePoints}
        showFixedFeesOverlay={showFixedFeesOverlay}
        proportionalFeeRatePercent={scpi.transferCommissionRateTtc + scpi.registrationTaxRate}
        fixedFolderFeeTtc={scpi.fixedFolderFeeTtc}
      />
    </div>
  );
}
