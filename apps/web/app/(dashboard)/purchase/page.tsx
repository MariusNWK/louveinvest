import { getOrSyncScpiMarketData } from "@utils/syncScpiMarketData";
import { formatDateTime } from "date";
import { ScpiHeroBanner, ScpiSourceFooter } from "my-components";
import { PurchaseEmailSectionWrapper } from "../../../wrappers/PurchaseEmailSectionWrapper";
import { RefreshMarketButtonWrapper } from "../../../wrappers/RefreshMarketButtonWrapper";
import { refreshPrimopierreMarketAction } from "../actions";

export const dynamic = "force-dynamic";

export interface IPurchasePageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PurchasePage(props: IPurchasePageProps) {
  const resolvedSearchParams = props.searchParams ? await props.searchParams : {};
  const rawPriceParam =
    typeof resolvedSearchParams.price === "string" ? Number.parseFloat(resolvedSearchParams.price) : Number.NaN;
  const rawPartsParam =
    typeof resolvedSearchParams.parts === "string" ? Number.parseInt(resolvedSearchParams.parts, 10) : Number.NaN;

  const initialMaxPricePerPart = !Number.isNaN(rawPriceParam) && rawPriceParam > 0 ? rawPriceParam : undefined;
  const initialPartsCount = !Number.isNaN(rawPartsParam) && rawPartsParam >= 1 ? rawPartsParam : undefined;

  const scpiData = await getOrSyncScpiMarketData("PRIMOPIERRE");

  return (
    <div className="flex flex-col gap-6">
      <ScpiHeroBanner
        scpi={scpiData}
        title="Préparer un email d'achat à la société de gestion"
        refreshActionSlot={
          <RefreshMarketButtonWrapper
            onRefresh={refreshPrimopierreMarketAction}
            managementCompany={scpiData.managementCompany}
          />
        }
      />

      <PurchaseEmailSectionWrapper
        scpi={scpiData}
        initialMaxPricePerPart={initialMaxPricePerPart}
        initialPartsCount={initialPartsCount}
      />

      <ScpiSourceFooter scpi={scpiData} lastSyncLabel={formatDateTime(scpiData.scrapedAt)} />
    </div>
  );
}
