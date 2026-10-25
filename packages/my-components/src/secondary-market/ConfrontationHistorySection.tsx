import { calculateDiscountPercentage, formatInteger, formatPercentage } from "my-functions";
import type { IConfrontationHistoryItem } from "my-zod";
import { Badge, SurfaceCard } from "ui";
import { ConfrontationHistoryTable } from "./priv/ConfrontationHistoryTable";
import { ConfrontationPriceBarChart } from "./priv/ConfrontationPriceBarChart";

export interface IConfrontationHistorySectionProps {
  confrontations: IConfrontationHistoryItem[];
}

export function ConfrontationHistorySection(props: IConfrontationHistorySectionProps) {
  const confrontations = props.confrontations;
  const totalExchangedParts = confrontations.reduce((accumulator, item) => accumulator + item.exchangedParts, 0);

  const latestConfrontation = confrontations[0];
  const oldestConfrontation = confrontations[confrontations.length - 1];
  const priceEvolutionPercent =
    latestConfrontation && oldestConfrontation
      ? calculateDiscountPercentage(latestConfrontation.sellerPrice, oldestConfrontation.sellerPrice)
      : null;

  return (
    <SurfaceCard
      title="Historique des confrontations et des prix"
      subtitle={
        oldestConfrontation
          ? `Résultats des séances périodiques publiées depuis le ${oldestConfrontation.confrontationDate}`
          : "Résultats des dernières séances de confrontation publiées"
      }
      headerRight={
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="slate">{formatInteger(totalExchangedParts)} parts échangées au total</Badge>
          {priceEvolutionPercent !== null && oldestConfrontation && (
            <Badge variant="blue">
              {formatPercentage(priceEvolutionPercent)} depuis le {oldestConfrontation.confrontationDate}
            </Badge>
          )}
        </div>
      }
    >
      {confrontations.length > 0 ? (
        <div className="flex flex-col gap-5">
          <ConfrontationPriceBarChart confrontations={confrontations} />
          <ConfrontationHistoryTable confrontations={confrontations} />
        </div>
      ) : (
        <p className="text-louve-slate text-sm">Aucun historique de confrontation disponible.</p>
      )}
    </SurfaceCard>
  );
}
