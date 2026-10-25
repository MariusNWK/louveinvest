import {
  type IConfrontationEstimationResult,
  type IConfrontationPriceLevel,
  type IInvestmentYieldSimulationInput,
  type IInvestmentYieldSimulationResult,
  type IOrderBookEntryItem,
  type IOrderBookSummaryMetrics,
  type IScpiWithMarketRelations,
  type IYieldBreakdownMetrics,
  type IYieldCurveDataPoint,
  type TConfrontationTieBreaker,
  type TYieldCurveMarkerType,
} from "my-zod";

const euroFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const integerFormatter = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 0,
});

const decimalFormatter = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 2,
});

const exactDecimalFormatter = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatEuroPrice(amount: number): string {
  return euroFormatter.format(amount);
}

export function formatInteger(value: number): string {
  return integerFormatter.format(value);
}

export function formatCompactEuro(amount: number): string {
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000;
    return `${decimalFormatter.format(millions)} M€`;
  }
  return euroFormatter.format(amount);
}

export function formatPercentage(value: number, showPositiveSign = false): string {
  const formattedNumber = decimalFormatter.format(Math.abs(value));
  if (value < 0) {
    return `-${formattedNumber} %`;
  }
  if (value > 0 && showPositiveSign) {
    return `+${formattedNumber} %`;
  }
  return `${formattedNumber} %`;
}

export function formatExactPercentage(value: number, showPositiveSign = false): string {
  const formattedNumber = exactDecimalFormatter.format(Math.abs(value));
  if (value < 0) {
    return `-${formattedNumber} %`;
  }
  if (value > 0 && showPositiveSign) {
    return `+${formattedNumber} %`;
  }
  return `${formattedNumber} %`;
}

export function calculateDiscountPercentage(currentPrice: number, referenceValue: number | null): number | null {
  if (!referenceValue || referenceValue <= 0) {
    return null;
  }
  return ((currentPrice - referenceValue) / referenceValue) * 100;
}

export function calculateOrderBookSummary(entries: IOrderBookEntryItem[]): IOrderBookSummaryMetrics {
  const buyEntries = entries.filter((entry) => entry.side === "BUY").sort((first, second) => first.rank - second.rank);
  const sellEntries = entries
    .filter((entry) => entry.side === "SELL")
    .sort((first, second) => first.rank - second.rank);

  const totalBuyOrders = buyEntries.reduce((accumulator, entry) => accumulator + entry.ordersCount, 0);
  const totalBuyParts = buyEntries.reduce((accumulator, entry) => accumulator + entry.partsCount, 0);
  const totalSellOrders = sellEntries.reduce((accumulator, entry) => accumulator + entry.ordersCount, 0);
  const totalSellParts = sellEntries.reduce((accumulator, entry) => accumulator + entry.partsCount, 0);

  const firstBuyEntry = buyEntries[0];
  const firstSellEntry = sellEntries[0];

  return {
    totalBuyOrders,
    totalBuyParts,
    highestBuyerPrice: firstBuyEntry?.buyerPrice ?? null,
    highestBuySellerPrice: firstBuyEntry?.sellerPrice ?? null,
    totalSellOrders,
    totalSellParts,
    lowestSellerPrice: firstSellEntry?.sellerPrice ?? null,
  };
}

export function calculateYieldBreakdown(scpi: IScpiWithMarketRelations): IYieldBreakdownMetrics {
  const executionPrice = scpi.lastExecutionPrice;
  const transferCommissionPerPart = executionPrice * (scpi.transferCommissionRateTtc / 100);
  const registrationTaxPerPart = executionPrice * (scpi.registrationTaxRate / 100);
  const totalProportionalFeeRate = scpi.transferCommissionRateTtc + scpi.registrationTaxRate;
  const totalProportionalFeesPerPart = transferCommissionPerPart + registrationTaxPerPart;
  const buyerPricePerPart = executionPrice + totalProportionalFeesPerPart;
  const annualGrossDividendPerPart = scpi.previousYearDividend;

  const yieldFeeIncludedPercent = buyerPricePerPart > 0 ? (annualGrossDividendPerPart / buyerPricePerPart) * 100 : 0;
  const netSellerYieldPercent = executionPrice > 0 ? (annualGrossDividendPerPart / executionPrice) * 100 : 0;

  return {
    executionPrice,
    transferCommissionPerPart,
    registrationTaxPerPart,
    totalProportionalFeeRate,
    totalProportionalFeesPerPart,
    buyerPricePerPart,
    annualGrossDividendPerPart,
    yieldFeeIncludedPercent,
    netSellerYieldPercent,
  };
}

