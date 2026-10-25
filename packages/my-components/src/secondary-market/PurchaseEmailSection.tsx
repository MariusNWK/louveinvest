"use client";

import { FormProvider } from "form/interfaces";
import { type IScpiWithMarketRelations, managementCompanyToLabel, scpiNameToLabel } from "my-zod";
import { Badge, SurfaceCard } from "ui";
import { PurchaseEmailPreviewCard } from "./priv/PurchaseEmailPreviewCard";
import { PurchaseFinancialSummaryCard } from "./priv/PurchaseFinancialSummaryCard";
import { PurchaseIdentityFieldsCard } from "./priv/PurchaseIdentityFieldsCard";
import { PurchaseOrderParametersCard } from "./priv/PurchaseOrderParametersCard";
import { usePurchaseEmailWorkflow } from "./priv/usePurchaseEmailWorkflow";

export interface IPurchaseEmailSectionProps {
  scpi: IScpiWithMarketRelations;
  initialMaxPricePerPart?: number;
  initialPartsCount?: number;
  onNotifySuccess?: (message: string) => void;
  onNotifyError?: (message: string) => void;
}

export function PurchaseEmailSection(props: IPurchaseEmailSectionProps) {
  const scpi = props.scpi;
  const workflow = usePurchaseEmailWorkflow(props);
  const {
    formMethods,
    pricePresets,
    simulation,
    fixedFolderFeeTtc,
    setFixedFolderFeeTtc,
    preparedEmail,
    handleValidatedCopy,
    handleOpenMailClient,
  } = workflow;

  return (
    <FormProvider {...formMethods}>
      <SurfaceCard
        title="Préparer un email à la société de gestion"
        subtitle={`Complétez votre projet d'acquisition sur le marché secondaire de la ${scpiNameToLabel[scpi.name]} pour générer et récupérer votre email formel à destination de ${managementCompanyToLabel[scpi.managementCompany]}.`}
        headerRight={<Badge variant="blue">Envoi hors périmètre — Prêt à copier</Badge>}
      >
        <form
          onSubmit={(event) => event.preventDefault()}
          noValidate
          className="grid grid-cols-1 gap-6 lg:grid-cols-12"
        >
          <div className="flex flex-col gap-5 lg:col-span-6">
            <PurchaseIdentityFieldsCard scpiName={scpi.name} managementCompany={scpi.managementCompany} />
            <PurchaseOrderParametersCard
              pricePresets={pricePresets}
              proportionalFeeRatePercent={scpi.transferCommissionRateTtc + scpi.registrationTaxRate}
            />
          </div>
          <div className="flex flex-col gap-5 lg:col-span-6">
            <PurchaseFinancialSummaryCard
              scpi={scpi}
              simulation={simulation}
              fixedFolderFeeTtc={fixedFolderFeeTtc}
              onFixedFolderFeeChange={setFixedFolderFeeTtc}
            />
            <PurchaseEmailPreviewCard
              preparedEmail={preparedEmail}
              onCopySubject={() => void handleValidatedCopy(preparedEmail.subject, "Objet de l'email copié !")}
              onCopyBody={() => void handleValidatedCopy(preparedEmail.body, "Corps de l'email copié !")}
              onCopyFullEmail={() =>
                void handleValidatedCopy(
                  `Objet : ${preparedEmail.subject}\n\n${preparedEmail.body}`,
                  "Email complet (objet + corps) copié dans le presse-papiers !",
                )
              }
              onOpenMailClient={() => void handleOpenMailClient()}
            />
          </div>
        </form>
      </SurfaceCard>
    </FormProvider>
  );
}
