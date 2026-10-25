import { formatEuroPrice, formatInteger } from "my-functions";
import type { IConfrontationHistoryItem } from "my-zod";

export interface IConfrontationHistoryTableProps {
  confrontations: IConfrontationHistoryItem[];
}

export function ConfrontationHistoryTable(props: IConfrontationHistoryTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-louve-border">
      <table className="w-full text-left text-xs">
        <thead className="bg-louve-bg text-louve-slate">
          <tr className="border-louve-border border-b">
            <th className="px-4 py-3 font-medium">Date de confrontation</th>
            <th className="px-4 py-3 text-right font-medium">Parts échangées</th>
            <th className="px-4 py-3 text-right font-medium">Prix net vendeur</th>
            <th className="px-4 py-3 text-right font-medium">Prix acquéreur (frais inclus)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-louve-border bg-louve-surface">
          {props.confrontations.map((confrontation, index) => (
            <tr key={confrontation.id} className="transition-colors hover:bg-louve-bg">
              <td className="px-4 py-3 font-medium text-louve-navy">
                <div className="flex items-center gap-2">
                  <span>{confrontation.confrontationDate}</span>
                  {index === 0 && (
                    <span className="rounded-md bg-louve-blue-soft px-1.5 py-0.5 font-medium text-louve-blue text-[10px]">
                      Dernière séance
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-right font-medium text-louve-navy">
                {formatInteger(confrontation.exchangedParts)}
              </td>
              <td className="px-4 py-3 text-right text-louve-slate">{formatEuroPrice(confrontation.sellerPrice)}</td>
              <td className="px-4 py-3 text-right font-medium text-louve-blue">
                {formatEuroPrice(confrontation.buyerPrice)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
