import { db } from "@lib/db";
import { getScpiByNameQuery } from "@lib/queries";
import type { IScpiScrapedMarketData, IScpiWithMarketRelations, TScpiName } from "my-zod";
import { scrapePrimopierre } from "./scrapePrimopierre";

type TScpiMarketScraper = () => Promise<IScpiScrapedMarketData>;

const SCPI_SCRAPERS_REGISTRY: Record<TScpiName, TScpiMarketScraper> = {
  PRIMOPIERRE: scrapePrimopierre,
};

export async function syncScpiMarketData(name: TScpiName = "PRIMOPIERRE"): Promise<IScpiWithMarketRelations> {
  const scraperFn = SCPI_SCRAPERS_REGISTRY[name];
  const scrapedData = await scraperFn();

  await db.$transaction(async (transaction) => {
    const upsertedScpi = await transaction.scpi.upsert({
      where: { name: scrapedData.name },
      create: {
        name: scrapedData.name,
        managementCompany: scrapedData.managementCompany,
        lastExecutionPrice: scrapedData.lastExecutionPrice,
        lastBuyerPrice: scrapedData.lastBuyerPrice,
        realizationValue: scrapedData.realizationValue,
        capitalization: scrapedData.capitalization,
        distributionRate: scrapedData.distributionRate,
        financialOccupancyRate: scrapedData.financialOccupancyRate,
        previousYearDividend: scrapedData.previousYearDividend,
        dividendYear: scrapedData.dividendYear,
        dividendSource: scrapedData.dividendSource,
        transferCommissionRateHt: scrapedData.transferCommissionRateHt,
        transferCommissionRateTtc: scrapedData.transferCommissionRateTtc,
        registrationTaxRate: scrapedData.registrationTaxRate,
        fixedFolderFeeHt: scrapedData.fixedFolderFeeHt,
        fixedFolderFeeTtc: scrapedData.fixedFolderFeeTtc,
        nextConfrontationDate: scrapedData.nextConfrontationDate,
        orderDeadlineDate: scrapedData.orderDeadlineDate,
        marketUpdatedAtLabel: scrapedData.marketUpdatedAtLabel,
        scrapedAt: new Date(),
      },
      update: {
        managementCompany: scrapedData.managementCompany,
        lastExecutionPrice: scrapedData.lastExecutionPrice,
        lastBuyerPrice: scrapedData.lastBuyerPrice,
        realizationValue: scrapedData.realizationValue,
        capitalization: scrapedData.capitalization,
        distributionRate: scrapedData.distributionRate,
        financialOccupancyRate: scrapedData.financialOccupancyRate,
        previousYearDividend: scrapedData.previousYearDividend,
        dividendYear: scrapedData.dividendYear,
        dividendSource: scrapedData.dividendSource,
        transferCommissionRateHt: scrapedData.transferCommissionRateHt,
        transferCommissionRateTtc: scrapedData.transferCommissionRateTtc,
        registrationTaxRate: scrapedData.registrationTaxRate,
        fixedFolderFeeHt: scrapedData.fixedFolderFeeHt,
        fixedFolderFeeTtc: scrapedData.fixedFolderFeeTtc,
        nextConfrontationDate: scrapedData.nextConfrontationDate,
        orderDeadlineDate: scrapedData.orderDeadlineDate,
        marketUpdatedAtLabel: scrapedData.marketUpdatedAtLabel,
        scrapedAt: new Date(),
      },
    });

    await transaction.orderBookEntry.deleteMany({
      where: { scpiId: upsertedScpi.id },
    });

    if (scrapedData.orderBookEntries.length > 0) {
      await transaction.orderBookEntry.createMany({
        data: scrapedData.orderBookEntries.map((entry) => ({
          scpiId: upsertedScpi.id,
          side: entry.side,
          rank: entry.rank,
          ordersCount: entry.ordersCount,
          partsCount: entry.partsCount,
          sellerPrice: entry.sellerPrice,
          buyerPrice: entry.buyerPrice,
        })),
      });
    }

    await transaction.confrontationHistory.deleteMany({
      where: { scpiId: upsertedScpi.id },
    });

    if (scrapedData.confrontations.length > 0) {
      await transaction.confrontationHistory.createMany({
        data: scrapedData.confrontations.map((confrontation) => ({
          scpiId: upsertedScpi.id,
          confrontationDate: confrontation.confrontationDate,
          exchangedParts: confrontation.exchangedParts,
          sellerPrice: confrontation.sellerPrice,
          buyerPrice: confrontation.buyerPrice,
          sortOrder: confrontation.sortOrder,
        })),
      });
    }
  });

  const persistedScpi = await getScpiByNameQuery(name);
  if (!persistedScpi) {
    throw new Error("Erreur lors de la synchronisation des données de marché de la SCPI.");
  }

  return persistedScpi;
}

export async function getOrSyncScpiMarketData(name: TScpiName = "PRIMOPIERRE"): Promise<IScpiWithMarketRelations> {
  const existingScpi = await getScpiByNameQuery(name);
  if (existingScpi) {
    return existingScpi;
  }

  return syncScpiMarketData(name);
}
