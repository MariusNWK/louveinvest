import {
  type IOrderBookEntryItem,
  type IOrderBookSummaryMetrics,
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
