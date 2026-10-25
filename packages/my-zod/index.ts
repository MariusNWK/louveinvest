import type { ReactNode } from "react";
import { z } from "zod";

export interface ILinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  id?: string;
  target?: string;
}

export type TSnackbarType = "error" | "success" | "info";

export type TResultSuccess<T = unknown> = T & {
  success: string;
  error?: undefined;
  redirectTo?: string;
};

export type TResult<T = unknown> =
  | TResultSuccess<T>
  | { error: string; success?: undefined; redirectTo?: string }
  | undefined;

export const orderSideSchema = z.enum(["BUY", "SELL"]);
export type TOrderSide = z.infer<typeof orderSideSchema>;

export interface ISelectOption<TValue extends string = string> {
  label: string;
  value: TValue;
}

export const managementCompanySchema = z.enum(["PRAEMIA_REIM"]);
export type TManagementCompany = z.infer<typeof managementCompanySchema>;

export const managementCompanyToLabel: Record<TManagementCompany, string> = {
  PRAEMIA_REIM: "Praemia REIM France",
};

export const managementCompanyToEmail: Record<TManagementCompany, string> = {
  PRAEMIA_REIM: "serviceclients@praemiareim.com",
};

export const managementCompanyList: ISelectOption<TManagementCompany>[] = managementCompanySchema.options.map(
  (value) => ({
    label: managementCompanyToLabel[value],
    value,
  }),
);

export const scpiNameSchema = z.enum(["PRIMOPIERRE"]);
export type TScpiName = z.infer<typeof scpiNameSchema>;

export const scpiNameToLabel: Record<TScpiName, string> = {
  PRIMOPIERRE: "SCPI Primopierre",
};

export const scpiNameToCategory: Record<TScpiName, string> = {
  PRIMOPIERRE: "Bureaux",
};

export const scpiNameToSourceUrl: Record<TScpiName, string> = {
  PRIMOPIERRE: "https://www.praemiareim.fr/fr/scpi-primopierre",
};

export const scpiNameToMandateFolderFeeTtc: Record<TScpiName, number> = {
  PRIMOPIERRE: 90,
};

export const managementCompanyToScpiList: Record<TManagementCompany, ISelectOption<TScpiName>[]> = {
  PRAEMIA_REIM: [
    {
      label: scpiNameToLabel.PRIMOPIERRE,
      value: "PRIMOPIERRE",
    },
  ],
};