export function calculateInvestmentYieldSimulation(
  input: IInvestmentYieldSimulationInput,
): IInvestmentYieldSimulationResult {
  const safePartsCount = Math.max(Math.floor(input.partsCount), 1);
  const safeAcquisitionPrice = Math.max(input.acquisitionPricePerPart, 0);
  const safeFixedFee = Math.max(input.fixedFolderFeeTtc, 0);

  const netSellerTotalAmount = safeAcquisitionPrice * safePartsCount;
  const transferCommissionTotalAmount = netSellerTotalAmount * (input.transferCommissionRateTtc / 100);
  const registrationTaxTotalAmount = netSellerTotalAmount * (input.registrationTaxRate / 100);
  const proportionalFeesTotalAmount = transferCommissionTotalAmount + registrationTaxTotalAmount;
  const totalFeesAmount = proportionalFeesTotalAmount + safeFixedFee;

  const totalInvestmentWithoutFixedFees = netSellerTotalAmount + proportionalFeesTotalAmount;
  const totalInvestmentWithFixedFees = totalInvestmentWithoutFixedFees + safeFixedFee;

  const allInCostPerPart = totalInvestmentWithFixedFees / safePartsCount;
  const fixedFeePerPart = safeFixedFee / safePartsCount;
  const annualGrossDividendsTotal = input.annualGrossDividendPerPart * safePartsCount;

  const yieldWithoutFixedFeesPercent =
    totalInvestmentWithoutFixedFees > 0 ? (annualGrossDividendsTotal / totalInvestmentWithoutFixedFees) * 100 : 0;

  const yieldWithFixedFeesPercent =
    totalInvestmentWithFixedFees > 0 ? (annualGrossDividendsTotal / totalInvestmentWithFixedFees) * 100 : 0;

  const fixedFeeYieldImpactPercent = yieldWithFixedFeesPercent - yieldWithoutFixedFeesPercent;

  return {
    partsCount: safePartsCount,
    acquisitionPricePerPart: safeAcquisitionPrice,
    netSellerTotalAmount,
    transferCommissionTotalAmount,
    registrationTaxTotalAmount,
    proportionalFeesTotalAmount,
    fixedFolderFeeTtc: safeFixedFee,
    totalFeesAmount,
    totalInvestmentWithoutFixedFees,
    totalInvestmentWithFixedFees,
    allInCostPerPart,
    fixedFeePerPart,
    annualGrossDividendsTotal,
    yieldWithoutFixedFeesPercent,
    yieldWithFixedFeesPercent,
    fixedFeeYieldImpactPercent,
  };
}

