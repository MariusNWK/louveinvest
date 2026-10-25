import { getOrSyncScpiMarketData } from "@utils/syncScpiMarketData";
import { formatDateTime } from "date";
import {
  ConfrontationEstimationSection,
  EstimationTabsContainer,
  ScpiHeroBanner,
  ScpiSourceFooter,
  YieldFeeIncludedSection,
} from "my-components";
import {
  calculateYieldBreakdown,
  estimateNextConfrontation,
  formatEuroPrice,
  formatExactPercentage,
  formatInteger,
} from "my-functions";
import { RefreshMarketButtonWrapper } from "../../../wrappers/RefreshMarketButtonWrapper";
import { refreshPrimopierreMarketAction } from "../actions";

export const dynamic = "force-dynamic";

export interface IEstimationPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function EstimationPage(props: IEstimationPageProps) {
  const resolvedSearchParams = props.searchParams ? await props.searchParams : {};
  const tabParam = resolvedSearchParams.tab;
  const initialTab = tabParam === "confrontation" ? "CONFRONTATION" : "YIELD";

  const scpiData = await getOrSyncScpiMarketData("PRIMOPIERRE");

  const yieldMetrics = calculateYieldBreakdown(scpiData);
  const confrontationEstimation = estimateNextConfrontation(scpiData);

  const yieldBadgeText = formatExactPercentage(yieldMetrics.yieldFeeIncludedPercent);
  const confrontationBadgeText =
    confrontationEstimation.estimatedSellerPrice !== null
      ? `${formatEuroPrice(confrontationEstimation.estimatedSellerPrice)} · ${formatInteger(confrontationEstimation.estimatedExchangedParts)} p.`
      : "Aucun croisement";

  return (
    <div className="flex flex-col gap-6">
      <ScpiHeroBanner
        scpi={scpiData}
        title="Rendement & Estimation de confrontation"
        refreshActionSlot={
          <RefreshMarketButtonWrapper
            onRefresh={refreshPrimopierreMarketAction}
            managementCompany={scpiData.managementCompany}
          />
        }
      />

      <EstimationTabsContainer
        initialTab={initialTab}
        yieldBadgeText={yieldBadgeText}
        confrontationBadgeText={confrontationBadgeText}
        yieldTabContent={<YieldFeeIncludedSection scpi={scpiData} />}
        confrontationTabContent={<ConfrontationEstimationSection scpi={scpiData} />}
      />

      <ScpiSourceFooter scpi={scpiData} lastSyncLabel={formatDateTime(scpiData.scrapedAt)} />
    </div>
  );
}
