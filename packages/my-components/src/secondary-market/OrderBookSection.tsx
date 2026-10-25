import { calculateOrderBookSummary, formatEuroPrice } from "my-functions";
import { type IOrderBookEntryItem, managementCompanyToLabel, type TManagementCompany } from "my-zod";
import { SurfaceCard } from "ui";
import { BuyOrderBookTable } from "./priv/BuyOrderBookTable";
import { SellOrderBookTable } from "./priv/SellOrderBookTable";

export interface IOrderBookSectionProps {
  entries: IOrderBookEntryItem[];
  managementCompany?: TManagementCompany;
  proportionalFeeRatePercent?: number;
}

export function OrderBookSection(props: IOrderBookSectionProps) {
  const managementCompanyLabel = managementCompanyToLabel[props.managementCompany ?? "PRAEMIA_REIM"];
  const buyEntries = props.entries
    .filter((entry) => entry.side === "BUY")
    .sort((first, second) => first.rank - second.rank);
  const sellEntries = props.entries
    .filter((entry) => entry.side === "SELL")
    .sort((first, second) => first.rank - second.rank);

  const summary = calculateOrderBookSummary(props.entries);
  const hasCrossingOrders =
    summary.highestBuySellerPrice !== null &&
    summary.lowestSellerPrice !== null &&
    summary.highestBuySellerPrice >= summary.lowestSellerPrice;

  return (
    <SurfaceCard
      title="Carnet d'ordres actuel"
      subtitle={`Les 5 meilleures limites d'achat et de vente enregistrées sur le registre de ${managementCompanyLabel}`}
    >
      {hasCrossingOrders && summary.highestBuySellerPrice !== null && summary.lowestSellerPrice !== null && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-louve-blue-border bg-louve-blue-soft/70 px-4 py-3 text-xs">
          <span className="text-louve-navy">
            <strong>Opportunité de croisement détectée :</strong> des ordres d&apos;achat (jusqu&apos;à{" "}
            <strong>{formatEuroPrice(summary.highestBuySellerPrice)}</strong> net vendeur) sont supérieurs aux ordres de
            vente les plus bas (dès <strong>{formatEuroPrice(summary.lowestSellerPrice)}</strong> net vendeur).
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <BuyOrderBookTable
          entries={buyEntries}
          totalParts={summary.totalBuyParts}
          totalOrders={summary.totalBuyOrders}
        />
        <SellOrderBookTable
          entries={sellEntries}
          totalParts={summary.totalSellParts}
          totalOrders={summary.totalSellOrders}
          proportionalFeeRatePercent={props.proportionalFeeRatePercent}
        />
      </div>
    </SurfaceCard>
  );
}
