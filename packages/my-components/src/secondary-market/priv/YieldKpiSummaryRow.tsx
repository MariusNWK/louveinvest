import { formatEuroPrice, formatExactPercentage } from "my-functions";
import type { IScpiWithMarketRelations, IYieldBreakdownMetrics } from "my-zod";
import { Award, DollarSign, Percent } from "react-feather";
import { Badge, KpiCard } from "ui";

export interface IYieldKpiSummaryRowProps {
  scpi: IScpiWithMarketRelations;
  metrics: IYieldBreakdownMetrics;
}

export function YieldKpiSummaryRow(props: IYieldKpiSummaryRowProps) {
  const scpi = props.scpi;
  const metrics = props.metrics;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <KpiCard
        highlighted
        label="Rendement frais inclus"
        value={formatExactPercentage(metrics.yieldFeeIncludedPercent)}
        unit="brut / an (hors frais fixes)"
        secondaryText={`Rendement sur prix net vendeur : ${formatExactPercentage(metrics.netSellerYieldPercent)}`}
        badge={<Badge variant="cyan">Indicateur cible</Badge>}
        icon={<Percent size={16} />}
      />

      <KpiCard
        label={`Dividende annuel brut (${scpi.dividendYear})`}
        value={formatEuroPrice(metrics.annualGrossDividendPerPart)}
        unit="/ part en pleine propriété"
        secondaryText={
          scpi.distributionRate
            ? `Taux de distribution officiel ${scpi.dividendYear} : ${formatExactPercentage(scpi.distributionRate)}`
            : `Exercice civil ${scpi.dividendYear} complet`
        }
        badge={<Badge variant="blue">Année {scpi.dividendYear}</Badge>}
        icon={<Award size={16} />}
      />

      <KpiCard
        label="Prix d'acquisition de référence"
        value={formatEuroPrice(metrics.buyerPricePerPart)}
        unit="/ part (frais proportionnels inclus)"
        secondaryText={`Exécution : ${formatEuroPrice(metrics.executionPrice)} + ${formatExactPercentage(metrics.totalProportionalFeeRate)} de frais`}
        badge={<Badge variant="emerald">+{formatEuroPrice(metrics.totalProportionalFeesPerPart)} / part</Badge>}
        icon={<DollarSign size={16} />}
      />
    </div>
  );
}
