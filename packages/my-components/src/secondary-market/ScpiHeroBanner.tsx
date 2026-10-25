import { formatCompactEuro, formatPercentage } from "my-functions";
import {
  type IScpiWithMarketRelations,
  managementCompanyToLabel,
  scpiNameToCategory,
  scpiNameToLabel,
  scpiNameToSourceUrl,
} from "my-zod";
import type { ReactNode } from "react";
import { ExternalLink } from "react-feather";
import { ActionLink } from "ui";

export interface IScpiHeroBannerProps {
  scpi: IScpiWithMarketRelations;
  title?: string;
  refreshActionSlot?: ReactNode;
}

export function ScpiHeroBanner(props: IScpiHeroBannerProps) {
  const scpi = props.scpi;
  const bannerTitle = props.title ?? "Analyser les opportunités du marché secondaire";
  const managementCompanyLabel = managementCompanyToLabel[scpi.managementCompany];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-louve-navy p-6 text-louve-surface shadow-sm md:p-8">
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-louve-blue/15 blur-2xl" />
      <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-louve-cyan px-2.5 py-1 font-medium text-louve-navy text-xs">
              {scpiNameToLabel[scpi.name]}
            </span>
            <span className="rounded-md bg-louve-navy-light px-2.5 py-1 font-medium text-louve-blue-border text-xs">
              {managementCompanyLabel}
            </span>
            <span className="rounded-md bg-louve-navy-light px-2.5 py-1 font-medium text-louve-blue-border text-xs">
              {scpiNameToCategory[scpi.name]}
            </span>
          </div>

          <h1 className="font-medium text-2xl tracking-tight md:text-3xl">{bannerTitle}</h1>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-louve-blue-muted text-xs">
            {scpi.capitalization && <span>Capitalisation : {formatCompactEuro(scpi.capitalization)}</span>}
            {scpi.financialOccupancyRate && <span>TOF : {formatPercentage(scpi.financialOccupancyRate)}</span>}
            {scpi.distributionRate && (
              <span>
                Taux de distribution {scpi.dividendYear} : {formatPercentage(scpi.distributionRate)}
              </span>
            )}
            {scpi.marketUpdatedAtLabel && (
              <span>
                Données {managementCompanyLabel} au {scpi.marketUpdatedAtLabel}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <ActionLink href={scpiNameToSourceUrl[scpi.name]} isExternal variant="onDark" className="gap-1.5">
            <span>Page officielle</span>
            <ExternalLink size={13} />
          </ActionLink>
          {props.refreshActionSlot}
        </div>
      </div>
    </div>
  );
}
