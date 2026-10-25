"use client";

import { cn } from "cn";
import { managementCompanyToLabel, type TManagementCompany, type TResult } from "my-zod";
import { RefreshCw } from "react-feather";
import { Button } from "ui";
import { useServerAction } from "../hooks/useServerAction";

export interface IRefreshMarketButtonWrapperProps {
  onRefresh: () => Promise<TResult>;
  managementCompany?: TManagementCompany;
}

export function RefreshMarketButtonWrapper(props: IRefreshMarketButtonWrapperProps) {
  const { isPending, action } = useServerAction();
  const managementCompanyLabel = managementCompanyToLabel[props.managementCompany ?? "PRAEMIA_REIM"];

  return (
    <Button
      variant="primary"
      disabled={isPending}
      onClick={() => action(props.onRefresh)}
      title={`Récupérer les dernières données par scraping de ${managementCompanyLabel}`}
    >
      <RefreshCw size={13} className={cn(isPending && "animate-spin")} />
      <span>{isPending ? "Synchronisation..." : "Actualiser les données"}</span>
    </Button>
  );
}
