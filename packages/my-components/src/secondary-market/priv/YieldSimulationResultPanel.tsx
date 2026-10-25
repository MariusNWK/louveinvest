import { formatEuroPrice, formatExactPercentage, formatInteger } from "my-functions";
import type { IInvestmentYieldSimulationResult } from "my-zod";
import { Badge } from "ui";

export interface IYieldSimulationResultPanelProps {
  result: IInvestmentYieldSimulationResult;
  dividendYear: number;
  transferCommissionRateTtc: number;
  registrationTaxRate: number;
}

export function YieldSimulationResultPanel(props: IYieldSimulationResultPanelProps) {
  const result = props.result;
  const proportionalRate = props.transferCommissionRateTtc + props.registrationTaxRate;

  return (
    <div className="flex flex-col gap-4 lg:col-span-7">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex flex-col justify-between gap-2 rounded-xl border border-louve-navy-light bg-gradient-to-br from-louve-navy to-louve-navy-light p-4 text-louve-surface">
          <span className="font-medium text-louve-blue-muted text-[11px] uppercase tracking-wider">
            Rendement frais fixes inclus
          </span>
          <span className="font-medium text-2xl tracking-tight">
            {formatExactPercentage(result.yieldWithFixedFeesPercent)}
          </span>
          <span className="text-louve-blue-border text-[11px]">
            Revient complet : {formatEuroPrice(result.allInCostPerPart)} / part
          </span>
        </div>

        <div className="flex flex-col justify-between gap-2 rounded-xl border border-louve-border bg-louve-surface p-4">
          <span className="font-medium text-louve-slate text-[11px] uppercase tracking-wider">
            Rendement hors frais fixes
          </span>
          <span className="font-medium text-louve-navy text-2xl tracking-tight">
            {formatExactPercentage(result.yieldWithoutFixedFeesPercent)}
          </span>
          <span className="text-louve-slate text-[11px]">
            Impact frais fixes :{" "}
            <strong className="text-louve-navy">{formatExactPercentage(result.fixedFeeYieldImpactPercent)}</strong> ( +
            {formatEuroPrice(result.fixedFeePerPart)}/p.)
          </span>
        </div>

        <div className="flex flex-col justify-between gap-2 rounded-xl border border-louve-border bg-louve-surface p-4">
          <span className="font-medium text-louve-slate text-[11px] uppercase tracking-wider">
            Dividendes bruts estimés
          </span>
          <span className="font-medium text-2xl text-success-700 tracking-tight">
            {formatEuroPrice(result.annualGrossDividendsTotal)}
          </span>
          <span className="text-louve-slate text-[11px]">
            Par an (base {props.dividendYear} sur {formatInteger(result.partsCount)} parts)
          </span>
        </div>
      </div>

      <div className="divide-y divide-louve-border rounded-xl border border-louve-border bg-louve-surface px-4 text-xs">
        <div className="flex items-center justify-between py-2.5">
          <span className="text-louve-slate">
            Montant net vendeur ({formatInteger(result.partsCount)} parts ×{" "}
            {formatEuroPrice(result.acquisitionPricePerPart)})
          </span>
          <span className="font-medium text-louve-navy">{formatEuroPrice(result.netSellerTotalAmount)}</span>
        </div>
        <div className="flex items-center justify-between py-2.5">
          <span className="text-louve-slate">
            + Commission de cession société de gestion ({formatExactPercentage(props.transferCommissionRateTtc)} TTC)
          </span>
          <span className="font-medium text-louve-navy">+{formatEuroPrice(result.transferCommissionTotalAmount)}</span>
        </div>
        <div className="flex items-center justify-between py-2.5">
          <span className="text-louve-slate">
            + Droits d&apos;enregistrement Trésor Public ({formatExactPercentage(props.registrationTaxRate)})
          </span>
          <span className="font-medium text-louve-navy">+{formatEuroPrice(result.registrationTaxTotalAmount)}</span>
        </div>
        <div className="flex items-center justify-between py-2.5">
          <span className="text-louve-slate">
            Sous-total hors frais fixes (+{formatExactPercentage(proportionalRate)})
          </span>
          <span className="font-medium text-louve-navy">{formatEuroPrice(result.totalInvestmentWithoutFixedFees)}</span>
        </div>
        <div className="flex items-center justify-between py-2.5">
          <span className="text-louve-slate">+ Forfait de frais fixes par dossier (TTC)</span>
          <Badge variant={result.fixedFolderFeeTtc > 0 ? "amber" : "slate"}>
            +{formatEuroPrice(result.fixedFolderFeeTtc)}
          </Badge>
        </div>
        <div className="flex items-center justify-between bg-louve-blue-soft/60 px-2 py-3 font-medium text-louve-navy">
          <span>Coût total de l&apos;investissement (frais fixes inclus)</span>
          <span className="text-louve-blue text-sm">{formatEuroPrice(result.totalInvestmentWithFixedFees)}</span>
        </div>
      </div>
    </div>
  );
}
