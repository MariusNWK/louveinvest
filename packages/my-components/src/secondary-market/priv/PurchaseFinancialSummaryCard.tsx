"use client";

import { formatEuroPrice, formatExactPercentage, formatInteger } from "my-functions";
import type { IInvestmentYieldSimulationResult, IScpiWithMarketRelations } from "my-zod";
import { scpiNameToMandateFolderFeeTtc } from "my-zod";
import { Badge, Button, CardTitle } from "ui";
import { PurchaseDeadlineBanner } from "./PurchaseDeadlineBanner";

export interface IPurchaseFinancialSummaryCardProps {
  scpi: IScpiWithMarketRelations;
  simulation: IInvestmentYieldSimulationResult;
  fixedFolderFeeTtc: number;
  onFixedFolderFeeChange: (value: number) => void;
}

export function PurchaseFinancialSummaryCard(props: IPurchaseFinancialSummaryCardProps) {
  const scpi = props.scpi;
  const simulation = props.simulation;
  const mandateFolderFeeTtc = scpiNameToMandateFolderFeeTtc[scpi.name];
  const feeOptions = [
    { label: `${formatEuroPrice(scpi.fixedFolderFeeTtc)} TTC`, value: scpi.fixedFolderFeeTtc },
    { label: `${formatEuroPrice(mandateFolderFeeTtc)} TTC`, value: mandateFolderFeeTtc },
    { label: "0 €", value: 0 },
  ];

  return (
    <div className="flex flex-col gap-3.5 rounded-xl border border-louve-border bg-louve-bg/60 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-louve-border border-b pb-3">
        <div>
          <CardTitle>Récapitulatif financier en temps réel</CardTitle>
          <p className="text-louve-slate text-xs">
            {formatInteger(simulation.partsCount)} {simulation.partsCount > 1 ? "parts" : "part"} ×{" "}
            {formatEuroPrice(simulation.acquisitionPricePerPart)} net vendeur
          </p>
        </div>
        <Badge variant="emerald">Rendement : {formatExactPercentage(simulation.yieldWithoutFixedFeesPercent)}</Badge>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col justify-between gap-1 rounded-xl border border-louve-navy-light bg-gradient-to-br from-louve-navy to-louve-navy-light p-3.5 text-louve-surface">
          <span className="font-medium text-louve-blue-muted text-[11px] uppercase tracking-wider">
            Coût total acquéreur frais inclus
          </span>
          <span className="font-medium text-2xl tracking-tight">
            {formatEuroPrice(simulation.totalInvestmentWithFixedFees)}
          </span>
          <span className="text-louve-blue-border text-[11px]">
            Hors frais fixes : {formatEuroPrice(simulation.totalInvestmentWithoutFixedFees)} (
            {formatEuroPrice(simulation.allInCostPerPart)} / p.)
          </span>
        </div>

        <div className="flex flex-col justify-between gap-1 rounded-xl border border-louve-border bg-louve-surface p-3.5">
          <span className="font-medium text-louve-slate text-[11px] uppercase tracking-wider">
            Rendement brut estimé (base {scpi.dividendYear})
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-medium text-2xl text-success-700 tracking-tight">
              {formatExactPercentage(simulation.yieldWithoutFixedFeesPercent)}
            </span>
            <span className="text-louve-slate text-xs">
              ({formatExactPercentage(simulation.yieldWithFixedFeesPercent)} frais fixes incl.)
            </span>
          </div>
          <span className="text-louve-slate text-[11px]">
            Dividendes bruts estimés :{" "}
            <strong className="text-louve-navy">{formatEuroPrice(simulation.annualGrossDividendsTotal)} / an</strong>
          </span>
        </div>
      </div>

      <div className="divide-y divide-louve-border rounded-xl border border-louve-border bg-louve-surface px-4 text-xs">
        <div className="flex items-center justify-between py-2">
          <span className="text-louve-slate">Montant total hors frais (net vendeur)</span>
          <span className="font-medium text-louve-navy">{formatEuroPrice(simulation.netSellerTotalAmount)}</span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-louve-slate">
            + Commission de cession ({formatExactPercentage(scpi.transferCommissionRateTtc)} TTC)
          </span>
          <span className="font-medium text-louve-navy">
            +{formatEuroPrice(simulation.transferCommissionTotalAmount)}
          </span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-louve-slate">
            + Droits d&apos;enregistrement ({formatExactPercentage(scpi.registrationTaxRate)})
          </span>
          <span className="font-medium text-louve-navy">+{formatEuroPrice(simulation.registrationTaxTotalAmount)}</span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 py-2">
          <span className="text-louve-slate">+ Forfait de frais fixes de dossier (TTC)</span>
          <div className="flex flex-wrap items-center gap-1">
            {feeOptions.map((option) => (
              <Button
                key={option.label}
                variant="chip"
                size="xs"
                isActive={props.fixedFolderFeeTtc === option.value}
                onClick={() => props.onFixedFolderFeeChange(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <PurchaseDeadlineBanner
        orderDeadlineDate={scpi.orderDeadlineDate}
        nextConfrontationDate={scpi.nextConfrontationDate}
      />
    </div>
  );
}
