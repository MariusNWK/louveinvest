import type { ReactNode } from "react";
import { z } from "zod";

export interface ILinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  id?: string;
  target?: string;
}

export type TSnackbarType = "error" | "success" | "info";

export type TResultSuccess<T = unknown> = T & {
  success: string;
  error?: undefined;
  redirectTo?: string;
};

export type TResult<T = unknown> =
  | TResultSuccess<T>
  | { error: string; success?: undefined; redirectTo?: string }
  | undefined;

export const orderSideSchema = z.enum(["BUY", "SELL"]);
export type TOrderSide = z.infer<typeof orderSideSchema>;

export interface ISelectOption<TValue extends string = string> {
  label: string;
  value: TValue;
}

export const managementCompanySchema = z.enum(["PRAEMIA_REIM"]);
export type TManagementCompany = z.infer<typeof managementCompanySchema>;

export const managementCompanyToLabel: Record<TManagementCompany, string> = {
  PRAEMIA_REIM: "Praemia REIM France",
};

export const managementCompanyToEmail: Record<TManagementCompany, string> = {
  PRAEMIA_REIM: "serviceclients@praemiareim.com",
};

export const managementCompanyList: ISelectOption<TManagementCompany>[] = managementCompanySchema.options.map(
  (value) => ({
    label: managementCompanyToLabel[value],
    value,
  }),
);

export const scpiNameSchema = z.enum(["PRIMOPIERRE"]);
export type TScpiName = z.infer<typeof scpiNameSchema>;

export const scpiNameToLabel: Record<TScpiName, string> = {
  PRIMOPIERRE: "SCPI Primopierre",
};

export const scpiNameToCategory: Record<TScpiName, string> = {
  PRIMOPIERRE: "Bureaux",
};

export const scpiNameToSourceUrl: Record<TScpiName, string> = {
  PRIMOPIERRE: "https://www.praemiareim.fr/fr/scpi-primopierre",
};

export const scpiNameToMandateFolderFeeTtc: Record<TScpiName, number> = {
  PRIMOPIERRE: 90,
};

export const managementCompanyToScpiList: Record<TManagementCompany, ISelectOption<TScpiName>[]> = {
  PRAEMIA_REIM: [
    {
      label: scpiNameToLabel.PRIMOPIERRE,
      value: "PRIMOPIERRE",
    },
  ],
};

export const orderBookEntryDataSchema = z.object({
  side: orderSideSchema,
  rank: z.number().int().positive(),
  ordersCount: z.number().int().nonnegative(),
  partsCount: z.number().int().nonnegative(),
  sellerPrice: z.number().nonnegative(),
  buyerPrice: z.number().nonnegative().nullable(),
});

export type TOrderBookEntryData = z.infer<typeof orderBookEntryDataSchema>;

export interface IOrderBookEntryItem {
  id: string;
  side: TOrderSide;
  rank: number;
  ordersCount: number;
  partsCount: number;
  sellerPrice: number;
  buyerPrice: number | null;
}

export const confrontationHistoryDataSchema = z.object({
  confrontationDate: z.string(),
  exchangedParts: z.number().int().nonnegative(),
  sellerPrice: z.number().nonnegative(),
  buyerPrice: z.number().nonnegative(),
  sortOrder: z.number().int().nonnegative(),
});

export type TConfrontationHistoryData = z.infer<typeof confrontationHistoryDataSchema>;

export interface IConfrontationHistoryItem {
  id: string;
  confrontationDate: string;
  exchangedParts: number;
  sellerPrice: number;
  buyerPrice: number;
  sortOrder: number;
}

export interface IScpiScrapedMarketData {
  name: TScpiName;
  managementCompany: TManagementCompany;
  lastExecutionPrice: number;
  lastBuyerPrice: number;
  realizationValue: number | null;
  capitalization: number | null;
  distributionRate: number | null;
  financialOccupancyRate: number | null;
  previousYearDividend: number;
  dividendYear: number;
  dividendSource: string;
  transferCommissionRateHt: number;
  transferCommissionRateTtc: number;
  registrationTaxRate: number;
  fixedFolderFeeHt: number;
  fixedFolderFeeTtc: number;
  nextConfrontationDate: string | null;
  orderDeadlineDate: string | null;
  marketUpdatedAtLabel: string | null;
  orderBookEntries: TOrderBookEntryData[];
  confrontations: TConfrontationHistoryData[];
}

