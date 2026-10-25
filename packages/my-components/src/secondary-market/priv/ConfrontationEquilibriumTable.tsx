import { cn } from "cn";
import { formatEuroPrice, formatExactPercentage, formatInteger } from "my-functions";
import type { IConfrontationPriceLevel } from "my-zod";
import { Badge, CardTitle } from "ui";

export interface IConfrontationEquilibriumTableProps {
  levels: IConfrontationPriceLevel[];
}

export function ConfrontationEquilibriumTable(props: IConfrontationEquilibriumTableProps) {
  const levels = props.levels;
  const maxCumulativeParts = Math.max(
    ...levels.map((level) => Math.max(level.cumulativeBuyParts, level.cumulativeSellParts)),
    1,
  );

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-louve-border bg-louve-bg/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <CardTitle>
            Formation du prix d&apos;équilibre par confrontation de l&apos;offre et de la demande cumulées
          </CardTitle>
          <p className="text-louve-slate text-xs">
            Pour chaque prix candidat P, le volume échangeable correspond à min(Demande cumulée ≥ P, Offre cumulée ≤ P).
          </p>
        </div>
        <Badge variant="blue">{levels.length} niveaux de prix analysés</Badge>
      </div>

      <div className="overflow-x-auto rounded-xl border border-louve-border bg-louve-surface">
        <table className="w-full text-left text-xs">
          <thead className="border-louve-border border-b bg-louve-bg text-louve-slate">
            <tr>
              <th className="px-3.5 py-3 font-medium">Prix net vendeur</th>
              <th className="px-3.5 py-3 text-right font-medium">Prix acquéreur</th>
              <th className="px-3.5 py-3 text-right font-medium">Demande cumulée (≥ P)</th>
              <th className="px-3.5 py-3 text-right font-medium">Offre cumulée (≤ P)</th>
              <th className="px-3.5 py-3 text-right font-medium">Parts échangeables</th>
              <th className="px-3.5 py-3 text-right font-medium">Reliquat non échangé</th>
              <th className="px-3.5 py-3 text-right font-medium">Rendement frais inclus</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-louve-border">
            {levels.map((level) => {
              const buyWidthPercent = Math.round((level.cumulativeBuyParts / maxCumulativeParts) * 100);
              const sellWidthPercent = Math.round((level.cumulativeSellParts / maxCumulativeParts) * 100);

              return (
                <tr
                  key={level.sellerPrice}
                  className={cn(
                    "transition-colors",
                    level.isOptimalEquilibrium
                      ? "bg-louve-blue-soft/85 font-medium"
                      : level.isTiedOnMaxVolume
                        ? "bg-warning-50/50"
                        : "hover:bg-louve-bg",
                  )}
                >
                  <td className="px-3.5 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-louve-navy">{formatEuroPrice(level.sellerPrice)}</span>
                      {level.isOptimalEquilibrium && <Badge variant="blue">Prix d&apos;équilibre retenu</Badge>}
                      {level.isTiedOnMaxVolume && <Badge variant="amber">Ex-æquo volume max (non retenu)</Badge>}
                    </div>
                  </td>
                  <td className="px-3.5 py-3 text-right text-louve-slate">{formatEuroPrice(level.buyerPrice)}</td>
                  <td className="px-3.5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-louve-blue-border/60 sm:block">
                        <div className="h-full rounded-full bg-louve-blue" style={{ width: `${buyWidthPercent}%` }} />
                      </div>
                      <span className="text-louve-navy">{formatInteger(level.cumulativeBuyParts)} p.</span>
                    </div>
                  </td>
                  <td className="px-3.5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-louve-border sm:block">
                        <div className="h-full rounded-full bg-louve-navy" style={{ width: `${sellWidthPercent}%` }} />
                      </div>
                      <span className="text-louve-navy">{formatInteger(level.cumulativeSellParts)} p.</span>
                    </div>
                  </td>
                  <td className="px-3.5 py-3 text-right">
                    <span
                      className={cn(
                        "inline-flex rounded-md px-2 py-0.5 font-medium",
                        level.isOptimalEquilibrium
                          ? "bg-louve-blue text-louve-surface"
                          : level.exchangeableParts > 0
                            ? "bg-success-50 text-success-700"
                            : "text-louve-slate",
                      )}
                    >
                      {formatInteger(level.exchangeableParts)} parts
                    </span>
                  </td>
                  <td className="px-3.5 py-3 text-right text-louve-slate">{formatInteger(level.unmatchedParts)} p.</td>
                  <td className="px-3.5 py-3 text-right font-medium text-louve-navy">
                    {formatExactPercentage(level.yieldFeeIncludedPercent)}
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
