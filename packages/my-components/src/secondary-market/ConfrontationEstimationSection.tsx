import { estimateNextConfrontation, formatEuroPrice, formatInteger } from "my-functions";
import type { IScpiWithMarketRelations } from "my-zod";
import { Badge, SurfaceCard } from "ui";
import { ConfrontationEquilibriumTable } from "./priv/ConfrontationEquilibriumTable";
import { ConfrontationEstimationKpiRow } from "./priv/ConfrontationEstimationKpiRow";
import { ConfrontationHypothesesCard } from "./priv/ConfrontationHypothesesCard";
import { YieldByExecutionPriceChart } from "./priv/YieldByExecutionPriceChart";

export interface IConfrontationEstimationSectionProps {
  scpi: IScpiWithMarketRelations;
}

export function ConfrontationEstimationSection(props: IConfrontationEstimationSectionProps) {
  const scpi = props.scpi;
  const estimation = estimateNextConfrontation(scpi);

  return (
    <SurfaceCard
      title="Consulter une estimation de la prochaine confrontation"
      subtitle="Simulation du prix d'équilibre maximisant le volume échangé à partir des 5 meilleures limites d'achat et de vente publiées"
      headerRight={
        <div className="flex flex-wrap items-center gap-2">
          {estimation.hasCrossing && estimation.estimatedSellerPrice !== null ? (
            <>
              <Badge variant="emerald">{formatInteger(estimation.estimatedExchangedParts)} parts échangeables</Badge>
              <Badge variant="blue">Prix d&apos;équilibre : {formatEuroPrice(estimation.estimatedSellerPrice)}</Badge>
            </>
          ) : (
            <Badge variant="amber">Aucun croisement d&apos;ordres actuel</Badge>
          )}
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        <ConfrontationEstimationKpiRow scpi={scpi} estimation={estimation} />
        <ConfrontationEquilibriumTable levels={estimation.levels} />
        <YieldByExecutionPriceChart scpi={scpi} estimatedSellerPrice={estimation.estimatedSellerPrice} />
        <ConfrontationHypothesesCard scpi={scpi} />
      </div>
    </SurfaceCard>
  );
}
