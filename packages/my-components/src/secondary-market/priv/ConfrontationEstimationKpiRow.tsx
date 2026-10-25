import { formatEuroPrice, formatExactPercentage, formatInteger } from "my-functions";
import type { IConfrontationEstimationResult, IScpiWithMarketRelations } from "my-zod";
import { Activity, CheckCircle, Layers, TrendingUp } from "react-feather";
import { Badge, KpiCard } from "ui";

export interface IConfrontationEstimationKpiRowProps {
  scpi: IScpiWithMarketRelations;
  estimation: IConfrontationEstimationResult;
}

const tieBreakerLabelRecord: Record<IConfrontationEstimationResult["tieBreakerApplied"], string> = {
  UNIQUE_MAX_VOLUME: "Critère 1 : Volume maximal unique",
  MIN_IMBALANCE: "Critère 2 : Reliquat non échangé minimal",
  CLOSEST_TO_LAST_PRICE: "Critère 3 : Proximité dernier prix",
  NO_CROSSING: "Aucun croisement d'ordres",
};

export function ConfrontationEstimationKpiRow(props: IConfrontationEstimationKpiRowProps) {
  const scpi = props.scpi;
  const estimation = props.estimation;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        highlighted
        label="Prix d'exécution estimé"
        value={estimation.estimatedSellerPrice !== null ? formatEuroPrice(estimation.estimatedSellerPrice) : "—"}
        unit="/ part (net vendeur)"
        secondaryText={
          estimation.estimatedBuyerPrice !== null
            ? `Prix acquéreur frais inclus : ${formatEuroPrice(estimation.estimatedBuyerPrice)}`
            : "Aucune limite compatible"
        }
        badge={
          estimation.priceEvolutionVsLastPercent !== null ? (
            <Badge variant="cyan">
              {formatExactPercentage(estimation.priceEvolutionVsLastPercent, true)} vs dernier prix
            </Badge>
          ) : undefined
        }
        icon={<Activity size={16} />}
      />

      <KpiCard
        label="Volume échangeable estimé"
        value={formatInteger(estimation.estimatedExchangedParts)}
        unit="parts échangées"
        secondaryText={`Montant acquéreur : ${formatEuroPrice(estimation.estimatedTotalBuyerVolumeEuro)}`}
        badge={<Badge variant="blue">Net vendeur : {formatEuroPrice(estimation.estimatedTotalSellerVolumeEuro)}</Badge>}
        icon={<Layers size={16} />}
      />

      <KpiCard
        label="Rendement au prix estimé"
        value={
          estimation.estimatedYieldFeeIncludedPercent !== null
            ? formatExactPercentage(estimation.estimatedYieldFeeIncludedPercent)
            : "—"
        }
        unit="brut / an (frais inclus)"
        secondaryText={`Base dividende ${scpi.dividendYear} (${formatEuroPrice(scpi.previousYearDividend)} / part)`}
        badge={
          <Badge variant="emerald">
            Frais {formatExactPercentage(scpi.transferCommissionRateTtc + scpi.registrationTaxRate)} inclus
          </Badge>
        }
        icon={<TrendingUp size={16} />}
      />

      <KpiCard
        label="Règle de fixing appliquée"
        value={`${formatInteger(estimation.unmatchedImbalanceParts)} parts`}
        unit="de déséquilibre résiduel"
        secondaryText={tieBreakerLabelRecord[estimation.tieBreakerApplied]}
        badge={<Badge variant="slate">Séance du {scpi.nextConfrontationDate?.split(" à ")[0] ?? "mois"}</Badge>}
        icon={<CheckCircle size={16} />}
      />
    </div>
  );
}
