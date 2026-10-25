import * as cheerio from "cheerio";
import {
  PRIMOPIERRE_DIVIDEND_SOURCE,
  PRIMOPIERRE_DIVIDEND_YEAR,
  PRIMOPIERRE_FIXED_FOLDER_FEE_HT,
  PRIMOPIERRE_FIXED_FOLDER_FEE_TTC,
  PRIMOPIERRE_PREVIOUS_YEAR_DIVIDEND,
  PRIMOPIERRE_REGISTRATION_TAX_RATE,
  PRIMOPIERRE_TRANSFER_COMMISSION_RATE_HT,
  PRIMOPIERRE_TRANSFER_COMMISSION_RATE_TTC,
} from "my-variables";
import {
  confrontationHistoryDataSchema,
  type IScpiScrapedMarketData,
  managementCompanyToLabel,
  orderBookEntryDataSchema,
  scpiNameToSourceUrl,
  type TConfrontationHistoryData,
  type TOrderBookEntryData,
} from "my-zod";
import { parseFrenchFloat, parseFrenchInt } from "./parseFrenchNumber";

export async function scrapePrimopierre(): Promise<IScpiScrapedMarketData> {
  const sourceUrl = scpiNameToSourceUrl.PRIMOPIERRE;
  const managementCompanyLabel = managementCompanyToLabel.PRAEMIA_REIM;

  const response = await fetch(sourceUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`Impossible de récupérer la page ${managementCompanyLabel} (statut ${response.status})`);
  }

  const htmlContent = await response.text();
  const documentRoot = cheerio.load(htmlContent);

  const rawSubtitle = documentRoot(".fixed-capital-web .fixed-capital-subtitle").first().text();
  const marketUpdatedAtLabel =
    rawSubtitle
      .replace(/Mise à jour le/i, "")
      .replace(/\u00a0/g, " ")
      .trim() || null;

  let lastExecutionPrice = 0;
  let lastBuyerPrice = 0;
  let nextConfrontationDate: string | null = null;
  let orderDeadlineDate: string | null = null;

  documentRoot(".fixed-capital-web .key-item, .fixed-capital-web .key-item-last").each((_index, element) => {
    const itemElement = documentRoot(element);
    const labelText = itemElement.find(".key-label").text().trim().toLowerCase();
    const numberText = itemElement.find(".key-number").text().trim();
    const dateText = itemElement.find(".key-date").text().trim();

    if (labelText.includes("dernier prix d'exécution")) {
      lastExecutionPrice = parseFrenchFloat(numberText);
    } else if (labelText.includes("dernier prix acquéreur")) {
      lastBuyerPrice = parseFrenchFloat(numberText);
    } else if (labelText.includes("prochaine confrontation")) {
      nextConfrontationDate = dateText ? `${numberText} à ${dateText}` : numberText;
    } else if (labelText.includes("date limite de réception")) {
      orderDeadlineDate = dateText ? `${numberText} à ${dateText}` : numberText;
    }
  });

  let realizationValue: number | null = null;
  let capitalization: number | null = null;
  let distributionRate: number | null = null;

  documentRoot(".subscription-conditions .key-item").each((_index, element) => {
    const itemElement = documentRoot(element);
    const labelText = itemElement.find(".key-label").text().trim().toLowerCase();
    const numberText = itemElement.find(".key-number").text().trim();

    if (labelText.includes("valeur de réalisation")) {
      realizationValue = parseFrenchFloat(numberText);
    } else if (labelText.includes("capitalisation")) {
      capitalization = parseFrenchFloat(numberText);
    } else if (labelText.includes("taux de distribution")) {
      distributionRate = parseFrenchFloat(numberText);
    }
  });

  let financialOccupancyRate: number | null = null;
  documentRoot(".key-numbers .key-block").each((_index, element) => {
    const blockElement = documentRoot(element);
    const labelText = blockElement.find(".key-text").text().trim().toLowerCase();
    const numberText = blockElement.find(".key-number").text().trim();

    if (labelText.includes("occupation financier")) {
      financialOccupancyRate = parseFrenchFloat(numberText);
    }
  });

  const confrontations: TConfrontationHistoryData[] = [];
  documentRoot("#historic-table tbody tr.historic-line").each((rowIndex, rowElement) => {
    const cells = documentRoot(rowElement).find("td");
    if (cells.length >= 4) {
      confrontations.push(
        confrontationHistoryDataSchema.parse({
          confrontationDate: documentRoot(cells[0]).text().trim(),
          exchangedParts: parseFrenchInt(documentRoot(cells[1]).text()),
          sellerPrice: parseFrenchFloat(documentRoot(cells[2]).text()),
          buyerPrice: parseFrenchFloat(documentRoot(cells[3]).text()),
          sortOrder: rowIndex,
        }),
      );
    }
  });

  const orderBookEntries: TOrderBookEntryData[] = [];
  documentRoot(".fixed-capital-web h3.fixed-capital-table-title").each((_tableIndex, headingElement) => {
    const headingText = documentRoot(headingElement).text().trim().toLowerCase();
    const tableElement = documentRoot(headingElement).parent().find("table").first();

    if (headingText.includes("ordres d'achat")) {
      tableElement.find("tbody tr").each((rowIndex, rowElement) => {
        const cells = documentRoot(rowElement).find("td");
        if (cells.length >= 4) {
          orderBookEntries.push(
            orderBookEntryDataSchema.parse({
              side: "BUY",
              rank: rowIndex + 1,
              ordersCount: parseFrenchInt(documentRoot(cells[0]).text()),
              partsCount: parseFrenchInt(documentRoot(cells[1]).text()),
              sellerPrice: parseFrenchFloat(documentRoot(cells[2]).text()),
              buyerPrice: parseFrenchFloat(documentRoot(cells[3]).text()),
            }),
          );
        }
      });
    } else if (headingText.includes("ordres de vente")) {
      tableElement.find("tbody tr").each((rowIndex, rowElement) => {
        const cells = documentRoot(rowElement).find("td");
        if (cells.length >= 3) {
          orderBookEntries.push(
            orderBookEntryDataSchema.parse({
              side: "SELL",
              rank: rowIndex + 1,
              ordersCount: parseFrenchInt(documentRoot(cells[0]).text()),
              partsCount: parseFrenchInt(documentRoot(cells[1]).text()),
              sellerPrice: parseFrenchFloat(documentRoot(cells[2]).text()),
              buyerPrice: null,
            }),
          );
        }
      });
    }
  });

  if (lastExecutionPrice <= 0 || lastBuyerPrice <= 0 || orderBookEntries.length === 0) {
    throw new Error(
      `Structure HTML ${managementCompanyLabel} modifiée ou incomplète : conservation des dernières données valides en base.`,
    );
  }

  return {
    name: "PRIMOPIERRE",
    managementCompany: "PRAEMIA_REIM",
    lastExecutionPrice,
    lastBuyerPrice,
    realizationValue,
    capitalization,
    distributionRate,
    financialOccupancyRate,
    previousYearDividend: PRIMOPIERRE_PREVIOUS_YEAR_DIVIDEND,
    dividendYear: PRIMOPIERRE_DIVIDEND_YEAR,
    dividendSource: PRIMOPIERRE_DIVIDEND_SOURCE,
    transferCommissionRateHt: PRIMOPIERRE_TRANSFER_COMMISSION_RATE_HT,
    transferCommissionRateTtc: PRIMOPIERRE_TRANSFER_COMMISSION_RATE_TTC,
    registrationTaxRate: PRIMOPIERRE_REGISTRATION_TAX_RATE,
    fixedFolderFeeHt: PRIMOPIERRE_FIXED_FOLDER_FEE_HT,
    fixedFolderFeeTtc: PRIMOPIERRE_FIXED_FOLDER_FEE_TTC,
    nextConfrontationDate,
    orderDeadlineDate,
    marketUpdatedAtLabel,
    orderBookEntries,
    confrontations,
  };
}