export interface IScpiWithMarketRelations {
  id: string;
  name: TScpiName;
  managementCompany: TManagementCompany;
  lastExecutionPrice: number;
  lastBuyerPrice: number;
  realizationValue: number | null;
  capitalization: number | null;
  distributionRate: number | null;
  financialOccupancyRate: number | null;
  previousYearDividend: number;
  dividendYear: number;
  dividendSource: string;
  transferCommissionRateHt: number;
  transferCommissionRateTtc: number;
  registrationTaxRate: number;
  fixedFolderFeeHt: number;
  fixedFolderFeeTtc: number;
  nextConfrontationDate: string | null;
  orderDeadlineDate: string | null;
  marketUpdatedAtLabel: string | null;
  scrapedAt: Date;
  orderBookEntries: IOrderBookEntryItem[];
  confrontations: IConfrontationHistoryItem[];
}

export interface IOrderBookSummaryMetrics {
  totalBuyOrders: number;
  totalBuyParts: number;
  highestBuyerPrice: number | null;
  highestBuySellerPrice: number | null;
  totalSellOrders: number;
  totalSellParts: number;
  lowestSellerPrice: number | null;
}

export interface IYieldBreakdownMetrics {
  executionPrice: number;
  transferCommissionPerPart: number;
  registrationTaxPerPart: number;
  totalProportionalFeeRate: number;
  totalProportionalFeesPerPart: number;
  buyerPricePerPart: number;
  annualGrossDividendPerPart: number;
  yieldFeeIncludedPercent: number;
  netSellerYieldPercent: number;
}

export interface IInvestmentYieldSimulationInput {
  acquisitionPricePerPart: number;
  partsCount: number;
  fixedFolderFeeTtc: number;
  annualGrossDividendPerPart: number;
  transferCommissionRateTtc: number;
  registrationTaxRate: number;
}

export interface IInvestmentYieldSimulationResult {
  partsCount: number;
  acquisitionPricePerPart: number;
  netSellerTotalAmount: number;
  transferCommissionTotalAmount: number;
  registrationTaxTotalAmount: number;
  proportionalFeesTotalAmount: number;
  fixedFolderFeeTtc: number;
  totalFeesAmount: number;
  totalInvestmentWithoutFixedFees: number;
  totalInvestmentWithFixedFees: number;
  allInCostPerPart: number;
  fixedFeePerPart: number;
  annualGrossDividendsTotal: number;
  yieldWithoutFixedFeesPercent: number;
  yieldWithFixedFeesPercent: number;
  fixedFeeYieldImpactPercent: number;
}

export type TConfrontationTieBreaker = "UNIQUE_MAX_VOLUME" | "MIN_IMBALANCE" | "CLOSEST_TO_LAST_PRICE" | "NO_CROSSING";

export interface IConfrontationPriceLevel {
  sellerPrice: number;
  buyerPrice: number;
  buyPartsAtPrice: number;
  sellPartsAtPrice: number;
  cumulativeBuyParts: number;
  cumulativeSellParts: number;
  exchangeableParts: number;
  unmatchedParts: number;
  distanceFromLastExecution: number;
  yieldFeeIncludedPercent: number;
  isOptimalEquilibrium: boolean;
  isTiedOnMaxVolume: boolean;
}

export interface IConfrontationEstimationResult {
  hasCrossing: boolean;
  estimatedSellerPrice: number | null;
  estimatedBuyerPrice: number | null;
  estimatedExchangedParts: number;
  estimatedTotalSellerVolumeEuro: number;
  estimatedTotalBuyerVolumeEuro: number;
  estimatedYieldFeeIncludedPercent: number | null;
  priceEvolutionVsLastPercent: number | null;
  unmatchedImbalanceParts: number;
  tieBreakerApplied: TConfrontationTieBreaker;
  levels: IConfrontationPriceLevel[];
}

export type TYieldCurveMarkerType = "ESTIMATED" | "LAST_EXECUTION" | "STANDARD";

export interface IYieldCurveDataPoint {
  sellerPrice: number;
  buyerPrice: number;
  yieldFeeIncludedPercent: number;
  yieldWithFixedFeesPercent: number;
  markerType: TYieldCurveMarkerType;
  markerLabel?: string;
}

