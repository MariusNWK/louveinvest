import { formatEuroPrice, formatExactPercentage } from "my-functions";
import {
  type IScpiWithMarketRelations,
  type IYieldBreakdownMetrics,
  managementCompanyToLabel,
  scpiNameToLabel,
  scpiNameToSourceUrl,
} from "my-zod";
import { BookOpen, ExternalLink } from "react-feather";
import { ActionLink, Badge, CardTitle } from "ui";

export interface IYieldFormulaBreakdownCardProps {
  scpi: IScpiWithMarketRelations;
  metrics: IYieldBreakdownMetrics;
}

export function YieldFormulaBreakdownCard(props: IYieldFormulaBreakdownCardProps) {
  const scpi = props.scpi;
  const metrics = props.metrics;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-louve-border bg-louve-bg/70 p-5 lg:col-span-7">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>Décomposition du calcul par part (hors frais fixes de dossier)</CardTitle>
          <Badge variant="slate">Dernière confrontation constatée</Badge>
        </div>

        <div className="divide-y divide-louve-border rounded-xl border border-louve-border bg-louve-surface px-4 text-xs">
          <div className="flex items-center justify-between py-2.5">
            <span className="text-louve-slate">Dernier prix d&apos;exécution constaté (net vendeur)</span>
            <span className="font-medium text-louve-navy">{formatEuroPrice(metrics.executionPrice)}</span>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <span className="text-louve-slate">
              + Commission de cession ({formatExactPercentage(scpi.transferCommissionRateHt)} HT soit{" "}
              <strong className="font-medium text-louve-navy">
                {formatExactPercentage(scpi.transferCommissionRateTtc)} TTC
              </strong>
              )
            </span>
            <span className="font-medium text-louve-navy">+{formatEuroPrice(metrics.transferCommissionPerPart)}</span>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <span className="text-louve-slate">
              + Droits d&apos;enregistrement Trésor Public (
              <strong className="font-medium text-louve-navy">{formatExactPercentage(scpi.registrationTaxRate)}</strong>
              )
            </span>
            <span className="font-medium text-louve-navy">+{formatEuroPrice(metrics.registrationTaxPerPart)}</span>
          </div>
          <div className="flex items-center justify-between bg-louve-blue-soft/50 px-2 py-2.5 font-medium text-louve-navy">
            <span>
              = Prix d&apos;acquisition frais inclus (+{formatExactPercentage(metrics.totalProportionalFeeRate)})
            </span>
            <span className="text-louve-blue">{formatEuroPrice(metrics.buyerPricePerPart)}</span>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <span className="text-louve-slate">Dividende annuel brut de référence ({scpi.dividendYear})</span>
            <span className="font-medium text-success-700">{formatEuroPrice(metrics.annualGrossDividendPerPart)}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-louve-blue-border bg-louve-blue-soft px-4 py-3 text-xs text-louve-navy">
          <span>
            <strong>Formule appliquée :</strong> {formatEuroPrice(metrics.annualGrossDividendPerPart)} ÷ (
            {formatEuroPrice(metrics.executionPrice)} ×{" "}
            {(1 + metrics.totalProportionalFeeRate / 100).toLocaleString("fr-FR", {
              minimumFractionDigits: 3,
              maximumFractionDigits: 3,
            })}
            )
          </span>
          <span className="rounded-lg bg-louve-blue px-2.5 py-1 font-medium text-louve-surface">
            = {formatExactPercentage(metrics.yieldFeeIncludedPercent)}
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-4 rounded-xl border border-louve-border bg-louve-bg/70 p-5 lg:col-span-5">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-louve-blue-soft text-louve-blue">
              <BookOpen size={15} />
            </div>
            <CardTitle>Référence du dividende &amp; source officielle</CardTitle>
          </div>

          <p className="text-louve-slate text-xs leading-relaxed">
            Conformément à la méthodologie retenue, le dividende annuel brut par part de l&apos;année civile précédente
            (exercice <strong className="text-louve-navy">{scpi.dividendYear}</strong>) est stocké en base de données
            pour la <strong className="text-louve-navy">{scpiNameToLabel[scpi.name]}</strong> et actualisable
            annuellement.
          </p>

          <dl className="flex flex-col gap-2 rounded-xl border border-louve-border bg-louve-surface p-3.5 text-xs">
            <div className="flex items-center justify-between gap-2">
              <dt className="text-louve-slate">Année civile de référence</dt>
              <dd className="font-medium text-louve-navy">{scpi.dividendYear}</dd>
            </div>
            <div className="flex items-center justify-between gap-2">
              <dt className="text-louve-slate">Dividende annuel brut / part</dt>
              <dd className="font-medium text-louve-navy">{formatEuroPrice(scpi.previousYearDividend)}</dd>
            </div>
            <div className="flex flex-col gap-1 border-louve-border-light border-t pt-2">
              <dt className="text-louve-slate">Source réglementaire vérifiée</dt>
              <dd className="font-medium text-louve-navy">{scpi.dividendSource}</dd>
            </div>
          </dl>
        </div>

        <ActionLink href={scpiNameToSourceUrl[scpi.name]} isExternal variant="outline" className="justify-between">
          <span>Consulter la documentation officielle {managementCompanyToLabel[scpi.managementCompany]}</span>
          <ExternalLink size={14} />
        </ActionLink>
      </div>
    </div>
  );
}
