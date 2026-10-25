import { cn } from "cn";
import { formatEuroPrice, formatExactPercentage } from "my-functions";
import type { IYieldCurveDataPoint } from "my-zod";

export interface IYieldCurveBarsCanvasProps {
  points: IYieldCurveDataPoint[];
  showFixedFeesOverlay: boolean;
  proportionalFeeRatePercent: number;
  fixedFolderFeeTtc: number;
}

export function YieldCurveBarsCanvas(props: IYieldCurveBarsCanvasProps) {
  const points = props.points;
  const maxYield = Math.max(...points.map((point) => point.yieldFeeIncludedPercent), 1);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-louve-border bg-louve-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-medium text-louve-navy">
          Courbe de rendement annuel brut en fonction du prix d&apos;exécution (net vendeur)
        </span>
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-louve-slate">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-xs bg-success-500" />
            Prix estimé confrontation
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-xs bg-louve-navy" />
            Dernier prix d&apos;exécution
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-xs bg-louve-blue" />
            Rendement frais inclus ({formatExactPercentage(props.proportionalFeeRatePercent)})
          </span>
          {props.showFixedFeesOverlay && (
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-xs bg-louve-blue-muted" />
              Avec frais fixes ({formatEuroPrice(props.fixedFolderFeeTtc)} / 50 p.)
            </span>
          )}
        </div>
      </div>

      <div className="overflow-x-auto pt-4 pb-1">
        <div className="grid min-w-[640px] grid-flow-col auto-cols-fr items-end gap-2">
          {points.map((point) => {
            const heightPercent = Math.max(Math.round((point.yieldFeeIncludedPercent / maxYield) * 100), 12);
            const fixedFeeHeightPercent = Math.max(Math.round((point.yieldWithFixedFeesPercent / maxYield) * 100), 10);
            const isEstimated = point.markerType === "ESTIMATED";
            const isLastExecution = point.markerType === "LAST_EXECUTION";

            return (
              <div key={point.sellerPrice} className="flex flex-col items-center gap-1.5">
                <span
                  className={cn(
                    "font-medium text-[10px]",
                    isEstimated ? "text-success-700" : isLastExecution ? "text-louve-navy" : "text-louve-blue",
                  )}
                >
                  {formatExactPercentage(point.yieldFeeIncludedPercent)}
                </span>

                <div
                  className={cn(
                    "flex h-36 w-full items-end justify-center gap-1 rounded-lg border px-1 py-2 transition-colors",
                    isEstimated
                      ? "border-success-300 bg-success-50/60"
                      : isLastExecution
                        ? "border-louve-navy-light/40 bg-louve-blue-soft/70"
                        : "border-louve-border/70 bg-louve-bg",
                  )}
                >
                  <div
                    title={`Prix net vendeur : ${formatEuroPrice(point.sellerPrice)} | Acquéreur : ${formatEuroPrice(point.buyerPrice)} | Rendement : ${formatExactPercentage(point.yieldFeeIncludedPercent)}`}
                    style={{ height: `${heightPercent}%` }}
                    className={cn(
                      "w-3 rounded-t-sm transition-all",
                      isEstimated ? "bg-success-500" : isLastExecution ? "bg-louve-navy" : "bg-louve-blue",
                    )}
                  />
                  {props.showFixedFeesOverlay && (
                    <div
                      title={`Rendement frais fixes inclus (50 parts) : ${formatExactPercentage(point.yieldWithFixedFeesPercent)}`}
                      style={{ height: `${fixedFeeHeightPercent}%` }}
                      className="w-2.5 rounded-t-sm bg-louve-blue-muted transition-all"
                    />
                  )}
                </div>

                <div className="flex flex-col items-center text-center">
                  <span
                    className={cn(
                      "font-medium text-[11px]",
                      isEstimated ? "text-success-700" : isLastExecution ? "text-louve-navy" : "text-louve-navy",
                    )}
                  >
                    {formatEuroPrice(point.sellerPrice)}
                  </span>
                  <span className="text-louve-slate text-[9px]">Acq. {formatEuroPrice(point.buyerPrice)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
