import { calculateOrderBookSummary, calculateYieldBreakdown, formatExactPercentage } from "my-functions";
import type { IScpiWithMarketRelations } from "my-zod";
import { Badge, SurfaceCard } from "ui";
import { YieldFixedFeesSimulator } from "./priv/YieldFixedFeesSimulator";
import { YieldFormulaBreakdownCard } from "./priv/YieldFormulaBreakdownCard";
import { YieldKpiSummaryRow } from "./priv/YieldKpiSummaryRow";

export interface IYieldFeeIncludedSectionProps {
  scpi: IScpiWithMarketRelations;
}

export function YieldFeeIncludedSection(props: IYieldFeeIncludedSectionProps) {
  const scpi = props.scpi;
  const yieldMetrics = calculateYieldBreakdown(scpi);
  const orderSummary = calculateOrderBookSummary(scpi.orderBookEntries);

  return (
    <SurfaceCard
      title="Consulter le rendement frais inclus"
      subtitle={`Dividende annuel brut ${scpi.dividendYear} rapporté au dernier prix d'exécution constaté augmenté des frais d'acquisition (commission de cession + droits d'enregistrement)`}
      headerRight={
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="blue">
            Frais proportionnels : +{formatExactPercentage(yieldMetrics.totalProportionalFeeRate)} TTC
          </Badge>
          <Badge variant="emerald">
            Rendement frais inclus : {formatExactPercentage(yieldMetrics.yieldFeeIncludedPercent)}
          </Badge>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        <YieldKpiSummaryRow scpi={scpi} metrics={yieldMetrics} />
        <YieldFormulaBreakdownCard scpi={scpi} metrics={yieldMetrics} />
        <YieldFixedFeesSimulator scpi={scpi} lowestSellPrice={orderSummary.lowestSellerPrice} />
      </div>
    </SurfaceCard>
  );
}
