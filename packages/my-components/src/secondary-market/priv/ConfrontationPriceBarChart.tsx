import { formatEuroPrice, formatInteger } from "my-functions";
import type { IConfrontationHistoryItem } from "my-zod";

export interface IConfrontationPriceBarChartProps {
  confrontations: IConfrontationHistoryItem[];
}

export function ConfrontationPriceBarChart(props: IConfrontationPriceBarChartProps) {
  const chronologicalItems = [...props.confrontations].reverse();
  const maxBuyerPrice = Math.max(...chronologicalItems.map((item) => item.buyerPrice), 1);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-louve-border bg-louve-bg/60 p-4">
      <div className="flex items-center justify-between">
        <span className="font-medium text-louve-navy text-xs">
          Évolution du prix d&apos;exécution (acquéreur &amp; net vendeur)
        </span>
        <div className="flex items-center gap-3 text-[11px] text-louve-slate">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-xs bg-louve-blue" />
            Prix acquéreur
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-xs bg-louve-navy" />
            Prix net vendeur
          </span>
        </div>
      </div>

      <div className="overflow-x-auto pt-4">
        <div className="grid min-w-[480px] grid-flow-col auto-cols-fr items-end gap-2">
          {chronologicalItems.map((item) => {
            const buyerHeightPercent = Math.max(Math.round((item.buyerPrice / maxBuyerPrice) * 100), 15);
            const sellerHeightPercent = Math.max(Math.round((item.sellerPrice / maxBuyerPrice) * 100), 12);
            const shortDate = item.confrontationDate.slice(0, 5);

            return (
              <div key={item.id} className="flex flex-col items-center gap-2">
                <span className="font-medium text-louve-navy text-[11px]">{formatEuroPrice(item.buyerPrice)}</span>
                <div className="flex h-28 w-full items-end justify-center gap-1 rounded-lg border border-louve-border/60 bg-louve-surface px-1.5 py-2">
                  <div
                    title={`Prix acquéreur : ${formatEuroPrice(item.buyerPrice)}`}
                    style={{ height: `${buyerHeightPercent}%` }}
                    className="w-3 rounded-t-sm bg-louve-blue transition-all"
                  />
                  <div
                    title={`Prix vendeur : ${formatEuroPrice(item.sellerPrice)}`}
                    style={{ height: `${sellerHeightPercent}%` }}
                    className="w-3 rounded-t-sm bg-louve-navy transition-all"
                  />
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-medium text-louve-navy text-xs">{shortDate}</span>
                  <span className="text-louve-slate text-[10px]">{formatInteger(item.exchangedParts)} p.</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
