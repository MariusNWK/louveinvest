import { getOrSyncScpiMarketData } from "@utils/syncScpiMarketData";
import { formatDateTime } from "date";
import {
  ConfrontationHistorySection,
  MarketKpiGrid,
  OrderBookSection,
  ScpiHeroBanner,
  ScpiSourceFooter,
} from "my-components";
import { RefreshMarketButtonWrapper } from "../../wrappers/RefreshMarketButtonWrapper";
import { refreshPrimopierreMarketAction } from "./actions";

export const dynamic = "force-dynamic";

export interface IOpportunitiesPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function OpportunitiesPage(props: IOpportunitiesPageProps) {
  void props;

  const scpiData = await getOrSyncScpiMarketData("PRIMOPIERRE");

  return (
    <div className="flex flex-col gap-6">
      <ScpiHeroBanner
        scpi={scpiData}
        refreshActionSlot={
          <RefreshMarketButtonWrapper
            onRefresh={refreshPrimopierreMarketAction}
            managementCompany={scpiData.managementCompany}
          />
        }
      />

      <MarketKpiGrid scpi={scpiData} />

      <OrderBookSection
        entries={scpiData.orderBookEntries}
        managementCompany={scpiData.managementCompany}
        proportionalFeeRatePercent={scpiData.transferCommissionRateTtc + scpiData.registrationTaxRate}
      />

      <ConfrontationHistorySection confrontations={scpiData.confrontations} />

      <ScpiSourceFooter scpi={scpiData} lastSyncLabel={formatDateTime(scpiData.scrapedAt)} />
    </div>
  );
}