export function estimateNextConfrontation(scpi: IScpiWithMarketRelations): IConfrontationEstimationResult {
  const buyEntries = scpi.orderBookEntries.filter((entry) => entry.side === "BUY");
  const sellEntries = scpi.orderBookEntries.filter((entry) => entry.side === "SELL");

  const distinctSellerPrices = Array.from(new Set(scpi.orderBookEntries.map((entry) => entry.sellerPrice))).sort(
    (first, second) => first - second,
  );

  const proportionalFeeMultiplier = 1 + (scpi.transferCommissionRateTtc + scpi.registrationTaxRate) / 100;

  const rawLevels: IConfrontationPriceLevel[] = distinctSellerPrices.map((candidatePrice) => {
    const buyPartsAtPrice = buyEntries
      .filter((entry) => entry.sellerPrice === candidatePrice)
      .reduce((sum, entry) => sum + entry.partsCount, 0);

    const sellPartsAtPrice = sellEntries
      .filter((entry) => entry.sellerPrice === candidatePrice)
      .reduce((sum, entry) => sum + entry.partsCount, 0);

    const cumulativeBuyParts = buyEntries
      .filter((entry) => entry.sellerPrice >= candidatePrice)
      .reduce((sum, entry) => sum + entry.partsCount, 0);

    const cumulativeSellParts = sellEntries
      .filter((entry) => entry.sellerPrice <= candidatePrice)
      .reduce((sum, entry) => sum + entry.partsCount, 0);

    const exchangeableParts = Math.min(cumulativeBuyParts, cumulativeSellParts);
    const unmatchedParts = Math.abs(cumulativeBuyParts - cumulativeSellParts);
    const distanceFromLastExecution = Math.abs(candidatePrice - scpi.lastExecutionPrice);
    const buyerPrice = candidatePrice * proportionalFeeMultiplier;
    const yieldFeeIncludedPercent = buyerPrice > 0 ? (scpi.previousYearDividend / buyerPrice) * 100 : 0;

    return {
      sellerPrice: candidatePrice,
      buyerPrice,
      buyPartsAtPrice,
      sellPartsAtPrice,
      cumulativeBuyParts,
      cumulativeSellParts,
      exchangeableParts,
      unmatchedParts,
      distanceFromLastExecution,
      yieldFeeIncludedPercent,
      isOptimalEquilibrium: false,
      isTiedOnMaxVolume: false,
    };
  });

  const maxExchangeableParts = rawLevels.reduce((maxVal, level) => Math.max(maxVal, level.exchangeableParts), 0);

  if (maxExchangeableParts <= 0) {
    return {
      hasCrossing: false,
      estimatedSellerPrice: null,
      estimatedBuyerPrice: null,
      estimatedExchangedParts: 0,
      estimatedTotalSellerVolumeEuro: 0,
      estimatedTotalBuyerVolumeEuro: 0,
      estimatedYieldFeeIncludedPercent: null,
      priceEvolutionVsLastPercent: null,
      unmatchedImbalanceParts: 0,
      tieBreakerApplied: "NO_CROSSING",
      levels: rawLevels,
    };
  }

  const maxVolumeCandidates = rawLevels.filter((level) => level.exchangeableParts === maxExchangeableParts);
  let tieBreakerApplied: TConfrontationTieBreaker = "UNIQUE_MAX_VOLUME";
  let winningLevel = maxVolumeCandidates[0];

  if (maxVolumeCandidates.length > 1) {
    const minUnmatched = Math.min(...maxVolumeCandidates.map((level) => level.unmatchedParts));
    const minImbalanceCandidates = maxVolumeCandidates.filter((level) => level.unmatchedParts === minUnmatched);

    if (minImbalanceCandidates.length === 1) {
      tieBreakerApplied = "MIN_IMBALANCE";
      winningLevel = minImbalanceCandidates[0];
    } else {
      tieBreakerApplied = "CLOSEST_TO_LAST_PRICE";
      const sortedByDistance = [...minImbalanceCandidates].sort(
        (first, second) =>
          first.distanceFromLastExecution - second.distanceFromLastExecution || second.sellerPrice - first.sellerPrice,
      );
      winningLevel = sortedByDistance[0];
    }
  }

  if (!winningLevel) {
    return {
      hasCrossing: false,
      estimatedSellerPrice: null,
      estimatedBuyerPrice: null,
      estimatedExchangedParts: 0,
      estimatedTotalSellerVolumeEuro: 0,
      estimatedTotalBuyerVolumeEuro: 0,
      estimatedYieldFeeIncludedPercent: null,
      priceEvolutionVsLastPercent: null,
      unmatchedImbalanceParts: 0,
      tieBreakerApplied: "NO_CROSSING",
      levels: rawLevels,
    };
  }

  const enrichedLevels = rawLevels.map((level) => ({
    ...level,
    isOptimalEquilibrium: level.sellerPrice === winningLevel.sellerPrice,
    isTiedOnMaxVolume:
      level.exchangeableParts === maxExchangeableParts && level.sellerPrice !== winningLevel.sellerPrice,
  }));

  const priceEvolutionVsLastPercent = calculateDiscountPercentage(winningLevel.sellerPrice, scpi.lastExecutionPrice);

  return {
    hasCrossing: true,
    estimatedSellerPrice: winningLevel.sellerPrice,
    estimatedBuyerPrice: winningLevel.buyerPrice,
    estimatedExchangedParts: winningLevel.exchangeableParts,
    estimatedTotalSellerVolumeEuro: winningLevel.sellerPrice * winningLevel.exchangeableParts,
    estimatedTotalBuyerVolumeEuro: winningLevel.buyerPrice * winningLevel.exchangeableParts,
    estimatedYieldFeeIncludedPercent: winningLevel.yieldFeeIncludedPercent,
    priceEvolutionVsLastPercent,
    unmatchedImbalanceParts: winningLevel.unmatchedParts,
    tieBreakerApplied,
    levels: enrichedLevels,
  };
}

