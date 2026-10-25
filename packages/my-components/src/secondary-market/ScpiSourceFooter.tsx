import { type IScpiWithMarketRelations, managementCompanyToLabel, scpiNameToLabel, scpiNameToSourceUrl } from "my-zod";
import { ActionLink } from "ui";

export interface IScpiSourceFooterProps {
  scpi: IScpiWithMarketRelations;
  lastSyncLabel: string;
}

export function ScpiSourceFooter(props: IScpiSourceFooterProps) {
  const scpi = props.scpi;

  return (
    <footer className="flex flex-wrap items-center justify-between gap-2 border-louve-border border-t pt-4 text-louve-slate text-xs">
      <span>
        Source :{" "}
        <ActionLink href={scpiNameToSourceUrl[scpi.name]} isExternal variant="text">
          {managementCompanyToLabel[scpi.managementCompany]} ({scpiNameToLabel[scpi.name]})
        </ActionLink>
      </span>
      <span>Dernière synchronisation en base : {props.lastSyncLabel}</span>
    </footer>
  );
}
