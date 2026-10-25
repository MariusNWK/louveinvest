"use client";

import { PurchaseEmailSection } from "my-components";
import type { IScpiWithMarketRelations } from "my-zod";
import { useSnackbar } from "../hooks/useSnackbar";

export interface IPurchaseEmailSectionWrapperProps {
  scpi: IScpiWithMarketRelations;
  initialMaxPricePerPart?: number;
  initialPartsCount?: number;
}

export function PurchaseEmailSectionWrapper(props: IPurchaseEmailSectionWrapperProps) {
  const snackbar = useSnackbar();

  return (
    <PurchaseEmailSection
      scpi={props.scpi}
      initialMaxPricePerPart={props.initialMaxPricePerPart}
      initialPartsCount={props.initialPartsCount}
      onNotifySuccess={(message) => snackbar.success(message)}
      onNotifyError={(message) => snackbar.error(message)}
    />
  );
}
