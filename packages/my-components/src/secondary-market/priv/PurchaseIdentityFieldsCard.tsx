"use client";

import { useController, useFormContext } from "form/interfaces";
import {
  managementCompanyToLabel,
  scpiNameToLabel,
  type TManagementCompany,
  type TPurchaseEmailFormData,
  type TScpiName,
} from "my-zod";
import { CardTitle, FormFieldWrapper, FormTextInput } from "ui";
import { AssociateStatusSelector } from "./AssociateStatusSelector";

export interface IPurchaseIdentityFieldsCardProps {
  scpiName: TScpiName;
  managementCompany: TManagementCompany;
}

export function PurchaseIdentityFieldsCard(props: IPurchaseIdentityFieldsCardProps) {
  const managementCompanyLabel = managementCompanyToLabel[props.managementCompany];
  const formMethods = useFormContext<TPurchaseEmailFormData>();
  const associateController = useController<TPurchaseEmailFormData, "isExistingAssociate">({
    name: "isExistingAssociate",
  });

  const isExistingAssociate = Boolean(associateController.field.value);

  const handleAssociateToggle = (nextValue: boolean) => {
    associateController.field.onChange(nextValue);
    if (!nextValue) {
      formMethods.setValue("associateNumber", "", { shouldValidate: true });
      formMethods.clearErrors("associateNumber");
    } else {
      void formMethods.trigger("associateNumber");
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-louve-border bg-louve-bg/60 p-4 sm:p-5">
      <div className="flex items-center gap-2.5 border-louve-border border-b pb-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-louve-blue-soft font-medium text-louve-blue text-xs">
          1
        </div>
        <div className="flex flex-col">
          <CardTitle>Identité & statut d&apos;associé</CardTitle>
          <p className="text-louve-slate text-xs">
            Coordonnées du donneur d&apos;ordre transmises à {managementCompanyLabel}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormTextInput<TPurchaseEmailFormData>
          name="firstName"
          label="Prénom"
          placeholder="Ex. Jean"
          required
          autoComplete="given-name"
        />
        <FormTextInput<TPurchaseEmailFormData>
          name="lastName"
          label="Nom"
          placeholder="Ex. Dupont"
          required
          autoComplete="family-name"
        />
      </div>

      <FormFieldWrapper
        label={`Êtes-vous déjà associé de la ${scpiNameToLabel[props.scpiName]} ?`}
        required
        description="Requis pour le registre des associés"
      >
        <AssociateStatusSelector isExistingAssociate={isExistingAssociate} onToggle={handleAssociateToggle} />
      </FormFieldWrapper>

      {isExistingAssociate && (
        <FormTextInput<TPurchaseEmailFormData>
          name="associateNumber"
          label="Numéro d'associé"
          placeholder="Ex. A-2024-88412"
          required
          description={`Figurant sur vos bulletins d'information ${managementCompanyLabel}`}
        />
      )}
    </div>
  );
}
