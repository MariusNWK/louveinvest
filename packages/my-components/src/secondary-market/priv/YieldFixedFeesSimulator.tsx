"use client";

import { calculateInvestmentYieldSimulation, formatEuroPrice } from "my-functions";
import { type IScpiWithMarketRelations, managementCompanyToLabel, scpiNameToMandateFolderFeeTtc } from "my-zod";
import { useState } from "react";
import { ArrowRight, Info, Sliders } from "react-feather";
import { ActionLink, Badge, CardTitle, TooltipWrapper } from "ui";
import { YieldSimulationResultPanel } from "./YieldSimulationResultPanel";
import { YieldSimulatorFormControls } from "./YieldSimulatorFormControls";

export interface IYieldFixedFeesSimulatorProps {
  scpi: IScpiWithMarketRelations;
  lowestSellPrice: number | null;
}

export function YieldFixedFeesSimulator(props: IYieldFixedFeesSimulatorProps) {
  const scpi = props.scpi;
  const managementCompanyLabel = managementCompanyToLabel[scpi.managementCompany];
  const [acquisitionPricePerPart, setAcquisitionPricePerPart] = useState<number>(scpi.lastExecutionPrice);
  const [partsCount, setPartsCount] = useState<number>(50);
  const [fixedFolderFeeTtc, setFixedFolderFeeTtc] = useState<number>(scpi.fixedFolderFeeTtc);

  const simulationResult = calculateInvestmentYieldSimulation({
    acquisitionPricePerPart,
    partsCount,
    fixedFolderFeeTtc,
    annualGrossDividendPerPart: scpi.previousYearDividend,
    transferCommissionRateTtc: scpi.transferCommissionRateTtc,
    registrationTaxRate: scpi.registrationTaxRate,
  });

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-louve-blue-border bg-louve-bg p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-louve-border border-b pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-louve-blue-soft text-louve-blue">
            <Sliders size={15} />
          </div>
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle>Simulateur de rendement frais fixes inclus selon votre projet</CardTitle>
              <Badge variant="blue">Bonus — Amortissement des frais fixes</Badge>
            </div>
            <p className="text-louve-slate text-xs">
              Modulez le prix d&apos;acquisition, le nombre de parts et le forfait de dossier pour observer
              l&apos;impact sur le rendement net de frais d&apos;entrée.
            </p>
          </div>
        </div>
        <ActionLink
          href={`/purchase?price=${acquisitionPricePerPart}&parts=${partsCount}`}
          variant="primary"
          className="gap-1.5"
        >
          <span>Préparer cet ordre ({partsCount} p.)</span>
          <ArrowRight size={13} />
        </ActionLink>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <YieldSimulatorFormControls
          acquisitionPricePerPart={acquisitionPricePerPart}
          onAcquisitionPriceChange={setAcquisitionPricePerPart}
          partsCount={partsCount}
          onPartsCountChange={setPartsCount}
          fixedFolderFeeTtc={fixedFolderFeeTtc}
          onFixedFolderFeeChange={setFixedFolderFeeTtc}
          defaultFolderFeeTtc={scpi.fixedFolderFeeTtc}
          mandateFolderFeeTtc={scpiNameToMandateFolderFeeTtc[scpi.name]}
          lastExecutionPrice={scpi.lastExecutionPrice}
          lowestSellPrice={props.lowestSellPrice}
        />

        <YieldSimulationResultPanel
          result={simulationResult}
          dividendYear={scpi.dividendYear}
          transferCommissionRateTtc={scpi.transferCommissionRateTtc}
          registrationTaxRate={scpi.registrationTaxRate}
        />
      </div>

      <div className="flex items-start gap-2.5 rounded-xl border border-louve-blue-border bg-louve-blue-soft/60 px-4 py-3 text-louve-navy text-xs leading-relaxed">
        <TooltipWrapper label="Note d'information Août 2026 (p. 24) & BTI 2T 2026 : 50 € HT / 60 € TTC par dossier. Mandat d'achat (p. 4) : 75 € HT / 90 € TTC.">
          <span className="mt-0.5 inline-flex shrink-0 cursor-help text-louve-blue">
            <Info size={15} />
          </span>
        </TooltipWrapper>
        <p>
          <strong>Précision juridique ({managementCompanyLabel}) :</strong> chez {managementCompanyLabel}, ce forfait
          fixe par dossier ({formatEuroPrice(scpi.fixedFolderFeeHt)} HT /{" "}
          <strong>{formatEuroPrice(scpi.fixedFolderFeeTtc)} TTC</strong> dans le BTI 2T 2026 et la Note
          d&apos;information, ou 75,00 € HT / 90,00 € TTC dans le Mandat d&apos;achat) s&apos;applique juridiquement aux
          cessions directes de gré à gré et mutations. Il est intégré ici pour simuler l&apos;amortissement des frais
          fixes par dossier selon le volume d&apos;investissement souhaité et anticiper l&apos;intégration d&apos;autres
          SCPI.
        </p>
      </div>
    </div>
  );
}
