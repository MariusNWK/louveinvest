import {
  calculateDiscountPercentage,
  calculateOrderBookSummary,
  formatEuroPrice,
  formatInteger,
  formatPercentage,
} from "my-functions";
import type { IScpiWithMarketRelations } from "my-zod";
import { Calendar, Layers, Percent, Tag } from "react-feather";
import { Badge, KpiCard } from "ui";

export interface IMarketKpiGridProps {
  scpi: IScpiWithMarketRelations;
}

export function MarketKpiGrid(props: IMarketKpiGridProps) {
  const scpi = props.scpi;
  const buyerDiscount = calculateDiscountPercentage(scpi.lastBuyerPrice, scpi.realizationValue);
  const sellerDiscount = calculateDiscountPercentage(scpi.lastExecutionPrice, scpi.realizationValue);
  const orderSummary = calculateOrderBookSummary(scpi.orderBookEntries);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        highlighted
        label="Dernier prix acquéreur"
        value={formatEuroPrice(scpi.lastBuyerPrice)}
        unit="/ part (frais inclus)"
        secondaryText={`Prix net vendeur : ${formatEuroPrice(scpi.lastExecutionPrice)}`}
        icon={<Tag size={16} />}
      />

      <KpiCard
        label="Décote vs Valeur de réalisation"
        value={buyerDiscount !== null ? formatPercentage(buyerDiscount) : "—"}
        secondaryText={
          scpi.realizationValue
            ? `Valeur de réalisation : ${formatEuroPrice(scpi.realizationValue)}`
            : "Valeur de réalisation non disponible"
        }
        badge={
          sellerDiscount !== null ? (
            <Badge variant="emerald">{formatPercentage(sellerDiscount)} net vendeur</Badge>
          ) : undefined
        }
        icon={<Percent size={16} />}
      />

      <KpiCard
        label="Prochaine confrontation"
        value={scpi.nextConfrontationDate?.split(" à ")[0] ?? "—"}
        unit={scpi.nextConfrontationDate?.includes(" à ") ? `à ${scpi.nextConfrontationDate.split(" à ")[1]}` : ""}
        secondaryText={
          scpi.orderDeadlineDate ? `Limite de réception : ${scpi.orderDeadlineDate}` : "Confrontation mensuelle"
        }
        icon={<Calendar size={16} />}
      />

      <KpiCard
        label="Profondeur du carnet (Top 5)"
        value={`${formatInteger(orderSummary.totalBuyParts)} / ${formatInteger(orderSummary.totalSellParts)}`}
        unit="parts (Achat / Vente)"
        secondaryText={
          orderSummary.lowestSellerPrice !== null
            ? `Vente la plus basse : ${formatEuroPrice(orderSummary.lowestSellerPrice)}`
            : undefined
        }
        icon={<Layers size={16} />}
      />
    </div>
  );
}
