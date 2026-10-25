import { type IScpiWithMarketRelations, managementCompanySchema, scpiNameSchema, type TScpiName } from "my-zod";
import { db } from "./db";

export async function getScpiByNameQuery(name: TScpiName): Promise<IScpiWithMarketRelations | null> {
  const scpiRecord = await db.scpi.findUnique({
    where: { name },
    include: {
      orderBookEntries: {
        orderBy: [{ side: "asc" }, { rank: "asc" }],
      },
      confrontations: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!scpiRecord) {
    return null;
  }

  return {
    id: scpiRecord.id,
    name: scpiNameSchema.catch("PRIMOPIERRE").parse(scpiRecord.name),
    managementCompany: managementCompanySchema.catch("PRAEMIA_REIM").parse(scpiRecord.managementCompany),
    lastExecutionPrice: scpiRecord.lastExecutionPrice,
    lastBuyerPrice: scpiRecord.lastBuyerPrice,
    realizationValue: scpiRecord.realizationValue,
    capitalization: scpiRecord.capitalization,
    distributionRate: scpiRecord.distributionRate,
    financialOccupancyRate: scpiRecord.financialOccupancyRate,
    previousYearDividend: scpiRecord.previousYearDividend,
    dividendYear: scpiRecord.dividendYear,
    dividendSource: scpiRecord.dividendSource,
    transferCommissionRateHt: scpiRecord.transferCommissionRateHt,
    transferCommissionRateTtc: scpiRecord.transferCommissionRateTtc,
    registrationTaxRate: scpiRecord.registrationTaxRate,
    fixedFolderFeeHt: scpiRecord.fixedFolderFeeHt,
    fixedFolderFeeTtc: scpiRecord.fixedFolderFeeTtc,
    nextConfrontationDate: scpiRecord.nextConfrontationDate,
    orderDeadlineDate: scpiRecord.orderDeadlineDate,
    marketUpdatedAtLabel: scpiRecord.marketUpdatedAtLabel,
    scrapedAt: scpiRecord.scrapedAt,
    orderBookEntries: scpiRecord.orderBookEntries.map((entry) => ({
      id: entry.id,
      side: entry.side === "SELL" ? "SELL" : "BUY",
      rank: entry.rank,
      ordersCount: entry.ordersCount,
      partsCount: entry.partsCount,
      sellerPrice: entry.sellerPrice,
      buyerPrice: entry.buyerPrice,
    })),
    confrontations: scpiRecord.confrontations.map((confrontation) => ({
      id: confrontation.id,
      confrontationDate: confrontation.confrontationDate,
      exchangedParts: confrontation.exchangedParts,
      sellerPrice: confrontation.sellerPrice,
      buyerPrice: confrontation.buyerPrice,
      sortOrder: confrontation.sortOrder,
    })),
  };
}
