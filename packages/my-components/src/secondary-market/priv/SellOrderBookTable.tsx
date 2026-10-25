import { formatEuroPrice, formatInteger } from "my-functions";
import type { IOrderBookEntryItem } from "my-zod";
import { Badge, CardTitle } from "ui";

export interface ISellOrderBookTableProps {
  entries: IOrderBookEntryItem[];
  totalParts: number;
  totalOrders: number;
  proportionalFeeRatePercent?: number;
}

export function SellOrderBookTable(props: ISellOrderBookTableProps) {
  const maxParts = Math.max(...props.entries.map((entry) => entry.partsCount), 1);
  const feeMultiplier = 1 + (props.proportionalFeeRatePercent ?? 9.8) / 100;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-louve-border bg-louve-bg/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-louve-navy" />
          <CardTitle>Les 5 ordres de vente les plus bas</CardTitle>
        </div>
        <Badge variant="slate">
          {formatInteger(props.totalParts)} parts ({props.totalOrders} ordres)
        </Badge>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-louve-border border-b text-louve-slate">
              <th className="py-2.5 pr-2 font-medium">Ordres</th>
              <th className="px-2 py-2.5 text-right font-medium">Parts</th>
              <th className="px-2 py-2.5 text-right font-medium">Prix net vendeur</th>
              <th className="py-2.5 pl-2 text-right font-medium">Coût acquéreur</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-louve-border/70">
            {props.entries.map((entry) => {
              const widthPercent = Math.max(Math.round((entry.partsCount / maxParts) * 100), 6);
              const calculatedBuyerPrice = entry.sellerPrice * feeMultiplier;
              return (
                <tr key={entry.id} className="transition-colors hover:bg-louve-surface">
                  <td className="py-2.5 pr-2 font-medium text-louve-navy">{entry.ordersCount}</td>
                  <td className="px-2 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="hidden h-1.5 w-14 overflow-hidden rounded-full bg-louve-border sm:block">
                        <div className="h-full rounded-full bg-louve-navy" style={{ width: `${widthPercent}%` }} />
                      </div>
                      <span className="font-medium text-louve-navy">{formatInteger(entry.partsCount)}</span>
                    </div>
                  </td>
                  <td className="px-2 py-2.5 text-right font-medium text-louve-navy">
                    {formatEuroPrice(entry.sellerPrice)}
                  </td>
                  <td className="py-2.5 pl-2 text-right font-medium text-louve-blue">
                    {formatEuroPrice(calculatedBuyerPrice)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