export interface IBuildYieldCurveParams {
  scpi: IScpiWithMarketRelations;
  minPrice: number;
  maxPrice: number;
  stepsCount?: number;
  estimatedSellerPrice: number | null;
  partsCountForFixedFee: number;
  fixedFolderFeeTtc: number;
}

export function buildYieldCurvePoints(params: IBuildYieldCurveParams): IYieldCurveDataPoint[] {
  const scpi = params.scpi;
  const safeMin = Math.max(1, Math.min(params.minPrice, params.maxPrice - 1));
  const safeMax = Math.max(safeMin + 1, params.maxPrice);
  const stepsCount = params.stepsCount ?? 13;

  const candidatePricesSet = new Set<number>();
  const stepSize = (safeMax - safeMin) / Math.max(stepsCount - 1, 1);

  for (let index = 0; index < stepsCount; index += 1) {
    const pricePoint = Math.round((safeMin + index * stepSize) * 100) / 100;
    candidatePricesSet.add(pricePoint);
  }

  if (
    params.estimatedSellerPrice !== null &&
    params.estimatedSellerPrice >= safeMin &&
    params.estimatedSellerPrice <= safeMax
  ) {
    candidatePricesSet.add(params.estimatedSellerPrice);
  }

  if (scpi.lastExecutionPrice >= safeMin && scpi.lastExecutionPrice <= safeMax) {
    candidatePricesSet.add(scpi.lastExecutionPrice);
  }

  const sortedPrices = Array.from(candidatePricesSet).sort((first, second) => first - second);
  const proportionalMultiplier = 1 + (scpi.transferCommissionRateTtc + scpi.registrationTaxRate) / 100;
  const safePartsCount = Math.max(1, params.partsCountForFixedFee);
  const fixedFeePerPart = Math.max(0, params.fixedFolderFeeTtc) / safePartsCount;

  return sortedPrices.map((sellerPrice) => {
    const buyerPrice = sellerPrice * proportionalMultiplier;
    const allInPricePerPart = buyerPrice + fixedFeePerPart;
    const yieldFeeIncludedPercent = buyerPrice > 0 ? (scpi.previousYearDividend / buyerPrice) * 100 : 0;
    const yieldWithFixedFeesPercent = allInPricePerPart > 0 ? (scpi.previousYearDividend / allInPricePerPart) * 100 : 0;

    let markerType: TYieldCurveMarkerType = "STANDARD";
    let markerLabel: string | undefined;

    if (params.estimatedSellerPrice !== null && Math.abs(sellerPrice - params.estimatedSellerPrice) < 0.01) {
      markerType = "ESTIMATED";
      markerLabel = "Prix estimé confrontation";
    } else if (Math.abs(sellerPrice - scpi.lastExecutionPrice) < 0.01) {
      markerType = "LAST_EXECUTION";
      markerLabel = "Dernier prix d'exécution";
    }

    return {
      sellerPrice,
      buyerPrice,
      yieldFeeIncludedPercent,
      yieldWithFixedFeesPercent,
      markerType,
      markerLabel,
    };
  });
}

export function buildPurchasePricePresets(scpi: IScpiWithMarketRelations): IPurchasePricePreset[] {
  const orderSummary = calculateOrderBookSummary(scpi.orderBookEntries);
  const confrontationEstimation = estimateNextConfrontation(scpi);
  const presets: IPurchasePricePreset[] = [
    {
      id: "LAST_EXECUTION",
      label: "Dernier exécuté",
      sublabel: "Dernière confrontation",
      price: scpi.lastExecutionPrice,
    },
  ];

  if (confrontationEstimation.estimatedSellerPrice !== null) {
    presets.push({
      id: "ESTIMATED_EQUILIBRIUM",
      label: "Équilibre estimé",
      sublabel: "Prochaine confrontation",
      price: confrontationEstimation.estimatedSellerPrice,
    });
  }

  if (orderSummary.lowestSellerPrice !== null) {
    presets.push({
      id: "BEST_SELL_LIMIT",
      label: "Meilleure limite vendeuse",
      sublabel: "Carnet d'ordres actuel",
      price: orderSummary.lowestSellerPrice,
    });
  }

  return presets;
}

export interface IBuildPurchasePreparedEmailParams {
  scpi: IScpiWithMarketRelations;
  formData: TPurchaseEmailFormData;
  simulation: IInvestmentYieldSimulationResult;
  recipientEmail: string;
}
