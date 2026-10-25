"use client";

import { usePurchaseEmailForm } from "form";
import { useWatch } from "form/interfaces";
import {
  buildPurchasePreparedEmail,
  buildPurchasePricePresets,
  calculateInvestmentYieldSimulation,
  normalizePurchaseFormData,
} from "my-functions";
import { DEFAULT_PURCHASE_PARTS_COUNT } from "my-variables";
import { type IScpiWithMarketRelations, managementCompanyToEmail, type TPurchaseEmailFormData } from "my-zod";
import { useState } from "react";

export interface IUsePurchaseEmailWorkflowProps {
  scpi: IScpiWithMarketRelations;
  initialMaxPricePerPart?: number;
  initialPartsCount?: number;
  onNotifySuccess?: (message: string) => void;
  onNotifyError?: (message: string) => void;
}

export function usePurchaseEmailWorkflow(props: IUsePurchaseEmailWorkflowProps) {
  const scpi = props.scpi;
  const [fixedFolderFeeTtc, setFixedFolderFeeTtc] = useState<number>(scpi.fixedFolderFeeTtc);
  const formMethods = usePurchaseEmailForm({
    defaultMaxPricePerPart: props.initialMaxPricePerPart ?? scpi.lastExecutionPrice,
    defaultPartsCount: props.initialPartsCount ?? DEFAULT_PURCHASE_PARTS_COUNT,
  });

  const watchedValues = useWatch<TPurchaseEmailFormData>({ control: formMethods.control });
  const pricePresets = buildPurchasePricePresets(scpi);
  const normalizedFormData = normalizePurchaseFormData(watchedValues);

  const simulation = calculateInvestmentYieldSimulation({
    acquisitionPricePerPart: normalizedFormData.maxPricePerPart,
    partsCount: Math.max(1, normalizedFormData.partsCount),
    fixedFolderFeeTtc,
    annualGrossDividendPerPart: scpi.previousYearDividend,
    transferCommissionRateTtc: scpi.transferCommissionRateTtc,
    registrationTaxRate: scpi.registrationTaxRate,
  });

  const preparedEmail = buildPurchasePreparedEmail({
    scpi,
    formData: normalizedFormData,
    simulation,
    recipientEmail: managementCompanyToEmail[scpi.managementCompany],
  });

  const handleValidatedCopy = async (content: string, successLabel: string) => {
    const isValid = await formMethods.trigger();
    if (!isValid) {
      props.onNotifyError?.("Veuillez renseigner tous les champs obligatoires avant de copier l'email.");
      return;
    }
    await navigator.clipboard.writeText(content);
    props.onNotifySuccess?.(successLabel);
  };

  const handleOpenMailClient = async () => {
    const isValid = await formMethods.trigger();
    if (!isValid) {
      props.onNotifyError?.("Veuillez renseigner tous les champs obligatoires avant d'ouvrir votre client mail.");
      return;
    }
    window.location.href = preparedEmail.mailtoHref;
    props.onNotifySuccess?.("Ouverture de votre messagerie avec l'email pré-rempli.");
  };

  return {
    formMethods,
    pricePresets,
    simulation,
    fixedFolderFeeTtc,
    setFixedFolderFeeTtc,
    preparedEmail,
    handleValidatedCopy,
    handleOpenMailClient,
  };
}
