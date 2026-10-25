import {
  managementCompanyList,
  managementCompanyToScpiList,
  scpiNameToCategory,
  type TManagementCompany,
  type TScpiName,
} from "my-zod";
import type { ReactNode } from "react";
import { Badge, Select } from "ui";

export interface IHeaderProps {
  scpiName?: TScpiName;
  managementCompany?: TManagementCompany;
  rightSlot?: ReactNode;
}

export function Header(props: IHeaderProps) {
  const selectedManagementCompany = props.managementCompany ?? "PRAEMIA_REIM";
  const selectedScpiName = props.scpiName ?? "PRIMOPIERRE";
  const availableScpiOptions = managementCompanyToScpiList[selectedManagementCompany];

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-louve-border border-b bg-louve-surface/90 px-6 backdrop-blur-xs md:px-8">
      <div className="flex flex-wrap items-center gap-2.5">
        <Select ariaLabel="Sélectionner la SCPI" defaultValue={selectedScpiName}>
          {availableScpiOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        <span className="text-louve-slate-light">·</span>

        <Select ariaLabel="Sélectionner la société de gestion" defaultValue={selectedManagementCompany} variant="muted">
          {managementCompanyList.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        <Badge variant="slate" className="hidden sm:inline-flex">
          {scpiNameToCategory[selectedScpiName]}
        </Badge>
      </div>
      {props.rightSlot && <div className="flex items-center gap-3">{props.rightSlot}</div>}
    </header>
  );
}
